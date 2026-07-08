import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Pressable, 
  Image, 
  Alert, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Hooks, Application Context, and Global Store Channels
import { useAuth } from '../../context/AuthContext'; 
import { useCartStore } from '../../store/useCartStore'; 

// Common Architectural Design Toolkit UI Elements
import InputField from '../../components/common/InputField';
import CustomButton from '../../components/common/CustomButton';

interface TransactionRecord {
  id: string;
  productDetails: string;
  receiptName: string;
  timestamp: string;
}

export default function CustomerDashboard() {
  // Safe validation check for the active Auth Context lifecycle instance
  const authContext = useAuth();
  
  // Return an initialization loader if the hook is parsed outside a valid provider tree frame
  if (!authContext) {
    return (
      <View style={styles.fallbackLoaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.fallbackLoaderText}>Initializing Customer Dashboard...</Text>
      </View>
    );
  }

  const { user } = authContext;

  // Zustand Reactive Shopping Basket State Engine
  const cartItems = useCartStore((state) => state.items);
  const clearItemRow = useCartStore((state) => state.clearItemRow);
  const cartTotalBalance = useCartStore((state) => state.getCartTotal());

  // Component Transaction History Framework State
  const [productDetails, setProductDetails] = useState('');
  const [uploadedReceipt, setUploadedReceipt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([
    { 
      id: 'tx-1', 
      productDetails: 'Downtown Tech Hub Depot (Deposit Payment Structure)', 
      receiptName: 'receipt_2026_07.pdf', 
      timestamp: '2026-07-01' 
    }
  ]);

  // Dropdown UI Interaction Manager Toggle State
  const [showCartDropdown, setShowCartDropdown] = useState(false);

  // Auto-collapse cart dropdown gracefully if the user clears all items out
  useEffect(() => {
    if (cartItems.length === 0) {
      setShowCartDropdown(false);
    }
  }, [cartItems.length]);

  // Document Picker Framework Pipeline Simulation Handler
  const handlePickReceipt = () => {
    if (Platform.OS === 'web') {
      // Safe fallback option for web browser platforms
      const confirmUpload = window.confirm("Mocking native storage protocol: Select remittance_receipt.pdf?");
      if (confirmUpload) {
        setUploadedReceipt('receipt_upload_success.pdf');
      }
      return;
    }

    Alert.alert(
      'Document System Injected', 
      'Mocking native device storage framework upload sequence protocols.',
      [
        { 
          text: 'Select remittance_receipt.pdf', 
          onPress: () => setUploadedReceipt('receipt_upload_success.pdf') 
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // Validation Verification Submission Controller
  const handleSubmitTransaction = () => {
    if (!productDetails.trim()) {
      if (Platform.OS === 'web') {
        alert('Validation Check Failure: Please supply descriptive details matching your property destination.');
      } else {
        Alert.alert('Validation Check Failure', 'Please supply descriptive details matching your property destination.');
      }
      return;
    }
    if (!uploadedReceipt) {
      if (Platform.OS === 'web') {
        alert('Missing Asset Attachment: Verification architecture demands receipt uploads.');
      } else {
        Alert.alert('Missing Asset Attachment', 'Verification architecture demands receipt uploads before database ledger logging.');
      }
      return;
    }

    setIsSubmitting(true);

    // Simulate API transactional writing delay block safely
    setTimeout(() => {
      const newRecord: TransactionRecord = {
        id: `tx-${Date.now()}`,
        productDetails: productDetails.trim(),
        receiptName: uploadedReceipt,
        timestamp: new Date().toISOString().split('T')[0]
      };

      setTransactions([newRecord, ...transactions]);
      handleClearForm();
      setIsSubmitting(false);
      
      if (Platform.OS === 'web') {
        alert('Submission Approved: Verification receipt payload safely queued for internal auditing.');
      } else {
        Alert.alert('Submission Approved', 'Verification receipt payload safely queued for internal auditing channels.');
      }
    }, 800);
  };

  const handleClearForm = () => {
    setProductDetails('');
    setUploadedReceipt(null);
  };

  return (
    <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
      
      {/* Identity Top Application Branding Frame */}
      <View style={styles.brandingHeader}>
        <View style={styles.logoLayout}>
          <Ionicons name="accessibility" size={24} color="#007AFF" />
          <Text style={styles.logoTitleText}>AccessibilityPro</Text>
        </View>
      </View>

      {/* Profile Hero Overview Section Banner */}
      <View style={styles.profileHeroSection}>
        <Image 
          source={{ uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' }} 
          style={styles.avatarImage} 
        />
        <View style={styles.identityTextPanel}>
          <Text style={styles.welcomeLabel}>Welcome Back,</Text>
          <Text style={styles.customerNameText}>{user?.fullName || 'Alex Johnston'}</Text>
          <View style={styles.badgeRow}>
            <Text style={styles.statusBadgeText}>Verified Account</Text>
          </View>
        </View>
      </View>

      {/* Global Interactive Checkout Interaction Layout */}
      <View style={styles.interactiveActionContainer}>
        <Pressable 
          style={[styles.cartIconButton, showCartDropdown && styles.cartActiveButton]} 
          onPress={() => cartItems.length > 0 && setShowCartDropdown(!showCartDropdown)}
          disabled={cartItems.length === 0}
        >
          <View style={styles.cartIconWrapper}>
            <Ionicons 
              name={showCartDropdown ? "cart" : "cart-outline"} 
              size={20} 
              color={cartItems.length === 0 ? "#AEAEB2" : showCartDropdown ? "#FFFFFF" : "#007AFF"} 
            />
            {cartItems.length > 0 && (
              <View style={styles.badgeIndicator}>
                <Text style={styles.badgeCounterText}>{cartItems.length}</Text>
              </View>
            )}
          </View>
          <Text style={[
            styles.cartButtonLabelText, 
            cartItems.length === 0 && styles.cartButtonLabelDisabled,
            showCartDropdown && styles.cartActiveText
          ]}>
            {cartItems.length === 0 
              ? 'Your Active Basket is Empty' 
              : showCartDropdown 
                ? 'Hide Active Cart Items' 
                : `View My Cart & Orders (${cartTotalBalance})`
            }
          </Text>
        </Pressable>

        {/* Persistent Memory Dropdown Section */}
        {showCartDropdown && cartItems.length > 0 && (
          <View style={styles.cartDropdownOverlay}>
            <Text style={styles.dropdownHeading}>Your Selected Properties</Text>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartItemRow}>
                <Image source={{ uri: item.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100' }} style={styles.cartRowThumb} />
                <View style={styles.cartItemMeta}>
                  <Text style={styles.cartItemTitle} numberOfLines={1}>{item.name}</Text>
                  <View style={styles.categoryBadgeRow}>
                    <Text style={styles.cartItemCategory}>{item.status || 'Asset'}</Text>
                    <Text style={styles.cartItemQty}>Qty: {item.quantity}</Text>
                  </View>
                  <Text style={styles.cartItemPrice}>{item.price}</Text>
                </View>
                <Pressable style={styles.removeCartItemBtn} onPress={() => clearItemRow(item.id)}>
                  <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Transaction History Verification Infrastructure Section */}
      <View style={styles.formCardContainer}>
        <Text style={styles.sectionHeadingText}>Transaction History Verification</Text>
        <Text style={styles.sectionSubtitleText}>
          Upload platform bank wire transfers or clearing house confirmations below to fast-track user property verification permissions.
        </Text>
        
        <InputField
          label="Product Details / Property Location *"
          placeholder="Enter unique asset name, listing address space, or checkout tracking identifier..."
          value={productDetails}
          onChangeText={setProductDetails}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          containerStyle={styles.inputOverrideSpacing}
        />

        <Text style={styles.fieldLabel}>Payment Receipt Attachment *</Text>
        <Pressable 
          style={[styles.uploadBoxFrame, uploadedReceipt !== null && styles.uploadBoxSuccess]} 
          onPress={handlePickReceipt}
        >
          <Ionicons 
            name={uploadedReceipt ? "cloud-done" : "cloud-upload-outline"} 
            size={26} 
            color={uploadedReceipt ? "#34C759" : "#007AFF"} 
          />
          <Text style={[styles.uploadBoxMainText, uploadedReceipt !== null && styles.uploadBoxSuccessText]}>
            {uploadedReceipt ? 'Receipt Captured Successfully' : 'Select Official Remittance PDF / Image'}
          </Text>
          <Text style={styles.uploadBoxSubtext}>
            {uploadedReceipt ? `${uploadedReceipt}` : 'Max individual ledger capacity allocation 10MB'}
          </Text>
        </Pressable>

        <View style={styles.formButtonActionRow}>
          <Pressable style={styles.clearFormBtn} onPress={handleClearForm}>
            <Ionicons name="refresh-outline" size={15} color="#636366" />
            <Text style={styles.clearFormBtnText}>Reset Form Layout</Text>
          </Pressable>

          <CustomButton
            title="Submit Records"
            onPress={handleSubmitTransaction}
            isLoading={isSubmitting}
            variant="primary"
            style={styles.submitBtnWidthCorrection}
          />
        </View>
      </View>

      {/* Logged Verifications Table Interface Ledger Container */}
      <View style={styles.historyLogContainer}>
        <Text style={styles.sectionHeadingText}>Logged Portal Audits</Text>
        {transactions.length === 0 ? (
          <Text style={styles.emptyLogsText}>No ledger items found mapped onto this registration tracking instance profile.</Text>
        ) : (
          /* ✅ Fixed: Wrapped inside standard JS evaluation context blocks */
          transactions.map((tx) => (
            <View key={tx.id} style={styles.logCardItem}>
              <View style={styles.logCardHeader}>
                <View style={styles.statusGroup}>
                  <View style={styles.statusDotIndicator} />
                  <Text style={styles.logIdString}>Log Ref: {tx.id}</Text>
                </View>
                <Text style={styles.logDateStamp}>{tx.timestamp}</Text>
              </View>
              <Text style={styles.logDetailBody}>{tx.productDetails}</Text>
              <View style={styles.receiptAttachedBadge}>
                <Ionicons name="document-text-outline" size={13} color="#5856D6" />
                <Text style={styles.receiptBadgeLabel} numberOfLines={1}>{tx.receiptName}</Text>
              </View>
            </View>
          ))
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fallbackLoaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 20
  },
  fallbackLoaderText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#636366'
  },
  container: { 
    flex: 1, 
    backgroundColor: '#F2F2F7' 
  },
  brandingHeader: { 
    paddingHorizontal: 16, 
    paddingTop: Platform.OS === 'ios' ? 54 : 16, 
    paddingBottom: 14, 
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C6C6C8'
  },
  logoLayout: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  logoTitleText: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#1C1C1E', 
    marginLeft: 6,
    letterSpacing: -0.3
  },
  profileHeroSection: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#FFFFFF', 
    borderBottomWidth: 0.5,
    borderColor: '#C6C6C8'
  },
  avatarImage: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    backgroundColor: '#E5E5EA' 
  },
  identityTextPanel: { 
    marginLeft: 14, 
    flex: 1 
  },
  welcomeLabel: { 
    fontSize: 11, 
    color: '#8E8E93', 
    fontWeight: '600', 
    textTransform: 'uppercase' 
  },
  customerNameText: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1C1C1E', 
    marginTop: 2 
  },
  badgeRow: { 
    flexDirection: 'row', 
    marginTop: 4 
  },
  statusBadgeText: { 
    fontSize: 11, 
    fontWeight: '600', 
    color: '#34C759', 
    backgroundColor: '#E8F9EE', 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 4, 
    overflow: 'hidden' 
  },
  interactiveActionContainer: { 
    paddingHorizontal: 16, 
    marginTop: 14 
  },
  cartIconButton: { 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: '#007AFF', 
    borderRadius: 8, 
    height: 48,
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  cartActiveButton: { 
    backgroundColor: '#007AFF', 
    borderColor: '#007AFF' 
  },
  cartIconWrapper: { 
    position: 'relative', 
    marginRight: 10 
  },
  badgeIndicator: { 
    position: 'absolute', 
    top: -6, 
    right: -10, 
    backgroundColor: '#FF3B30', 
    minWidth: 16, 
    height: 16, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 3 
  },
  badgeCounterText: { 
    color: '#FFFFFF', 
    fontSize: 9, 
    fontWeight: '700' 
  },
  cartButtonLabelText: { 
    color: '#007AFF', 
    fontWeight: '700', 
    fontSize: 14 
  },
  cartButtonLabelDisabled: {
    color: '#AEAEB2'
  },
  cartActiveText: { 
    color: '#FFFFFF' 
  },
  cartDropdownOverlay: { 
    backgroundColor: '#FFFFFF', 
    marginTop: 8, 
    borderRadius: 8, 
    padding: 16, 
    borderWidth: 0.5, 
    borderColor: '#C6C6C8',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 3 }
    })
  },
  dropdownHeading: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#1C1C1E', 
    marginBottom: 10, 
    borderBottomWidth: 0.5, 
    borderBottomColor: '#E5E5EA', 
    paddingBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.1
  },
  cartItemRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 10, 
    borderBottomWidth: 0.5, 
    borderBottomColor: '#E5E5EA' 
  },
  cartRowThumb: { 
    width: 46, 
    height: 46, 
    borderRadius: 6, 
    backgroundColor: '#E5E5EA' 
  },
  cartItemMeta: { 
    flex: 1, 
    marginLeft: 12, 
    paddingRight: 8 
  },
  cartItemTitle: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#1C1C1E' 
  },
  categoryBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
    alignItems: 'center'
  },
  cartItemCategory: { 
    fontSize: 11, 
    color: '#8E8E93',
    fontWeight: '500'
  },
  cartItemQty: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '600'
  },
  cartItemPrice: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#34C759', 
    marginTop: 2 
  },
  removeCartItemBtn: { 
    padding: 6 
  },
  formCardContainer: { 
    backgroundColor: '#FFFFFF', 
    padding: 16, 
    borderTopWidth: 0.5, 
    borderBottomWidth: 0.5, 
    borderColor: '#C6C6C8', 
    marginTop: 18 
  },
  sectionHeadingText: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#1C1C1E', 
    marginBottom: 4 
  },
  sectionSubtitleText: { 
    fontSize: 12, 
    color: '#636366', 
    lineHeight: 16, 
    marginBottom: 16 
  },
  inputOverrideSpacing: {
    marginBottom: 14,
  },
  fieldLabel: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#3A3A3C', 
    marginBottom: 6,
    letterSpacing: -0.1
  },
  uploadBoxFrame: { 
    borderStyle: 'dashed', 
    borderWidth: 1.5, 
    borderColor: '#007AFF', 
    borderRadius: 8, 
    paddingVertical: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#F4F9FF', 
    marginBottom: 18 
  },
  uploadBoxSuccess: { 
    borderColor: '#34C759', 
    backgroundColor: '#F2FBF4' 
  },
  uploadBoxMainText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#007AFF', 
    marginTop: 8 
  },
  uploadBoxSuccessText: { 
    color: '#34C759' 
  },
  uploadBoxSubtext: { 
    fontSize: 11, 
    color: '#8E8E93', 
    marginTop: 2 
  },
  formButtonActionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  clearFormBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    paddingVertical: 8 
  },
  clearFormBtnText: { 
    color: '#636366', 
    fontSize: 13, 
    fontWeight: '600' 
  },
  submitBtnWidthCorrection: {
    width: 140,
    height: 40,
  },
  historyLogContainer: { 
    backgroundColor: '#FFFFFF', 
    padding: 16, 
    borderTopWidth: 0.5, 
    borderBottomWidth: 0.5, 
    borderColor: '#C6C6C8', 
    marginTop: 18,
    paddingBottom: 40 
  },
  emptyLogsText: { 
    fontSize: 13, 
    color: '#8E8E93', 
    textAlign: 'center', 
    marginVertical: 16 
  },
  logCardItem: { 
    backgroundColor: '#F8F9FA', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 10, 
    borderWidth: 0.5, 
    borderColor: '#C6C6C8' 
  },
  logCardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 8, 
    borderBottomWidth: 0.5, 
    borderBottomColor: '#E5E5EA', 
    paddingBottom: 6 
  },
  statusGroup: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  statusDotIndicator: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: '#FF9500', 
    marginRight: 6 
  },
  logIdString: { 
    fontSize: 11, 
    fontWeight: '600', 
    color: '#636366' 
  },
  logDateStamp: { 
    fontSize: 11, 
    color: '#8E8E93' 
  },
  logDetailBody: { 
    fontSize: 13, 
    color: '#1C1C1E', 
    lineHeight: 18 
  },
  receiptAttachedBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#E5E5EA', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4, 
    marginTop: 10, 
    alignSelf: 'flex-start', 
    maxWidth: '90%', 
    gap: 4 
  },
  receiptBadgeLabel: { 
    fontSize: 11, 
    color: '#5856D6', 
    fontWeight: '600' 
  }
});