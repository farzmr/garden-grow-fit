import type { CapacitorConfig } from "@capacitor/cli";

// Bundled offline: no server.url. Built by `npm run build:ios` into dist/client.
const config: CapacitorConfig = {
  appId: "app.lovable.mygymgarden",
  appName: "My Gym Garden",
  webDir: "dist/client",
  ios: { contentInset: "never" },
  plugins: {
    SplashScreen: { launchShowDuration: 800, backgroundColor: "#f1eeea" },
    StatusBar: { style: "LIGHT", overlaysWebView: true },
  },
};

export default config;
