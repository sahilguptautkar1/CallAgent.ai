import { Room } from "livekit-client";

const LIVEKIT_URL = "wss://human-inloop-ai-supervisor-0bzy67xc.livekit.cloud";

export async function connectToRoom(token: string): Promise<Room> {
  const room = new Room();
  await room.connect(LIVEKIT_URL, token);
  return room;
}
