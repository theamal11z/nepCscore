import { useEffect, useState } from 'react';
import { Redirect, Slot, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { getCurrentUser } from '@/utils/auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  useFrameworkReady();
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUserRole(user.role);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading screen while checking authentication
  if (isLoading) {
    return null;
  }

  // If not logged in, redirect to auth flow
  if (!userRole) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(fan)" />
        <Stack.Screen name="(player)" />
        <Stack.Screen name="(organizer)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}