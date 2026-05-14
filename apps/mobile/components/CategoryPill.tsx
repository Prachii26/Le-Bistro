import React, { useEffect } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { theme } from '../constants/theme';

interface CategoryPillProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CategoryPill: React.FC<CategoryPillProps> = ({ label, active, onPress }) => {
  const progress = useSharedValue(active ? 1 : 0);
  const scale = useSharedValue(active ? 1.05 : 1);

  useEffect(() => {
    progress.value = withSpring(active ? 1 : 0, { damping: 15, stiffness: 200 });
    scale.value = withSpring(active ? 1.05 : 1, { damping: 15, stiffness: 200 });
  }, [active, progress, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [theme.colors.surface, theme.colors.primary]
    ),
    transform: [{ scale: scale.value }],
  }));

  const textColor = active ? '#FFFFFF' : theme.colors.textSecondary;

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[styles.pill, animatedStyle]}
      accessibilityLabel={`Filter by ${label}`}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default CategoryPill;
