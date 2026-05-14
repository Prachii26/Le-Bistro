import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MENU_ITEMS } from '../../data/menu';
import { MenuItem } from '../../types';
import { useCartStore } from '../../store/cartStore';
import MenuCard from '../../components/MenuCard';
import CategoryPill from '../../components/CategoryPill';
import CartSummaryBar from '../../components/CartSummaryBar';
import AIChat from '../../components/AIChat';
import ItemDetailSheet from '../../components/ItemDetailSheet';
import Toast from '../../components/Toast';
import { theme } from '../../constants/theme';

const CATEGORIES = ['All', 'Starters', 'Mains', 'Drinks', 'Desserts'] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

const CATEGORY_MAP: Record<CategoryFilter, string | null> = {
  All: null,
  Starters: 'starter',
  Mains: 'main',
  Drinks: 'drink',
  Desserts: 'dessert',
};

export default function MenuScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const cartItems = useCartStore((s) => s.items);
  const router = useRouter();

  const filteredItems = useMemo(() => {
    const categoryKey = CATEGORY_MAP[activeCategory];
    const query = search.toLowerCase();
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = !categoryKey || item.category === categoryKey;
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 2500);
  }, []);

  const handleAddToCart = useCallback(
    (item: MenuItem) => {
      addItem(item, 1);
      const existing = cartItems.find((c) => c.menuItem.id === item.id);
      const currentQty = (existing?.quantity ?? 0) + 1;
      showToast(`Added: ${currentQty}× ${item.name} 🌿`);
    },
    [addItem, cartItems, showToast]
  );

  const handleOpenDetail = useCallback((item: MenuItem) => {
    setSelectedItem(item);
    setSheetVisible(true);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSheetVisible(false);
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MenuItem>) => {
      const cartEntry = cartItems.find((c) => c.menuItem.id === item.id);
      const qty = cartEntry?.quantity ?? 0;
      return (
        <MenuCard
          item={item}
          quantity={qty}
          onAddToCart={() => handleAddToCart(item)}
          onDecrement={() => updateQuantity(item.id, qty - 1)}
          onOpenDetail={() => handleOpenDetail(item)}
        />
      );
    },
    [cartItems, handleAddToCart, handleOpenDetail]
  );

  const keyExtractor = useCallback((item: MenuItem) => item.id, []);
  const separator = useCallback(() => <View style={{ height: 8 }} />, []);

  const resultsLabel =
    search.length > 0
      ? `${filteredItems.length} results`
      : `${filteredItems.length} dishes`;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.wordmark}>
              <Text style={styles.wordmarkLe}>Le </Text>
              <Text style={styles.wordmarkBistro}>Bistro</Text>
            </Text>
            <Text style={styles.subtitle}>Good evening, Prachi 🌿</Text>
          </View>
          <View style={styles.avatar} accessibilityLabel="User avatar">
            <Text style={styles.avatarText}>PK</Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color={theme.colors.textSecondary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search dishes..."
            placeholderTextColor={theme.colors.textSecondary}
            style={styles.searchInput}
            accessibilityLabel="Search dishes"
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} accessibilityLabel="Clear search">
              <Text style={styles.clearBtn}>×</Text>
            </Pressable>
          )}
        </View>

        <FlatList
          data={CATEGORIES}
          renderItem={({ item: cat }) => (
            <CategoryPill
              label={cat}
              active={activeCategory === cat}
              onPress={() => setActiveCategory(cat)}
            />
          )}
          keyExtractor={(cat) => cat}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          style={styles.categoryScroll}
        />

        <Text style={styles.resultsLabel}>{resultsLabel}</Text>

        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={separator}
          contentContainerStyle={styles.menuList}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No dishes match your search</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>

      <CartSummaryBar onPress={() => router.push('/(tabs)/cart')} />
      <AIChat />

      <Toast message={toastMessage} visible={toastVisible} />

      <ItemDetailSheet
        item={selectedItem}
        visible={sheetVisible}
        onClose={handleCloseSheet}
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  wordmark: {
    fontSize: 22,
  },
  wordmarkLe: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  wordmarkBistro: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primaryDark,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radii.input,
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  clearBtn: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryList: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.sm,
  },
  resultsLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  menuList: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 160,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: theme.spacing.xxxl,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
