import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../constants/theme';
import { useCartStore } from '../store/cartStore';

interface OrderSuccessSheetProps {
  visible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const orderNumberRef = { current: Math.floor(1000 + Math.random() * 9000) };

const OrderSuccessSheet: React.FC<OrderSuccessSheetProps> = ({ visible, onClose }) => {
  const scale = useSharedValue(0);
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();
  const orderNumber = useRef(orderNumberRef.current);

  useEffect(() => {
    if (visible) {
      orderNumber.current = Math.floor(1000 + Math.random() * 9000);
      scale.value = withSequence(
        withSpring(0, { damping: 10, stiffness: 300 }),
        withSpring(1.3, { damping: 10, stiffness: 300 }),
        withSpring(1.0, { damping: 15, stiffness: 250 })
      );
    }
  }, [visible, scale]);

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleBackToMenu = () => {
    clearCart();
    onClose();
    router.push('/(tabs)/');
  };

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.content}>
            <Animated.View style={[styles.checkCircle, checkmarkStyle]}>
              <Ionicons name="checkmark" size={32} color="#FFFFFF" />
            </Animated.View>

            <Text style={styles.heading}>Order Placed! 🌿</Text>
            <Text style={styles.orderNum}>Order #{orderNumber.current}</Text>
            <Text style={styles.eta}>Estimated time: 25–35 minutes</Text>

            <View style={styles.divider} />

            <Pressable
              onPress={handleBackToMenu}
              style={styles.button}
              accessibilityLabel="Back to Menu"
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Back to Menu</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.overlay,
  },
  sheet: {
    height: SCREEN_HEIGHT * 0.5,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radii.lg,
    borderTopRightRadius: theme.radii.lg,
    ...theme.shadows.sheet,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xxxl,
  },
  checkCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    ...theme.typography.headingLG,
    marginTop: theme.spacing.xl,
    textAlign: 'center',
  },
  orderNum: {
    ...theme.typography.labelMD,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  eta: {
    ...theme.typography.bodySM,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    alignSelf: 'stretch',
    marginTop: theme.spacing.lg,
  },
  button: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.button,
    alignSelf: 'stretch',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default OrderSuccessSheet;
