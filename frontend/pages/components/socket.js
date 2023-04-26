import { io } from "socket.io-client";

export const initSocket = async () => {
    console.log("ye baar baar chal rha hai")
  const options = {
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };
  return io("https://livecodex-backend.onrender.com", options);
};
