import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  Award,
  BarChart2,
  Clipboard,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

interface Player {
  id: string;
  name: string;
  role: string;
  image: string;
  isCaptain: boolean;
}

interface Team {
  id: string;
  name: string;
  logo: string;
  players: Player[];
  score?: number;
  wickets?: number;
  overs?: number;
}

interface PlayerPerformance {
  playerId: string;
  playerName: string;
  runs?: number;
  balls?: number;
  fours?: number;
  sixes?: number;
  wickets?: number;
  overs?: number;
  economy?: number;
  maidens?: number;
}

interface MatchData {
  id: string;
  title: string;
  tournament: string;
  date: string;
  time: string;
  venue: {
    name: string;
    location: string;
    city: string;
  };
  status: 'upcoming' | 'live' | 'completed';
  matchType: 'T20' | 'ODI' | 'Test';
  team1: Team;
  team2: Team;
  playerPerformance?: PlayerPerformance;
  manOfTheMatch?: {
    id: string;
    name: string;
    team: string;
    image: string;
  };
  result?: string;
}

// Mock API function to fetch match details
const getMatchDetails = async (matchId: string): Promise<MatchData> => {
  // In a real app, this would be an API call
  return {
    id: matchId,
    title: 'League Match #5',
    tournament: 'Nepal Premier League 2025',
    date: '2025-05-28',
    time: '14:00',
    venue: {
      name: 'Tribhuvan University Ground',
      location: 'Kirtipur',
      city: 'Kathmandu',
    },
    status: 'upcoming',
    matchType: 'T20',
    team1: {
      id: 't1',
      name: 'Kathmandu Kings',
      logo: 'https://via.placeholder.com/60',
      players: [
        {
          id: 'p1',
          name: 'Paras Khadka',
          role: 'All-rounder',
          image: 'https://via.placeholder.com/60',
          isCaptain: true,
        },
        {
          id: 'p2',
          name: 'Dipendra Singh Airee',
          role: 'Batsman',
          image: 'https://via.placeholder.com/60',
          isCaptain: false,
        },
      ],
    },
    team2: {
      id: 't2',
      name: 'Pokhara Rhinos',
      logo: 'https://via.placeholder.com/60',
      players: [
        {
          id: 'p3',
          name: 'Kushal Bhurtel',
          role: 'Batsman',
          image: 'https://via.placeholder.com/60',
          isCaptain: true,
        },
        {
          id: 'p4',
          name: 'Karan KC',
          role: 'Bowler',
          image: 'https://via.placeholder.com/60',
          isCaptain: false,
        },
      ],
    },
  };
};

