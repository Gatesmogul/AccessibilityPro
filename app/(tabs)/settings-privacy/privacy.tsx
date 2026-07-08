import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  Pressable,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PolicySection {
  id: string;
  title: string;
  body: string;
}

export default function Privacy() {
  // Privacy & Permission toggle configurations
  const [shareMetrics, setShareMetrics] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(false);
  const [locationTracking, setLocationTracking] = useState(true);

  // Dynamic policy accordion active tracker
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const policyData: PolicySection[] = [
    {
      id: 'p1',
      title: 'Data Collection & Acquisition Scope',
      body: 'AccessibilityPro securely processes structural asset geometries, identity attributes verified by merchant dashboards, and spatial metadata (GPS links) to establish a baseline for browse feed queries. Financial credentials uploaded during commission receipts are handled using hardware isolation protocols.'
    },
    {
      id: 'p2',
      title: 'Third-Party Metric Distribution',
      body: 'We do not sell personal identification records or spatial profile indices to corporate brokers. Technical data related to performance crashes and viewport latency metrics are anonymously bundled to optimize layout performance on iOS and Android platforms.'
    },
    {
      id: 'p3',
      title: 'Your Consumer Rights Under GDPR & CCPA',
      body: 'Registered real estate businesses and users retain complete sovereignty over their data. You can inspect your digital profile files, limit analytics tracing, or trigger permanent deletion protocols at any time through the primary account panel.'
    }
  ];

  const toggleAccordion = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const handleExportDataDataRequest = () => {
    Alert.alert(
      'Export Profile Dossier',
      'AccessibilityPro will compile a secure JSON ledger containing your full listing inventory, commission receipts, and settings preferences.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Compile & Export', 
          onPress: () => Alert.alert('Export Complete', 'An encrypted download archive link has been routed to your verified email destination.') 
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
      
      {/* Informative Security Banner */}
      <View style={styles.bannerContainer}>
        <Ionicons name="shield-checkmark" size={32} color="#007AFF" />
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerTitle}>Privacy Sovereignty Console</Text>
          <Text style={styles.bannerSubtext}>
            Control your analytical signature, diagnostic feeds, and localized operational tracking permissions below.
          </Text>
        </View>
      </View>

      {/* Category Section: Interactive Framework Controls */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Data & Permission Controls</Text>

        {/* Tracing Toggle Frame */}
        <View style={styles.toggleItemRow}>
          <View style={styles.toggleMeta}>
            <Text style={styles.toggleTitle}>Share Analytics Metrics</Text>
            <Text style={styles.toggleDescription}>Route performance diagnostic payloads to help fix runtime errors.</Text>
          </View>
          <Switch
            value={shareMetrics}
            onValueChange={setShareMetrics}
            trackColor={{ false: '#D1D1D6', true: '#34C759' }}
            thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
          />
        </View>

        {/* Marketing Personalization Toggle Frame */}
        <View style={styles.toggleItemRow}>
          <View style={styles.toggleMeta}>
            <Text style={styles.toggleTitle}>Targeted Asset Suggestions</Text>
            <Text style={styles.toggleDescription}>Personalize dashboard feed results using your recent browse patterns.</Text>
          </View>
          <Switch
            value={personalizedAds}
            onValueChange={setPersonalizedAds}
            trackColor={{ false: '#D1D1D6', true: '#34C759' }}
            thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
          />
        </View>

        {/* Geolocation Authorization Toggle Frame */}
        <View style={styles.toggleItemRow}>
          <View style={styles.toggleMeta}>
            <Text style={styles.toggleTitle}>Background GPS link Sync</Text>
            <Text style={styles.toggleDescription}>Enable localized coordinate resolution to drop pins on your property matches.</Text>
          </View>
          <Switch
            value={locationTracking}
            onValueChange={setLocationTracking}
            trackColor={{ false: '#D1D1D6', true: '#34C759' }}
            thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
          />
        </View>
      </View>

      {/* Category Section: Data Rights Management */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Account Ledger Management</Text>
        <Pressable style={styles.actionRowBtn} onPress={handleExportDataDataRequest}>
          <View style={styles.actionLeftRow}>
            <Ionicons name="download-outline" size={20} color="#007AFF" />
            <Text style={styles.actionText}>Download Comprehensive Data Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
        </Pressable>
      </View>

      {/* Category Section: Policy Accordions Documentation */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Corporate Disclosures & Terms</Text>

        {policyData.map((item) => {
          const isExpanded = expandedSection === item.id;
          return (
            <View key={item.id} style={styles.accordionContainer}>
              <Pressable style={styles.accordionHeader} onPress={() => toggleAccordion(item.id)}>
                <Text style={styles.accordionTitleText}>{item.title}</Text>
                <Ionicons 
                  name={isExpanded ? "chevron-up" : "chevron-down"} 
                  size={18} 
                  color="#8E8E93" 
                />
              </Pressable>
              
              {isExpanded && (
                <View style={styles.accordionBodyContent}>
                  <Text style={styles.accordionBodyText}>{item.body}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Professional Footer Statement */}
      <Text style={styles.footerNote}>
        Last Revised: July 2026 • Version 2.4.0
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  bannerContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderBottomWidth: 0.5,
    borderColor: '#C6C6C8',
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  bannerSubtext: {
    fontSize: 12,
    color: '#636366',
    marginTop: 2,
    lineHeight: 16,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 18,
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
  },
  toggleItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingRight: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  toggleMeta: {
    flex: 1,
    paddingRight: 16,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  toggleDescription: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
    lineHeight: 16,
  },
  actionRowBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingRight: 16,
  },
  actionLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  accordionContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingRight: 16,
  },
  accordionTitleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  accordionBodyContent: {
    paddingRight: 16,
    paddingBottom: 14,
    backgroundColor: '#F8F9FA',
    paddingLeft: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  accordionBodyText: {
    fontSize: 13,
    color: '#3A3A3C',
    lineHeight: 18,
  },
  footerNote: {
    fontSize: 11,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 30,
  },
});