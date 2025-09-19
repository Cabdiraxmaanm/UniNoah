import { Platform } from 'react-native';

// Web-specific enhancements and styles
export const WebEnhancements = {
  // Check if running on web
  isWeb: Platform.OS === 'web',
  
  // Web-specific styles
  styles: {
    // Enhanced shadows for web
    enhancedShadow: Platform.OS === 'web' ? {
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    
    // Web-specific hover effects
    hoverEffect: Platform.OS === 'web' ? {
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    } : {},
    
    // Web-specific animations
    webAnimation: Platform.OS === 'web' ? {
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    } : {},
    
    // Enhanced gradients for web
    enhancedGradient: Platform.OS === 'web' ? {
      background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
    } : {},
    
    // Web-specific layout
    webLayout: Platform.OS === 'web' ? {
      maxWidth: '1200px',
      marginHorizontal: 'auto',
      paddingHorizontal: '24px',
    } : {},
  },
  
  // Web-specific behaviors
  behaviors: {
    // Hover animations
    hoverScale: Platform.OS === 'web' ? 1.05 : 1,
    hoverShadow: Platform.OS === 'web' ? '0 20px 40px rgba(0, 0, 0, 0.2)' : '0 4px 10px rgba(0, 0, 0, 0.1)',
    
    // Animation durations
    animationDuration: Platform.OS === 'web' ? 300 : 1000,
    
    // Interactive elements
    interactive: Platform.OS === 'web',
  },
  
  // Web-specific features
  features: {
    // Enhanced tooltips
    tooltips: Platform.OS === 'web',
    
    // Keyboard navigation
    keyboardNav: Platform.OS === 'web',
    
    // Mouse interactions
    mouseInteractions: Platform.OS === 'web',
    
    // Responsive design
    responsive: Platform.OS === 'web',
  },
};

// Web-specific utility functions
export const webUtils = {
  // Add hover effects to components
  addHoverEffect: (baseStyle) => {
    if (Platform.OS === 'web') {
      return {
        ...baseStyle,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        ':hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        },
      };
    }
    return baseStyle;
  },
  
  // Add web-specific animations
  addWebAnimation: (baseStyle) => {
    if (Platform.OS === 'web') {
      return {
        ...baseStyle,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      };
    }
    return baseStyle;
  },
  
  // Add responsive breakpoints
  addResponsive: (baseStyle, breakpoints = {}) => {
    if (Platform.OS === 'web') {
      return {
        ...baseStyle,
        '@media (min-width: 768px)': breakpoints.tablet || {},
        '@media (min-width: 1024px)': breakpoints.desktop || {},
        '@media (min-width: 1440px)': breakpoints.large || {},
      };
    }
    return baseStyle;
  },
};

// Web-specific component enhancements
export const WebComponents = {
  // Enhanced button with web effects
  EnhancedButton: (baseStyle) => {
    if (Platform.OS === 'web') {
      return {
        ...baseStyle,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        userSelect: 'none',
        ':hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        },
        ':active': {
          transform: 'translateY(0)',
        },
      };
    }
    return baseStyle;
  },
  
  // Enhanced card with web effects
  EnhancedCard: (baseStyle) => {
    if (Platform.OS === 'web') {
      return {
        ...baseStyle,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        ':hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        },
      };
    }
    return baseStyle;
  },
  
  // Enhanced input with web effects
  EnhancedInput: (baseStyle) => {
    if (Platform.OS === 'web') {
      return {
        ...baseStyle,
        transition: 'all 0.3s ease',
        outline: 'none',
        ':focus': {
          borderColor: '#3b82f6',
          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
        },
      };
    }
    return baseStyle;
  },
};

export default WebEnhancements;
