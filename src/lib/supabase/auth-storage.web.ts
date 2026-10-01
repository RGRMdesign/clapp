import { storage } from '@/lib/storage';

/** Web session storage: localStorage, guarded for static rendering (no window on the server). */
export const authStorage = storage;
