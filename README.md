# InventarioApp Mobile

This project is a React Native/Expo application for managing inventory records. It uses Redux for state management and Axios for API requests.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the Metro bundler:

```bash
npm start
```

3. Run on Android emulator or device:

```bash
npm run android
```

## Configuration

The API base URL is defined in `src/config.js`. You can override it by setting the `API_BASE_URL` environment variable before running Metro:

```bash
API_BASE_URL="https://example.com/api" npm start
```

### Debug Keystore

Android builds use a debug keystore located at `android/app/debug.keystore`. This file is ignored by Git. If it does not exist, generate one with:

```bash
keytool -genkeypair -v -keystore android/app/debug.keystore \
  -storepass android -alias androiddebugkey -keypass android \
  -dname "CN=Android Debug,O=Android,C=US" -keyalg RSA -keysize 2048 -validity 10000
```

## Testing

Basic tests run with Jest:

```bash
npm test
```

## Building

For release builds, follow Expo and React Native guidelines to generate your own signing keys.
