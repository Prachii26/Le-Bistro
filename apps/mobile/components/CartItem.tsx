import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { CartItem as CartItemType } from '../types';
import { theme } from '../constants/theme';
import { formatCurrency } from '../utils/formatCurrency';

interface CartItemProps {
  item: CartItemType;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onIncrement, onDecrement, onRemove }) => {
  const { menuItem, quantity } = item;
  const emojiContainerBg = theme.colors.categoryAccent[menuItem.category] ?? theme.colors.accent;

  const handleLongPress = useCallback(() => {
    Alert.alert(
      'Remove Item',
      `Remove ${menuItem.name} from your order?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: onRemove },
      ]
    );
  }, [menuItem.name, onRemove]);

  const isLastUnit = quantity === 1;

  return (
    <Pressable
      onLongPress={handleLongPress}
      style={styles.card}
      accessibilityLabel={`${menuItem.name}, quantity ${quantity}`}
    >
      <View style={[styles.emojiContainer, { backgroundColor: emojiContainerBg }]}>
        <Text style={styles.emoji} accessibilityLabel={menuItem.name}>
          {menuItem.emoji}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {menuItem.name}
        </Text>
        <Text style={styles.unitPrice}>
          {formatCurrency(menuItem.price)} each
        </Text>
      </View>

      <View style={styles.controls}>
        <Pressable
          onPress={isLastUnit ? onRemove : onDecrement}
          style={[styles.qtyButton, isLastUnit && styles.qtyButtonDanger]}
          accessibilityLabel={isLastUnit ? `Remove ${menuItem.name}` : 'Decrease quantity'}
          accessibilityRole="button"
        >
          <Ionicons
            name={isLastUnit ? 'trash-outline' : 'remove'}
            size={14}
            color={isLastUnit ? theme.colors.error : theme.colors.textPrimary}
          />
        </Pressable>

        <Animated.Text
          key={quantity}
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
          style={styles.qtyNumber}
        >
          {quantity}
        </Animated.Text>

        <Pressable
          onPress={onIncrement}
          style={styles.qtyButton}
          accessibilityLabel="Increase quantity"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={14} color={theme.colors.textPrimary} />
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm + 2,
    ...theme.shadows.card,
  },
  emojiContainer: {
    width: 52,
    height: 52,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: {
    fontSize: 22,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  unitPrice: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  qtyButtonDanger: {
    borderColor: theme.colors.error,
  },
  qtyNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    minWidth: 20,
    textAlign: 'center',
  },
});

export default CartItem;
