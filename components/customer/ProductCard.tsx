import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Pressable, 
  Linking, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  price: string;
  status: 'Lease' | 'Sell' | 'Rent' | string;
  location: string;
  gpsLink?: string;
  image?: string;
  availability: 'Available' | 'Sold Out' | string;
}

interface ProductCardProps {
  /** The item model containing key property asset configuration details */
  product: ProductItem;
  /** Action executed when pressing the baseline product container card */
  onPress?: (id: string) => void;
  /** Action executed when adding this asset entity into the user's shopping basket array */
  onAddToCart?: (product: ProductItem) => void;
}

export default function ProductCard({ 
  product, 
  onPress, 
  onAddToCart 
}: ProductCardProps) {
  
  // Default vector image fallback to prevent UI breakage on invalid picture urls
  const fallbackImage = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600';

  const handleOpenGps = async () => {
    if (!product.gpsLink) return;
    
    try {
      const supported = await Linking.canOpenURL(product.gpsLink);
      if (supported) {
        await Linking.openURL(product.gpsLink);
      } else {
        Alert.alert('Error', 'Unable to resolve the provided spatial GPS tracking hyperlink structure.');
      }
    } catch {
      Alert.alert('Navigation Routing Error', 'An issue occurred while launching the external map layer.');
    }
  };

  const isSoldOut = product.availability === 'Sold Out';

  return (
    <Pressable 
      style={styles.cardContainer}
      onPress={() => onPress && onPress(product.id)}
    >
      {/* Structural Aspect Image Block */}
      <View style={styles.imageWrapper}>
        <Image 
          source={{ uri: product.image || fallbackImage }} 
          style={styles.cardImage} 
          resizeMode="cover"
        />
        
        {/* Absolute Positioning Overlay Labels */}
        <View style={styles.badgeOverlayRow}>
          <Text style={[
            styles.statusBadge, 
            product.status === 'Sell' ? styles.badgeSell : styles.badgeRent
          ]}>
            {product.status}
          </Text>
          
          <Text style={[
            styles.availabilityBadge,
            isSoldOut ? styles.badgeSoldOut : styles.badgeAvailable
          ]}>
            {product.availability}
          </Text>
        </View>
      </View>

      {/* Primary Context Typography Panel */}
      <View style={styles.metaPanel}>
        <Text style={styles.categoryText} numberOfLines={1}>
          {product.category} {product.subCategory ? `• ${product.subCategory}` : ''}
        </Text>
        
        <Text style={styles.productTitleText} numberOfLines={1}>
          {product.name}
        </Text>

        <Text style={styles.priceStringText}>
          {product.price}
        </Text>

        {/* Localized Structural Layout Fields */}
        <View style={styles.locationFooterRow}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color="#636366" />
            <Text style={styles.locationLabelText} numberOfLines={1}>
              {product.location}
            </Text>
          </View>

          {/* GPS Google Maps Redirection Pivot Icon */}
          {product.gpsLink && (
            <Pressable 
              style={styles.gpsIconBtn} 
              onPress={handleOpenGps}
              accessibilityLabel="View map location details"
            >
              <Ionicons name="map-outline" size={16} color="#007AFF" />
            </Pressable>
          )}
        </View>

        <View style={styles.cardDivider} />

        {/* Bottom Interactive Cart Request Anchor */}
        <Pressable 
          style={[styles.cartActionBtn, isSoldOut && styles.cartActionBtnDisabled]}
          disabled={isSoldOut}
          onPress={() => onAddToCart && onAddToCart(product)}
        >
          <Ionicons 
            name="cart-outline" 
            size={16} 
            color={isSoldOut ? '#AEAEB2' : '#007AFF'} 
          />
          <Text style={[styles.cartActionBtnText, isSoldOut && styles.cartActionTextDisabled]}>
            {isSoldOut ? 'Out of Stock' : 'Add to Cart / Order'}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  imageWrapper: {
    width: '100%',
    height: 180,
    backgroundColor: '#E5E5EA',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  badgeOverlayRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    overflow: 'hidden',
  },
  badgeSell: {
    backgroundColor: '#007AFF',
  },
  badgeRent: {
    backgroundColor: '#5856D6',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    overflow: 'hidden',
  },
  badgeAvailable: {
    backgroundColor: '#E8F9EE',
    color: '#34C759',
  },
  badgeSoldOut: {
    backgroundColor: '#FFEEEE',
    color: '#FF3B30',
  },
  metaPanel: {
    padding: 14,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  productTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 4,
  },
  priceStringText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#34C759',
    marginTop: 6,
  },
  locationFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    paddingRight: 10,
  },
  locationLabelText: {
    fontSize: 13,
    color: '#636366',
    fontWeight: '500',
  },
  gpsIconBtn: {
    backgroundColor: '#F2F2F7',
    padding: 6,
    borderRadius: 6,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginVertical: 12,
  },
  cartActionBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#007AFF',
    borderRadius: 8,
    height: 38,
    backgroundColor: 'transparent',
  },
  cartActionBtnDisabled: {
    borderColor: '#E5E5EA',
    backgroundColor: '#F2F2F7',
  },
  cartActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#007AFF',
  },
  cartActionTextDisabled: {
    color: '#AEAEB2',
  },
});