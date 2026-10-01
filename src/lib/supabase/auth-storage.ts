import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Native session storage. AsyncStorage (not SecureStore): Supabase sessions exceed SecureStore's
 * ~2KB value limit. Tokens are short-lived and refreshable; see ADR 0003.
 */
export const authStorage = AsyncStorage;
