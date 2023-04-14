import { MapPage } from './pages/MapPage'
import { SocketProvider } from './context/SocketProvider';

export const MapasApp = () => {
  return (
    <SocketProvider>
      <MapPage/>
    </SocketProvider>
  )
}
