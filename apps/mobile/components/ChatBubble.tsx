import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { ChatMessage } from '../types';
import { theme } from '../constants/theme';

interface ChatBubbleProps {
  message: ChatMessage;
  isTyping?: boolean;
}

const TypingDot: React.FC<{ index: number }> = ({ index }) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(
      index * 150,
      withRepeat(
        withSequence(withTiming(1, { duration: 300 }), withTiming(0.3, { duration: 300 })),
        -1,
        true
      )
    );
  }, [index, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

export const TypingIndicator: React.FC = () => (
  <View style={styles.typingContainer}>
    <View style={styles.typingBubble}>
      {[0, 1, 2].map((i) => (
        <TypingDot key={i} index={i} />
      ))}
    </View>
  </View>
);

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  if (message.role === 'system') {
    return (
      <View style={styles.systemContainer}>
        <Text style={styles.systemText}>{message.content}</Text>
      </View>
    );
  }

  const isUser = message.role === 'user';

  const timestamp = message.timestamp instanceof Date
    ? message.timestamp
    : new Date(message.timestamp);

  const timeStr = timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.wrapper, isUser ? styles.wrapperUser : styles.wrapperAI]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
        <Text style={[styles.text, isUser ? styles.textUser : styles.textAI]}>
          {message.content}
        </Text>
      </View>
      <Text style={[styles.timestamp, isUser ? styles.timestampRight : styles.timestampLeft]}>
        {timeStr}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: theme.spacing.xs,
    maxWidth: '80%',
  },
  wrapperUser: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  wrapperAI: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  bubbleAI: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 12,
    borderBottomLeftRadius: 2,
  },
  bubbleUser: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    borderBottomRightRadius: 2,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  textAI: {
    color: theme.colors.textPrimary,
  },
  textUser: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  timestampLeft: {
    alignSelf: 'flex-start',
  },
  timestampRight: {
    alignSelf: 'flex-end',
  },
  systemContainer: {
    alignSelf: 'center',
    marginVertical: theme.spacing.xs,
  },
  systemText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  typingContainer: {
    alignSelf: 'flex-start',
    marginVertical: theme.spacing.xs,
  },
  typingBubble: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 12,
    borderBottomLeftRadius: 2,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    height: 36,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
});

export default ChatBubble;
