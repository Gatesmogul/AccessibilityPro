import React from 'react';
import { Tabs } from 'expo-router'; // ✅ Added and imported cleanly
import { Drawer } from 'expo-router/drawer';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, View } from 'react-native';

export default function TabsDrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerLeft: () => (
          <View style={styles.drawerButtonWrapper}>
            <DrawerToggleButton tintColor="#1C1C1E" />
          </View>
        ),
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 17,
          color: '#1C1C1E',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          ...Platform.select({
            ios: {
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 0.5 },
              shadowOpacity: 0.1,
              shadowRadius: 0,
            },
            android: {
              elevation: 2,
            },
            web: {
              // ✅ Fixed: Resolved platform object spread configuration issues on Web engines
              boxShadow: '0px 0.5px 0px rgba(0, 0, 0, 0.1)',
            },
          }),
        },
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#8E8E93',
        drawerLabelStyle: {
          fontWeight: '600',
          fontSize: 15,
          marginLeft: -10,
        },
        drawerStyle: {
          backgroundColor: '#FFFFFF',
          width: 280,
        },
      }}
    >
      {/* 1. Explore Marketplace */}
      <Drawer.Screen
        name="homepage"
        options={{
          drawerLabel: 'Marketplace',
          title: 'Explore AccessibilityPro',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 2. Owner Console */}
      <Drawer.Screen
        name="owner-dashboard"
        options={{
          drawerLabel: 'Owner Hub',
          title: 'Owner Console',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="business-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 3. Customer Dashboard Layout Link */}
      <Drawer.Screen
        name="customer-dashboard"
        options={{
          drawerLabel: 'Customer Dashboard', // ✅ Fixed label syntax representation
          title: 'Customer Dashboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 4. Settings-Privacy Panel */}
      <Drawer.Screen
        name="settings-privacy"
        options={{
          drawerLabel: 'Settings-Privacy',
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerButtonWrapper: {
    ...Platform.select({
      ios: { marginLeft: 4 },
      android: { marginLeft: 8 },
      default: { marginLeft: 4 },
    }),
  },
});