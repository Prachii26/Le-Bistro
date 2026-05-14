import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useCartStore } from '../store/cartStore';
import { theme } from '../constants/theme';
import { formatCurrency } from '../utils/formatCurrency';

interface CartSummaryBarProps {
  onPress: () => void;
}

const CartSummaryBar: React.FC<CartSummaryBarProps> = ({ onPress }) => {
  const totalItems = useCartStore((s) => s.totalItems());
  const total = useCartStore((s) => s.total());

  if (totalItems === 0) return null;

  const itemLabel = totalItems === 1 ? '1 item' : `${totalItems} items`;

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(20).stiffness(200)}
      exiting={SlideOutDown.springify().damping(20).stiffness(200)}
      style={styles.container}
    >
      <Pressable
        onPress={onPress}
        style={styles.inner}
        accessibilityLabel={`View order: ${itemLabel}, ${formatCurrency(total)}`}
        accessibilityRole="button"
      >
        <View>
          <Text style={styles.itemLabel}>{itemLabel}</Text>
          <Text style={styles.total}>{formatCurrency(total)}</Text>
        </View>
        <Text style={styles.cta}>View Order →</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 58,
    left: 16,
    right: 16,
    zIndex: 50,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.card,
    ...theme.shadows.bar,
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  total: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  cta: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});

export default CartSummaryBar;
