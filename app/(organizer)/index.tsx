import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { ChevronRight, Users, Calendar, Clipboard, ChartBar as BarChart3 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import { getOrganizerData } from '@/utils/api';

interface Team {
  id: string;
  name: string;
  logo: string;
  score?: number;
  wickets?: number;
  overs?: number;
}

interface Match {
  id: string;
  title: string;
  tournament?: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  date: string;
  time: string;
  venue: string;
  team1: Team;
  team2: Team;
  result?: string;
}

interface Activity {
  id: string;
  type: string;
  text: string;
  time: string;
  timestamp: string;
  description: string;
  dotColor?: string;
}

interface DashboardData {
  organizerName: string;
  organizerAvatar: string;
  organizationName: string;
  stats: {
    totalMatches: number;
    activeTeams: number;
    totalPlayers: number;
    fanEngagement: number;
  };
  liveMatches: Match[];
  upcomingMatches: Match[];
  recentActivities: Activity[];
}

export default function OrganizerDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      interface RawMatch {
        id: string;
        title?: string;
        tournament?: string;
        status?: string;
        date?: string;
        time?: string;
        venue: string;
        team1: {
          id?: string;
          name: string;
          logo: string;
          score?: number;
          wickets?: number;
          overs?: string | number;
        };
        team2: {
          id?: string;
          name: string;
          logo: string;
          score?: number;
          wickets?: number;
          overs?: string | number;
        };
      }

      interface RawActivity {
        id?: string;
        type?: string;
        text?: string;
        time?: string;
        timestamp?: string;
        description?: string;
        dotColor?: string;
      }

      interface RawData {
        organizerName: string;
        organizerAvatar: string;
        organizationName: string;
        stats: {
          totalMatches: number;
          activeTeams: number;
          totalPlayers: number;
          fanEngagement: number;
        };
        liveMatches: RawMatch[];
        upcomingMatches: RawMatch[];
        recentActivities: RawActivity[];
      }

      const rawData = await getOrganizerData() as RawData;
      // Transform raw data to match our types
      const data: DashboardData = {
        organizerName: rawData.organizerName,
        organizerAvatar: rawData.organizerAvatar,
        organizationName: rawData.organizationName,
        stats: rawData.stats,
        liveMatches: rawData.liveMatches.map(match => ({
          id: match.id,
          title: match.title || 'Untitled Match',
          tournament: match.tournament || '',
          status: 'live',
          date: match.date || new Date().toISOString().split('T')[0],
          time: match.time || new Date().toTimeString().split(' ')[0],
          venue: match.venue,
          team1: {
            id: match.team1.id || `team1_${match.id}`,
            name: match.team1.name,
            logo: match.team1.logo,
            score: match.team1.score || 0,
            wickets: match.team1.wickets || 0,
            overs: typeof match.team1.overs === 'string' ? parseFloat(match.team1.overs) : (match.team1.overs || 0),
          },
          team2: {
            id: match.team2.id || `team2_${match.id}`,
            name: match.team2.name,
            logo: match.team2.logo,
            score: match.team2.score || 0,
            wickets: match.team2.wickets || 0,
            overs: typeof match.team2.overs === 'string' ? parseFloat(match.team2.overs) : (match.team2.overs || 0),
          },
        })),
        upcomingMatches: rawData.upcomingMatches.map(match => ({
          id: match.id,
          title: match.title || 'Untitled Match',
          tournament: match.tournament || '',
          status: 'upcoming',
          date: match.date || new Date().toISOString().split('T')[0],
          time: match.time || new Date().toTimeString().split(' ')[0],
          venue: match.venue,
          team1: {
            id: match.team1.id || `team1_${match.id}`,
            name: match.team1.name,
            logo: match.team1.logo,
            score: 0,
            wickets: 0,
            overs: 0,
          },
          team2: {
            id: match.team2.id || `team2_${match.id}`,
            name: match.team2.name,
            logo: match.team2.logo,
            score: 0,
            wickets: 0,
            overs: 0,
          },
        })),
        recentActivities: rawData.recentActivities.map(activity => ({
          id: activity.id || `activity_${Date.now()}`,
          type: activity.type || 'info',
          text: activity.text || '',
          time: activity.time || '',
          timestamp: activity.timestamp || new Date().toISOString(),
          description: activity.description || activity.text || '',
          dotColor: activity.dotColor || '#666',
        })),
      };
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !dashboardData) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <Header title="Dashboard" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header title="Dashboard" />
      
      <ScrollView style={styles.scrollView}>
        <LinearGradient
          colors={['#DC143C', '#8B0000']}
          style={styles.welcomeContainer}
        >
          <View style={styles.welcomeContent}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.organizerName}>{dashboardData.organizerName}</Text>
              <Text style={styles.organizationName}>{dashboardData.organizationName}</Text>
            </View>
            <Image 
              source={{ uri: dashboardData.organizerAvatar }}
              style={styles.organizerAvatar}
            />
          </View>
        </LinearGradient>
        
        <View style={styles.statsContainer}>
          <StatsCard
            title="Total Matches"
            value={dashboardData.stats.totalMatches}
            icon={<Calendar size={20} color="#DC143C" />}
            backgroundColor="#FFEBEE"
            textColor="#DC143C"
          />
          <StatsCard
            title="Active Teams"
            value={dashboardData.stats.activeTeams}
            icon={<Users size={20} color="#1976D2" />}
            backgroundColor="#E3F2FD"
            textColor="#1976D2"
          />
          <StatsCard
            title="Total Players"
            value={dashboardData.stats.totalPlayers}
            icon={<Clipboard size={20} color="#388E3C" />}
            backgroundColor="#E8F5E9"
            textColor="#388E3C"
          />
          <StatsCard
            title="Fan Engagement"
            value={`${dashboardData.stats.fanEngagement}%`}
            icon={<BarChart3 size={20} color="#F57C00" />}
            backgroundColor="#FFF3E0"
            textColor="#F57C00"
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Matches</Text>
          
          {dashboardData.liveMatches.length > 0 ? (
            dashboardData.liveMatches.map((match: Match) => (
              <TouchableOpacity 
                key={match.id}
                style={styles.matchCard}
                onPress={() => router.push(`/match/${match.id}/manage`)}
              >
                <View style={styles.matchHeader}>
                  <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                  <Text style={styles.matchVenue}>{match.venue}</Text>
                </View>
                
                <View style={styles.matchTeams}>
                  <View style={styles.teamContainer}>
                    <Image source={{ uri: match.team1.logo }} style={styles.teamLogo} />
                    <Text style={styles.teamName}>{match.team1.name}</Text>
                    <Text style={styles.teamScore}>{match.team1.score}/{match.team1.wickets}</Text>
                    <Text style={styles.teamOvers}>({match.team1.overs})</Text>
                  </View>
                  
                  <Text style={styles.vsText}>VS</Text>
                  
                  <View style={styles.teamContainer}>
                    <Image source={{ uri: match.team2.logo }} style={styles.teamLogo} />
                    <Text style={styles.teamName}>{match.team2.name}</Text>
                    <Text style={styles.teamScore}>{match.team2.score}/{match.team2.wickets}</Text>
                    <Text style={styles.teamOvers}>({match.team2.overs})</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.updateButton}
                  onPress={() => router.push(`/(organizer)/update-score?matchId=${match.id}`)}
                >
                  <Text style={styles.updateButtonText}>Update Score</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No live matches</Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Matches</Text>
            <TouchableOpacity onPress={() => router.push('/matches')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {dashboardData.upcomingMatches.length > 0 ? (
            dashboardData.upcomingMatches.map((match: Match) => (
              <TouchableOpacity 
                key={match.id}
                style={styles.upcomingMatchCard}
                onPress={() => router.push(`/match/${match.id}/manage`)}
              >
                <View style={styles.upcomingMatchInfo}>
                  <Text style={styles.upcomingMatchDate}>{match.date}</Text>
                  <Text style={styles.upcomingMatchTime}>{match.time}</Text>
                  <Text style={styles.upcomingMatchVenue}>{match.venue}</Text>
                </View>
                
                <View style={styles.upcomingMatchTeams}>
                  <View style={styles.upcomingTeamRow}>
                    <Image source={{ uri: match.team1.logo }} style={styles.upcomingTeamLogo} />
                    <Text style={styles.upcomingTeamName}>{match.team1.name}</Text>
                  </View>
                  
                  <Text style={styles.upcomingVsText}>vs</Text>
                  
                  <View style={styles.upcomingTeamRow}>
                    <Image source={{ uri: match.team2.logo }} style={styles.upcomingTeamLogo} />
                    <Text style={styles.upcomingTeamName}>{match.team2.name}</Text>
                  </View>
                </View>
                
                <ChevronRight size={20} color="#777" />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No upcoming matches</Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.createMatchButton}
            onPress={() => router.push('/create')}
          >
            <Text style={styles.createMatchButtonText}>Create New Match</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
          </View>
          
          {dashboardData.recentActivities.map((activity: Activity, index: number) => (
            <View key={index} style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: activity.dotColor }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>{activity.text}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#777',
  },
  welcomeContainer: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  organizerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  organizationName: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
  },
  organizerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -20,
  },
  section: {
    padding: 16,
    marginBottom: 16,
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
    color: '#121212',
  },
  viewAllText: {
    fontSize: 14,
    color: '#DC143C',
    fontWeight: '500',
  },
  matchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC143C',
    marginRight: 4,
  },
  liveText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#DC143C',
  },
  matchVenue: {
    fontSize: 12,
    color: '#777',
  },
  matchTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  teamLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#121212',
    marginBottom: 4,
    textAlign: 'center',
  },
  teamScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
  },
  teamOvers: {
    fontSize: 12,
    color: '#777',
  },
  vsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#777',
    marginHorizontal: 8,
  },
  updateButton: {
    backgroundColor: '#DC143C',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  upcomingMatchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  upcomingMatchInfo: {
    marginRight: 12,
  },
  upcomingMatchDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#121212',
  },
  upcomingMatchTime: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  upcomingMatchVenue: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  upcomingMatchTeams: {
    flex: 1,
    marginRight: 12,
  },
  upcomingTeamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  upcomingTeamLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  upcomingTeamName: {
    fontSize: 14,
    color: '#121212',
  },
  upcomingVsText: {
    fontSize: 12,
    color: '#777',
    marginVertical: 2,
    marginLeft: 16,
  },
  createMatchButton: {
    backgroundColor: '#DC143C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  createMatchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#777',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#121212',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#777',
  },
});