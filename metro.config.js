const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add platform-specific resolver
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Handle react-native-maps for web - provide a mock implementation
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-maps': require.resolve('./src/components/MapView.web.js'),
};

// Ensure proper module resolution
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

module.exports = config; 