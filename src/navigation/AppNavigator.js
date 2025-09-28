import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../utils/AppContext';
import SplashScreen from '../screens/SplashScreen';
import SignUpScreen from '../screens/SignUpScreen';
import StudentAuthScreen from '../screens/StudentAuthScreen';
import StudentSearchRidesScreen from '../screens/StudentSearchRidesScreen';
import StudentMapScreen from '../screens/StudentMapScreen';
import StudentBookRideScreen from '../screens/StudentBookRideScreen';
import StudentLiveTrackingScreen from '../screens/StudentLiveTrackingScreen';
import StudentRateDriverScreen from '../screens/StudentRateDriverScreen';
import StudentRateExperienceScreen from '../screens/StudentRateExperienceScreen';
import StudentRideHistoryScreen from '../screens/StudentRideHistoryScreen';
import StudentRequestsScreen from '../screens/StudentRequestsScreen';
import StudentHomeScreen from '../screens/StudentHomeScreen';
import StudentSettingsScreen from '../screens/StudentSettingsScreen';
import StudentSupportScreen from '../screens/StudentSupportScreen';
import DriverAuthScreen from '../screens/DriverAuthScreen';
import DriverSetAvailabilityScreen from '../screens/DriverSetAvailabilityScreen';
import DriverRequestsScreen from '../screens/DriverRequestsScreen';
import DriverBookingsScreen from '../screens/DriverBookingsScreen';
import DriverNavigationScreen from '../screens/DriverNavigationScreen';
import DriverHomeScreen from '../screens/DriverHomeScreen';
import DriverMapScreen from '../screens/DriverMapScreen';
import DriverSettingsScreen from '../screens/DriverSettingsScreen';
import DriverSupportScreen from '../screens/DriverSupportScreen';
import DriverEarningsScreen from '../screens/DriverEarningsScreen';
import DriverEditProfileScreen from '../screens/DriverEditProfileScreen';
import AdminAuthScreen from '../screens/AdminAuthScreen';
import AdminPanel from './AdminNavigator';

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
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.8)',
        tabBarStyle: {
          position: 'absolute',
          bottom: 50,
          left: 15,
          right: 15,
          height: 75,
          backgroundColor: 'transparent',
          borderRadius: 30,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#003B73',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.35,
          shadowRadius: 16,
          elevation: 12,
          borderTopWidth: 0,
          borderWidth: 2,
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#003B73', '#0074D9', '#00BFFF']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 30,
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const icons = {
            StudentHome: 'home-outline',
            StudentSearchRides: 'search-outline',
            StudentMap: 'map-outline',
            StudentRideHistory: 'time-outline',
            StudentRequests: 'mail-outline',
          };
          const name = icons[route.name] || 'ellipse-outline';
          
          // Special styling for Map tab
          if (route.name === 'StudentMap') {
            return (
              <View style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: '#F59E0B', // gold color
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#F59E0B',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.6,
                shadowRadius: 15,
                elevation: 12,
                borderWidth: 4,
                borderColor: focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)',
                transform: [{ scale: focused ? 1.15 : 1 }, { translateY: -10 }],
                marginTop: -10,
              }}>
                <Ionicons 
                  name={focused ? 'map' : 'map-outline'} 
                  size={35} 
                  color="#FFFFFF"
                />
              </View>
            );
          }
          
          // Enhanced styling for other tabs
          return (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 4,
            }}>
              <View style={{
                width: focused ? 40 : 36,
                height: focused ? 40 : 36,
                borderRadius: 20,
                backgroundColor: focused ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 2,
              }}>
                <Ionicons 
                  name={focused ? name.replace('-outline', '') : name} 
                  size={focused ? 24 : 22} 
                  color={color} 
                />
              </View>
            </View>
          );
        },
      })}
    >
      <StudentTab.Screen name="StudentHome" component={StudentHomeScreen} options={{ title: 'Home' }} />
      <StudentTab.Screen name="StudentSearchRides" component={StudentSearchRidesScreen} options={{ title: 'Search' }} />
      <StudentTab.Screen 
        name="StudentMap" 
        component={StudentMapScreen} 
        options={{ 
          title: 'Map',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 16,
          }
        }} 
      />
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
      <StudentStack.Screen name="StudentRateExperience" component={StudentRateExperienceScreen} />
      <StudentStack.Screen name="StudentSettings" component={StudentSettingsScreen} />
      <StudentStack.Screen name="StudentSupport" component={StudentSupportScreen} />
    </StudentStack.Navigator>
  );
}

function DriverTabs() {
  return (
    <DriverTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.8)',
        tabBarStyle: {
          position: 'absolute',
          bottom: 50,
          left: 15,
          right: 15,
          height: 75,
          backgroundColor: 'transparent',
          borderRadius: 30,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#003B73',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.35,
          shadowRadius: 16,
          elevation: 12,
          borderTopWidth: 0,
          borderWidth: 2,
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#003B73', '#0074D9', '#00BFFF']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 30,
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const icons = {
            DriverHome: 'home-outline',
            DriverSetAvailability: 'calendar-outline',
            DriverMap: 'map-outline',
            DriverRequests: 'mail-unread-outline',
            DriverBookings: 'list-outline',
          };
          const name = icons[route.name] || 'ellipse-outline';
          
          // Special styling for Map tab
          if (route.name === 'DriverMap') {
            return (
              <View style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: '#F59E0B', // gold color
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#F59E0B',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.6,
                shadowRadius: 15,
                elevation: 12,
                borderWidth: 4,
                borderColor: focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)',
                transform: [{ scale: focused ? 1.15 : 1 }, { translateY: -10 }],
                marginTop: -10,
              }}>
                <Ionicons
                  name={focused ? 'map' : 'map-outline'}
                  size={35}
                  color="#FFFFFF"
                />
              </View>
            );
          }
          
          return (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 4,
            }}>
              <View style={{
                width: focused ? 40 : 36,
                height: focused ? 40 : 36,
                borderRadius: 20,
                backgroundColor: focused ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 2,
              }}>
                <Ionicons 
                  name={focused ? name.replace('-outline', '') : name} 
                  size={focused ? 24 : 22} 
                  color={color} 
                />
              </View>
            </View>
          );
        },
      })}
    >
      <DriverTab.Screen name="DriverHome" component={DriverHomeScreen} options={{ title: 'Home' }} />
      <DriverTab.Screen name="DriverSetAvailability" component={DriverSetAvailabilityScreen} options={{ title: 'Availability' }} />
      <DriverTab.Screen 
        name="DriverMap" 
        component={DriverMapScreen} 
        options={{ 
          title: 'Map',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 16,
          }
        }} 
      />
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
      <DriverStack.Screen name="DriverSettings" component={DriverSettingsScreen} />
      <DriverStack.Screen name="DriverSupport" component={DriverSupportScreen} />
      <DriverStack.Screen name="DriverEarnings" component={DriverEarningsScreen} />
      <DriverStack.Screen name="DriverEditProfile" component={DriverEditProfileScreen} />
    </DriverStack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, userType } = useApp();

  // Determine initial route based on authentication status and user type
  const getInitialRoute = () => {
    if (isAuthenticated) {
      switch (userType) {
        case 'student':
          return 'StudentPanel';
        case 'driver':
          return 'DriverPanel';
        case 'admin':
          return 'AdminPanel';
        default:
          return 'Splash';
      }
    }
    return 'Splash';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={getInitialRoute()} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="StudentAuth" component={StudentAuthScreen} />
        <Stack.Screen name="DriverAuth" component={DriverAuthScreen} />
        <Stack.Screen name="AdminAuth" component={AdminAuthScreen} />
        <Stack.Screen name="StudentPanel" component={StudentPanel} />
        <Stack.Screen name="DriverPanel" component={DriverPanel} />
        <Stack.Screen name="AdminPanel" component={AdminPanel} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 