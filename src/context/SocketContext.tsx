import { createContext } from "react";
import { Socket } from "socket.io-client";

interface SocketContextProps {
  socket: Socket;
  online: boolean;
}

export const SocketContext= createContext<SocketContextProps>({} as SocketContextProps)

