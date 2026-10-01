import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    // Declared order decides the default screen (e.g. after sign-out): sign-in first.
    // Not `initialRouteName`, which would stack sign-in underneath deep links to /sign-up.
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
