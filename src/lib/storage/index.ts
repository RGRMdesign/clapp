import * as SecureStore from 'expo-secure-store';

import { type KeyValueStorage } from './types';

/** Native: values are stored in the iOS Keychain / Android Keystore. */
export const storage: KeyValueStorage = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

export type { KeyValueStorage } from './types';
