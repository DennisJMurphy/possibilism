import { useColorScheme as useDeviceColorScheme } from 'react-native';

export function useColorScheme() {
  const deviceScheme = useDeviceColorScheme();
  // Default to dark mode if device scheme is not set
  return deviceScheme ?? 'dark';
}
