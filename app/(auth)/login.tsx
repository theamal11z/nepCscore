import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { UserCircle } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

import { login } from '@/utils/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const userRole = await login(email, password);
      router.replace(`/(${userRole})`);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleDemoLogin = async (role) => {
    setIsLoading(true);
    try {
      // In a real app, you would authenticate with the backend
      setTimeout(() => {
        router.replace(`/(${role})`);
      }, 1000);
    } catch (err) {
      setError('Demo login failed');
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={['#DC143C', '#8B0000']}
        style={styles.background}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/2570139/pexels-photo-2570139.jpeg' }}
            style={styles.logoBackground}
          />
          <View style={styles.logoOverlay}>
            <UserCircle color="#FFFFFF" size={60} />
            <Text style={styles.logoText}>nepCscore</Text>
            <Text style={styles.tagline}>Nepal's Cricket Community</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#777"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#777"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => {}}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or try a demo</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.demoContainer}>
            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => handleDemoLogin('fan')}
            >
              <Text style={styles.demoButtonText}>Fan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => handleDemoLogin('player')}
            >
              <Text style={styles.demoButtonText}>Player</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => handleDemoLogin('organizer')}
            >
              <Text style={styles.demoButtonText}>Organizer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => handleDemoLogin('admin')}
            >
              <Text style={styles.demoButtonText}>Admin</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '50%',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  logoContainer: {
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  logoOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
    marginTop: -20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 24,
  },
  errorText: {
    color: '#DC143C',
    marginBottom: 16,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#121212',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#121212',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#DC143C',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#DC143C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#F5A5A5',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#777',
    fontSize: 14,
  },
  demoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  demoButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  demoButtonText: {
    color: '#121212',
    fontSize: 14,
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#777',
    fontSize: 14,
  },
  signupLink: {
    color: '#DC143C',
    fontSize: 14,
    fontWeight: 'bold',
  },
});