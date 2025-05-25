import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import {
  Calendar,
  Clock,
  Award,
  BarChart2,
  User,
  Settings,
  ChevronRight,
  TrendingUp,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

// Interfaces for type safety
interface Match {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  team1: {
    id: string;
    name: string;
    logo: string;
  };
  team2: {
    id: string;
    name: string;
    logo: string;
  };
  isMyTeam: boolean;
}

interface Performance {
  id: string;
  matchId: string;
  matchTitle: string;
  date: string;
  runs?: number;
  wickets?: number;
  overs?: number;
  economy?: number;
  team: {
    name: string;
    logo: string;
  };
  opponent: {
    name: string;
    logo: string;
  };
}

interface PlayerStats {
  batting: {
    matches: number;
    runs: number;
    average: number;
    strikeRate: number;
    highestScore: number;
    fifties: number;
    hundreds: number;
  };
  bowling: {
    wickets: number;
    economy: number;
    bestFigures: string;
    fiveWickets: number;
  };
}

interface DashboardData {
  playerName: string;
  playerAvatar: string;
  teamName: string;
  teamLogo: string;
  role: string;
  upcomingMatches: Match[];
  recentPerformances: Performance[];
  stats: PlayerStats;
  achievements: {
    id: string;
    title: string;
    description: string;
    date: string;
    icon: string;
  }[];
}

// Mock API function to fetch player data
const getPlayerData = async (): Promise<DashboardData> => {
  // In a real app, this would be an API call
  return {
    playerName: 'Paras Khadka',
    playerAvatar: 'https://via.placeholder.com/100',
    teamName: 'Kathmandu Kings',
    teamLogo: 'https://via.placeholder.com/60',
    role: 'All-rounder',
    upcomingMatches: [
      {
        id: 'm1',
        title: 'League Match #5',
        date: '2025-05-28',
        time: '14:00',
        venue: 'Tribhuvan University Ground',
        team1: {
          id: 't1',
          name: 'Kathmandu Kings',
          logo: 'https://via.placeholder.com/60',
        },
        team2: {
          id: 't2',
          name: 'Pokhara Rhinos',
          logo: 'https://via.placeholder.com/60',
        },
        isMyTeam: true,
      },
      {
        id: 'm2',
        title: 'League Match #7',
        date: '2025-06-02',
        time: '10:00',
        venue: 'Kirtipur Cricket Ground',
        team1: {
          id: 't3',
          name: 'Lalitpur Patriots',
          logo: 'https://via.placeholder.com/60',
        },
        team2: {
          id: 't1',
          name: 'Kathmandu Kings',
          logo: 'https://via.placeholder.com/60',
        },
        isMyTeam: true,
      },
    ],
    recentPerformances: [
      {
        id: 'p1',
        matchId: 'm0',
        matchTitle: 'League Match #3',
        date: '2025-05-20',
        runs: 62,
        wickets: 2,
        overs: 4,
        economy: 6.25,
        team: {
          name: 'Kathmandu Kings',
          logo: 'https://via.placeholder.com/60',
        },
        opponent: {
          name: 'Chitwan Tigers',
          logo: 'https://via.placeholder.com/60',
        },
      },
      {
        id: 'p2',
        matchId: 'p2',
        matchTitle: 'League Match #1',
        date: '2025-05-15',
        runs: 34,
        wickets: 0,
        overs: 3,
        economy: 7.33,
        team: {
          name: 'Kathmandu Kings',
          logo: 'https://via.placeholder.com/60',
        },
        opponent: {
          name: 'Bhairahawa Gladiators',
          logo: 'https://via.placeholder.com/60',
        },
      },
    ],
    stats: {
      batting: {
        matches: 45,
        runs: 1250,
        average: 35.5,
        strikeRate: 132.5,
        highestScore: 98,
        fifties: 8,
        hundreds: 0,
      },
      bowling: {
        wickets: 30,
        economy: 7.25,
        bestFigures: '3/25',
        fiveWickets: 0,
      },
    },
    achievements: [
      {
        id: 'a1',
        title: 'Player of the Match',
        description: 'League Match #3 vs Chitwan Tigers',
        date: '2025-05-20',
        icon: '🏆',
      },
      {
        id: 'a2',
        title: 'Half Century',
        description: '62 runs off 45 balls',
        date: '2025-05-20',
        icon: '🏏',
      },
    ],
  };
};

export default function PlayerDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = await getPlayerData();
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
          <View style={styles.profileSection}>
            <Image source={{ uri: dashboardData.playerAvatar }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.playerName}>{dashboardData.playerName}</Text>
              <View style={styles.teamInfo}>
                <Image source={{ uri: dashboardData.teamLogo }} style={styles.teamLogo} />
                <Text style={styles.teamName}>{dashboardData.teamName}</Text>
              </View>
              <Text style={styles.playerRole}>{dashboardData.role}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#DC143C']} />
        }
      >
        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboardData.stats.batting.runs}</Text>
            <Text style={styles.statLabel}>Runs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboardData.stats.bowling.wickets}</Text>
            <Text style={styles.statLabel}>Wickets</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboardData.stats.batting.matches}</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Matches</Text>
            <TouchableOpacity onPress={() => router.push('/(player)/matches')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {dashboardData.upcomingMatches.length === 0 ? (
            <Text style={styles.emptyStateText}>No upcoming matches</Text>
          ) : (
            dashboardData.upcomingMatches.map(match => (
              <TouchableOpacity 
                key={match.id} 
                style={styles.matchCard}
                onPress={() => router.push(`/(player)/match/${match.id}`)}
              >
                <View style={styles.matchHeader}>
                  <Text style={styles.matchTitle}>{match.title}</Text>
                  <Text style={styles.matchVenue}>{match.venue}</Text>
                </View>
                
                <View style={styles.matchTeams}>
                  <View style={styles.teamSection}>
                    <Image source={{ uri: match.team1.logo }} style={styles.matchTeamLogo} />
                    <Text style={styles.teamName} numberOfLines={1}>{match.team1.name}</Text>
                  </View>
                  <Text style={styles.vsText}>vs</Text>
                  <View style={styles.teamSection}>
                    <Image source={{ uri: match.team2.logo }} style={styles.matchTeamLogo} />
                    <Text style={styles.teamName} numberOfLines={1}>{match.team2.name}</Text>
                  </View>
                </View>
                
                <View style={styles.matchFooter}>
                  <View style={styles.matchInfo}>
                    <Calendar size={14} color="#666" />
                    <Text style={styles.matchInfoText}>{new Date(match.date).toLocaleDateString()}</Text>
                  </View>
                  <View style={styles.matchInfo}>
                    <Clock size={14} color="#666" />
                    <Text style={styles.matchInfoText}>{match.time}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Performances</Text>
            <TouchableOpacity onPress={() => router.push('/(player)/performances')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {dashboardData.recentPerformances.length === 0 ? (
            <Text style={styles.emptyStateText}>No recent performances</Text>
          ) : (
            dashboardData.recentPerformances.map(performance => (
              <TouchableOpacity 
                key={performance.id} 
                style={styles.performanceCard}
                onPress={() => router.push(`/(player)/match/${performance.matchId}`)}
              >
                <View style={styles.performanceHeader}>
                  <Text style={styles.performanceTitle}>{performance.matchTitle}</Text>
                  <Text style={styles.performanceDate}>{new Date(performance.date).toLocaleDateString()}</Text>
                </View>
                
                <View style={styles.performanceTeams}>
                  <Image source={{ uri: performance.team.logo }} style={styles.performanceTeamLogo} />
                  <Text style={styles.vsText}>vs</Text>
                  <Image source={{ uri: performance.opponent.logo }} style={styles.performanceTeamLogo} />
                </View>
                
                <View style={styles.performanceStats}>
                  {performance.runs !== undefined && (
                    <View style={styles.performanceStat}>
                      <Text style={styles.performanceStatValue}>{performance.runs}</Text>
                      <Text style={styles.performanceStatLabel}>Runs</Text>
                    </View>
                  )}
                  {performance.wickets !== undefined && (
                    <View style={styles.performanceStat}>
                      <Text style={styles.performanceStatValue}>{performance.wickets}</Text>
                      <Text style={styles.performanceStatLabel}>Wickets</Text>
                    </View>
                  )}
                  {performance.economy !== undefined && (
                    <View style={styles.performanceStat}>
                      <Text style={styles.performanceStatValue}>{performance.economy}</Text>
                      <Text style={styles.performanceStatLabel}>Economy</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Achievements</Text>
          </View>

          {dashboardData.achievements.length === 0 ? (
            <Text style={styles.emptyStateText}>No achievements yet</Text>
          ) : (
            dashboardData.achievements.map(achievement => (
              <View key={achievement.id} style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  <Text style={styles.achievementDate}>{new Date(achievement.date).toLocaleDateString()}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonActive]} 
          onPress={() => {}}
        >
          <User size={24} color="#DC143C" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Dashboard</Text>
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
          style={styles.navButton} 
          onPress={() => router.push('/(player)/settings')}
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
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    marginLeft: 16,
  },
  playerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  teamLogo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  teamName: {
    fontSize: 14,
    color: '#fff',
  },
  playerRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
  },
  quickStats: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    color: '#DC143C',
  },
  emptyStateText: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  matchCard: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  matchHeader: {
    marginBottom: 12,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  matchVenue: {
    fontSize: 14,
    color: '#666',
  },
  matchTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
  },
  matchTeamLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  vsText: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 12,
  },
  matchFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    gap: 16,
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  matchInfoText: {
    fontSize: 14,
    color: '#666',
  },
  performanceCard: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  performanceDate: {
    fontSize: 14,
    color: '#666',
  },
  performanceTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  performanceTeamLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  performanceStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  performanceStat: {
    flex: 1,
    alignItems: 'center',
  },
  performanceStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  performanceStatLabel: {
    fontSize: 14,
    color: '#666',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: '#999',
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
