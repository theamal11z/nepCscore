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
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  LogOut,
  ChevronRight,
  Shield,
  CreditCard,
  HelpCircle,
  MessageSquare,
  Clock,
  Globe,
  Share2,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Types
interface OrganizerProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  organization: string;
  phoneNumber: string;
  joinedDate: string;
  subscription: {
    plan: 'free' | 'premium' | 'professional';
    expiryDate: string;
    features: string[];
  };
  preferences: {
    notifications: {
      matchReminders: boolean;
      playerUpdates: boolean;
      resultAlerts: boolean;
      systemAnnouncements: boolean;
    };
    appearance: {
      darkMode: boolean;
      language: string;
      timeZone: string;
    };
    privacy: {
      showEmail: boolean;
      showPhone: boolean;
      publicProfile: boolean;
    };
  };
}

// Mock data
const mockOrganizerProfile: OrganizerProfile = {
  id: '1',
  name: 'Rajesh Hamal',
  email: 'rajesh.hamal@example.com',
  avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  role: 'Tournament Organizer',
  organization: 'Nepal Cricket Association',
  phoneNumber: '+977 9841234567',
  joinedDate: 'February 2023',
  subscription: {
    plan: 'premium',
    expiryDate: '2025-12-31',
    features: [
      'Unlimited matches',
      'Advanced statistics',
      'Live scoring',
      'Team management',
      'Player profiles',
      'Export data',
    ],
  },
  preferences: {
    notifications: {
      matchReminders: true,
      playerUpdates: true,
      resultAlerts: true,
      systemAnnouncements: false,
    },
    appearance: {
      darkMode: false,
      language: 'English',
      timeZone: 'Asia/Kathmandu',
    },
    privacy: {
      showEmail: true,
      showPhone: false,
      publicProfile: true,
    },
  },
};

