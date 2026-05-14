import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MenuItem } from '../types';
import { theme } from '../constants/theme';
import { formatCurrency } from '../utils/formatCurrency';
import { useCartStore } from '../store/cartStore';

interface ItemDetailSheetProps {
  item: MenuItem | null;
  visible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.65;

const ItemDetailSheet: React.FC<ItemDetailSheetProps> = ({ item, visible, onClose }) => {
  const [qty, setQty] = useState(1);
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (visible) {
      setQty(1);
      translateY.value = withSpring(0, { damping: 22, stiffness: 200 });
      backdropOpacity.value = withTiming(0.45, { duration: 250 });
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, { damping: 22, stiffness: 200 });
      backdropOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, translateY, backdropOpacity]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const handleAdd = () => {
    if (!item) return;
    addItem(item, qty);
    onClose();
  };

  if (!item) return null;

  const emojiContainerBg = theme.colors.categoryAccent[item.category] ?? theme.colors.accent;

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="none">
      <View style={styles.modalRoot}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        </Animated.View>

        <Animated.View style={[styles.sheet, sheetStyle]}>
          <View style={styles.handle} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={[styles.emojiCircle, { backgroundColor: emojiContainerBg }]}>
              <Text style={styles.emoji} accessibilityLabel={item.name}>
                {item.emoji}
              </Text>
            </View>

            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{formatCurrency(item.price)}</Text>
            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoText}>🔥 {item.calories}kcal</Text>
              <Text style={styles.infoText}>
                {item.allergens.length > 0 ? `⚠️ ${item.allergens.join(', ')}` : '✓ No allergens'}
              </Text>
            </View>

            {item.allergens.length > 0 && (
              <View style={styles.allergenChips}>
                {item.allergens.map((a) => (
                  <View key={a} style={styles.allergenChip}>
                    <Text style={styles.allergenChipText}>{a}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.stepper}>
              <Pressable
                onPress={() => setQty(Math.max(1, qty - 1))}
                style={styles.stepBtn}
                accessibilityLabel="Decrease quantity"
              >
                <Text style={styles.stepBtnText}>−</Text>
              </Pressable>
              <Text style={styles.stepQty}>{qty}</Text>
              <Pressable
                onPress={() => setQty(qty + 1)}
                style={styles.stepBtn}
                accessibilityLabel="Increase quantity"
              >
                <Text style={styles.stepBtnText}>+</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={handleAdd}
              style={styles.ctaButton}
              accessibilityLabel={`Add to order, ${formatCurrency(item.price * qty)}`}
              accessibilityRole="button"
            >
              <Text style={styles.ctaText}>
                Add to Order — {formatCurrency(item.price * qty)}
              </Text>
            </Pressable>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay,
  },
  sheet: {
    height: SHEET_HEIGHT,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radii.lg,
    borderTopRightRadius: theme.radii.lg,
    ...theme.shadows.sheet,
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginTop: theme.spacing.sm,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: theme.spacing.xxxl,
  },
  emojiCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },
  emoji: {
    fontSize: 48,
  },
  name: {
    ...theme.typography.headingLG,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
  price: {
    ...theme.typography.priceLG,
    textAlign: 'center',
    marginTop: 4,
  },
  description: {
    ...theme.typography.bodyMD,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xxl,
    marginTop: theme.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    alignSelf: 'stretch',
    marginHorizontal: theme.spacing.xxl,
    marginTop: theme.spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xxl,
    alignSelf: 'stretch',
    marginTop: theme.spacing.lg,
  },
  infoText: {
    ...theme.typography.bodySM,
  },
  allergenChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: theme.spacing.xxl,
    marginTop: theme.spacing.sm,
    justifyContent: 'center',
  },
  allergenChip: {
    backgroundColor: theme.colors.errorLight,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
  },
  allergenChipText: {
    fontSize: 11,
    color: theme.colors.error,
    fontWeight: '600',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xl,
    marginTop: theme.spacing.xxl,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  stepBtnText: {
    fontSize: 20,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  stepQty: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    minWidth: 28,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.button,
    marginHorizontal: theme.spacing.xxl,
    alignSelf: 'stretch',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xxl,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ItemDetailSheet;
