import React, { useState } from 'react'
import { Alert, StyleSheet, View, Text } from 'react-native'
import { Button, Input, Divider } from '@rneui/themed'
import { supabase } from '@/lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicLinkMode, setMagicLinkMode] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  async function signInWithMagicLink() {
    if (!email) {
      Alert.alert('Please enter your email address')
      return
    }
    
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
    })

    if (error) {
      Alert.alert(error.message)
    } else {
      Alert.alert('Magic Link Sent', 'Check your email for the login link')
    }
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      
      {!magicLinkMode && (
        <View style={styles.verticallySpaced}>
          <Input
            label="Password"
            leftIcon={{ type: 'font-awesome', name: 'lock' }}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={'none'}
          />
        </View>
      )}
      
      {!magicLinkMode ? (
        <>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
          </View>
          <View style={styles.verticallySpaced}>
            <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
          </View>
          <Divider style={styles.divider} />
          <View style={styles.toggleContainer}>
            {/* <Text style={styles.toggleText}>
              Don't want to use a password?
            </Text> */}
            <Button
              type="clear"
              title="Use Magic Link"
              disabled={loading}
              onPress={() => setMagicLinkMode(true)}
            />
          </View>
        </>
      ) : (
        <>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Button 
              title="Send Magic Link" 
              disabled={loading} 
              onPress={() => signInWithMagicLink()} 
            />
          </View>
          <Divider style={styles.divider} />
          <View style={styles.toggleContainer}>
           
            <Button
              type="clear"
              title="Use Email/Password"
              disabled={loading}
              onPress={() => setMagicLinkMode(false)}
            />
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  divider: {
    marginVertical: 20,
  },
  toggleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  toggleText: {
    color: '#666',
    marginBottom: 5,
  },
})