import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, UserPlus } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('fan');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // In a real app, you would register with the backend
      setTimeout(() => {
        router.replace(`/(${role})`);
      }, 1500);
    } catch (err) {
      setError('Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={['#DC143C', '#8B0000']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ChevronLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <UserPlus color="#FFFFFF" size={40} />
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSubtitle}>Join Nepal's Cricket Community</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.formContainer} contentContainerStyle={styles.scrollContent}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#777"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

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
            placeholder="Create a password"
            placeholderTextColor="#777"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor="#777"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <Text style={styles.roleTitle}>Select Your Role</Text>
        
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'fan' && styles.roleButtonActive]}
            onPress={() => setRole('fan')}
          >
            <Text style={[styles.roleText, role === 'fan' && styles.roleTextActive]}>Fan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.roleButton, role === 'player' && styles.roleButtonActive]}
            onPress={() => setRole('player')}
          >
            <Text style={[styles.roleText, role === 'player' && styles.roleTextActive]}>Player</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.roleButton, role === 'organizer' && styles.roleButtonActive]}
            onPress={() => setRole('organizer')}
          >
            <Text style={[styles.roleText, role === 'organizer' && styles.roleTextActive]}>Organizer</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By signing up, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
  formContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
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
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#121212',
    marginTop: 8,
    marginBottom: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  roleButtonActive: {
    backgroundColor: '#DC143C',
    borderColor: '#DC143C',
  },
  roleText: {
    color: '#121212',
    fontWeight: '500',
  },
  roleTextActive: {
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#DC143C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#F5A5A5',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  termsText: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#DC143C',
    fontWeight: '500',
  },
});