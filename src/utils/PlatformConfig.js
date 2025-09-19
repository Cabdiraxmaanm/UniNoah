import { Platform } from 'react-native';

// Platform-specific configuration
export const PlatformConfig = {
  // Check if running on web
  isWeb: Platform.OS === 'web',
  
  // Check if running on mobile (iOS/Android)
  isMobile: Platform.OS === 'ios' || Platform.OS === 'android',
  
  // Check specific platform
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  
  // Platform-specific features
  features: {
    // Maps
    maps: {
      interactive: !Platform.OS === 'web',
      animations: !Platform.OS === 'web',
      realTime: !Platform.OS === 'web',
    },
    
    // Animations
    animations: {
      nativeDriver: !Platform.OS === 'web',
      smooth: !Platform.OS === 'web',
    },
    
    // Gestures
    gestures: {
      touch: Platform.OS === 'ios' || Platform.OS === 'android',
      mouse: Platform.OS === 'web',
    },
    
    // Storage
    storage: {
      asyncStorage: true, // Works on both
      secureStore: Platform.OS === 'ios' || Platform.OS === 'android',
    },
  },
  
  // Platform-specific styling
  styles: {
    // Shadows (different on web vs mobile)
    shadow: Platform.OS === 'web' ? {
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    
    // Border radius
    borderRadius: {
      small: Platform.OS === 'web' ? '4px' : 4,
      medium: Platform.OS === 'web' ? '8px' : 8,
      large: Platform.OS === 'web' ? '12px' : 12,
      xlarge: Platform.OS === 'web' ? '16px' : 16,
    },
  },
  
  // Platform-specific behavior
  behavior: {
    // Map interactions
    mapInteraction: Platform.OS === 'web' ? 'visual' : 'interactive',
    
    // Animation duration
    animationDuration: Platform.OS === 'web' ? 300 : 1000,
    
    // Touch feedback
    touchFeedback: Platform.OS === 'web' ? false : true,
  },
};

// Helper functions
export const isFeatureAvailable = (feature) => {
  return PlatformConfig.features[feature] !== undefined;
};

export const getPlatformStyle = (styleType) => {
  return PlatformConfig.styles[styleType] || {};
};

export const getPlatformBehavior = (behaviorType) => {
  return PlatformConfig.behavior[behaviorType];
};

export default PlatformConfig;
