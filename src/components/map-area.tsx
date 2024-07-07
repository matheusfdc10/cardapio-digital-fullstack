"use client"
import { GoogleMap, LoadScript, Circle, Marker } from '@react-google-maps/api';

interface MapAreaProps {
  lat?: number;
  lng?: number;
  distance?: number; // distance in kilometers
  name?: string;
  zoom?: number;
  children?: React.ReactNode;
}

const MapArea: React.FC<MapAreaProps> = ({ lat, lng, distance, name = 'Você', zoom = 13, children }) => {  
  const center = {
    lat: lat || -22.9035,
    lng: lng || -43.2096,
  };

  const loading = (
    <div className='h-[400px] w-full flex justify-center items-center'>
      <div>Loading...</div>
    </div>
  )

  return (
    <LoadScript googleMapsApiKey={''} loadingElement={loading}>
      <GoogleMap
        mapContainerStyle={{
          height: '400px',
          width: '100%',
          borderRadius: 8
        }}
        center={center}
        zoom={zoom} // Adjust zoom level as needed
      >
        {children}
        {!!(lat || lng) && (
          <Marker position={center} options={{
            label: {
              text: name,
              className: '-mt-8',
              fontWeight: '700',
              color: 'white'
            }
          }}/>
        )}
        {distance && (
          <Circle center={center} options={{
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            clickable: false,
            draggable: false,
            editable: false,
            visible: true,
            radius: distance * 1000, // Convert km to meters
            zIndex: 1,
          }} />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapArea;