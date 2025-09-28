import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Admin Screens
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminUsersScreen from '../screens/AdminUsersScreen';
import AdminRidesScreen from '../screens/AdminRidesScreen';
import AdminAnalyticsScreen from '../screens/AdminAnalyticsScreen';
import AdminSettingsScreen from '../screens/AdminSettingsScreen';
import AdminSupportScreen from '../screens/AdminSupportScreen';
import AdminNotificationsScreen from '../screens/AdminNotificationsScreen';

const Stack = createNativeStackNavigator();
const AdminTab = createBottomTabNavigator();

function AdminTabs() {
  return (
    <AdminTab.Navigator
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
          shadowColor: '#10B981',
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
            colors={['#10B981', '#34D399', '#6EE7B7']}
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
            AdminDashboard: 'home-outline',
            AdminUsers: 'people-outline',
            AdminRides: 'car-outline',
            AdminAnalytics: 'analytics-outline',
            AdminSettings: 'settings-outline',
          };
          const name = icons[route.name] || 'ellipse-outline';
          
          // Special styling for Analytics tab (center tab)
          if (route.name === 'AdminAnalytics') {
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
                  name={focused ? 'analytics' : 'analytics-outline'} 
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
      <AdminTab.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen} 
        options={{ title: 'Dashboard' }} 
      />
      <AdminTab.Screen 
        name="AdminUsers" 
        component={AdminUsersScreen} 
        options={{ title: 'Users' }} 
      />
      <AdminTab.Screen 
        name="AdminRides" 
        component={AdminRidesScreen} 
        options={{ title: 'Rides' }} 
      />
      <AdminTab.Screen 
        name="AdminAnalytics" 
        component={AdminAnalyticsScreen} 
        options={{ 
          title: 'Analytics',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 16,
          }
        }} 
      />
      <AdminTab.Screen 
        name="AdminSettings" 
        component={AdminSettingsScreen} 
        options={{ title: 'Settings' }} 
      />
    </AdminTab.Navigator>
  );
}

function AdminPanel() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs" component={AdminTabs} />
      <Stack.Screen name="AdminSupport" component={AdminSupportScreen} />
      <Stack.Screen name="AdminNotifications" component={AdminNotificationsScreen} />
    </Stack.Navigator>
  );
}

export default AdminPanel;
