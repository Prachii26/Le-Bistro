import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { MenuItem } from '../types';
import { theme } from '../constants/theme';
import { formatCurrency } from '../utils/formatCurrency';

interface MenuCardProps {
  item: MenuItem;
  quantity: number;
  onAddToCart: () => void;
  onDecrement: () => void;
  onOpenDetail: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = { damping: 8, stiffness: 300 };

const MenuCard: React.FC<MenuCardProps> = ({ item, quantity, onAddToCart, onDecrement, onOpenDetail }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleAddPress = useCallback(() => {
    scale.value = withSequence(
      withSpring(0.85, SPRING_CONFIG),
      withSpring(1.2, SPRING_CONFIG),
      withSpring(1.0, SPRING_CONFIG)
    );
    onAddToCart();
  }, [onAddToCart, scale]);

  const emojiContainerBg =
    theme.colors.categoryAccent[item.category] ?? theme.colors.accent;
  const displayedTags = item.tags.slice(0, 2);

  return (
    <Pressable
      onPress={onOpenDetail}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityLabel={`${item.name}, ${formatCurrency(item.price)}`}
      accessibilityRole="button"
    >
      <View style={[styles.emojiContainer, { backgroundColor: emojiContainerBg }]}>
        <Text style={styles.emoji} accessibilityLabel={item.name}>
          {item.emoji}
        </Text>
      </View>

      <View style={styles.info}>
        {displayedTags.length > 0 && (
          <View style={styles.tagsRow}>
            {displayedTags.map((tag) => (
              <View key={tag} style={styles.badge}>
                <Text style={styles.badgeText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {item.description}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>{formatCurrency(item.price)}</Text>

          {quantity > 0 ? (
            <View style={styles.stepper}>
              <Pressable
                onPress={onDecrement}
                style={styles.stepBtn}
                accessibilityLabel={quantity === 1 ? `Remove ${item.name}` : `Decrease ${item.name}`}
                accessibilityRole="button"
              >
                <Ionicons name={quantity === 1 ? 'trash-outline' : 'remove'} size={14} color="#FFFFFF" />
              </Pressable>
              <Text style={styles.qtyText}>{quantity}</Text>
              <AnimatedPressable
                onPress={handleAddPress}
                style={[styles.stepBtn, animatedStyle]}
                accessibilityLabel={`Add more ${item.name}`}
                accessibilityRole="button"
              >
                <Ionicons name="add" size={14} color="#FFFFFF" />
              </AnimatedPressable>
            </View>
          ) : (
            <AnimatedPressable
              onPress={handleAddPress}
              style={[styles.addButton, animatedStyle]}
              accessibilityLabel={`Add ${item.name} to cart`}
              accessibilityRole="button"
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
            </AnimatedPressable>
          )}
        </View>
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
    gap: theme.spacing.md,
    ...theme.shadows.card,
  },
  cardPressed: {
    opacity: 0.92,
  },
  emojiContainer: {
    width: 72,
    height: 72,
    borderRadius: theme.radii.image,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: {
    fontSize: 32,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  badge: {
    backgroundColor: theme.colors.badge,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '600',
    color: theme.colors.badgeText,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  description: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    minWidth: 16,
    textAlign: 'center',
  },
});

export default MenuCard;
