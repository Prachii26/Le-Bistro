import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useChatStore } from '../store/chatStore';
import { useAIChat } from '../hooks/useAIChat';
import ChatBubble, { TypingIndicator } from './ChatBubble';
import { theme } from '../constants/theme';
import { ChatMessage } from '../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const COLLAPSED_HEIGHT = 58;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.55;

const SPRING_CONFIG = { damping: 20, stiffness: 200, mass: 0.8 };

const AIChat: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);

  const messages = useChatStore((s) => s.messages);
  const isLoading = useChatStore((s) => s.isLoading);
  const { sendMessage } = useAIChat();

  const drawerHeight = useSharedValue(COLLAPSED_HEIGHT);

  const expand = useCallback(() => {
    setIsExpanded(true);
    drawerHeight.value = withSpring(EXPANDED_HEIGHT, SPRING_CONFIG);
  }, [drawerHeight]);

  const collapse = useCallback(() => {
    setIsExpanded(false);
    drawerHeight.value = withSpring(COLLAPSED_HEIGHT, SPRING_CONFIG);
    inputRef.current?.blur();
  }, [drawerHeight]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 40) {
        collapse();
      }
    })
    .runOnJS(true);

  const animatedStyle = useAnimatedStyle(() => ({
    height: drawerHeight.value,
  }));

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText('');
    if (!isExpanded) expand();
    await sendMessage(text);
  }, [inputText, isLoading, isExpanded, expand, sendMessage]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => <ChatBubble message={item} />,
    []
  );

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  return (
    <>
      {isExpanded && (
        <Pressable
          style={styles.backdrop}
          onPress={collapse}
          accessibilityLabel="Close AI chat"
        />
      )}

      <Animated.View style={[styles.drawer, animatedStyle]}>
        <GestureDetector gesture={panGesture}>
          <View style={styles.handleArea}>
            <View style={styles.handle} />
          </View>
        </GestureDetector>

        {!isExpanded ? (
          <Pressable style={styles.collapsedRow} onPress={expand} accessibilityRole="button" accessibilityLabel="Open AI assistant">
            <View style={styles.collapsedLeft}>
              <Ionicons name="sparkles-outline" size={16} color={theme.colors.primary} />
              <Text style={styles.collapsedHint}>Ask Bistro anything...</Text>
            </View>
            <Pressable
              onPress={() => { expand(); setTimeout(() => inputRef.current?.focus(), 300); }}
              style={styles.sendCircle}
              accessibilityLabel="Send message"
            >
              <Ionicons name="arrow-up" size={16} color="#FFFFFF" />
            </Pressable>
          </Pressable>
        ) : (
          <View style={styles.expandedContent}>
            <View style={styles.expandedHeader}>
              <Text style={styles.headerLabel}>✦ Bistro</Text>
              <Pressable onPress={collapse} accessibilityLabel="Close chat" accessibilityRole="button">
                <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
              </Pressable>
            </View>

            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.messageList}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              ListFooterComponent={isLoading ? <TypingIndicator /> : null}
            />

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <View style={styles.inputBar}>
                <TextInput
                  ref={inputRef}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Message Bistro..."
                  placeholderTextColor={theme.colors.textSecondary}
                  style={styles.input}
                  multiline
                  maxLength={500}
                  blurOnSubmit={false}
                  onSubmitEditing={handleSend}
                  accessibilityLabel="Message input"
                />
                <Pressable
                  onPress={handleSend}
                  disabled={!inputText.trim() || isLoading}
                  style={[
                    styles.sendBtn,
                    (!inputText.trim() || isLoading) && styles.sendBtnDisabled,
                  ]}
                  accessibilityLabel="Send message"
                  accessibilityRole="button"
                >
                  <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </View>
        )}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay,
    zIndex: 99,
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radii.lg,
    borderTopRightRadius: theme.radii.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    overflow: 'hidden',
    ...theme.shadows.sheet,
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    paddingBottom: 4,
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
  },
  collapsedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    flex: 1,
  },
  collapsedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  collapsedHint: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  sendCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedContent: {
    flex: 1,
  },
  expandedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  messageList: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.primaryLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    fontSize: 13,
    color: theme.colors.textPrimary,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});

export default AIChat;