export default function MatchDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMyTeamTab, setIsMyTeamTab] = useState(true);

  useEffect(() => {
    loadMatchDetails();
  }, [id]);

  const loadMatchDetails = async () => {
    setIsLoading(true);
    try {
      const data = await getMatchDetails(id as string);
      setMatchData(data);
    } catch (error) {
      console.error('Failed to load match details:', error);
      Alert.alert('Error', 'Failed to load match details');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'upcoming':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  if (isLoading || !matchData) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{matchData.title}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.matchInfoCard}>
          <Text style={styles.tournamentName}>{matchData.tournament}</Text>
          
          <View style={styles.teamsContainer}>
            <View style={styles.teamColumn}>
              <Image source={{ uri: matchData.team1.logo }} style={styles.teamLogo} />
              <Text style={styles.teamName} numberOfLines={2}>{matchData.team1.name}</Text>
            </View>
            
            <View style={styles.scoreContainer}>
              {matchData.status !== 'upcoming' ? (
                <>
                  <Text style={styles.scoreText}>
                    {matchData.team1.score}/{matchData.team1.wickets}
                  </Text>
                  <Text style={styles.versusText}>vs</Text>
                  <Text style={styles.scoreText}>
                    {matchData.team2.score}/{matchData.team2.wickets}
                  </Text>
                </>
              ) : (
                <Text style={styles.versusText}>vs</Text>
              )}
            </View>
            
            <View style={styles.teamColumn}>
              <Image source={{ uri: matchData.team2.logo }} style={styles.teamLogo} />
              <Text style={styles.teamName} numberOfLines={2}>{matchData.team2.name}</Text>
            </View>
          </View>
          
          <View style={styles.matchDetailRow}>
            <View style={styles.matchDetail}>
              <Calendar size={16} color="#666" />
              <Text style={styles.matchDetailText}>{new Date(matchData.date).toLocaleDateString()}</Text>
            </View>
            <View style={styles.matchDetail}>
              <Clock size={16} color="#666" />
              <Text style={styles.matchDetailText}>{matchData.time}</Text>
            </View>
          </View>
          
          <View style={styles.matchDetail}>
            <MapPin size={16} color="#666" />
            <Text style={styles.matchDetailText}>
              {matchData.venue.name}, {matchData.venue.location}
            </Text>
          </View>
          
          <View style={styles.matchStatusContainer}>
            <View 
              style={[
                styles.statusBadge, 
                { backgroundColor: getStatusColor(matchData.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {matchData.status.charAt(0).toUpperCase() + matchData.status.slice(1)}
              </Text>
            </View>
            <Text style={styles.matchTypeText}>{matchData.matchType}</Text>
          </View>
        </View>

        {matchData.status !== 'upcoming' && matchData.playerPerformance && (
          <View style={styles.performanceCard}>
            <Text style={styles.cardTitle}>Your Performance</Text>
            
            <View style={styles.performanceStats}>
              {matchData.playerPerformance.runs !== undefined && (
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{matchData.playerPerformance.runs}</Text>
                  <Text style={styles.statLabel}>Runs</Text>
                </View>
              )}
              
              {matchData.playerPerformance.balls !== undefined && (
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{matchData.playerPerformance.balls}</Text>
                  <Text style={styles.statLabel}>Balls</Text>
                </View>
              )}
              
              {matchData.playerPerformance.wickets !== undefined && (
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{matchData.playerPerformance.wickets}</Text>
                  <Text style={styles.statLabel}>Wickets</Text>
                </View>
              )}
              
              {matchData.playerPerformance.economy !== undefined && (
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{matchData.playerPerformance.economy.toFixed(2)}</Text>
                  <Text style={styles.statLabel}>Economy</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {matchData.manOfTheMatch && (
          <View style={styles.motmCard}>
            <View style={styles.motmHeader}>
              <Award size={20} color="#DC143C" />
              <Text style={styles.motmTitle}>Player of the Match</Text>
            </View>
            
            <View style={styles.motmContent}>
              <Image 
                source={{ uri: matchData.manOfTheMatch.image }} 
                style={styles.motmImage} 
              />
              <View style={styles.motmInfo}>
                <Text style={styles.motmName}>{matchData.manOfTheMatch.name}</Text>
                <Text style={styles.motmTeam}>{matchData.manOfTheMatch.team}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.squadSection}>
          <Text style={styles.cardTitle}>Team Squads</Text>
          
          <View style={styles.squadTabs}>
            <TouchableOpacity
              style={[styles.squadTab, isMyTeamTab && styles.squadTabActive]}
              onPress={() => setIsMyTeamTab(true)}
            >
              <Text 
                style={[
                  styles.squadTabText, 
                  isMyTeamTab && styles.squadTabTextActive,
                ]}
              >
                {matchData.team1.name}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.squadTab, !isMyTeamTab && styles.squadTabActive]}
              onPress={() => setIsMyTeamTab(false)}
            >
              <Text 
                style={[
                  styles.squadTabText, 
                  !isMyTeamTab && styles.squadTabTextActive,
                ]}
              >
                {matchData.team2.name}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.playersList}>
            {(isMyTeamTab ? matchData.team1.players : matchData.team2.players).map(player => (
              <TouchableOpacity
                key={player.id}
                style={styles.playerCard}
                onPress={() => router.push(`/(player)/player/${player.id}`)}
              >
                <Image source={{ uri: player.image }} style={styles.playerImage} />
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>
                    {player.name}
                    {player.isCaptain && ' (C)'}
                  </Text>
                  <Text style={styles.playerRole}>{player.role}</Text>
                </View>
                <ChevronLeft size={18} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {matchData.status === 'upcoming' && (
          <TouchableOpacity 
            style={styles.prepareButton}
            onPress={() => router.push({
              pathname: '/(player)/training/prepare',
              params: { matchId: matchData.id },
            })}
          >
            <BarChart2 size={20} color="#fff" />
            <Text style={styles.prepareButtonText}>
              Prepare for this Match
            </Text>
          </TouchableOpacity>
        )}

        {matchData.status === 'upcoming' && (
          <TouchableOpacity 
            style={styles.notesButton}
            onPress={() => router.push({
              pathname: '/(player)/match/notes',
              params: { matchId: matchData.id },
            })}
          >
            <Clipboard size={20} color="#DC143C" />
            <Text style={styles.notesButtonText}>
              Add Pre-match Notes
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  matchInfoCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tournamentName: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  teamColumn: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  teamLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  versusText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  matchDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  matchDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  matchDetailText: {
    fontSize: 14,
    color: '#666',
  },
  matchStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },
  matchTypeText: {
    fontSize: 14,
    color: '#666',
  },
  performanceCard: {
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
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  performanceStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  motmCard: {
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
  motmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  motmTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  motmContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  motmImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  motmInfo: {
    flex: 1,
  },
  motmName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  motmTeam: {
    fontSize: 14,
    color: '#666',
  },
  squadSection: {
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
  squadTabs: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  squadTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  squadTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#DC143C',
  },
  squadTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  squadTabTextActive: {
    color: '#DC143C',
  },
  playersList: {},
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  playerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  playerRole: {
    fontSize: 12,
    color: '#666',
  },
  prepareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC143C',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  prepareButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  notesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DC143C',
    gap: 8,
  },
  notesButtonText: {
    color: '#DC143C',
    fontWeight: '500',
  },
});
