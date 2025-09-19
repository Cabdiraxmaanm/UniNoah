import React from 'react';
import RNMapView, { Marker, Polyline } from 'react-native-maps';

const MapView = React.forwardRef((props, ref) => {
  return <RNMapView ref={ref} {...props} />;
});

export default MapView;
export { Marker, Polyline, MapView };


