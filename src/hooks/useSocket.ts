import { useEffect, useMemo, useState } from "react"
import io from "socket.io-client"

export const useSocket=(serverPath:string)=>{
  const [online, setOnline] = useState<boolean>(false)

  const socket= useMemo(() => io('http://localhost:8080',{
    transports:['websocket']
  }), [serverPath])

  useEffect(() => {
    setOnline(socket.connected)

    // return ()=> {socket.disconnect()}
  }, [socket])

  useEffect(() => {
    socket.on('connect',()=>{
      setOnline(true)
    })
  }, [socket])

  useEffect(() => {
    socket.on('disconnect',()=>{
      setOnline(false)
    })
  }, [socket])

  return {
    socket,online
  }
}