import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Bell, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: 'profile' | 'notification' | 'none';
  onRightIconPress?: () => void;
}

export default function Header({
  title,
  showBack = false,
  onBack,
  rightIcon = 'profile',
  onRightIconPress,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleRightIconPress = () => {
    if (onRightIconPress) {
      onRightIconPress();
    } else if (rightIcon === 'profile') {
      router.push('/profile');
    } else if (rightIcon === 'notification') {
      router.push('/notifications');
    }
  };

  return (
    <LinearGradient
      colors={['#DC143C', '#8B0000']}
      style={[
        styles.header,
        { paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + 8 },
      ]}
    >
      <View style={styles.headerContent}>
        {showBack ? (
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ChevronLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <Text style={styles.title}>{title}</Text>

        {rightIcon !== 'none' ? (
          <TouchableOpacity style={styles.rightIcon} onPress={handleRightIconPress}>
            {rightIcon === 'profile' ? (
              <User color="#FFFFFF" size={24} />
            ) : (
              <Bell color="#FFFFFF" size={24} />
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
  },
});