import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';
import CartItemComponent from '../../components/CartItem';
import OrderSuccessSheet from '../../components/OrderSuccessSheet';
import { CartItem } from '../../types';
import { theme } from '../../constants/theme';
import { formatCurrency } from '../../utils/formatCurrency';

export default function CartScreen() {
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalItems = useCartStore((s) => s.totalItems());
  const subtotal = useCartStore((s) => s.subtotal());
  const serviceCharge = useCartStore((s) => s.serviceCharge());
  const tax = useCartStore((s) => s.tax());
  const total = useCartStore((s) => s.total());

  const handlePlaceOrder = useCallback(() => {
    if (totalItems === 0) return;
    setShowSuccess(true);
  }, [totalItems]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<CartItem>) => (
      <CartItemComponent
        item={item}
        onIncrement={() => addItem(item.menuItem, 1)}
        onDecrement={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
        onRemove={() => removeItem(item.menuItem.id)}
      />
    ),
    [addItem, updateQuantity, removeItem]
  );

  const keyExtractor = useCallback((item: CartItem) => item.menuItem.id, []);

  const separator = useCallback(() => <View style={{ height: 8 }} />, []);

  const itemCountLabel = totalItems === 1 ? '1 item' : `${totalItems} items`;

  if (totalItems === 0) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Order</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji} accessibilityLabel="Empty plate">🍽️</Text>
          <Text style={styles.emptyHeading}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Browse our menu to get started</Text>
          <Pressable
            onPress={() => router.push('/(tabs)/')}
            style={styles.browseButton}
            accessibilityLabel="Browse menu"
            accessibilityRole="button"
          >
            <Text style={styles.browseButtonText}>Browse Menu →</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Order</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{itemCountLabel}</Text>
        </View>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={separator}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View>
            <Pressable
              onPress={() => router.push('/(tabs)/')}
              style={styles.addMoreCard}
              accessibilityLabel="Add more items"
              accessibilityRole="button"
            >
              <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.addMoreText}>Add more items</Text>
            </Pressable>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service (10%)</Text>
                <Text style={styles.summaryValue}>{formatCurrency(serviceCharge)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax (8.5%)</Text>
                <Text style={styles.summaryValue}>{formatCurrency(tax)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
              </View>
            </View>

            <Pressable
              onPress={handlePlaceOrder}
              style={[styles.placeOrderBtn, totalItems === 0 && styles.placeOrderDisabled]}
              disabled={totalItems === 0}
              accessibilityLabel="Place order"
              accessibilityRole="button"
            >
              <Text style={styles.placeOrderText}>Place Order</Text>
            </Pressable>
          </View>
        }
      />

      <OrderSuccessSheet
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    ...theme.typography.headingLG,
  },
  countBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
  },
  countBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 64,
  },
  emptyHeading: {
    ...theme.typography.headingMD,
    marginTop: theme.spacing.lg,
  },
  emptySubtitle: {
    ...theme.typography.bodySM,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  browseButton: {
    marginTop: theme.spacing.xxl,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    borderRadius: theme.radii.button,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.md,
  },
  browseButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  addMoreCard: {
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    borderRadius: theme.radii.card,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  addMoreText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.card,
    padding: theme.spacing.xl,
    ...theme.shadows.card,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    ...theme.typography.bodySM,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    ...theme.typography.labelMD,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  totalLabel: {
    ...theme.typography.headingMD,
  },
  totalValue: {
    ...theme.typography.priceLG,
  },
  placeOrderBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.button,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  placeOrderDisabled: {
    opacity: 0.5,
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
