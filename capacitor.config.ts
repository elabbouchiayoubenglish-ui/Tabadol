import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ayoub.tabadol',
  appName: 'Tabadol',
  webDir: 'out',
  server: {
    url: 'https://tabadolgit.vercel.app',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;