import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

// Import icons individually
import { User } from 'lucide-react-native';
import { Users } from 'lucide-react-native';
import { Trophy } from 'lucide-react-native';
import { Calendar } from 'lucide-react-native';
import { Settings } from 'lucide-react-native';
import { Layers } from 'lucide-react-native';
import { Bell } from 'lucide-react-native';
import { Activity } from 'lucide-react-native';
import { PieChart } from 'lucide-react-native';
import { ShieldAlert } from 'lucide-react-native';
import { Plus } from 'lucide-react-native';
import { MapPin } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';

// Interfaces for type safety
interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  teams: number;
  matches: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  logo: string;
}

interface AdminStats {
  totalOrganizers: number;
  totalPlayers: number;
  totalTeams: number;
  totalTournaments: number;
  totalMatches: number;
  activeUsers: number;
  pendingRequests: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
}

interface DashboardData {
  adminName: string;
  adminAvatar: string;
  stats: AdminStats;
  activeTournaments: Tournament[];
  upcomingTournaments: Tournament[];
  recentNotifications: Notification[];
}

// Mock API function to fetch admin data
const getAdminData = async (): Promise<DashboardData> => {
  // In a real app, this would be an API call
  return {
    adminName: 'Rajesh Sharma',
    adminAvatar: 'https://via.placeholder.com/100',
    stats: {
      totalOrganizers: 25,
      totalPlayers: 350,
      totalTeams: 42,
      totalTournaments: 8,
      totalMatches: 120,
      activeUsers: 280,
      pendingRequests: 12,
    },
    activeTournaments: [
      {
        id: 't1',
        name: 'Nepal Premier League 2025',
        startDate: '2025-05-15',
        endDate: '2025-06-20',
        teams: 8,
        matches: 31,
        status: 'ongoing',
        logo: 'https://via.placeholder.com/60',
      },
      {
        id: 't2',
        name: 'Everest T20 Cup',
        startDate: '2025-05-10',
        endDate: '2025-05-30',
        teams: 6,
        matches: 16,
        status: 'ongoing',
        logo: 'https://via.placeholder.com/60',
      },
    ],
    upcomingTournaments: [
      {
        id: 't3',
        name: 'Kathmandu Mayor Cup',
        startDate: '2025-07-05',
        endDate: '2025-07-25',
        teams: 10,
        matches: 25,
        status: 'upcoming',
        logo: 'https://via.placeholder.com/60',
      },
    ],
    recentNotifications: [
      {
        id: 'n1',
        title: 'New Organizer Registration',
        message: 'Binod Thapa has registered as an organizer and is awaiting approval.',
        time: '2025-05-25T10:30:00',
        isRead: false,
        type: 'info',
      },
      {
        id: 'n2',
        title: 'Tournament Completion',
        message: 'Pokhara Premier League has been successfully completed.',
        time: '2025-05-24T15:45:00',
        isRead: true,
        type: 'success',
      },
      {
        id: 'n3',
        title: 'System Warning',
        message: 'Storage usage is at 85% capacity. Consider upgrading your plan.',
        time: '2025-05-23T09:15:00',
        isRead: false,
        type: 'warning',
      },
    ],
  };
};

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminData();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Bell size={20} color="#1E90FF" />;
      case 'warning':
        return <ShieldAlert size={20} color="#FFA500" />;
      case 'error':
        return <ShieldAlert size={20} color="#DC143C" />;
      case 'success':
        return <Activity size={20} color="#32CD32" />;
      default:
        return <Bell size={20} color="#1E90FF" />;
    }
  };

  if (isLoading || !dashboardData) {
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
          <View style={styles.adminInfo}>
            <Image source={{ uri: dashboardData.adminAvatar }} style={styles.adminAvatar} />
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.adminName}>{dashboardData.adminName}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.settingsButton} 
            onPress={() => router.push('/(admin)/settings')}
          >
            <Settings size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#DC143C']} />
        }
      >
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Users size={24} color="#DC143C" />
              <Text style={styles.statValue}>{dashboardData.stats.totalPlayers}</Text>
              <Text style={styles.statLabel}>Players</Text>
            </View>
            <View style={styles.statCard}>
              <User size={24} color="#1E90FF" />
              <Text style={styles.statValue}>{dashboardData.stats.totalOrganizers}</Text>
              <Text style={styles.statLabel}>Organizers</Text>
            </View>
            <View style={styles.statCard}>
              <Trophy size={24} color="#32CD32" />
              <Text style={styles.statValue}>{dashboardData.stats.totalTeams}</Text>
              <Text style={styles.statLabel}>Teams</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Layers size={24} color="#FFA500" />
              <Text style={styles.statValue}>{dashboardData.stats.totalTournaments}</Text>
              <Text style={styles.statLabel}>Tournaments</Text>
            </View>
            <View style={styles.statCard}>
              <Calendar size={24} color="#8A2BE2" />
              <Text style={styles.statValue}>{dashboardData.stats.totalMatches}</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statCard}>
              <Activity size={24} color="#20B2AA" />
              <Text style={styles.statValue}>{dashboardData.stats.activeUsers}</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(admin)/requests')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FFE5E5' }]}>
              <Bell size={24} color="#DC143C" />
              {dashboardData.stats.pendingRequests > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{dashboardData.stats.pendingRequests}</Text>
                </View>
              )}
            </View>
            <Text style={styles.actionText}>Pending Requests</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(admin)/users')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E6F7FF' }]}>
              <Users size={24} color="#1E90FF" />
            </View>
            <Text style={styles.actionText}>Manage Users</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(admin)/tournaments')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E6FFFA' }]}>
              <Trophy size={24} color="#20B2AA" />
            </View>
            <Text style={styles.actionText}>Tournaments</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(admin)/analytics')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F0E6FF' }]}>
              <PieChart size={24} color="#8A2BE2" />
            </View>
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Tournaments</Text>
            <TouchableOpacity onPress={() => router.push('/(admin)/tournaments')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {dashboardData.activeTournaments.length === 0 ? (
            <Text style={styles.emptyStateText}>No active tournaments</Text>
          ) : (
            dashboardData.activeTournaments.map((tournament) => (
              <TouchableOpacity
                key={tournament.id}
                style={styles.tournamentCard}
                onPress={() => router.push(`/(admin)/tournament/${tournament.id}`)}
              >
                <Image source={{ uri: tournament.logo }} style={styles.tournamentLogo} />
                <View style={styles.tournamentInfo}>
                  <Text style={styles.tournamentName}>{tournament.name}</Text>
                  <View style={styles.tournamentDetails}>
                    <View style={styles.tournamentDetail}>
                      <Calendar size={14} color="#666" />
                      <Text style={styles.tournamentDetailText}>
                        {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.tournamentDetail}>
                      <Trophy size={14} color="#666" />
                      <Text style={styles.tournamentDetailText}>
                        {tournament.teams} Teams • {tournament.matches} Matches
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.tournamentStatus}>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                      {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#666" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Notifications</Text>
            <TouchableOpacity onPress={() => router.push('/(admin)/notifications')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {dashboardData.recentNotifications.length === 0 ? (
            <Text style={styles.emptyStateText}>No recent notifications</Text>
          ) : (
            dashboardData.recentNotifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[styles.notificationCard, !notification.isRead && styles.unreadNotification]}
                onPress={() => router.push(`/(admin)/notification/${notification.id}`)}
              >
                <View style={styles.notificationIcon}>
                  {getNotificationIcon(notification.type)}
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage} numberOfLines={2}>
                    {notification.message}
                  </Text>
                  <Text style={styles.notificationTime}>
                    {new Date(notification.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                {!notification.isRead && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Tournaments</Text>
            <TouchableOpacity onPress={() => router.push('/(admin)/tournaments?filter=upcoming')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {dashboardData.upcomingTournaments.length === 0 ? (
            <Text style={styles.emptyStateText}>No upcoming tournaments</Text>
          ) : (
            dashboardData.upcomingTournaments.map((tournament) => (
              <TouchableOpacity
                key={tournament.id}
                style={styles.tournamentCard}
                onPress={() => router.push(`/(admin)/tournament/${tournament.id}`)}
              >
                <Image source={{ uri: tournament.logo }} style={styles.tournamentLogo} />
                <View style={styles.tournamentInfo}>
                  <Text style={styles.tournamentName}>{tournament.name}</Text>
                  <View style={styles.tournamentDetails}>
                    <View style={styles.tournamentDetail}>
                      <Calendar size={14} color="#666" />
                      <Text style={styles.tournamentDetailText}>
                        Starts {new Date(tournament.startDate).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.tournamentDetail}>
                      <Trophy size={14} color="#666" />
                      <Text style={styles.tournamentDetailText}>
                        {tournament.teams} Teams Registered
                      </Text>
                    </View>
                  </View>
                </View>
                <ChevronRight size={20} color="#666" />
              </TouchableOpacity>
            ))
          )}

          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/(admin)/tournament/create')}
          >
            <Plus size={20} color="#fff" />
            <Text style={styles.addButtonText}>Create Tournament</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonActive]} 
        >
          <User size={24} color="#DC143C" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Dashboard</Text>
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
          style={styles.navButton} 
          onPress={() => router.push('/(admin)/settings')}
        >
          <Settings size={24} color="#666" />
          <Text style={styles.navLabel}>Settings</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  adminInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  welcomeText: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 14,
  },
  adminName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#DC143C',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#DC143C',
    fontSize: 14,
  },
  tournamentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tournamentLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  tournamentDetails: {},
  tournamentDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  tournamentDetailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  tournamentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E6F7FF',
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#1E90FF',
  },
  emptyStateText: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'relative',
  },
  unreadNotification: {
    backgroundColor: '#FAFAFA',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 10,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC143C',
    position: 'absolute',
    right: 8,
    top: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC143C',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
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
