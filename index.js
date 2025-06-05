// index.js
import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent hace la llamada:
//    AppRegistry.registerComponent('main', () => App);
// y se encarga de inicializar correctamente el entorno tanto en Expo Go
// como en builds nativas (APK/IPA).
registerRootComponent(App);
