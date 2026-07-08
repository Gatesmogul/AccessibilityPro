import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  Pressable, 
  Image, 
  Alert, 
  Platform 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface UploadedProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  status: string;
}

interface CommissionRecord {
  id: string;
  productName: string;
  receiptName: string;
}

export default function OwnerDashboard() {
  // Panel view toggle states
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);

  // Commission Confirmation Form States
  const [commissionProductName, setCommissionProductName] = useState('');
  const [commissionReceipt, setCommissionReceipt] = useState<string | null>(null);
  const [commissionHistory, setCommissionHistory] = useState<CommissionRecord[]>([
    { id: 'com-1', productName: 'Sunset Boulevard Estate', receiptName: 'rec_com_042.pdf' }
  ]);

  // Add Product Form States
  const [prodName, setProdName] = useState('');
  const [prodAbout, setProdAbout] = useState('');
  const [prodCategory, setProdCategory] = useState('House');
  const [prodSubCategory, setProdSubCategory] = useState('Villa');
  const [prodGps, setProdGps] = useState('');
  const [prodLocation, setProdLocation] = useState('');
  const [prodQuantity, setProdQuantity] = useState('');
  const [prodStatus, setProdStatus] = useState('Sell'); // Sell, Lease, Rent
  const [prodPrice, setProdPrice] = useState('');
  const [prodPlan, setProdPlan] = useState('');
  const [prodVat, setProdVat] = useState('');
  const [prodOwnerInfo, setProdOwnerInfo] = useState('');
  const [prodInspection, setProdInspection] = useState('');
  const [prodAvailability, setProdAvailability] = useState('Available'); // Available, Sold Out

  // Live Published Owner Store State
  const [myProducts, setMyProducts] = useState<UploadedProduct[]>([
    { id: 'p-1', name: 'Sunset Boulevard Estate', category: 'House', price: '$2,400,000', status: 'Sell' }
  ]);

  // Dropdown options arrays
  const categories = ['Warehouse', 'House', 'Office', 'Land', 'Room'];
  const subCategories = [
    'Agricultural', 'Residential', 'Recreational', 'Commercial', 'Industrial', 
    'Detached House', 'Semi-detached House', 'Chalet', 'Cottage', 'Villa', 
    'Terraced House', 'Bungalow', 'Flat', 'Maisonette', 'Townhouse', 'Mansion', 'Condominium'
  ];

  // Dummy action hooks
  const handleUploadReceipt = () => {
    Alert.alert('Upload Engine', 'Selecting remittance file signature from storage...', [
      { text: 'Attach receipt.pdf', onPress: () => setCommissionReceipt('uploaded_commission_receipt.pdf') },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const handleSubmitCommission = () => {
    if (!commissionProductName.trim() || !commissionReceipt) {
      Alert.alert('Validation Error', 'Provide the associated product name and verify your payment receipt upload.');
      return;
    }
    const newRecord: CommissionRecord = {
      id: `com-${Date.now()}`,
      productName: commissionProductName,
      receiptName: commissionReceipt
    };
    setCommissionHistory([newRecord, ...commissionHistory]);
    Alert.alert('Success', 'Commission verification submitted for approval audit.');
  };

  const handleClearCommissionForm = () => {
    setCommissionProductName('');
    setCommissionReceipt(null);
  };

  const handlePublishProduct = () => {
    if (!prodName.trim() || !prodPrice.trim() || !prodLocation.trim()) {
      Alert.alert('Validation Error', 'Product Name, Price, and Location are required baseline inputs.');
      return;
    }
    const newProduct: UploadedProduct = {
      id: `p-${Date.now()}`,
      name: prodName,
      category: prodCategory,
      price: prodPrice,
      status: prodStatus
    };
    setMyProducts([newProduct, ...myProducts]);
    Alert.alert('Success', `${prodName} is now live across standard user marketplace exploration indices.`);
  };

  const handleClearProductForm = () => {
    setProdName('');
    setProdAbout('');
    setProdGps('');
    setProdLocation('');
    setProdQuantity('');
    setProdPrice('');
    setProdPlan('');
    setProdVat('');
    setProdOwnerInfo('');
    setProdInspection('');
  };

  return (
    <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
      
      {/* Branding Navigation Layer */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Ionicons name="accessibility" size={26} color="#007AFF" />
          <Text style={styles.logoText}>AccessibilityPro</Text>
        </View>
        
        {/* Core Metrics Notifications Action Button */}
        <Pressable style={styles.notificationBtn} onPress={() => setShowNotificationCenter(!showNotificationCenter)}>
          <View style={styles.iconBadgeWrapper}>
            <Ionicons name="notifications" size={24} color="#1C1C1E" />
            <View style={styles.badgeDot} />
          </View>
        </Pressable>
      </View>

      {/* Corporate Owner Identity Context */}
      <View style={styles.profileSection}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400' }} 
          style={styles.profileImage} 
        />
        <View style={styles.profileMeta}>
          <Text style={styles.profileName}>Apex Global Holdings Ltd.</Text>
          <Text style={styles.profileRoleLabel}>Verified Merchant Console</Text>
        </View>
      </View>

      {/* Dynamic Activity Dropdown Panel */}
      {showNotificationCenter && (
        <View style={styles.notificationPanel}>
          <Text style={styles.panelTitle}>Performance & Activity Feed</Text>
          <View style={styles.notifyItem}>
            <Ionicons name="eye-outline" size={16} color="#007AFF" />
            <Text style={styles.notifyText}>Your listings received <Text style={styles.bold}>1,420 unique hits</Text> this week.</Text>
          </View>
          <View style={styles.notifyItem}>
            <Ionicons name="cart-outline" size={16} color="#34C759" />
            <Text style={styles.notifyText}>New Order Notification: Customer added <Text style={styles.bold}>Sunset Boulevard Estate</Text> to cart.</Text>
          </View>
        </View>
      )}

      {/* Store Listing Ledger Output Grid */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Store Inventory</Text>
        {myProducts.length === 0 ? (
          <Text style={styles.emptyText}>No live records linked to your corporate ID profile index.</Text>
        ) : (
          myProducts.map((item) => (
            <View key={item.id} style={styles.productRowItem}>
              <View style={styles.productMainMeta}>
                <Text style={styles.productRowTitle}>{item.name}</Text>
                <Text style={styles.productRowSub}>{item.category} • <Text style={styles.statusHighlight}>{item.status}</Text></Text>
                <Text style={styles.productRowPrice}>{item.price}</Text>
              </View>
              <Pressable style={styles.editBtn} onPress={() => Alert.alert('Edit', `Modifying data properties for listing entry ${item.id}`)}>
                <Text style={styles.editBtnText}>Edit</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>

      {/* Commission Processing & Clearing Center Section */}
      <View style={styles.sectionCard}>
        <Pressable style={styles.accordionHeader} onPress={() => setShowBankDetails(!showBankDetails)}>
          <View style={styles.rowCentered}>
            <MaterialCommunityIcons name="bank-transfer" size={24} color="#007AFF" />
            <Text style={styles.sectionTitleLink}>Commission Processing Center</Text>
          </View>
          <Ionicons name={showBankDetails ? "chevron-up" : "chevron-down"} size={20} color="#8E8E93" />
        </Pressable>

        {showBankDetails && (
          <View style={styles.bankDetailBox}>
            <Text style={styles.bankLabel}>ACCOUNT NUMBER:</Text><Text style={styles.bankValue}>8398055962</Text>
            <Text style={styles.bankLabel}>BANK NAME:</Text><Text style={styles.bankValue}>Community Federal Savings Bank</Text>
            <Text style={styles.bankLabel}>SWIFT CODE:</Text><Text style={styles.bankValue}>CMFGUS33XXX</Text>
            <Text style={styles.bankLabel}>ACH ROUTING:</Text><Text style={styles.bankValue}>026073150</Text>
            <Text style={styles.bankLabel}>BANK ADDRESS:</Text><Text style={styles.bankValue}>89-16 Jamaica Ave, Woodhaven, NY 11421, USA</Text>
            <Text style={styles.bankLabel}>ACCOUNT TYPE:</Text><Text style={styles.bankValue}>checking</Text>
            <Text style={styles.bankLabel}>ACCOUNT NAME:</Text><Text style={styles.bankValue}>Adekunle Ogunmola</Text>
            
            <View style={styles.feeScheduleBox}>
              <Text style={styles.feeScheduleTitle}>AccessibilityPro Commission Tiers:</Text>
              <Text style={styles.feeText}>• USA: 3%   • Canada: 3%   • UK: 2%</Text>
            </View>
          </View>
        )}

        <View style={styles.dividerLine} />

        {/* Payment Confirmation Submission Form Block */}
        <Text style={styles.formSectionHeading}>Payment Confirmation</Text>
        <Text style={styles.policyCallout}>Commission payment should be made within 24-48 hours after the client or customer has made payment for the product.</Text>
        
        <Text style={styles.fieldLabel}>Product Name:</Text>
        <TextInput 
          style={styles.textInput} 
          placeholder="Input corresponding listing asset label" 
          placeholderTextColor="#8E8E93"
          value={commissionProductName}
          onChangeText={setCommissionProductName}
        />

        <Pressable style={[styles.fileUploadBox, commissionReceipt && styles.fileUploadSuccess]} onPress={handleUploadReceipt}>
          <Ionicons name={commissionReceipt ? "checkmark-circle" : "document-attach-outline"} size={20} color={commissionReceipt ? "#34C759" : "#007AFF"} />
          <Text style={[styles.fileUploadText, commissionReceipt && styles.fileUploadTextSuccess]}>
            {commissionReceipt ? `${commissionReceipt}` : 'Upload The Receipt'}
          </Text>
        </Pressable>

        <View style={styles.formActionsRow}>
          <Pressable style={styles.addButtonAlt} onPress={handleClearCommissionForm}>
            <Text style={styles.addButtonAltText}>Add Another Commission</Text>
          </Pressable>
          <Pressable style={styles.submitBtn} onPress={handleSubmitCommission}>
            <Text style={styles.submitBtnText}>Submit</Text>
          </Pressable>
        </View>

        {/* Render History of Receipts Processed locally */}
        {commissionHistory.map((rec) => (
          <View key={rec.id} style={styles.receiptLogItem}>
            <Ionicons name="cloud-done-outline" size={16} color="#636366" />
            <Text style={styles.receiptLogText} numberOfLines={1}>{rec.productName} ({rec.receiptName})</Text>
          </View>
        ))}
      </View>

      {/* Main Framework Block: Add Product Details Form Area */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Add Product Details</Text>
        
        <Text style={styles.fieldLabel}>Product Pictures:</Text>
        <Pressable style={styles.imageSelectorPlaceholder} onPress={() => Alert.alert('Media Framework', 'Hooking up device asset cameras.')}>
          <Ionicons name="images-outline" size={24} color="#007AFF" />
          <Text style={styles.imageSelectorText}>Upload Structural Assets / Floor Plans</Text>
        </Pressable>

        <Text style={styles.fieldLabel}>Product Name:</Text>
        <TextInput style={styles.textInput} placeholder="e.g. Luxury Penthouse" placeholderTextColor="#8E8E93" value={prodName} onChangeText={setProdName} />

        <Text style={styles.fieldLabel}>About Product:</Text>
        <TextInput style={[styles.textInput, styles.textArea]} placeholder="Detail functional features, sizing, and room allotments..." placeholderTextColor="#8E8E93" multiline numberOfLines={4} value={prodAbout} onChangeText={setProdAbout} />

        {/* Dropdown Pickers Simulated Elegantly using Horizontal Selectors */}
        <Text style={styles.fieldLabel}>Product Category:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dropdownSimRow}>
          {categories.map((cat) => (
            <Pressable key={cat} style={[styles.dropdownChip, prodCategory === cat && styles.dropdownChipActive]} onPress={() => setProdCategory(cat)}>
              <Text style={[styles.dropdownChipText, prodCategory === cat && styles.dropdownChipTextActive]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.fieldLabel}>Product Sub-category:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dropdownSimRow}>
          {subCategories.map((sub) => (
            <Pressable key={sub} style={[styles.dropdownChip, prodSubCategory === sub && styles.dropdownChipActive]} onPress={() => setProdSubCategory(sub)}>
              <Text style={[styles.dropdownChipText, prodSubCategory === sub && styles.dropdownChipTextActive]}>{sub}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.fieldLabel}>Product GPS Link (Google Map):</Text>
        <TextInput style={styles.textInput} placeholder="https://maps.google.com/?q=..." placeholderTextColor="#8E8E93" value={prodGps} onChangeText={setProdGps} autoCapitalize="none" keyboardType="url" />

        <Text style={styles.fieldLabel}>Product Location:</Text>
        <TextInput style={styles.textInput} placeholder="State, City, Country" placeholderTextColor="#8E8E93" value={prodLocation} onChangeText={setProdLocation} />

        <Text style={styles.fieldLabel}>Product Quantity:</Text>
        <TextInput style={styles.textInput} placeholder="Available units count" placeholderTextColor="#8E8E93" keyboardType="numeric" value={prodQuantity} onChangeText={setProdQuantity} />

        {/* Tick Box Choice Matrices: Operational Intent Strategy */}
        <Text style={styles.fieldLabel}>Product Status:</Text>
        <View style={styles.tickRow}>
          {['Lease', 'Sell', 'Rent'].map((status) => (
            <Pressable key={status} style={styles.tickOption} onPress={() => setProdStatus(status)}>
              <Ionicons name={prodStatus === status ? "checkbox" : "square-outline"} size={22} color="#007AFF" />
              <Text style={styles.tickLabel}>{status}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.formGridSplit}>
          <View style={styles.splitInputBox}>
            <Text style={styles.fieldLabel}>Price & Currency:</Text>
            <TextInput style={styles.textInput} placeholder="e.g. $4,000 / mo" placeholderTextColor="#8E8E93" value={prodPrice} onChangeText={setProdPrice} />
          </View>
          <View style={styles.splitInputBox}>
            <Text style={styles.fieldLabel}>Payment Plan (Frequency):</Text>
            <TextInput style={styles.textInput} placeholder="e.g. Annual, Quarterly" placeholderTextColor="#8E8E93" value={prodPlan} onChangeText={setProdPlan} />
          </View>
        </View>

        <Text style={styles.fieldLabel}>VAT Requirements:</Text>
        <TextInput style={styles.textInput} placeholder="Specify if included or percentage scale" placeholderTextColor="#8E8E93" value={prodVat} onChangeText={setProdVat} />

        <Text style={styles.fieldLabel}>About Owner / Real Estate Business:</Text>
        <TextInput style={[styles.textInput, styles.textArea]} placeholder="Corporate license references, operating models info" placeholderTextColor="#8E8E93" multiline numberOfLines={3} value={prodOwnerInfo} onChangeText={setProdOwnerInfo} />

        <Text style={styles.fieldLabel}>Inspection Scheduling (Days & Times):</Text>
        <TextInput style={styles.textInput} placeholder="e.g. Mon-Wed 10:00 AM - 4:00 PM" placeholderTextColor="#8E8E93" value={prodInspection} onChangeText={setProdInspection} />

        {/* Availability Flag Ticks */}
        <Text style={styles.fieldLabel}>Availability State:</Text>
        <View style={styles.tickRow}>
          {['Available', 'Sold Out'].map((state) => (
            <Pressable key={state} style={styles.tickOption} onPress={() => setProdAvailability(state)}>
              <Ionicons name={prodAvailability === state ? "checkbox" : "square-outline"} size={22} color="#007AFF" />
              <Text style={styles.tickLabel}>{state}</Text>
            </Pressable>
          ))}
        </View>

        {/* Ultimate Publishing Actions Area */}
        <Pressable style={styles.publishBtn} onPress={handlePublishProduct}>
          <Ionicons name="cloud-upload" size={18} color="#FFFFFF" />
          <Text style={styles.publishBtnText}>Publish Product</Text>
        </Pressable>

        <Pressable style={styles.addAnotherProductBtn} onPress={handleClearProductForm}>
          <Text style={styles.addAnotherProductBtnText}>Add Another Product</Text>
        </Pressable>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingTop: Platform.OS === 'ios' ? 16 : 12,
    paddingBottom: 12, 
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA'
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoText: { fontSize: 18, fontWeight: '800', color: '#1C1C1E', marginLeft: 6 },
  notificationBtn: { padding: 6 },
  iconBadgeWrapper: { position: 'relative' },
  badgeDot: { position: 'absolute', top: 1, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF3B30' },
  
  profileSection: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', marginVertical: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E5E5EA' },
  profileImage: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E5E5EA' },
  profileMeta: { marginLeft: 14 },
  profileName: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  profileRoleLabel: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  
  notificationPanel: { backgroundColor: '#FFF9E6', padding: 14, marginHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#FFE0B2', marginBottom: 8 },
  panelTitle: { fontSize: 13, fontWeight: '700', color: '#B78103', marginBottom: 8 },
  notifyItem: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 6 },
  notifyText: { fontSize: 12, color: '#5C4308', flex: 1 },
  bold: { fontWeight: '700' },
  
  sectionCard: { backgroundColor: '#FFFFFF', padding: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E5E5EA', marginBottom: 10 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1C1C1E', marginBottom: 12 },
  emptyText: { fontSize: 13, color: '#8E8E93', textAlign: 'center', marginVertical: 12 },
  productRowItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  productMainMeta: { flex: 1, paddingRight: 12 },
  productRowTitle: { fontSize: 15, fontWeight: '600', color: '#1C1C1E' },
  productRowSub: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  statusHighlight: { color: '#007AFF', fontWeight: '500' },
  productRowPrice: { fontSize: 13, fontWeight: '700', color: '#34C759', marginTop: 2 },
  editBtn: { borderWidth: 1, borderColor: '#007AFF', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 6 },
  editBtnText: { color: '#007AFF', fontSize: 13, fontWeight: '600' },
  
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowCentered: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitleLink: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  bankDetailBox: { backgroundColor: '#F8F9FA', padding: 12, borderRadius: 8, marginTop: 12, borderWidth: 1, borderColor: '#E5E5EA' },
  bankLabel: { fontSize: 11, fontWeight: '700', color: '#8E8E93', marginTop: 6 },
  bankValue: { fontSize: 13, color: '#1C1C1E', fontWeight: '500' },
  feeScheduleBox: { marginTop: 14, borderTopWidth: 1, borderTopColor: '#E5E5EA', paddingTop: 10 },
  feeScheduleTitle: { fontSize: 12, fontWeight: '700', color: '#1C1C1E' },
  feeText: { fontSize: 13, color: '#007AFF', marginTop: 2, fontWeight: '600' },
  dividerLine: { height: 1, backgroundColor: '#E5E5EA', marginVertical: 16 },
  
  formSectionHeading: { fontSize: 15, fontWeight: '700', color: '#1C1C1E', marginBottom: 4 },
  policyCallout: { fontSize: 12, color: '#FF3B30', lineHeight: 16, marginBottom: 12 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#3A3A3C', marginBottom: 6, marginTop: 12 },
  textInput: { backgroundColor: '#F2F2F7', height: 44, borderRadius: 8, paddingHorizontal: 12, color: '#1C1C1E', fontSize: 14 },
  textArea: { height: 80, paddingTop: 10, textAlignVertical: 'top' },
  fileUploadBox: { borderStyle: 'dashed', borderWidth: 1, borderColor: '#007AFF', backgroundColor: '#F4F9FF', height: 44, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 12 },
  fileUploadSuccess: { borderColor: '#34C759', backgroundColor: '#F2FBF4' },
  fileUploadText: { color: '#007AFF', fontWeight: '600', fontSize: 13 },
  fileUploadTextSuccess: { color: '#34C759' },
  formActionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, marginBottom: 10 },
  addButtonAlt: { paddingVertical: 6 },
  addButtonAltText: { color: '#636366', fontSize: 13, fontWeight: '600' },
  submitBtn: { backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 22, borderRadius: 6 },
  submitBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  
  // FIXED: Changed 'items' to 'alignItems'
  receiptLogItem: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, opacity: 0.8 },
  receiptLogText: { fontSize: 12, color: '#636366' },
  
  imageSelectorPlaceholder: { height: 100, borderStyle: 'dashed', borderWidth: 1, borderColor: '#8E8E93', borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA', gap: 6 },
  imageSelectorText: { fontSize: 12, color: '#636366', fontWeight: '500' },
  dropdownSimRow: { gap: 8, paddingVertical: 4 },
  dropdownChip: { backgroundColor: '#F2F2F7', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: '#E5E5EA' },
  dropdownChipActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  dropdownChipText: { fontSize: 13, color: '#1C1C1E', fontWeight: '500' },
  dropdownChipTextActive: { color: '#FFFFFF', fontWeight: '600' },
  tickRow: { flexDirection: 'row', gap: 20, marginVertical: 4 },
  tickOption: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tickLabel: { fontSize: 14, color: '#1C1C1E', fontWeight: '500' },
  formGridSplit: { flexDirection: 'row', gap: 12, marginTop: 4 },
  splitInputBox: { flex: 1 },
  publishBtn: { backgroundColor: '#34C759', height: 46, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 },
  publishBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  
  // FIXED: Changed 'borderHeight' to 'borderWidth'
  addAnotherProductBtn: { borderWidth: 1, borderColor: '#E5E5EA', height: 44, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  addAnotherProductBtnText: { color: '#007AFF', fontSize: 14, fontWeight: '600' }
});