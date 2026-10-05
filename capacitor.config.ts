import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.daymark.app',
  appName: 'Daymark',
  webDir: 'public',
  server: {
    url: 'https://daymark-liart-ten.vercel.app',
    cleartext: false,
  },
};

export default config;