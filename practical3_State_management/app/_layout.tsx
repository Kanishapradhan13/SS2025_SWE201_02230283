import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { TaskProvider } from '@/shared/store/taskStore';
import { getCurrentUser, subscribeToAuthChanges } from '../lib/auth';
import { User } from 'firebase/auth';

// Define the types for route parameters
type RouteParams = {
  task?: string;
  [key: string]: any;
};

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      if (initializing) {
        setInitializing(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [initializing]);

  if (initializing) {
    return null; // Or a loading screen
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <TaskProvider>
        <Stack screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
          {!user ? (
            <Stack.Screen 
              name="auth" 
              options={{ 
                headerShown: false,
                title: "Login" 
              }} 
            />
          ) : (
            <>
              <Stack.Screen 
                name="(tabs)" 
                options={{ 
                  headerShown: false
                }} 
              />
              <Stack.Screen 
                name="taskDetail" 
                options={{ 
                  title: "Task Details",
                  presentation: "modal" 
                }} 
              />
              <Stack.Screen 
                name="taskForm" 
                options={({ route }) => {
                  // Cast route.params to our typed interface
                  const params = route.params as RouteParams;
                  return {
                    title: params?.task ? 'Edit Task' : 'New Task',
                    presentation: "modal"
                  };
                }} 
              />
            </>
          )}
        </Stack>
      </TaskProvider>
    </SafeAreaProvider>
  );
}