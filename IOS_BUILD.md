# Building My Gym Garden for iOS

Requires a Mac with Xcode 16+, CocoaPods-free Swift Package Manager (Capacitor 8), Node 20+, and an Apple Developer account.

## Steps

1. **Export to GitHub** — in Lovable, open the GitHub menu and connect/export the project.
2. **Clone or pull** on your Mac:
   ```sh
   git clone <your-repo-url> && cd <repo>
   # later updates:
   git pull
   ```
3. **Install dependencies**
   ```sh
   npm install
   ```
4. **Add the iOS platform** (first time only)
   ```sh
   npx cap add ios
   ```
5. **Build the static bundle and sync it into the iOS project** (run after every pull)
   ```sh
   npm run cap:sync
   ```
   This runs `npm run build:ios` (static SPA in `dist/client`) and `npx cap sync ios`.
6. **Open in Xcode**
   ```sh
   npm run cap:open
   ```
7. **Signing** — select the `App` target → Signing & Capabilities → choose your Team. Confirm the Bundle Identifier is `app.lovable.mygymgarden` (or change it to one you own).
8. **Run on a device** — plug in your iPhone (enable Developer Mode in Settings → Privacy & Security), pick it as the run destination, press ▶.
9. **Archive for TestFlight / App Store** — set destination to "Any iOS Device (arm64)", then Product → Archive. In the Organizer, click **Distribute App → App Store Connect → Upload**. The build then appears in TestFlight in App Store Connect.

The app runs fully offline; all data stays in the phone's local storage.

## Needed for App Store submission

- App icon 1024×1024 PNG (no transparency) — add in `ios/App/App/Assets.xcassets/AppIcon.appiconset`
- Splash screen image — `ios/App/App/Assets.xcassets/Splash.imageset` (or use `@capacitor/assets` to generate icons and splash)
- Privacy policy URL (required even though no data leaves the device)
- Screenshots: 6.9" iPhone (1320×2868) at minimum; 6.5" optional
- App name, subtitle, description, keywords, support URL, category (Health & Fitness), age rating
- App Privacy questionnaire in App Store Connect ("Data Not Collected")
