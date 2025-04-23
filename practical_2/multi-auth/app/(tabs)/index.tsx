import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import Auth from '../authentication/Auth';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Check if there's an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Set up auth state change listener
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View>
      {!session ? (
        <Auth />
      ) : (
        <View>
          {session && session.user && <Text>{session.user.id}</Text>}
          
          {/* Add your authenticated app content here */}
          <Text>You are logged in!</Text>
          
          {/* Add a sign out button */}
          <TouchableOpacity 
            style={styles.signOutButton} 
            onPress={() => supabase.auth.signOut()}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  signOutButton: {
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});