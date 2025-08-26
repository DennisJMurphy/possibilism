export default {
  name: 'possibilism-app',
  slug: 'possibilism-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.jpg',
  scheme: 'possibilism',
  splash: {
    image: './assets/images/icon.jpg',
    resizeMode: 'contain',
    backgroundColor: '#0099cc', // Use your app's background color
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.possibilism.app',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/icon.jpg',
      backgroundColor: '#FFFFFF',
    },
    package: 'com.possibilism.app',
    permissions: ['INTERNET'], // Ensure INTERNET permission is included
  },
    extra: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      "eas": {
        "projectId": "49e0502c-f497-4509-a7f8-0b2f153e73c0"
      }
    }
}
