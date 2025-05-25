import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import {
  User,
  BarChart2,
  TrendingUp,
  Settings as SettingsIcon,
  Bell,
  Moon,
  LogOut,
  ChevronRight,
  Shield,
  UserCog,
  Lock,
  Globe,
  HelpCircle,
  Info,
  Camera,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';

interface PlayerSettings {
  notifications: {
    matchReminders: boolean;
    trainingReminders: boolean;
    teamUpdates: boolean;
    appUpdates: boolean;
  };
  appearance: {
    darkMode: boolean;
    compactView: boolean;
  };
  privacy: {
    showStats: boolean;
    showPerformance: boolean;
    allowMessages: boolean;
  };
}

interface PlayerProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  team: {
    name: string;
    logo: string;
  };
}

// Mock API function to fetch player profile
const getPlayerProfile = async (): Promise<PlayerProfile> => {
  // In a real app, this would be an API call
  return {
    name: 'Paras Khadka',
    email: 'paras.khadka@example.com',
    phone: '+977 98XXXXXXXX',
    avatar: 'https://via.placeholder.com/100',
    team: {
      name: 'Kathmandu Kings',
      logo: 'https://via.placeholder.com/60',
    },
  };
};

// Mock API function to fetch player settings
const getPlayerSettings = async (): Promise<PlayerSettings> => {
  // In a real app, this would be an API call
  return {
    notifications: {
      matchReminders: true,
      trainingReminders: true,
      teamUpdates: true,
      appUpdates: false,
    },
    appearance: {
      darkMode: false,
      compactView: false,
    },
    privacy: {
      showStats: true,
      showPerformance: true,
      allowMessages: true,
    },
  };
};

export default function PlayerSettings() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [settings, setSettings] = useState<PlayerSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfileAndSettings();
  }, []);

  const loadProfileAndSettings = async () => {
    setIsLoading(true);
    try {
      const [profileData, settingsData] = await Promise.all([
        getPlayerProfile(),
        getPlayerSettings(),
      ]);
      setProfile(profileData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Failed to load profile or settings:', error);
      Alert.alert('Error', 'Failed to load profile or settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSetting = (
    category: keyof PlayerSettings,
    setting: string,
    value: boolean
  ) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value,
      },
    });
    
    // In a real app, this would save to an API
    console.log(`Setting ${category}.${setting} changed to ${value}`);
  };

  const handleChangePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        // In a real app, this would upload the image to a server
        setProfile(prev => prev ? {...prev, avatar: result.assets[0].uri} : null);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // In a real app, clear auth tokens and navigate to login screen
            router.push('/login');
          },
        },
      ]
    );
  };

  if (isLoading || !profile || !settings) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#DC143C', '#8B0000']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handleChangePhoto}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            <View style={styles.editAvatarButton}>
              <Camera size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <View style={styles.teamInfo}>
              <Image source={{ uri: profile.team.logo }} style={styles.teamLogo} />
              <Text style={styles.teamName}>{profile.team.name}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => router.push('/(player)/profile/edit')}
          >
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/(player)/profile/edit')}
          >
            <UserCog size={20} color="#333" />
            <Text style={styles.settingLabel}>Personal Information</Text>
            <ChevronRight size={18} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/(player)/security')}
          >
            <Lock size={20} color="#333" />
            <Text style={styles.settingLabel}>Security</Text>
            <ChevronRight size={18} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <Bell size={20} color="#333" />
            <Text style={styles.settingLabel}>Match Reminders</Text>
            <Switch
              value={settings.notifications.matchReminders}
              onValueChange={(value) =>
                handleToggleSetting('notifications', 'matchReminders', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.notifications.matchReminders ? '#DC143C' : '#f4f4f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Bell size={20} color="#333" />
            <Text style={styles.settingLabel}>Training Reminders</Text>
            <Switch
              value={settings.notifications.trainingReminders}
              onValueChange={(value) =>
                handleToggleSetting('notifications', 'trainingReminders', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.notifications.trainingReminders ? '#DC143C' : '#f4f4f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Bell size={20} color="#333" />
            <Text style={styles.settingLabel}>Team Updates</Text>
            <Switch
              value={settings.notifications.teamUpdates}
              onValueChange={(value) =>
                handleToggleSetting('notifications', 'teamUpdates', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.notifications.teamUpdates ? '#DC143C' : '#f4f4f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Bell size={20} color="#333" />
            <Text style={styles.settingLabel}>App Updates</Text>
            <Switch
              value={settings.notifications.appUpdates}
              onValueChange={(value) =>
                handleToggleSetting('notifications', 'appUpdates', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.notifications.appUpdates ? '#DC143C' : '#f4f4f4'}
            />
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <Moon size={20} color="#333" />
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={settings.appearance.darkMode}
              onValueChange={(value) =>
                handleToggleSetting('appearance', 'darkMode', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.appearance.darkMode ? '#DC143C' : '#f4f4f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Moon size={20} color="#333" />
            <Text style={styles.settingLabel}>Compact View</Text>
            <Switch
              value={settings.appearance.compactView}
              onValueChange={(value) =>
                handleToggleSetting('appearance', 'compactView', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.appearance.compactView ? '#DC143C' : '#f4f4f4'}
            />
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          <View style={styles.settingItem}>
            <Shield size={20} color="#333" />
            <Text style={styles.settingLabel}>Show Statistics</Text>
            <Switch
              value={settings.privacy.showStats}
              onValueChange={(value) =>
                handleToggleSetting('privacy', 'showStats', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.privacy.showStats ? '#DC143C' : '#f4f4f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Shield size={20} color="#333" />
            <Text style={styles.settingLabel}>Show Performance</Text>
            <Switch
              value={settings.privacy.showPerformance}
              onValueChange={(value) =>
                handleToggleSetting('privacy', 'showPerformance', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.privacy.showPerformance ? '#DC143C' : '#f4f4f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Shield size={20} color="#333" />
            <Text style={styles.settingLabel}>Allow Messages</Text>
            <Switch
              value={settings.privacy.allowMessages}
              onValueChange={(value) =>
                handleToggleSetting('privacy', 'allowMessages', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.privacy.allowMessages ? '#DC143C' : '#f4f4f4'}
            />
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/(player)/help')}
          >
            <HelpCircle size={20} color="#333" />
            <Text style={styles.settingLabel}>Help & Support</Text>
            <ChevronRight size={18} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/(player)/about')}
          >
            <Info size={20} color="#333" />
            <Text style={styles.settingLabel}>About nepCscore</Text>
            <ChevronRight size={18} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#DC143C" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.push('/(player)/')}
        >
          <User size={24} color="#666" />
          <Text style={styles.navLabel}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/(player)/stats')}
        >
          <BarChart2 size={24} color="#666" />
          <Text style={styles.navLabel}>Statistics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/(player)/training')}
        >
          <TrendingUp size={24} color="#666" />
          <Text style={styles.navLabel}>Training</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonActive]}
        >
          <SettingsIcon size={24} color="#DC143C" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#DC143C',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamLogo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  teamName: {
    fontSize: 14,
    color: '#666',
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#DC143C',
  },
  editProfileButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  settingsSection: {
    backgroundColor: '#fff',
    marginBottom: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#666',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DC143C',
  },
  logoutButtonText: {
    color: '#DC143C',
    fontWeight: '500',
    marginLeft: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: 16,
    paddingHorizontal: 8,
    height: 64,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonActive: {
    borderTopWidth: 2,
    borderTopColor: '#DC143C',
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  navLabelActive: {
    color: '#DC143C',
    fontWeight: '500',
  },
});
