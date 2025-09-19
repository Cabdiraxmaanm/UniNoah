import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../utils/AppContext';
import SplashScreen from '../screens/SplashScreen';
import SignUpScreen from '../screens/SignUpScreen';
import StudentAuthScreen from '../screens/StudentAuthScreen';
import StudentSearchRidesScreen from '../screens/StudentSearchRidesScreen';
import StudentBookRideScreen from '../screens/StudentBookRideScreen';
import StudentLiveTrackingScreen from '../screens/StudentLiveTrackingScreen';
import StudentRateDriverScreen from '../screens/StudentRateDriverScreen';
import StudentRideHistoryScreen from '../screens/StudentRideHistoryScreen';
import StudentRequestsScreen from '../screens/StudentRequestsScreen';
import StudentHomeScreen from '../screens/StudentHomeScreen';
import DriverAuthScreen from '../screens/DriverAuthScreen';
import DriverSetAvailabilityScreen from '../screens/DriverSetAvailabilityScreen';
import DriverRequestsScreen from '../screens/DriverRequestsScreen';
import DriverBookingsScreen from '../screens/DriverBookingsScreen';
import DriverNavigationScreen from '../screens/DriverNavigationScreen';
import DriverHomeScreen from '../screens/DriverHomeScreen';

const Stack = createNativeStackNavigator();
const StudentStack = createNativeStackNavigator();
const DriverStack = createNativeStackNavigator();
const StudentTab = createBottomTabNavigator();
const DriverTab = createBottomTabNavigator();

function StudentTabs() {
  return (
    <StudentTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1E3A8A',
        tabBarInactiveTintColor: '#6B7280',
        tabBarIcon: ({ color, size }) => {
          const icons = {
            StudentHome: 'home-outline',
            StudentSearchRides: 'search-outline',
            StudentRideHistory: 'time-outline',
            StudentRequests: 'mail-outline',
          };
          const name = icons[route.name] || 'ellipse-outline';
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <StudentTab.Screen name="StudentHome" component={StudentHomeScreen} options={{ title: 'Home' }} />
      <StudentTab.Screen name="StudentSearchRides" component={StudentSearchRidesScreen} options={{ title: 'Search' }} />
      <StudentTab.Screen name="StudentRideHistory" component={StudentRideHistoryScreen} options={{ title: 'History' }} />
      <StudentTab.Screen name="StudentRequests" component={StudentRequestsScreen} options={{ title: 'Requests' }} />
    </StudentTab.Navigator>
  );
}

function StudentPanel() {
  return (
    <StudentStack.Navigator screenOptions={{ headerShown: false }}>
      <StudentStack.Screen name="StudentTabs" component={StudentTabs} />
      <StudentStack.Screen name="StudentBookRide" component={StudentBookRideScreen} />
      <StudentStack.Screen name="StudentLiveTracking" component={StudentLiveTrackingScreen} />
      <StudentStack.Screen name="StudentRateDriver" component={StudentRateDriverScreen} />
    </StudentStack.Navigator>
  );
}

function DriverTabs() {
  return (
    <DriverTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1E3A8A',
        tabBarInactiveTintColor: '#6B7280',
        tabBarIcon: ({ color, size }) => {
          const icons = {
            DriverHome: 'home-outline',
            DriverSetAvailability: 'calendar-outline',
            DriverRequests: 'mail-unread-outline',
            DriverBookings: 'list-outline',
          };
          const name = icons[route.name] || 'ellipse-outline';
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <DriverTab.Screen name="DriverHome" component={DriverHomeScreen} options={{ title: 'Home' }} />
      <DriverTab.Screen name="DriverSetAvailability" component={DriverSetAvailabilityScreen} options={{ title: 'Availability' }} />
      <DriverTab.Screen name="DriverRequests" component={DriverRequestsScreen} options={{ title: 'Requests' }} />
      <DriverTab.Screen name="DriverBookings" component={DriverBookingsScreen} options={{ title: 'Bookings' }} />
    </DriverTab.Navigator>
  );
}

function DriverPanel() {
  return (
    <DriverStack.Navigator screenOptions={{ headerShown: false }}>
      <DriverStack.Screen name="DriverTabs" component={DriverTabs} />
      <DriverStack.Screen name="DriverNavigation" component={DriverNavigationScreen} />
    </DriverStack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, userType } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="StudentAuth" component={StudentAuthScreen} />
        <Stack.Screen name="DriverAuth" component={DriverAuthScreen} />
        <Stack.Screen name="StudentPanel" component={StudentPanel} />
        <Stack.Screen name="DriverPanel" component={DriverPanel} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 