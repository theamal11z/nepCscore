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
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';

// Import icons individually
import { User } from 'lucide-react-native';
import { Users } from 'lucide-react-native';
import { Trophy } from 'lucide-react-native';
import { Settings as SettingsIcon } from 'lucide-react-native';
import { Bell } from 'lucide-react-native';
import { Shield } from 'lucide-react-native';
import { Lock } from 'lucide-react-native';
import { Globe } from 'lucide-react-native';
import { Server } from 'lucide-react-native';
import { Database } from 'lucide-react-native';
import { Mail } from 'lucide-react-native';
import { HelpCircle } from 'lucide-react-native';
import { Info } from 'lucide-react-native';
import { LogOut } from 'lucide-react-native';
import { Camera } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';

interface AdminSettings {
  notifications: {
    userRegistrations: boolean;
    tournamentUpdates: boolean;
    systemAlerts: boolean;
    emailNotifications: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    dataEncryption: boolean;
    autoLogout: boolean;
    logAllActivity: boolean;
  };
  system: {
    developerMode: boolean;
    allowBetaFeatures: boolean;
    autoBackup: boolean;
    maintenanceMode: boolean;
  };
  appearance: {
    darkMode: boolean;
    compactView: boolean;
  };
}

interface AdminProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  lastLogin: string;
}

// Mock API function to fetch admin profile
const getAdminProfile = async (): Promise<AdminProfile> => {
  // In a real app, this would be an API call
  return {
    name: 'Rajesh Sharma',
    email: 'admin@nepcscore.com',
    phone: '+977 98XXXXXXXX',
    avatar: 'https://via.placeholder.com/100',
    role: 'Super Admin',
    lastLogin: '2025-05-25T10:15:00',
  };
};

// Mock API function to fetch admin settings
const getAdminSettings = async (): Promise<AdminSettings> => {
  // In a real app, this would be an API call
  return {
    notifications: {
      userRegistrations: true,
      tournamentUpdates: true,
      systemAlerts: true,
      emailNotifications: false,
    },
    security: {
      twoFactorAuth: true,
      dataEncryption: true,
      autoLogout: false,
      logAllActivity: true,
    },
    system: {
      developerMode: false,
      allowBetaFeatures: true,
      autoBackup: true,
      maintenanceMode: false,
    },
    appearance: {
      darkMode: false,
      compactView: false,
    },
  };
};