export default function SettingsScreen() {
  const [profile, setProfile] = useState<OrganizerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Simulate API call
    const fetchProfile = () => {
      setLoading(true);
      setTimeout(() => {
        setProfile(mockOrganizerProfile);
        setLoading(false);
      }, 500);
    };

    fetchProfile();
  }, []);

  const toggleNotificationPreference = (key: keyof OrganizerProfile['preferences']['notifications']) => {
    if (profile) {
      setProfile({
        ...profile,
        preferences: {
          ...profile.preferences,
          notifications: {
            ...profile.preferences.notifications,
            [key]: !profile.preferences.notifications[key],
          },
        },
      });
    }
  };

  const toggleDarkMode = () => {
    if (profile) {
      setProfile({
        ...profile,
        preferences: {
          ...profile.preferences,
          appearance: {
            ...profile.preferences.appearance,
            darkMode: !profile.preferences.appearance.darkMode,
          },
        },
      });
    }
  };

  const togglePrivacySetting = (key: keyof OrganizerProfile['preferences']['privacy']) => {
    if (profile) {
      setProfile({
        ...profile,
        preferences: {
          ...profile.preferences,
          privacy: {
            ...profile.preferences.privacy,
            [key]: !profile.preferences.privacy[key],
          },
        },
      });
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
            // Handle logout logic here
            router.replace('/login');
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      [
        { text: 'English', onPress: () => updateLanguage('English') },
        { text: 'नेपाली', onPress: () => updateLanguage('नेपाली') },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const updateLanguage = (language: string) => {
    if (profile) {
      setProfile({
        ...profile,
        preferences: {
          ...profile.preferences,
          appearance: {
            ...profile.preferences.appearance,
            language,
          },
        },
      });
    }
  };

  const handleTimeZoneChange = () => {
    Alert.alert(
      'Select Time Zone',
      'Choose your preferred time zone',
      [
        { text: 'Asia/Kathmandu', onPress: () => updateTimeZone('Asia/Kathmandu') },
        { text: 'UTC', onPress: () => updateTimeZone('UTC') },
        { text: 'Asia/Kolkata', onPress: () => updateTimeZone('Asia/Kolkata') },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const updateTimeZone = (timeZone: string) => {
    if (profile) {
      setProfile({
        ...profile,
        preferences: {
          ...profile.preferences,
          appearance: {
            ...profile.preferences.appearance,
            timeZone,
          },
        },
      });
    }
  };

  const handleUpgradeSubscription = () => {
    router.push('/subscription');
  };

  const navigateToEditProfile = () => {
    router.push('/edit-profile');
  };

  if (loading || !profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading settings...</Text>
      </View>
    );
  }

  const isPremium = profile.subscription.plan !== 'free';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#DC143C', '#8B0000']}
        style={[styles.header, { paddingTop: insets.top > 0 ? insets.top : 20 }]}
      >
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.profileHeader}>
          <Image source={{ uri: profile.avatar }} style={styles.profileAvatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileRole}>{profile.role}</Text>
            <Text style={styles.profileOrg}>{profile.organization}</Text>
          </View>
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={navigateToEditProfile}
          >
            <Text style={styles.editProfileText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Subscription Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color="#DC143C" />
            <Text style={styles.sectionTitle}>Subscription</Text>
          </View>
          
          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionHeader}>
              <View>
                <Text style={styles.subscriptionPlan}>{profile.subscription.plan.charAt(0).toUpperCase() + profile.subscription.plan.slice(1)} Plan</Text>
                <Text style={styles.subscriptionExpiry}>Expires on {new Date(profile.subscription.expiryDate).toLocaleDateString()}</Text>
              </View>
              
              {isPremium ? (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumText}>PREMIUM</Text>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.upgradeButton}
                  onPress={handleUpgradeSubscription}
                >
                  <Text style={styles.upgradeButtonText}>Upgrade</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.featuresList}>
              {profile.subscription.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity style={styles.manageSubscriptionButton}>
              <Text style={styles.manageSubscriptionText}>Manage Subscription</Text>
              <ChevronRight size={16} color="#DC143C" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Notification Preferences */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color="#DC143C" />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>
          
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Match Reminders</Text>
              <Switch
                value={profile.preferences.notifications.matchReminders}
                onValueChange={() => toggleNotificationPreference('matchReminders')}
                trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Player Updates</Text>
              <Switch
                value={profile.preferences.notifications.playerUpdates}
                onValueChange={() => toggleNotificationPreference('playerUpdates')}
                trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Result Alerts</Text>
              <Switch
                value={profile.preferences.notifications.resultAlerts}
                onValueChange={() => toggleNotificationPreference('resultAlerts')}
                trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>System Announcements</Text>
              <Switch
                value={profile.preferences.notifications.systemAnnouncements}
                onValueChange={() => toggleNotificationPreference('systemAnnouncements')}
                trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>
        
        {/* Appearance Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SettingsIcon size={20} color="#DC143C" />
            <Text style={styles.sectionTitle}>Appearance</Text>
          </View>
          
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingLabelContainer}>
                {profile.preferences.appearance.darkMode ? (
                  <Moon size={18} color="#333" style={{ marginRight: 8 }} />
                ) : (
                  <Sun size={18} color="#333" style={{ marginRight: 8 }} />
                )}
                <Text style={styles.settingLabel}>Dark Mode</Text>
              </View>
              <Switch
                value={profile.preferences.appearance.darkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <TouchableOpacity 
              style={styles.settingItemWithArrow}
              onPress={handleLanguageChange}
            >
              <View style={styles.settingLabelContainer}>
                <Globe size={18} color="#333" style={{ marginRight: 8 }} />
                <Text style={styles.settingLabel}>Language</Text>
              </View>
              <View style={styles.settingValueContainer}>
                <Text style={styles.settingValue}>{profile.preferences.appearance.language}</Text>
                <ChevronRight size={18} color="#777" />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItemWithArrow}
              onPress={handleTimeZoneChange}
            >
              <View style={styles.settingLabelContainer}>
                <Clock size={18} color="#333" style={{ marginRight: 8 }} />
                <Text style={styles.settingLabel}>Time Zone</Text>
              </View>
              <View style={styles.settingValueContainer}>
                <Text style={styles.settingValue}>{profile.preferences.appearance.timeZone}</Text>
                <ChevronRight size={18} color="#777" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Privacy Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color="#DC143C" />
            <Text style={styles.sectionTitle}>Privacy</Text>
          </View>
          
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Show Email to Public</Text>
              <Switch
                value={profile.preferences.privacy.showEmail}
                onValueChange={() => togglePrivacySetting('showEmail')}
                trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Show Phone Number</Text>
              <Switch
                value={profile.preferences.privacy.showPhone}
                onValueChange={() => togglePrivacySetting('showPhone')}
                trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Public Profile</Text>
              <Switch
                value={profile.preferences.privacy.publicProfile}
                onValueChange={() => togglePrivacySetting('publicProfile')}
                trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>
        
        {/* Help & Support */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <HelpCircle size={20} color="#DC143C" />
            <Text style={styles.sectionTitle}>Help & Support</Text>
          </View>
          
          <View style={styles.settingsList}>
            <TouchableOpacity style={styles.settingItemWithArrow}>
              <Text style={styles.settingLabel}>Contact Support</Text>
              <ChevronRight size={18} color="#777" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItemWithArrow}>
              <Text style={styles.settingLabel}>FAQs</Text>
              <ChevronRight size={18} color="#777" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItemWithArrow}>
              <Text style={styles.settingLabel}>Organizer Guide</Text>
              <ChevronRight size={18} color="#777" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItemWithArrow}>
              <Text style={styles.settingLabel}>Terms of Service</Text>
              <ChevronRight size={18} color="#777" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItemWithArrow}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
              <ChevronRight size={18} color="#777" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* About & Share */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MessageSquare size={20} color="#DC143C" />
            <Text style={styles.sectionTitle}>About & Share</Text>
          </View>
          
          <View style={styles.settingsList}>
            <TouchableOpacity style={styles.settingItemWithArrow}>
              <Text style={styles.settingLabel}>About nepCscore</Text>
              <ChevronRight size={18} color="#777" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItemWithArrow}>
              <View style={styles.settingLabelContainer}>
                <Share2 size={18} color="#333" style={{ marginRight: 8 }} />
                <Text style={styles.settingLabel}>Share App</Text>
              </View>
              <ChevronRight size={18} color="#777" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItemWithArrow}>
              <Text style={styles.settingLabel}>Rate App</Text>
              <ChevronRight size={18} color="#777" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
        
        {/* App Version */}
        <Text style={styles.versionText}>nepCscore v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  profileOrg: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  editProfileButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
  },
  editProfileText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
    marginLeft: 8,
  },
  subscriptionCard: {
    padding: 16,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subscriptionPlan: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 4,
  },
  subscriptionExpiry: {
    fontSize: 14,
    color: '#777',
  },
  premiumBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#121212',
  },
  upgradeButton: {
    backgroundColor: '#DC143C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  upgradeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  featuresList: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC143C',
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#555',
  },
  manageSubscriptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  manageSubscriptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#DC143C',
    marginRight: 4,
  },
  settingsList: {
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingItemWithArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 15,
    color: '#333',
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#777',
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC143C',
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: 24,
  },
});
