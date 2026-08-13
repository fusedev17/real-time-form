import PusherServer from "pusher";

declare global {
  var __pusherServer: PusherServer | undefined;
}

function createPusherServer() {
  const { PUSHER_APP_ID, NEXT_PUBLIC_PUSHER_KEY, PUSHER_SECRET, NEXT_PUBLIC_PUSHER_CLUSTER } =
    process.env;

  if (!PUSHER_APP_ID || !NEXT_PUBLIC_PUSHER_KEY || !PUSHER_SECRET || !NEXT_PUBLIC_PUSHER_CLUSTER) {
    throw new Error(
      "Missing Pusher server environment variables. Check PUSHER_APP_ID, NEXT_PUBLIC_PUSHER_KEY, PUSHER_SECRET, NEXT_PUBLIC_PUSHER_CLUSTER."
    );
  }

  return new PusherServer({
    appId: PUSHER_APP_ID,
    key: NEXT_PUBLIC_PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: NEXT_PUBLIC_PUSHER_CLUSTER,
    useTLS: true,
  });
}

export const pusherServer = globalThis.__pusherServer ?? createPusherServer();

if (process.env.NODE_ENV !== "production") {
  globalThis.__pusherServer = pusherServer;
}
