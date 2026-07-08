import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define the structure for our accessible venue items
interface Venue {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  features: string[];
}

// Mock Data optimized for an accessibility mapping platform
const RECOMMENDED_VENUES: Venue[] = [
  {
    id: '1',
    name: 'Central Plaza Market',
    category: 'Shopping & Retail',
    location: 'Downtown Core',
    rating: 4.9,
    features: ['Ramp Access', 'Braille Signage', 'Wide Aisles'],
  },
  {
    id: '2',
    name: 'Metro Transit Hub',
    category: 'Transport',
    location: 'Civic Center',
    rating: 4.7,
    features: ['Step-free Route', 'Audio Guides', 'Tactile Paving'],
  },
  {
    id: '3',
    name: 'Apex Care Clinic',
    category: 'Medical & Health',
    location: 'North Suburbs',
    rating: 4.8,
    features: ['Automated Doors', 'Accessible Restrooms'],
  },
];

export default function TabsIndex() {
  
  // Clean card component for rendering each venue item entry
  const renderVenueCard = ({ item }: { item: Venue }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>{item.category} • {item.location}</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={14} color="#FFB300" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>

      <View style={styles.tagContainer}>
        {item.features.map((feature, index) => (
          <View key={index} style={styles.tag}>
            <Ionicons name="checkmark-circle-outline" size={12} color="#007AFF" style={styles.tagIcon} />
            <Text style={styles.tagText}>{feature}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        
        {/* Main Dashboard Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Welcome Back,</Text>
            <Text style={styles.titleText}>Explore Accessible Places</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={36} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Quick Summary Grid */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryBox}>
            <Ionicons name="navigate" size={24} color="#007AFF" />
            <Text style={styles.summaryCount}>24</Text>
            <Text style={styles.summaryLabel}>Verified Nearby</Text>
          </View>
          <View style={styles.summaryBox}>
            <Ionicons name="shield-checkmark" size={24} color="#34C759" />
            <Text style={styles.summaryCount}>100%</Text>
            <Text style={styles.summaryLabel}>Accessible</Text>
          </View>
        </View>

        {/* Recommended Locations List Section */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <FlatList
            data={RECOMMENDED_VENUES}
            keyExtractor={(item) => item.id}
            renderItem={renderVenueCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No verified places found nearby.</Text>
            }
          />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 25,
  },
  greetingText: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  titleText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212529',
    marginTop: 2,
  },
  profileButton: {
    padding: 4,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 15,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryCount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
    textAlign: 'center',
  },
  listSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6C757D',
    marginTop: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFB300',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F0FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagIcon: {
    marginRight: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6C757D',
    marginTop: 30,
    fontSize: 14,
  },
});