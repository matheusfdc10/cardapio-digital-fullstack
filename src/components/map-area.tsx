import { GoogleMap, LoadScript, Circle, Marker } from '@react-google-maps/api';

interface MapAreaProps {
  lat: number;
  lng: number;
  distance: number; // distance in kilometers
  name: string;
}

const MapArea: React.FC<MapAreaProps> = ({ lat, lng, distance, name }) => {
  const mapContainerStyle = {
    height: '400px',
    width: '100%',
  };

  const center = {
    lat: lat,
    lng: lng,
  };

  const circleOptions = {
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
  };

  return (
    <LoadScript googleMapsApiKey={''}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13} // Adjust zoom level as needed
      >
        <Marker position={center} options={{
            label: {
                text: name,
                className: '-mt-8',
                fontWeight: '700',
                color: 'white'
            }
        }}/>
        <Circle center={center} options={circleOptions} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapArea;