import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { 
  User, 
  Settings, 
  Bell, 
  Star, 
  Users, 
  LogOut, 
  ChevronRight, 
  Edit2, 
  Shield, 
  Moon,
  Sun,
  Info,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// Mock data for fan profile
interface FollowedTeam {
  id: string;
  name: string;
  logo: string;
}

interface FollowedPlayer {
  id: string;
  name: string;
  avatar: string;
  teamName: string;
}

interface FanProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  bio: string;
  joinedDate: string;
  followedTeams: FollowedTeam[];
  followedPlayers: FollowedPlayer[];
  notificationPreferences: {
    matchUpdates: boolean;
    teamNews: boolean;
    playerNews: boolean;
    scoreAlerts: boolean;
  };
  appPreferences: {
    darkMode: boolean;
    dataUsage: 'low' | 'medium' | 'high';
    language: string;
  };
}

// Mock data function
const getFanProfile = (): FanProfile => {
  return {
    id: '1',
    name: 'Anil Sharma',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    email: 'anil.sharma@example.com',
    bio: 'Cricket enthusiast from Kathmandu. Love watching T20 matches and following local cricket tournaments.',
    joinedDate: 'January 2023',
    followedTeams: [
      {
        id: '1',
        name: 'Kathmandu Kings',
        logo: 'https://via.placeholder.com/60',
      },
      {
        id: '2',
        name: 'Pokhara Rhinos',
        logo: 'https://via.placeholder.com/60',
      },
      {
        id: '3',
        name: 'Biratnagar Warriors',
        logo: 'https://via.placeholder.com/60',
      },
    ],
    followedPlayers: [
      {
        id: '1',
        name: 'Sandeep Lamichhane',
        avatar: 'https://via.placeholder.com/60',
        teamName: 'Kathmandu Kings',
      },
      {
        id: '2',
        name: 'Dipendra Singh Airee',
        avatar: 'https://via.placeholder.com/60',
        teamName: 'Pokhara Rhinos',
      },
      {
        id: '3',
        name: 'Sompal Kami',
        avatar: 'https://via.placeholder.com/60',
        teamName: 'Biratnagar Warriors',
      },
    ],
    notificationPreferences: {
      matchUpdates: true,
      teamNews: true,
      playerNews: true,
      scoreAlerts: true,
    },
    appPreferences: {
      darkMode: false,
      dataUsage: 'medium',
      language: 'English',
    },
  };
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState<FanProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('profile'); // profile, teams, players, settings
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Simulate fetching profile data
    const loadProfile = () => {
      try {
        const profileData = getFanProfile();
        setProfile(profileData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load profile data:', error);
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

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
            router.replace('/');
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen or show modal
    Alert.alert('Edit Profile', 'Edit profile functionality will be implemented here');
  };

  const toggleNotificationPreference = (key: keyof FanProfile['notificationPreferences']) => {
    if (profile) {
      setProfile({
        ...profile,
        notificationPreferences: {
          ...profile.notificationPreferences,
          [key]: !profile.notificationPreferences[key],
        },
      });
    }
  };

  const toggleDarkMode = () => {
    if (profile) {
      setProfile({
        ...profile,
        appPreferences: {
          ...profile.appPreferences,
          darkMode: !profile.appPreferences.darkMode,
        },
      });
    }
  };

  const handleDataUsageChange = (value: 'low' | 'medium' | 'high') => {
    if (profile) {
      setProfile({
        ...profile,
        appPreferences: {
          ...profile.appPreferences,
          dataUsage: value,
        },
      });
    }
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Change Language',
      'Select your preferred language',
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
        appPreferences: {
          ...profile.appPreferences,
          language,
        },
      });
    }
  };

  const navigateToTeam = (teamId: string) => {
    router.push(`/team/${teamId}`);
  };

  const navigateToPlayer = (playerId: string) => {
    router.push(`/player/${playerId}`);
  };

  if (loading || !profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header with profile info */}
      <LinearGradient
        colors={['#DC143C', '#8B0000']}
        style={[
          styles.header,
          { paddingTop: insets.top > 0 ? insets.top : 20 }
        ]}
      >
        <Text style={styles.headerTitle}>Profile</Text>
        
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: profile.avatar }} 
            style={styles.profileAvatar} 
          />
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
            <Text style={styles.profileJoinDate}>Member since {profile.joinedDate}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Edit2 size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {/* Navigation tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeSection === 'profile' && styles.activeTab]}
            onPress={() => setActiveSection('profile')}
          >
            <User size={20} color={activeSection === 'profile' ? '#DC143C' : '#777'} />
            <Text style={[styles.tabText, activeSection === 'profile' && styles.activeTabText]}>
              Profile
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeSection === 'teams' && styles.activeTab]}
            onPress={() => setActiveSection('teams')}
          >
            <Users size={20} color={activeSection === 'teams' ? '#DC143C' : '#777'} />
            <Text style={[styles.tabText, activeSection === 'teams' && styles.activeTabText]}>
              Teams
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeSection === 'players' && styles.activeTab]}
            onPress={() => setActiveSection('players')}
          >
            <Star size={20} color={activeSection === 'players' ? '#DC143C' : '#777'} />
            <Text style={[styles.tabText, activeSection === 'players' && styles.activeTabText]}>
              Players
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeSection === 'settings' && styles.activeTab]}
            onPress={() => setActiveSection('settings')}
          >
            <Settings size={20} color={activeSection === 'settings' ? '#DC143C' : '#777'} />
            <Text style={[styles.tabText, activeSection === 'settings' && styles.activeTabText]}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        {/* Profile Tab Content */}
        {activeSection === 'profile' && (
          <View style={styles.sectionContainer}>
            <View style={styles.bioSection}>
              <Text style={styles.sectionTitle}>About Me</Text>
              <Text style={styles.bioText}>{profile.bio}</Text>
            </View>
            
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>My Stats</Text>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{profile.followedTeams.length}</Text>
                  <Text style={styles.statLabel}>Teams</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{profile.followedPlayers.length}</Text>
                  <Text style={styles.statLabel}>Players</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>12</Text>
                  <Text style={styles.statLabel}>Matches</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>45</Text>
                  <Text style={styles.statLabel}>Comments</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <LogOut size={20} color="#DC143C" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Teams Tab Content */}
        {activeSection === 'teams' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Teams You Follow</Text>
            
            {profile.followedTeams.length > 0 ? (
              <View>
                {profile.followedTeams.map((team) => (
                  <TouchableOpacity 
                    key={team.id}
                    style={styles.followedItemCard}
                    onPress={() => navigateToTeam(team.id)}
                  >
                    <Image source={{ uri: team.logo }} style={styles.followedItemLogo} />
                    <Text style={styles.followedItemName}>{team.name}</Text>
                    <ChevronRight size={20} color="#777" />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>You don't follow any teams yet</Text>
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => router.push('/teams')}
                >
                  <Text style={styles.emptyStateButtonText}>Explore Teams</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        
        {/* Players Tab Content */}
        {activeSection === 'players' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Players You Follow</Text>
            
            {profile.followedPlayers.length > 0 ? (
              <View>
                {profile.followedPlayers.map((player) => (
                  <TouchableOpacity 
                    key={player.id}
                    style={styles.followedItemCard}
                    onPress={() => navigateToPlayer(player.id)}
                  >
                    <Image source={{ uri: player.avatar }} style={styles.followedItemLogo} />
                    <View style={styles.followedPlayerInfo}>
                      <Text style={styles.followedItemName}>{player.name}</Text>
                      <Text style={styles.followedPlayerTeam}>{player.teamName}</Text>
                    </View>
                    <ChevronRight size={20} color="#777" />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>You don't follow any players yet</Text>
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => router.push('/players')}
                >
                  <Text style={styles.emptyStateButtonText}>Explore Players</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        
        {/* Settings Tab Content */}
        {activeSection === 'settings' && (
          <View style={styles.sectionContainer}>
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>
                <Bell size={18} color="#DC143C" style={{ marginRight: 8 }} />
                Notification Preferences
              </Text>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Match Updates</Text>
                <Switch
                  value={profile.notificationPreferences.matchUpdates}
                  onValueChange={() => toggleNotificationPreference('matchUpdates')}
                  trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Team News</Text>
                <Switch
                  value={profile.notificationPreferences.teamNews}
                  onValueChange={() => toggleNotificationPreference('teamNews')}
                  trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Player News</Text>
                <Switch
                  value={profile.notificationPreferences.playerNews}
                  onValueChange={() => toggleNotificationPreference('playerNews')}
                  trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Score Alerts</Text>
                <Switch
                  value={profile.notificationPreferences.scoreAlerts}
                  onValueChange={() => toggleNotificationPreference('scoreAlerts')}
                  trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
            
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>
                <Settings size={18} color="#DC143C" style={{ marginRight: 8 }} />
                App Preferences
              </Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingLabelContainer}>
                  {profile.appPreferences.darkMode ? (
                    <Moon size={18} color="#333" style={{ marginRight: 8 }} />
                  ) : (
                    <Sun size={18} color="#333" style={{ marginRight: 8 }} />
                  )}
                  <Text style={styles.settingLabel}>Dark Mode</Text>
                </View>
                <Switch
                  value={profile.appPreferences.darkMode}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              <TouchableOpacity style={styles.settingItemWithArrow}>
                <View style={styles.settingLabelContainer}>
                  <Info size={18} color="#333" style={{ marginRight: 8 }} />
                  <Text style={styles.settingLabel}>Data Usage</Text>
                </View>
                <View style={styles.settingValueContainer}>
                  <Text style={styles.settingValue}>{profile.appPreferences.dataUsage}</Text>
                  <ChevronRight size={18} color="#777" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.settingItemWithArrow}
                onPress={handleLanguageChange}
              >
                <View style={styles.settingLabelContainer}>
                  <Text style={styles.settingLabel}>Language</Text>
                </View>
                <View style={styles.settingValueContainer}>
                  <Text style={styles.settingValue}>{profile.appPreferences.language}</Text>
                  <ChevronRight size={18} color="#777" />
                </View>
              </TouchableOpacity>
            </View>
            
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>
                <Shield size={18} color="#DC143C" style={{ marginRight: 8 }} />
                Account
              </Text>
              
              <TouchableOpacity style={styles.settingItemWithArrow}>
                <Text style={styles.settingLabel}>Change Password</Text>
                <ChevronRight size={18} color="#777" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingItemWithArrow}>
                <Text style={styles.settingLabel}>Privacy Policy</Text>
                <ChevronRight size={18} color="#777" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingItemWithArrow}>
                <Text style={styles.settingLabel}>Terms of Service</Text>
                <ChevronRight size={18} color="#777" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.dangerButton}
                onPress={handleLogout}
              >
                <LogOut size={18} color="#DC143C" style={{ marginRight: 8 }} />
                <Text style={styles.dangerButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    paddingBottom: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  profileJoinDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#DC143C',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#777',
  },
  activeTabText: {
    color: '#DC143C',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sectionContainer: {
    padding: 16,
  },
  bioSection: {
    marginBottom: 24,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC143C',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#DC143C',
    marginLeft: 8,
  },
  followedItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  followedItemLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  followedItemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#121212',
  },
  followedPlayerInfo: {
    flex: 1,
  },
  followedPlayerTeam: {
    fontSize: 12,
    color: '#777',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#777',
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#DC143C',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  settingsSection: {
    marginBottom: 24,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  settingItemWithArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 14,
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
    textTransform: 'capitalize',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 12,
  },
  dangerButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#DC143C',
  },
});
