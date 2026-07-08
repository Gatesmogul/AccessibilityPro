import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../common/InputField';
import CustomButton from '../common/CustomButton';

export interface ListingFormData {
  name: string;
  category: string;
  price: string;
  status: 'Sell' | 'Rent' | 'Lease';
  location: string;
  gpsLink: string;
  description: string;
}

interface ListingFormProps {
  /** Optional initial dataset when using the form framework to update an existing listing */
  initialData?: Partial<ListingFormData>;
  /** Callback payload function handling final storage execution arrays */
  onSubmit: (data: ListingFormData) => void;
  /** Flags intermediate process wait states to disable buttons across high latency requests */
  isSubmitting?: boolean;
}

export default function ListingForm({
  initialData,
  onSubmit,
  isSubmitting = false
}: ListingFormProps) {
  // Input fields hook states initialization matrix
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [status, setStatus] = useState<'Sell' | 'Rent' | 'Lease'>(initialData?.status || 'Sell');
  const [location, setLocation] = useState(initialData?.location || '');
  const [gpsLink, setGpsLink] = useState(initialData?.gpsLink || '');
  const [description, setDescription] = useState(initialData?.description || '');

  // Validation structural errors dictionary
  const [errors, setErrors] = useState<Partial<Record<keyof ListingFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ListingFormData, string>> = {};

    if (!name.trim()) newErrors.name = 'Listing title text line cannot be empty.';
    if (!category.trim()) newErrors.category = 'Please assign an operational market category.';
    if (!price.trim()) newErrors.price = 'Price metric evaluation amount required.';
    if (!location.trim()) newErrors.location = 'Physical asset coordinate description required.';
    
    if (gpsLink.trim() && !gpsLink.startsWith('http://') && !gpsLink.startsWith('https://')) {
      newErrors.gpsLink = 'Please map a valid URL schema configuration starting with http/https.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Validation Check Failed', 'Please review all mandatory fields highlighted in red borders.');
      return;
    }

    onSubmit({
      name: name.trim(),
      category: category.trim(),
      price: price.trim(),
      status,
      location: location.trim(),
      gpsLink: gpsLink.trim(),
      description: description.trim()
    });
  };

  return (
    <ScrollView 
      style={styles.container} 
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.formBody}>
        
        {/* Mock Graphic Media Upload Pipeline Trigger */}
        <View style={styles.mediaUploadCard}>
          <Ionicons name="cloud-upload-outline" size={36} color="#007AFF" />
          <Text style={styles.mediaMainText}>Upload Asset Photography Portfolio</Text>
          <Text style={styles.mediaSubtext}>Supports high resolution PNG or JPEG configurations up to 10MB sizes.</Text>
        </View>

        {/* Dynamic Structural Segment Array Selector */}
        <View style={styles.segmentContainerWrapper}>
          <Text style={styles.segmentHeadingLabel}>Listing Transaction Method</Text>
          <View style={styles.segmentRowTrack}>
            {(['Sell', 'Rent', 'Lease'] as const).map((type) => {
              const isSelected = status === type;
              return (
                <Pressable
                  key={type}
                  style={[styles.segmentBtn, isSelected && styles.segmentBtnActive]}
                  onPress={() => setStatus(type)}
                >
                  <Text style={[styles.segmentBtnText, isSelected && styles.segmentBtnTextActive]}>
                    {type}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Input Text Form Fields Container Layout */}
        <InputField
          label="Listing Display Name / Title *"
          placeholder="e.g. Modern Workspace Studio Suite"
          value={name}
          onChangeText={setName}
          error={errors.name}
          iconLeft="business-outline"
        />

        <InputField
          label="Operational Portfolio Category *"
          placeholder="e.g. Commercial Office Space, Logistics"
          value={category}
          onChangeText={setCategory}
          error={errors.category}
          iconLeft="grid-outline"
        />

        <InputField
          label="Financial Value / Pricing Valuation *"
          placeholder="e.g. $4,500 / month"
          value={price}
          onChangeText={setPrice}
          error={errors.price}
          iconLeft="cash-outline"
          keyboardType="default"
        />

        <InputField
          label="Physical Location Address Vector *"
          placeholder="e.g. 742 Evergreen Terrace, Sector 4G"
          value={location}
          onChangeText={setLocation}
          error={errors.location}
          iconLeft="location-outline"
        />

        <InputField
          label="Google Maps Hyperlink Route (Optional)"
          placeholder="https://maps.google.com/..."
          value={gpsLink}
          onChangeText={setGpsLink}
          error={errors.gpsLink}
          iconLeft="map-outline"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <InputField
          label="Comprehensive Asset Specifications / Narrative Description"
          placeholder="Describe interior details, structural configurations, amenities, or utility bundles available..."
          value={description}
          onChangeText={setDescription}
          iconLeft="document-text-outline"
          multiline
          numberOfLines={4}
          containerStyle={styles.memoInputPatch}
          textAlignVertical="top"
        />

        {/* Form Structural Action Confirmation Trigger */}
        <CustomButton
          title={initialData ? "Save & Apply Listing Mutations" : "Publish Listing Profile to Feed"}
          onPress={handleFormSubmit}
          isLoading={isSubmitting}
          variant="primary"
          iconLeft="checkmark-circle-outline"
          style={styles.actionBtnStyleSpacing}
        />

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  formBody: {
    padding: 16,
    paddingBottom: 40,
  },
  mediaUploadCard: {
    width: '100%',
    height: 140,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#C7C7CC',
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginBottom: 20,
  },
  mediaMainText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 8,
    textAlign: 'center',
  },
  mediaSubtext: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
    textAlign: 'center',
  },
  segmentContainerWrapper: {
    marginBottom: 18,
  },
  segmentHeadingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3A3A3C',
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  segmentRowTrack: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 3,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.12,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  segmentBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636366',
  },
  segmentBtnTextActive: {
    color: '#007AFF',
    fontWeight: '700',
  },
  memoInputPatch: {
    marginBottom: 24,
  },
  actionBtnStyleSpacing: {
    marginTop: 10,
    height: 50,
  },
});