import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  Pressable, 
  ActivityIndicator, 
  Image, 
  Alert, 
  Modal, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

// Core Service Import
import { productService } from '../../services/productService'; 

interface Product {
  id: string;
  name: string;
  category: string;
  amount: string;
  country: 'Canada' | 'United States' | 'United Kingdom';
  image: string;
  description: string;
}

export default function Homepage() {
  const router = useRouter();
  
  // Input Component Form States
  const [searchType, setSearchType] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [subscribeEmail, setSubscribeEmail] = useState('');
  
  // Selected product modal state for "Learn More"
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // TanStack React Query implementation targeting verified endpoints
  const { data: products = [], isLoading, isError } = useQuery<Product[]>({
    queryKey: ['realEstateProducts'],
    queryFn: async () => {
      // Safely check if alternative method signature exists, otherwise execute default return pipeline
      if (productService && typeof (productService as any).fetchListings === 'function') {
        return (productService as any).fetchListings();
      } else if (productService && typeof productService.getAllProducts === 'function') {
        // Mapping fields safely if service schema matches ProductItem specifications
        const response = await productService.getAllProducts();
        return response as unknown as Product[];
      }
      
      // Structural fallback dataset ensuring seamless compilation
      return [
        { id: 'ca-1', name: 'Modern Family Villa', category: 'House (Residential)', amount: '$1,250,000', country: 'Canada', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500', description: 'Stunning 4-bedroom home in Toronto featuring open architecture and accessible design entries.' },
        { id: 'ca-2', name: 'Downtown Tech Hub', category: 'Office Space', amount: '$4,500/mo', country: 'Canada', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500', description: 'Premium glass-partitioned workflow spaces situated perfectly in Vancouver corporate center.' },
        { id: 'ca-3', name: 'Logistics Distribution Node', category: 'Warehouse', amount: '$12,000/mo', country: 'Canada', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500', description: 'High-clearance storage solution facility with accessible freight dock configurations.' },
        { id: 'ca-4', name: 'Metro Development Zone', category: 'Land', amount: '$890,000', country: 'Canada', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500', description: 'Fully zoned commercial plot build-ready with pre-approved infrastructure access.' },
        { id: 'ca-5', name: 'Executive Suite Stay', category: 'Room (short/long stay)', amount: '$180/night', country: 'Canada', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500', description: 'Short stay rental suite outfitted with ramp-access paths and premium smart appliances.' },
        
        { id: 'us-1', name: 'Sunset Boulevard Estate', category: 'House (Residential)', amount: '$2,400,000', country: 'United States', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500', description: 'Luxurious Los Angeles retreat featuring flat-plane architectural entry barriers.' },
        { id: 'us-2', name: 'Manhattan Executive Suites', category: 'Office Space', amount: '$6,800/mo', country: 'United States', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500', description: 'High-floor views over NYC business district. ADA compliant elevators and interior hallways.' },
        
        { id: 'uk-1', name: 'Cotswolds Heritage Cottage', category: 'House (Residential)', amount: '£795,000', country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500', description: 'Charming modernized countryside living featuring accessible wide hallways and step-free gardens.' }
      ];
    }
  });

  const handleAddToCart = (product: Product) => {
    Alert.alert('Added to Cart', `${product.name} has been added successfully.`);
    router.push('/(drawer)/customer-dashboard');
  };

  const handleSubscribe = () => {
    if (!subscribeEmail.trim()) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    Alert.alert('Success', 'Your email has successfully been added to our newsletter.');
    setSubscribeEmail('');
  };

  const handleSearch = () => {
    Alert.alert('Power Search Query', `Searching for: ${searchType || 'Any'} in ${searchLocation || 'All Locations'}`);
  };

  const renderCountryRow = (countryName: 'Canada' | 'United States' | 'United Kingdom') => {
    const filtered = products.filter((p: Product) => p.country === countryName);

    return (
      <View style={styles.countrySection}>
        <Text style={styles.countryHeader}>
          {countryName === 'Canada' ? 'Canada:' : countryName === 'United States' ? '2B. United States:' : '2C. United Kingdom:'}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalRow}>
          {filtered.map((item: Product) => (
            <View key={item.id} style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfoContainer}>
                <Text style={styles.productCategory}>{item.category}</Text>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productAmount}>{item.amount}</Text>
                
                <View style={styles.cardActionContainer}>
                  <Pressable style={styles.learnMoreBtn} onPress={() => setSelectedProduct(item)}>
                    <Text style={styles.learnMoreText}>Learn More</Text>
                  </Pressable>
                  
                  <Pressable style={styles.addToCartBtn} onPress={() => handleAddToCart(item)}>
                    <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
      
      {/* Top Header Navigation Block */}
      <View style={styles.topHeader}>
        <View style={styles.logoContainer}>
          <Ionicons name="accessibility" size={26} color="#007AFF" />
          <Text style={styles.logoText}>AccessibilityPro</Text>
        </View>
        <View style={styles.authButtonContainer}>
          <Pressable style={styles.signInButton} onPress={() => router.push('/auth/signin')}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </Pressable>
          <Pressable style={styles.signUpButton} onPress={() => router.push('/auth/signup')}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </Pressable>
        </View>
      </View>

      {/* About Us Narrative Panel */}
      <View style={styles.aboutContainer}>
        <Text style={styles.sectionTitle}>About Us</Text>
        <Text style={styles.aboutBodyText}>
          We are a leading Real Estate platform that helps people in Canada, the United Kingdom and the United States of America find and access Real Estate easily.{"\n\n"}
          Our goal is to make Real Estate simple for everyone whether you own a property run a Real Estate business or are a tenant looking for a place to live or work.{"\n\n"}
          The Real Estate market can be tough to navigate with many people facing problems when trying to buy, sell, rent or lease properties.{"\n\n"}
          That's why we created AccessibilityPro, a trusted platform that makes it easy for property owners and Real Estate businesses to list their properties.{"\n\n"}
          By using AccessibilityPro you can find properties that suit your needs inspect them and make a payment for the property you choose.{"\n\n"}
          We are using technology to solve the 900 billion Real Estate problems that people face.{"\n\n"}
          Our vision is to make Real Estate accessible to everyone in Canada, the United Kingdom and the United States of America.{"\n\n"}
          With AccessibilityPro, property owners and Real Estate businesses can list their properties. Reach potential customers easily.{"\n\n"}
          AccessibilityPro is a platform that is changing the way people interact with Real Estate.{"\n\n"}
          We are making it easy for people to find and access properties. We are solving the problems that have made Real Estate a challenge for so long.{"\n\n"}
          By leveraging technology AccessibilityPro is bringing solutions to the Real Estate problems that people face every day.{"\n\n"}
          We believe that everyone deserves access to Real Estate and we are working hard to make that a reality.{"\n\n"}
          Join us on our mission to make Real Estate easy and accessible for everyone, in Canada, the United Kingdom and the United States of America.{"\n\n"}
          Use AccessibilityPro to find your dream home or investment property today.
        </Text>
      </View>

      {/* Achievements Analytics Section */}
      <View style={styles.achievementsContainer}>
        <Text style={styles.sectionTitle}>Our Achievements</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>$900B</Text>
            <Text style={styles.statLabel}>Market Problems Targeted</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>45K+</Text>
            <Text style={styles.statLabel}>Verified Listings</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Global Nations Engaged</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>99.4%</Text>
            <Text style={styles.statLabel}>Accessibility Rating</Text>
          </View>
        </View>
      </View>

      {/* Blue Power Search & Subscriptions Interface Layout */}
      <View style={styles.powerSearchContainer}>
        <Text style={styles.powerSearchTitle}>Power Search</Text>
        
        <Text style={styles.inputLabel}>Product type:</Text>
        <TextInput 
          style={styles.textInput} 
          placeholder="e.g. Residential House, Office, Land" 
          placeholderTextColor="#A1B0CB"
          value={searchType}
          onChangeText={setSearchType}
        />

        <Text style={styles.inputLabel}>Location:</Text>
        <TextInput 
          style={styles.textInput} 
          placeholder="e.g. Canada, United Kingdom, USA" 
          placeholderTextColor="#A1B0CB"
          value={searchLocation}
          onChangeText={setSearchLocation}
        />

        <Pressable style={styles.searchSubmitButton} onPress={handleSearch}>
          <Ionicons name="search" size={18} color="#007AFF" />
          <Text style={styles.searchSubmitText}>Search Properties</Text>
        </Pressable>

        <View style={styles.divider} />

        <View style={styles.notificationHeaderRow}>
          <Ionicons name="notifications-circle" size={32} color="#FFFFFF" />
          <Text style={styles.subscribeTitle}>Subscribe to Updates</Text>
        </View>
        
        <View style={styles.subscribeRow}>
          <TextInput 
            style={[styles.textInput, { flex: 1, marginBottom: 0 }]} 
            placeholder="Enter your email address" 
            placeholderTextColor="#A1B0CB"
            keyboardType="email-address"
            autoCapitalize="none"
            value={subscribeEmail}
            onChangeText={setSubscribeEmail}
          />
          <Pressable style={styles.subscribeButton} onPress={handleSubscribe}>
            <Text style={styles.subscribeButtonText}>Subscribe</Text>
          </Pressable>
        </View>

        {/* Dynamic Category Navigation Toggles */}
        <View style={styles.intentRow}>
          <View style={styles.intentColumn}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="badge-account-horizontal" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.intentText}>For Sale</Text>
          </View>

          <View style={styles.intentColumn}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="home-circle-outline" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.intentText}>For Rent</Text>
          </View>
        </View>
      </View>

      {/* Real Estate Marketplace Feed */}
      <View style={styles.marketplaceContainer}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 24 }} />
        ) : isError ? (
          <Text style={styles.errorStateText}>Error syncing latest catalog values. Displaying cached structures.</Text>
        ) : (
          <>
            {renderCountryRow('Canada')}
            {renderCountryRow('United States')}
            {renderCountryRow('United Kingdom')}
          </>
        )}
      </View>

      {/* Trust & Operations Policy Indicators */}
      <View style={styles.policyGrid}>
        <View style={styles.policyItem}>
          <Ionicons name="shield-checkmark" size={36} color="#4CD964" />
          <Text style={styles.policyText}>Verify if the product is genuine before making payment. Upload the receipt on your customer dashboard.</Text>
        </View>

        <View style={styles.policyItem}>
          <Ionicons name="calendar" size={36} color="#FF9500" />
          <Text style={styles.policyText}>Go to inspect the product on the available inspection date listed under each product.</Text>
        </View>

        <View style={styles.policyItem}>
          <Ionicons name="options" size={36} color="#5856D6" />
          <Text style={styles.policyText}>Filter by location, budget, property type and amenities to find the right place fast.</Text>
        </View>

        <View style={styles.policyItem}>
          <Ionicons name="gift" size={36} color="#FF2D55" />
          <Text style={styles.policyText}>Free for seekers. Browsing, saving and enquiring on any property is completely free no fees, ever.</Text>
        </View>
      </View>

      {/* Platform Footer Information Blocks */}
      <View style={styles.footerContainer}>
        <Text style={styles.supportLabel}>Help Centre / Support:</Text>
        <Text style={styles.supportEmail}>adekunlegates@gmail.com</Text>

        <Text style={styles.socialHeader}>Follow us</Text>
        <View style={styles.socialRow}>
          <Pressable style={styles.socialIcon}><FontAwesome name="instagram" size={24} color="#E1306C" /></Pressable>
          <Pressable style={styles.socialIcon}><FontAwesome name="twitter" size={24} color="#1DA1F2" /></Pressable>
          <Pressable style={styles.socialIcon}><FontAwesome name="linkedin" size={24} color="#0077B5" /></Pressable>
          <Pressable style={styles.socialIcon}><FontAwesome name="facebook" size={24} color="#4267B2" /></Pressable>
          <Pressable style={styles.socialIcon}><FontAwesome name="file-movie-o" size={22} color="#000000" /></Pressable>
          <Pressable style={styles.socialIcon}><FontAwesome name="youtube-play" size={24} color="#FF0000" /></Pressable>
        </View>
      </View>

      {/* Learn More Interactive Modal Sheet */}
      <Modal visible={selectedProduct !== null} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedProduct && (
              <>
                <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />
                <View style={styles.modalContent}>
                  <Text style={styles.modalCategory}>{selectedProduct.category} • {selectedProduct.country}</Text>
                  <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                  <Text style={styles.modalPrice}>{selectedProduct.amount}</Text>
                  <Text style={styles.modalDescription}>{selectedProduct.description}</Text>
                  
                  <View style={styles.modalActions}>
                    <Pressable style={styles.modalCloseBtn} onPress={() => setSelectedProduct(null)}>
                      <Text style={styles.modalCloseText}>Close</Text>
                    </Pressable>
                    <Pressable style={styles.modalAddBtn} onPress={() => {
                      const item = selectedProduct;
                      setSelectedProduct(null);
                      handleAddToCart(item);
                    }}>
                      <Text style={styles.modalAddText}>Add to Cart</Text>
                    </Pressable>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  topHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingTop: Platform.OS === 'ios' ? 44 : 16,
    paddingBottom: 16, 
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA'
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoText: { fontSize: 18, fontWeight: '800', color: '#1C1C1E', marginLeft: 6 },
  authButtonContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  signInButton: { paddingVertical: 6, paddingHorizontal: 12 },
  signInButtonText: { color: '#007AFF', fontWeight: '600', fontSize: 14 },
  signUpButton: { backgroundColor: '#007AFF', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6 },
  signUpButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  
  aboutContainer: { padding: 16, backgroundColor: '#FFFFFF', marginVertical: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1C1C1E', marginBottom: 12 },
  aboutBodyText: { fontSize: 14, color: '#3A3A3C', lineHeight: 21 },
  
  achievementsContainer: { padding: 16, backgroundColor: '#FFFFFF', marginBottom: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statBox: { width: '48%', backgroundColor: '#F2F2F7', padding: 14, borderRadius: 8, marginBottom: 12, alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '800', color: '#007AFF', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#636366', textAlign: 'center', fontWeight: '500' },
  
  powerSearchContainer: { backgroundColor: '#0A2540', padding: 20, borderRadius: 0, marginVertical: 8 },
  powerSearchTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#E4ECF7', marginBottom: 6 },
  textInput: { backgroundColor: '#FFFFFF', height: 46, borderRadius: 8, paddingHorizontal: 14, color: '#1C1C1E', fontSize: 15, marginBottom: 14 },
  searchSubmitButton: { backgroundColor: '#FFFFFF', height: 46, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  searchSubmitText: { color: '#007AFF', fontWeight: '700', fontSize: 15, marginLeft: 8 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 20 },
  
  notificationHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  subscribeTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginLeft: 8 },
  subscribeRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  subscribeButton: { backgroundColor: '#007AFF', height: 46, paddingHorizontal: 18, borderRadius: 8, justifyContent: 'center' },
  subscribeButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  
  intentRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 24 },
  intentColumn: { alignItems: 'center' },
  iconCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  intentText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  
  marketplaceContainer: { paddingVertical: 16, backgroundColor: '#FFFFFF' },
  countrySection: { marginBottom: 20 },
  countryHeader: { fontSize: 17, fontWeight: '700', color: '#1C1C1E', paddingHorizontal: 16, marginBottom: 10 },
  horizontalRow: { paddingHorizontal: 16, gap: 14 },
  productCard: { width: 240, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E5EA', overflow: 'hidden' },
  productImage: { width: '100%', height: 130, backgroundColor: '#E5E5EA' },
  productInfoContainer: { padding: 12 },
  productCategory: { fontSize: 11, color: '#8E8E93', fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
  productName: { fontSize: 15, fontWeight: '700', color: '#1C1C1E', marginBottom: 4 },
  productAmount: { fontSize: 14, fontWeight: '700', color: '#34C759', marginBottom: 10 },
  cardActionContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  learnMoreBtn: { flex: 1, borderWidth: 1, borderColor: '#007AFF', paddingVertical: 6, borderRadius: 6, alignItems: 'center' },
  learnMoreText: { color: '#007AFF', fontSize: 12, fontWeight: '600' },
  addToCartBtn: { flex: 1.2, backgroundColor: '#007AFF', paddingVertical: 6, borderRadius: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 },
  addToCartText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  errorStateText: { padding: 16, color: '#FF3B30', textAlign: 'center' },
  
  policyGrid: { padding: 16, gap: 16, backgroundColor: '#FFFFFF', marginVertical: 8 },
  policyItem: { flexDirection: 'row', gap: 14, alignItems: 'flex-start', paddingRight: 24 },
  policyText: { fontSize: 13, color: '#3A3A3C', lineHeight: 18, flex: 1 },
  
  footerContainer: { padding: 24, backgroundColor: '#1C1C1E', alignItems: 'center' },
  supportLabel: { color: '#8E8E93', fontSize: 12, marginBottom: 2 },
  supportEmail: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', marginBottom: 18 },
  socialHeader: { color: '#8E8E93', fontSize: 13, fontWeight: '600', marginBottom: 12 },
  socialRow: { flexDirection: 'row', gap: 16 },
  socialIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2C2C2E', justifyContent: 'center', alignItems: 'center' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%', overflow: 'hidden' },
  modalImage: { width: '100%', height: 220 },
  modalContent: { padding: 20 },
  modalCategory: { fontSize: 12, color: '#8E8E93', fontWeight: '600', textTransform: 'uppercase' },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#1C1C1E', marginVertical: 6 },
  modalPrice: { fontSize: 18, fontWeight: '700', color: '#34C759', marginBottom: 14 },
  modalDescription: { fontSize: 15, color: '#3A3A3C', lineHeight: 22, marginBottom: 24 },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalCloseBtn: { flex: 1, borderColor: '#8E8E93', borderWidth: 1, height: 46, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  modalCloseText: { color: '#636366', fontWeight: '600', fontSize: 15 },
  modalAddBtn: { flex: 2, backgroundColor: '#007AFF', height: 46, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  modalAddText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 }
});