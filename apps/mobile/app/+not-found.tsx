import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={styles.container}>
        <Text style={styles.heading}>This screen does not exist.</Text>
        <Link href="/(tabs)/" style={styles.link}>
          <Text style={styles.linkText}>Go to Menu →</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xxl,
  },
  heading: {
    ...theme.typography.headingMD,
    textAlign: 'center',
  },
  link: {
    marginTop: theme.spacing.lg,
  },
  linkText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});
