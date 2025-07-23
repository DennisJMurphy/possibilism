export default {
  name: 'possibilism-app',
  slug: 'possibilism-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  splash: {
    image: './assets/images/icon.png',
    resizeMode: 'contain',
    backgroundColor: '#0099cc', // Use your app's background color
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.possibilism.app',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/icon.png',
      backgroundColor: '#FFFFFF',
    },
  },
    extra: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      DEVMAIL: process.env.DEVMAIL, // Uncomment for development
      DEVPASS: process.env.DEVPASS, // Uncomment for development
      "eas": {
        "projectId": "49e0502c-f497-4509-a7f8-0b2f153e73c0"
      }
    }
  }
