import { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useMapbox } from './useMapbox';
import { Coords, MarkerType } from '../pages/MapPage';

export const useSocketMapbox = (puntoInicial:Coords) => {
  const {coords,setRef,nuevoMarcador$,movimientoMarcador$,agregarMarcador,actualizarPosicion}= useMapbox(puntoInicial)
  const {socket}= useContext(SocketContext)

  //escuchar los marcadores existentes

  useEffect(() => {
  socket.on('marcadores-activos',(marcadores)=>{
    for (const key of Object.keys(marcadores)) {
      agregarMarcador(marcadores[key],key)
    }
  })
  }, [agregarMarcador,socket])
    

  useEffect(() => {
    nuevoMarcador$.subscribe((marcador)=>{
      // console.log(marcador)
      //nuevo marcador emitir
      socket.emit('marcador-nuevo',marcador)
      
    })
  }, [nuevoMarcador$,socket])

  useEffect(() => {
    movimientoMarcador$.subscribe((marcador)=>{
      // console.log(marcador)
      //nuevo marcador emitir
      socket.emit('marcador-actualizado',marcador)

    })
  }, [movimientoMarcador$])

  useEffect(() => {
    socket.on('marcador-actualizado',(marcador:MarkerType)=>{
      actualizarPosicion(marcador)
    })
  }, [socket,actualizarPosicion])

  useEffect(() => {
    socket.on('marcador-nuevo',(marcador:MarkerType)=>{
      agregarMarcador(marcador,marcador.id)
    })

    }, [socket,agregarMarcador])

    return{
      coords,setRef
    }
}
