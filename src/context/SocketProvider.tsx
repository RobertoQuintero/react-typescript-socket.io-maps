import { useSocket } from "../hooks/useSocket"
import { SocketContext } from "./SocketContext"

interface props{
  children: JSX.Element | JSX.Element[]
}

export const SocketProvider=({children}:props)=>{
  const {socket,online}=useSocket('http:localhost:8080')

  return(
    <SocketContext.Provider value={{socket,online}}>
      {children}
    </SocketContext.Provider>
  )
}