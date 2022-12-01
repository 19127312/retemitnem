import { createContext, useMemo } from "react";
import io from "socket.io-client";

const SocketContext = createContext({});
export function SocketProvider({ children }) {
  const socket = io.connect(process.env.REACT_APP_URL_API, {
    path: "/socket.io",
    transports: ["polling"],
  });

  const value = useMemo(() => ({ socket }), [socket]);
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
export default SocketContext;
