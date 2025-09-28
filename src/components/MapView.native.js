import React from 'react';
import { Platform } from 'react-native';

// Conditional import for react-native-maps (native only)
let RNMapView, Marker, Polyline, PROVIDER_GOOGLE;

if (Platform.OS !== 'web') {
  try {
    const MapModule = require('react-native-maps');
    RNMapView = MapModule.default;
    Marker = MapModule.Marker;
    Polyline = MapModule.Polyline;
    PROVIDER_GOOGLE = MapModule.PROVIDER_GOOGLE;
  } catch (error) {
    console.log('react-native-maps not available on this platform');
  }
}

const MapView = React.forwardRef((props, ref) => {
  if (Platform.OS === 'web' || !RNMapView) {
    // Fallback for web or when react-native-maps is not available
    return null;
  }
  return <RNMapView ref={ref} {...props} />;
});

export default MapView;
export { Marker, Polyline, MapView, PROVIDER_GOOGLE };


