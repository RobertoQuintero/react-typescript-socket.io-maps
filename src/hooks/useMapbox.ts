import mapboxgl,{ Map,  Marker} from "mapbox-gl"
import {  useCallback, useEffect, useRef, useState } from "react"
import { Coords, MarkerType } from '../pages/MapPage';
import {v4 } from "uuid";
import {Subject} from 'rxjs'

mapboxgl.accessToken = 'pk.eyJ1Ijoicm9iZXJ0b3F1aW50ZXJvIiwiYSI6ImNsZmxkb3c4ZDAwdWU0MW85MXFrNHAybnMifQ.u4FAty3I812p8CfwZu8weQ';

export const useMapbox = (puntoInicial:Coords) => {
  //referencia al div del mapa
  const mapDiv=useRef<HTMLDivElement | null>()
  const setRef= useCallback((node:HTMLDivElement)=>{
    mapDiv.current=node;
  },[])
  
  //referencia a los marcadores
  const marcadores= useRef({})

  //Observables de Rxjs
  const movimientoMarcador=useRef(new Subject());
  const nuevoMarcador=useRef(new Subject());


  //Mapa y coords
  const map= useRef<Map>()
  const [coords, setCoords] = useState(puntoInicial)

  class MarkerInterface extends Marker{
    id:string=''
  }

  //funcion para agregar marcadores
  const agregarMarcador=useCallback((ev: mapboxgl.MapMouseEvent & mapboxgl.EventData | MarkerType  ,id?:string) => {
    //@ts-ignore   XD  
    const {lng,lat}= ev.lngLat || ev

    const marker= new MarkerInterface()
    
    marker.id= id??v4()

    marker
      .setLngLat([lng,lat])
      .addTo(map.current!)
      .setDraggable(true)

      //asignamos al objeto de marcadores
      //@ts-ignore   XD
      marcadores.current[marker.id]=marker

      //si el marcador tiene id no emitir
      if(!id){

        nuevoMarcador.current.next({
          id:marker.id,
          lng,
          lat
        })
      }

      //escuchar movimientos del marcador
      marker.on('drag',(ev:any)=>{
                
        const {id}= ev.target

        const {lng,lat} = ev.target.getLngLat()
        // console.log(lng,lat)

        //emitir los cambios del marcador
        movimientoMarcador.current.next({
          id,lng,lat
        })

      })

    },[])

    const actualizarPosicion=useCallback(({id,lat,lng}:MarkerType)=>{
      // @ts-ignore
      marcadores.current[id].setLngLat([lng,lat])
    },[])

  useEffect(() => {
    const mapa=new mapboxgl.Map({
      container:mapDiv.current!,
      style:'mapbox://styles/mapbox/streets-v11',
      center:[puntoInicial.lng,puntoInicial.lat],
      zoom:puntoInicial.zoom
    })

    map.current=mapa;
  }, [puntoInicial])

  useEffect(() => {
    map.current?.on('move',()=>{
      const {lng,lat}= map.current!.getCenter()
      setCoords({
        lng:Number(lng.toFixed(4)),
        lat:Number(lat.toFixed(4)),
        zoom:Number(map.current?.getZoom().toFixed(2))
      })
    })
    
    return ()=>{
      // map.current?.off('move')
    }
  }, [])


  useEffect(() => {
    map.current?.on('click',agregarMarcador)
  }, [agregarMarcador])

  return {
    coords,
    setRef,
    agregarMarcador,
    actualizarPosicion,
    nuevoMarcador$:nuevoMarcador.current,
    movimientoMarcador$:movimientoMarcador.current,
    marcadores
  }

}
