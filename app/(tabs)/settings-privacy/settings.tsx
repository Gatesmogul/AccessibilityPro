import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Switch,
  Modal,
  TextInput,
  Alert,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Settings() {
  const router = useRouter();

  // Primary user profile states (Simulating database states)
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 234-5678');
  const [emailAddress, setEmailAddress] = useState('developer@accessibilitypro.com');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Modal display control states
  const [activeModal, setActiveModal] = useState<'none' | 'phone' | 'email'>('none');
  const [tempInput, setTempInput] = useState('');

  // Editing overlay trigger handlers
  const openEditModal = (type: 'phone' | 'email') => {
    setTempInput(type === 'phone' ? phoneNumber : emailAddress);
    setActiveModal(type);
  };

  const handleUpdateField = () => {
    if (!tempInput.trim()) {
      Alert.alert('Validation Error', 'Input fields cannot be left blank.');
      return;
    }

    if (activeModal === 'phone') {
      setPhoneNumber(tempInput.trim());
      setActiveModal('none');
      Alert.alert(
        'Verification Dispatched',
        'We have transmitted an authorization update code to your phone number. Please confirm your text alerts.'
      );
    } else if (activeModal === 'email') {
      setEmailAddress(tempInput.trim());
      setActiveModal('none');
      Alert.alert(
        'Verification Email Sent',
        'A secure authorization payload has been routed to your new email destination profile. Check your inbox to verify.'
      );
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out Account', 'Are you sure you want to end your active session on this device?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => router.replace('/auth/signin') }
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '🚨 Critical Action',
      'This action is irreversible. Deleting your profile removes all listed items, historical ledgers, and transaction metrics permanently.',
      [
        { text: 'Abort', style: 'cancel' },
        { 
          text: 'Permanently Erase', 
          style: 'destructive', 
          onPress: () => {
            Alert.alert('Account Purged', 'Your registry details have been wiped securely from AccessibilityPro servers.');
            router.replace('/auth/signup');
          } 
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
      
      {/* Category Section: Core Account Access Details */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Account Information</Text>
        
        {/* Phone Handling Metric Item */}
        <View style={styles.settingItemRow}>
          <View style={styles.settingLeftColumn}>
            <Ionicons name="call-outline" size={20} color="#48484A" />
            <View style={styles.textStack}>
              <Text style={styles.itemTitle}>Phone Number</Text>
              <Text style={styles.itemValueText}>{phoneNumber}</Text>
            </View>
          </View>
          <Pressable style={styles.editButtonBtn} onPress={() => openEditModal('phone')}>
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
        </View>

        {/* Email Handling Metric Item */}
        <View style={styles.settingItemRow}>
          <View style={styles.settingLeftColumn}>
            <Ionicons name="mail-outline" size={20} color="#48484A" />
            <View style={styles.textStack}>
              <Text style={styles.itemTitle}>Email Address</Text>
              <Text style={styles.itemValueText} numberOfLines={1}>{emailAddress}</Text>
            </View>
          </View>
          <Pressable style={styles.editButtonBtn} onPress={() => openEditModal('email')}>
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
        </View>
      </View>

      {/* Category Section: Interface Personalization */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Preferences</Text>
        
        <View style={styles.settingItemRow}>
          <View style={styles.settingLeftColumn}>
            <Ionicons name="moon-outline" size={20} color="#48484A" />
            <View style={styles.textStack}>
              <Text style={styles.itemTitle}>Dark Mode</Text>
              <Text style={styles.itemSubtext}>Adjust system theme application colors</Text>
            </View>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={(value) => setIsDarkMode(value)}
            trackColor={{ false: '#D1D1D6', true: '#34C759' }}
            thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
          />
        </View>
      </View>

      {/* Category Section: Device Management & Security */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Security & Control</Text>

        <Pressable 
          style={styles.navRowItem} 
          onPress={() => Alert.alert('Password Strategy', 'Routing user to biometric and key authentication management suites.')}
        >
          <View style={styles.settingLeftColumn}>
            <Ionicons name="lock-closed-outline" size={20} color="#48484A" />
            <View style={styles.textStack}>
              <Text style={styles.itemTitle}>Password & Security</Text>
              <Text style={styles.itemSubtext}>Update authorization codes and 2FA keys</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
        </Pressable>
      </View>

      {/* Category Section: Danger Zone Session Clearances */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Session Actions</Text>

        <Pressable style={styles.navRowItem} onPress={handleSignOut}>
          <View style={styles.settingLeftColumn}>
            <Ionicons name="log-out-outline" size={20} color="#FF9500" />
            <Text style={[styles.itemTitle, { color: '#FF9500' }]}>Sign Out</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
        </Pressable>

        <Pressable style={styles.navRowItem} onPress={handleDeleteAccount}>
          <View style={styles.settingLeftColumn}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            <Text style={[styles.itemTitle, { color: '#FF3B30', fontWeight: '700' }]}>Delete Account</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
        </Pressable>
      </View>

      {/* Reusable Data Management Overlay Sheet Modal */}
      <Modal
        visible={activeModal !== 'none'}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setActiveModal('none')}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Update {activeModal === 'phone' ? 'Phone Number' : 'Email Address'}
            </Text>
            <Text style={styles.modalDescription}>
              Modifying this parameter shifts profile status fields into a tentative validation loop until the verification email is confirmed.
            </Text>
            
            <TextInput
              style={styles.modalTextInput}
              value={tempInput}
              onChangeText={setTempInput}
              keyboardType={activeModal === 'phone' ? 'phone-pad' : 'email-address'}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />

            <View style={styles.modalActionsRow}>
              <Pressable style={styles.modalCancelBtn} onPress={() => setActiveModal('none')}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalSaveBtn} onPress={handleUpdateField}>
                <Text style={styles.modalSaveText}>Save & Verify</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#C6C6C8',
    paddingLeft: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#636366',
    textTransform: 'uppercase',
    marginTop: 14,
    marginBottom: 6,
    marginLeft: 0,
  },
  settingItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingRight: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  navRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingRight: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  settingLeftColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textStack: {
    marginLeft: 14,
    flex: 1,
    paddingRight: 8,
  },
  itemTitle: {
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  itemValueText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  itemSubtext: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 1,
  },
  editButtonBtn: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 14,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 13,
    color: '#636366',
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalTextInput: {
    backgroundColor: '#F2F2F7',
    height: 46,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#1C1C1E',
    borderWidth: 0.5,
    borderColor: '#C6C6C8',
    marginBottom: 20,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C6C6C8',
  },
  modalCancelText: {
    color: '#48484A',
    fontWeight: '600',
    fontSize: 15,
  },
  modalSaveBtn: {
    flex: 1.5,
    backgroundColor: '#007AFF',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});