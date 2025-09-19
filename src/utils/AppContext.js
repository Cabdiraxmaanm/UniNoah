import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state
const initialState = {
  user: null,
  userType: null, // 'student' or 'driver'
  rides: [],
  bookings: [],
  requests: [],
  currentLocation: null,
  isAuthenticated: false,
  isLoading: false,
  notifications: [],
};

// Action types
export const ACTIONS = {
  SET_USER: 'SET_USER',
  SET_USER_TYPE: 'SET_USER_TYPE',
  SET_RIDES: 'SET_RIDES',
  ADD_RIDE: 'ADD_RIDE',
  UPDATE_RIDE: 'UPDATE_RIDE',
  SET_BOOKINGS: 'SET_BOOKINGS',
  ADD_BOOKING: 'ADD_BOOKING',
  UPDATE_BOOKING: 'UPDATE_BOOKING',
  SET_REQUESTS: 'SET_REQUESTS',
  ADD_REQUEST: 'ADD_REQUEST',
  UPDATE_REQUEST: 'UPDATE_REQUEST',
  SET_CURRENT_LOCATION: 'SET_CURRENT_LOCATION',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_LOADING: 'SET_LOADING',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  LOGOUT: 'LOGOUT',
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };
    case ACTIONS.SET_USER_TYPE:
      return { ...state, userType: action.payload };
    case ACTIONS.SET_RIDES:
      return { ...state, rides: action.payload };
    case ACTIONS.ADD_RIDE:
      return { ...state, rides: [...state.rides, action.payload] };
    case ACTIONS.UPDATE_RIDE:
      return {
        ...state,
        rides: state.rides.map(ride =>
          ride.id === action.payload.id ? { ...ride, ...action.payload } : ride
        ),
      };
    case ACTIONS.SET_BOOKINGS:
      return { ...state, bookings: action.payload };
    case ACTIONS.ADD_BOOKING:
      return { ...state, bookings: [...state.bookings, action.payload] };
    case ACTIONS.UPDATE_BOOKING:
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.id ? { ...booking, ...action.payload } : booking
        ),
      };
    case ACTIONS.SET_REQUESTS:
      return { ...state, requests: action.payload };
    case ACTIONS.ADD_REQUEST:
      return { ...state, requests: [...state.requests, action.payload] };
    case ACTIONS.UPDATE_REQUEST:
      return {
        ...state,
        requests: state.requests.map(request =>
          request.id === action.payload.id ? { ...request, ...action.payload } : request
        ),
      };
    case ACTIONS.SET_CURRENT_LOCATION:
      return { ...state, currentLocation: action.payload };
    case ACTIONS.SET_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTIONS.ADD_NOTIFICATION:
      return { ...state, notifications: [...state.notifications, action.payload] };
    case ACTIONS.CLEAR_NOTIFICATIONS:
      return { ...state, notifications: [] };
    case ACTIONS.LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user data from storage on app start
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        dispatch({ type: ACTIONS.SET_USER, payload: parsedData.user });
        dispatch({ type: ACTIONS.SET_USER_TYPE, payload: parsedData.userType });
        dispatch({ type: ACTIONS.SET_AUTHENTICATED, payload: true });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async (user, userType) => {
    try {
      const userData = { user, userType };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const login = async (user, userType) => {
    console.log('=== APP CONTEXT LOGIN ===');
    console.log('Login called with:', { user, userType });
    
    dispatch({ type: ACTIONS.SET_USER, payload: user });
    dispatch({ type: ACTIONS.SET_USER_TYPE, payload: userType });
    dispatch({ type: ACTIONS.SET_AUTHENTICATED, payload: true });
    
    console.log('Dispatched actions, saving user data...');
    await saveUserData(user, userType);
    console.log('User data saved, login complete');
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      dispatch({ type: ACTIONS.LOGOUT });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const addRide = (ride) => {
    dispatch({ type: ACTIONS.ADD_RIDE, payload: ride });
  };

  const updateRide = (ride) => {
    dispatch({ type: ACTIONS.UPDATE_RIDE, payload: ride });
  };

  const addBooking = (booking) => {
    dispatch({ type: ACTIONS.ADD_BOOKING, payload: booking });
  };

  const updateBooking = (booking) => {
    dispatch({ type: ACTIONS.UPDATE_BOOKING, payload: booking });
  };

  const addRequest = (request) => {
    dispatch({ type: ACTIONS.ADD_REQUEST, payload: request });
  };

  const updateRequest = (request) => {
    dispatch({ type: ACTIONS.UPDATE_REQUEST, payload: request });
  };

  const addNotification = (notification) => {
    dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: notification });
  };

  const value = {
    ...state,
    login,
    logout,
    addRide,
    updateRide,
    addBooking,
    updateBooking,
    addRequest,
    updateRequest,
    addNotification,
    dispatch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 