export default function AdminSettings() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPhone, setEditedPhone] = useState('');

  useEffect(() => {
    loadProfileAndSettings();
  }, []);

  const loadProfileAndSettings = async () => {
    setIsLoading(true);
    try {
      const [profileData, settingsData] = await Promise.all([
        getAdminProfile(),
        getAdminSettings(),
      ]);
      setProfile(profileData);
      setSettings(settingsData);
      setEditedName(profileData.name);
      setEditedEmail(profileData.email);
      setEditedPhone(profileData.phone);
    } catch (error) {
      console.error('Failed to load profile or settings:', error);
      Alert.alert('Error', 'Failed to load profile or settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSetting = (
    category: keyof AdminSettings,
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

  const handleSaveProfile = () => {
    if (!profile) return;
    
    // Validate inputs
    if (!editedName.trim() || !editedEmail.trim()) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }
    
    // In a real app, this would call an API to update the profile
    setProfile({
      ...profile,
      name: editedName,
      email: editedEmail,
      phone: editedPhone,
    });
    
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
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

  const toggleMaintenanceMode = () => {
    if (!settings) return;
    
    Alert.alert(
      settings.system.maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode',
      settings.system.maintenanceMode 
        ? 'Are you sure you want to disable maintenance mode? The app will become accessible to all users.' 
        : 'Are you sure you want to enable maintenance mode? This will make the app inaccessible to non-admin users.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: settings.system.maintenanceMode ? 'Disable' : 'Enable',
          onPress: () => {
            handleToggleSetting('system', 'maintenanceMode', !settings.system.maintenanceMode);
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
      <View style={[styles.header, { backgroundColor: '#DC143C' }]}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {isEditing ? (
          <View style={styles.profileEditCard}>
            <TouchableOpacity style={styles.avatarContainer} onPress={handleChangePhoto}>
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              <View style={styles.editAvatarButton}>
                <Camera size={14} color="#fff" />
              </View>
            </TouchableOpacity>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Enter your name"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={editedEmail}
                onChangeText={setEditedEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                value={editedPhone}
                onChangeText={setEditedPhone}
                placeholder="Enter your phone"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.editButtons}>
              <TouchableOpacity 
                style={[styles.editButton, styles.cancelButton]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.editButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.profileCard}>
            <TouchableOpacity style={styles.avatarContainer} onPress={handleChangePhoto}>
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              <View style={styles.editAvatarButton}>
                <Camera size={14} color="#fff" />
              </View>
            </TouchableOpacity>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileEmail}>{profile.email}</Text>
              <Text style={styles.profileRole}>{profile.role}</Text>
            </View>

            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <Bell size={20} color="#333" />
            <Text style={styles.settingLabel}>User Registrations</Text>
            <Switch
              value={settings.notifications.userRegistrations}
              onValueChange={(value) =>
                handleToggleSetting('notifications', 'userRegistrations', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.notifications.userRegistrations ? '#DC143C' : '#f4f4f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Bell size={20} color="#333" />
            <Text style={styles.settingLabel}>Tournament Updates</Text>
            <Switch
              value={settings.notifications.tournamentUpdates}
              onValueChange={(value) =>
                handleToggleSetting('notifications', 'tournamentUpdates', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.notifications.tournamentUpdates ? '#DC143C' : '#f4f4f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Bell size={20} color="#333" />
            <Text style={styles.settingLabel}>System Alerts</Text>
            <Switch
              value={settings.notifications.systemAlerts}
              onValueChange={(value) =>
                handleToggleSetting('notifications', 'systemAlerts', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.notifications.systemAlerts ? '#DC143C' : '#f4f4f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Mail size={20} color="#333" />
            <Text style={styles.settingLabel}>Email Notifications</Text>
            <Switch
              value={settings.notifications.emailNotifications}
              onValueChange={(value) =>
                handleToggleSetting('notifications', 'emailNotifications', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.notifications.emailNotifications ? '#DC143C' : '#f4f4f4'}
            />
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <View style={styles.settingItem}>
            <Shield size={20} color="#333" />
            <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
            <Switch
              value={settings.security.twoFactorAuth}
              onValueChange={(value) =>
                handleToggleSetting('security', 'twoFactorAuth', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.security.twoFactorAuth ? '#DC143C' : '#f4f4f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Lock size={20} color="#333" />
            <Text style={styles.settingLabel}>Data Encryption</Text>
            <Switch
              value={settings.security.dataEncryption}
              onValueChange={(value) =>
                handleToggleSetting('security', 'dataEncryption', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.security.dataEncryption ? '#DC143C' : '#f4f4f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Lock size={20} color="#333" />
            <Text style={styles.settingLabel}>Auto Logout (30 min)</Text>
            <Switch
              value={settings.security.autoLogout}
              onValueChange={(value) =>
                handleToggleSetting('security', 'autoLogout', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.security.autoLogout ? '#DC143C' : '#f4f4f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Shield size={20} color="#333" />
            <Text style={styles.settingLabel}>Log All Activity</Text>
            <Switch
              value={settings.security.logAllActivity}
              onValueChange={(value) =>
                handleToggleSetting('security', 'logAllActivity', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.security.logAllActivity ? '#DC143C' : '#f4f4f4'}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => router.push('/(admin)/security/change-password')}
          >
            <Lock size={20} color="#333" />
            <Text style={styles.linkButtonText}>Change Password</Text>
            <ChevronRight size={18} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => router.push('/(admin)/security/activity-logs')}
          >
            <Shield size={20} color="#333" />
            <Text style={styles.linkButtonText}>View Activity Logs</Text>
            <ChevronRight size={18} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>System</Text>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => router.push('/(admin)/system/database')}
          >
            <Database size={20} color="#333" />
            <Text style={styles.linkButtonText}>Database Management</Text>
            <ChevronRight size={18} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => router.push('/(admin)/system/backup')}
          >
            <Server size={20} color="#333" />
            <Text style={styles.linkButtonText}>Backup & Restore</Text>
            <ChevronRight size={18} color="#666" />
          </TouchableOpacity>
          
          <View style={styles.settingItem}>
            <Server size={20} color="#333" />
            <Text style={styles.settingLabel}>Developer Mode</Text>
            <Switch
              value={settings.system.developerMode}
              onValueChange={(value) =>
                handleToggleSetting('system', 'developerMode', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.system.developerMode ? '#DC143C' : '#f4f4f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Server size={20} color="#333" />
            <Text style={styles.settingLabel}>Beta Features</Text>
            <Switch
              value={settings.system.allowBetaFeatures}
              onValueChange={(value) =>
                handleToggleSetting('system', 'allowBetaFeatures', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.system.allowBetaFeatures ? '#DC143C' : '#f4f4f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Database size={20} color="#333" />
            <Text style={styles.settingLabel}>Auto Backup</Text>
            <Switch
              value={settings.system.autoBackup}
              onValueChange={(value) =>
                handleToggleSetting('system', 'autoBackup', value)
              }
              trackColor={{ false: '#e0e0e0', true: '#ffccd5' }}
              thumbColor={settings.system.autoBackup ? '#DC143C' : '#f4f4f4'}
            />
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <Globe size={20} color="#333" />
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
            <Globe size={20} color="#333" />
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

        <TouchableOpacity 
          style={[
            styles.actionButton, 
            styles.maintenanceButton, 
            { backgroundColor: settings.system.maintenanceMode ? '#DC143C' : 'transparent' }
          ]}
          onPress={toggleMaintenanceMode}
        >
          <Server size={20} color={settings.system.maintenanceMode ? '#fff' : '#DC143C'} />
          <Text 
            style={[
              styles.maintenanceButtonText, 
              { color: settings.system.maintenanceMode ? '#fff' : '#DC143C' }
            ]}
          >
            {settings.system.maintenanceMode ? 'Disable' : 'Enable'} Maintenance Mode
          </Text>
        </TouchableOpacity>

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
          onPress={() => router.push('/(admin)/')}
        >
          <User size={24} color="#666" />
          <Text style={styles.navLabel}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/(admin)/users')}
        >
          <Users size={24} color="#666" />
          <Text style={styles.navLabel}>Users</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/(admin)/tournaments')}
        >
          <Trophy size={24} color="#666" />
          <Text style={styles.navLabel}>Tournaments</Text>
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
    padding: 24,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  profileEditCard: {
    backgroundColor: '#fff',
    padding: 24,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  profileRole: {
    fontSize: 14,
    color: '#DC143C',
    fontWeight: '500',
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
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#DC143C',
  },
  saveButtonText: {
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
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  linkButtonText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
  },
  maintenanceButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#DC143C',
  },
  maintenanceButtonText: {
    fontWeight: '500',
    marginLeft: 8,
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
