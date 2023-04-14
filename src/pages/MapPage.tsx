import { useSocketMapbox } from '../hooks/useSocketMapbox';

export interface Coords {
  lng:number
  lat:number
  zoom:number
}

const puntoInicial:Coords={
  lng:-122.4725,
  lat:37.8010,
  zoom:13.5
}

export  type MarkerType={
  id:string
  lat:number
  lng:number
}

export const MapPage = () => {
  
  const {coords,setRef}=useSocketMapbox(puntoInicial)
  
  return (
    <>
    <div className="info">{coords.lng} | {coords.lng}| {coords.zoom}</div>
      <div ref={setRef} className="mapContainer"/>
    </>
  )
}
