import { Redis } from "@upstash/redis";
import type { PatientData } from "./types";

declare global {
  var __redisClient: Redis | undefined;
}

function createRedisClient(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN environment variables."
    );
  }

  return new Redis({ url, token });
}

function getRedisClient(): Redis {
  const client = globalThis.__redisClient ?? createRedisClient();

  if (process.env.NODE_ENV !== "production") {
    globalThis.__redisClient = client;
  }

  return client;
}

const patientKey = (id: string) => `patient:${id}`;
const INDEX_KEY = "patients:index";

// A plain in-memory Map only works if every request lands on the same process. On
// serverless hosting, concurrent requests can be handled by different instances with no
// shared memory at all, so the store has to live somewhere every instance reads/writes
// the same copy of. Redis (via Upstash's HTTP API, so it works from serverless functions
// without a persistent connection) is that shared copy.
//
// Once a patient has submitted, that's terminal: a draft "active"/"inactive" patch sent
// *before* submission can still be processed *after* it lands (no ordering guarantee
// across concurrent instances), and must not clobber the submitted record back to a
// draft state. That check-then-write has to be atomic *inside* Redis itself -- doing a
// separate GET then SET from Node is racy the instant more than one instance can run it
// at the same time, since another instance's write can land in the gap between the two.
const SET_UNLESS_SUBMITTED_SCRIPT = `
  local existing = redis.call('GET', KEYS[1])
  if existing then
    local decoded = cjson.decode(existing)
    if decoded.status == 'submitted' and ARGV[2] ~= 'submitted' then
      return existing
    end
  end
  redis.call('SET', KEYS[1], ARGV[1])
  redis.call('SADD', KEYS[2], ARGV[3])
  return ARGV[1]
`;

const DELETE_UNLESS_SUBMITTED_SCRIPT = `
  local existing = redis.call('GET', KEYS[1])
  if existing then
    local decoded = cjson.decode(existing)
    if decoded.status == 'submitted' then
      return 0
    end
  end
  redis.call('DEL', KEYS[1])
  redis.call('SREM', KEYS[2], ARGV[1])
  return 1
`;

function parsePatient(raw: unknown): PatientData {
  return typeof raw === "string" ? (JSON.parse(raw) as PatientData) : (raw as PatientData);
}

export const patientStore = {
  async get(id: string): Promise<PatientData | undefined> {
    const data = await getRedisClient().get<PatientData>(patientKey(id));
    return data ?? undefined;
  },

  /** Writes `patient`, unless the currently-stored record is already "submitted" and this write isn't. Returns whatever ends up persisted either way. */
  async setUnlessSubmitted(id: string, patient: PatientData): Promise<PatientData> {
    const raw = await getRedisClient().eval(
      SET_UNLESS_SUBMITTED_SCRIPT,
      [patientKey(id), INDEX_KEY],
      [JSON.stringify(patient), patient.status, id]
    );
    return parsePatient(raw);
  },

  /** Deletes the record, unless it's already "submitted" (a terminal state that stray draft/leave signals shouldn't be able to erase). Returns whether it deleted anything. */
  async deleteUnlessSubmitted(id: string): Promise<boolean> {
    const result = await getRedisClient().eval(DELETE_UNLESS_SUBMITTED_SCRIPT, [patientKey(id), INDEX_KEY], [id]);
    return result === 1;
  },

  async values(): Promise<PatientData[]> {
    const ids = await getRedisClient().smembers(INDEX_KEY);
    if (ids.length === 0) return [];
    const records = await getRedisClient().mget<(PatientData | null)[]>(...ids.map(patientKey));
    return records.filter((p): p is PatientData => p !== null);
  },
};
