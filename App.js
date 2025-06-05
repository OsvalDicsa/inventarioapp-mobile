import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

import MainNavigator from './src/navigation/MainNavigator';
import { store, persistor } from './src/store';
import { setConnection } from './src/slices/queueSlice';

// 1) Habilitamos react-native-screens antes de montar la navegación:
enableScreens();

export default function App() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      store.dispatch(setConnection(state.isConnected));
    });
    return () => unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* 2) Habilitamos provider de safe area */}
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer>
              <MainNavigator />
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
