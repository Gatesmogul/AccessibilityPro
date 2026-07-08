import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Pressable 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface CartProduct {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image?: string;
  status?: string; // e.g., 'Rent', 'Sell'
}

interface CartItemProps {
  /** The item structural instance properties config block */
  item: CartProduct;
  /** Callback fired when raising the quantity count asset value */
  onIncrease: (id: string) => void;
  /** Callback fired when decrementing the quantity value */
  onDecrease: (id: string) => void;
  /** Callback fired when stripping the element entirely from the array */
  onRemove: (id: string) => void;
}

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove
}: CartItemProps) {
  
  const fallbackImage = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600';

  return (
    <View style={styles.itemWrapper}>
      {/* Product Image Thumbnail */}
      <Image 
        source={{ uri: item.image || fallbackImage }} 
        style={styles.thumbnailImage}
        resizeMode="cover"
      />

      {/* Center Details Panel */}
      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.titleText} numberOfLines={1}>
            {item.name}
          </Text>
          {item.status && (
            <Text style={[
              styles.typeBadge,
              item.status === 'Sell' ? styles.badgeSell : styles.badgeRent
            ]}>
              {item.status}
            </Text>
          )}
        </View>

        <Text style={styles.priceText}>
          {item.price}
        </Text>

        {/* Counter Interface and Absolute Trash Actions */}
        <View style={styles.actionsFooter}>
          <View style={styles.stepperContainer}>
            <Pressable 
              style={styles.stepperBtn} 
              onPress={() => onDecrease(item.id)}
              accessibilityLabel="Decrease item quantity"
            >
              <Ionicons name="remove" size={16} color="#1C1C1E" />
            </Pressable>
            
            <Text style={styles.quantityDisplay}>
              {item.quantity}
            </Text>
            
            <Pressable 
              style={styles.stepperBtn} 
              onPress={() => onIncrease(item.id)}
              accessibilityLabel="Increase item quantity"
            >
              <Ionicons name="add" size={16} color="#1C1C1E" />
            </Pressable>
          </View>

          <Pressable 
            style={styles.trashBtn} 
            onPress={() => onRemove(item.id)}
            accessibilityLabel="Remove item from cart"
          >
            <Ionicons name="trash-outline" size={16} color="#FF3B30" />
            <Text style={styles.trashBtnText}>Remove</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
  },
  thumbnailImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E5E5EA',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
  },
  typeBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
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
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#34C759',
    marginTop: 4,
  },
  actionsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  stepperBtn: {
    width: 30,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityDisplay: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    paddingHorizontal: 8,
    textAlign: 'center',
    minWidth: 24,
  },
  trashBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  trashBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF3B30',
  },
});