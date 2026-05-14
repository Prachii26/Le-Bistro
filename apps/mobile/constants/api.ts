import Constants from 'expo-constants';

const getDevApiUrl = (): string => {
  const hostUri = Constants.expoConfig?.hostUri ?? Constants.manifest?.debuggerHost;
  const host = hostUri?.split(':')[0];
  // Android emulator uses 10.0.2.2 to reach host localhost
  if (!host || host === '127.0.0.1' || host === 'localhost') {
    return 'http://10.0.2.2:3001';
  }
  return `http://${host}:3001`;
};

export const API_BASE_URL = __DEV__
  ? getDevApiUrl()
  : 'https://your-production-url.com';
