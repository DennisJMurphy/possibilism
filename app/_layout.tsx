import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { createContext, useContext, useState, useEffect } from 'react';
import 'react-native-reanimated';
import * as Linking from 'expo-linking';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const DeepLinkContext = createContext<string | null>(null);

export function useDeepLink() {
  return useContext(DeepLinkContext);
}

export default function RootLayout() {
  const [deepLinkUrl, setDeepLinkUrl] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const handleDeepLink = (url: string) => {
      console.log('Deep link received in _layout:', url);
      setDeepLinkUrl(url);
    };

    Linking.getInitialURL().then(url => {
      if (url) {
        console.log('App opened with deep link:', url);
        setDeepLinkUrl(url);
      }
    });

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
  if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  if (!loaded) {
    return null;
  }
  return (
    <DeepLinkContext.Provider value={deepLinkUrl}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="reset-password" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </DeepLinkContext.Provider>
  );
}
