import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';
import { theme } from '../../constants/theme';

export default function TabLayout() {
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#D8E4D0',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Menu',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'restaurant' : 'restaurant-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Order',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'bag' : 'bag-outline'}
              size={22}
              color={color}
            />
          ),
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
          tabBarBadgeStyle: { backgroundColor: theme.colors.primary },
        }}
      />
    </Tabs>
  );
}
