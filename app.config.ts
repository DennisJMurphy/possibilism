export default {
  name: 'possibilism-app',
  slug: 'possibilism-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'possibilism',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/icon.png',
    resizeMode: 'contain',
    backgroundColor: '#0099cc',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.possibilism.app',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/icon.png',
      backgroundColor: '#FFFFFF',
    },
    package: 'com.possibilism.app',
    permissions: ['INTERNET'],
    intentFilters: [
      {
        action: 'VIEW',
        data: [
          {
            scheme: 'possibilism',
            host: 'reset-password',
          },
          {
            scheme: 'possibilism',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/icon.png',
  },
  extra: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    eas: {
      projectId: '49e0502c-f497-4509-a7f8-0b2f153e73c0',
    },
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
}
