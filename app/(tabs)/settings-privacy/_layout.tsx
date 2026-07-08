import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList, DrawerToggleButton } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet, Platform, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

/**
 * Custom Drawer Content Component
 * Renders the top profile banner (Avatar + Full Name) followed by the sub-screen navigation items.
 */
function CustomDrawerContent(props: any) {
  const router = useRouter();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScrollContainer}>
      
      {/* Registered User Profile Branding Header */}
      <View style={styles.profileHeaderContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' }}
          style={styles.profileAvatar}
        />
        <View style={styles.profileMeta}>
          <Text style={styles.profileNameText} numberOfLines={1}>
            Alex Johnston
          </Text>
          <Text style={styles.profileStatusSubtext}>
            Registered Member
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Navigation Sub-screens List Container */}
      <View style={styles.drawerItemsWrapper}>
        <DrawerItemList {...props} />
      </View>

      {/* Optional Corporate Footer Action */}
      <View style={styles.drawerFooter}>
        <Pressable 
          style={styles.logoutPressable} 
          onPress={() => router.replace('/auth/signin')}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Sign Out Account</Text>
        </Pressable>
      </View>

    </DrawerContentScrollView>
  );
}

export default function SettingsPrivacyLayout() {
  return (
    <Drawer
      drawerContent={(props: any) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerLeft: () => (
          <View style={styles.menuIconWrapper}>
            <DrawerToggleButton tintColor="#1C1C1E" />
          </View>
        ),
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 16,
          color: '#1C1C1E',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          ...Platform.select({
            ios: {
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 0.5 },
              shadowOpacity: 0.08,
              shadowRadius: 0,
            },
            android: {
              elevation: 2,
            },
          }),
        },
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#48484A',
        drawerActiveBackgroundColor: '#F2F2F7',
        drawerLabelStyle: {
          fontWeight: '600',
          fontSize: 14,
          marginLeft: -6,
        },
        drawerStyle: {
          backgroundColor: '#FFFFFF',
          width: 290,
        },
      }}
    >
      {/* Target Sub-Screen: Core Application Preferences */}
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'App Settings',
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Target Sub-Screen: Legal Compliance & Privacy Statements */}
      <Drawer.Screen
        name="privacy"
        options={{
          drawerLabel: 'Privacy & Security',
          title: 'Privacy Policy',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="shield-checkmark-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerScrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileHeaderContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E5E5EA',
  },
  profileMeta: {
    marginLeft: 14,
    flex: 1,
  },
  profileNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  profileStatusSubtext: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  drawerItemsWrapper: {
    flex: 1,
    paddingHorizontal: 8,
  },
  menuIconWrapper: {
    ...Platform.select({
      ios: {
        marginLeft: 6,
      },
      android: {
        marginLeft: 10,
      },
    }),
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  logoutPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 14,
  },
});