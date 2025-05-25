import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Share2, Star, Trophy, Calendar, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getTeamDetails } from '@/utils/api';

// TypeScript interfaces
interface PlayerType {
  id: string;
  name: string;
  role: string;
  avatar: string;
  matches: number;
  runs: number;
  wickets: number;
  average: number;
}

interface RecentMatchType {
  id: string;
  date: string;
  venue: string;
  team1: {
    name: string;
    logo: string;
    score: number;
    wickets: number;
  };
  team2: {
    name: string;
    logo: string;
    score: number;
    wickets: number;
  };
  result: string;
}

interface TeamStatsType {
  totalWins: number;
  totalLosses: number;
  winPercentage: number;
  highestScore: number;
  lowestScore: number;
}

interface TeamDetailsType {
  id: string;
  name: string;
  logo: string;
  matches: number;
  win: number;
  loss: number;
  isFollowing: boolean;
  players: PlayerType[];
  recentMatches: RecentMatchType[];
  stats: TeamStatsType;
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
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerRightActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginLeft: 8,
  },
  teamHeaderInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  teamLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 12,
  },
  teamName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  quickStatValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickStatLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
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
    fontSize: 14,
    fontWeight: '500',
    color: '#777',
  },
  activeTabText: {
    color: '#DC143C',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  overviewContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 16,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
    marginLeft: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#121212',
  },
  keyPlayersSection: {
    marginBottom: 24,
  },
  keyPlayersScrollView: {
    flexDirection: 'row',
    marginLeft: -8,
    marginRight: -8,
  },
  keyPlayerCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
  },
  playerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  playerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 4,
    textAlign: 'center',
  },
  playerRole: {
    fontSize: 12,
    color: '#777',
    marginBottom: 8,
  },
  playerStat: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  playerStatText: {
    fontSize: 11,
    color: '#555',
    textAlign: 'center',
  },
  recentMatchesSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
  },
  viewAllText: {
    fontSize: 12,
    color: '#555',
  },
  recentMatchCard: {
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
  recentMatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  recentMatchDate: {
    fontSize: 12,
    color: '#777',
  },
  recentMatchVenue: {
    fontSize: 12,
    color: '#777',
  },
  teamsContainer: {
    marginBottom: 12,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchTeamLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  matchTeamName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#121212',
  },
  matchTeamScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#121212',
  },
  matchResult: {
    fontSize: 12,
    color: '#DC143C',
    fontWeight: '500',
  },
  playersContainer: {
    padding: 16,
  },
  playerCard: {
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
  playerCardAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  playerCardInfo: {
    flex: 1,
  },
  playerCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 4,
  },
  playerRoleContainer: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  playerCardRole: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  playerCardStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  playerCardStat: {
    fontSize: 12,
    color: '#777',
    marginRight: 12,
  },
  playerCardArrow: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchesContainer: {
    padding: 16,
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
  matchCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  matchCardDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#121212',
  },
  matchCardVenue: {
    fontSize: 12,
    color: '#777',
  },
  matchTeamsContainer: {
    marginBottom: 16,
  },
  matchTeamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchCardTeamLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  matchCardTeamName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#121212',
  },
  matchCardTeamScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
  },
  matchCardResult: {
    fontSize: 14,
    color: '#DC143C',
    fontWeight: '500',
    marginBottom: 16,
  },
  viewMatchButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewMatchButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
});

export default function TeamProfileScreen() {
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : typeof params.id === 'object' ? params.id[0] : '1';
  const [team, setTeam] = useState<TeamDetailsType | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, players, matches
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const loadTeamDetails = async () => {
      try {
        const teamData = await getTeamDetails(id);
        setTeam(teamData);
        setIsFollowing(teamData.isFollowing);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load team details:', error);
        setLoading(false);
      }
    };

    loadTeamDetails();
  }, [id]);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const viewPlayerProfile = (playerId: string) => {
    router.push(`/player/${playerId}`);
  };

  const viewMatchDetails = (matchId: string) => {
    router.push(`/match/${matchId}`);
  };

  if (loading || !team) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading team profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header with team logo */}
      <LinearGradient
        colors={['#DC143C', '#8B0000']}
        style={[
          styles.header,
          { paddingTop: insets.top > 0 ? insets.top : 20 }
        ]}
      >
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
          
          <View style={styles.headerRightActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={toggleFollow}
            >
              <Star 
                size={20} 
                color="#FFFFFF" 
                fill={isFollowing ? "#FFFFFF" : "transparent"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.teamHeaderInfo}>
          <Image 
            source={{ uri: team.logo }} 
            style={styles.teamLogo} 
          />
          
          <Text style={styles.teamName}>{team.name}</Text>
          
          <View style={styles.quickStats}>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{team.matches}</Text>
              <Text style={styles.quickStatLabel}>Matches</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{team.win}</Text>
              <Text style={styles.quickStatLabel}>Wins</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{team.loss}</Text>
              <Text style={styles.quickStatLabel}>Losses</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{team.stats.winPercentage}%</Text>
              <Text style={styles.quickStatLabel}>Win Rate</Text>
            </View>
          </View>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'players' && styles.activeTab]}
            onPress={() => setActiveTab('players')}
          >
            <Text style={[styles.tabText, activeTab === 'players' && styles.activeTabText]}>
              Players
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'matches' && styles.activeTab]}
            onPress={() => setActiveTab('matches')}
          >
            <Text style={[styles.tabText, activeTab === 'matches' && styles.activeTabText]}>
              Matches
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <View style={styles.overviewContainer}>
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Team Statistics</Text>
              
              <View style={styles.statsCards}>
                <View style={styles.statsCard}>
                  <View style={styles.statsCardHeader}>
                    <Trophy size={20} color="#DC143C" />
                    <Text style={styles.statsCardTitle}>Performance</Text>
                  </View>
                  
                  <View style={styles.statsRow}>
                    <Text style={styles.statLabel}>Total Matches</Text>
                    <Text style={styles.statValue}>{team.matches}</Text>
                  </View>
                  
                  <View style={styles.statsRow}>
                    <Text style={styles.statLabel}>Wins</Text>
                    <Text style={styles.statValue}>{team.win}</Text>
                  </View>
                  
                  <View style={styles.statsRow}>
                    <Text style={styles.statLabel}>Losses</Text>
                    <Text style={styles.statValue}>{team.loss}</Text>
                  </View>
                  
                  <View style={styles.statsRow}>
                    <Text style={styles.statLabel}>Win Percentage</Text>
                    <Text style={styles.statValue}>{team.stats.winPercentage}%</Text>
                  </View>
                </View>
                
                <View style={styles.statsCard}>
                  <View style={styles.statsCardHeader}>
                    <Calendar size={20} color="#DC143C" />
                    <Text style={styles.statsCardTitle}>Batting</Text>
                  </View>
                  
                  <View style={styles.statsRow}>
                    <Text style={styles.statLabel}>Highest Score</Text>
                    <Text style={styles.statValue}>{team.stats.highestScore}</Text>
                  </View>
                  
                  <View style={styles.statsRow}>
                    <Text style={styles.statLabel}>Lowest Score</Text>
                    <Text style={styles.statValue}>{team.stats.lowestScore}</Text>
                  </View>
                  
                  <View style={styles.statsRow}>
                    <Text style={styles.statLabel}>Avg. Score</Text>
                    <Text style={styles.statValue}>
                      {Math.round((team.stats.highestScore + team.stats.lowestScore) / 2)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.keyPlayersSection}>
              <Text style={styles.sectionTitle}>Key Players</Text>
              
              <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.keyPlayersScrollView}
              >
                {team.players.slice(0, 3).map((player: PlayerType) => (
                  <TouchableOpacity 
                    key={player.id}
                    style={styles.keyPlayerCard}
                    onPress={() => viewPlayerProfile(player.id)}
                  >
                    <Image source={{ uri: player.avatar }} style={styles.playerAvatar} />
                    <Text style={styles.playerName}>{player.name}</Text>
                    <Text style={styles.playerRole}>{player.role}</Text>
                    <View style={styles.playerStat}>
                      {player.role === 'Batsman' ? (
                        <Text style={styles.playerStatText}>
                          {player.runs} runs ({player.matches} matches)
                        </Text>
                      ) : player.role === 'Bowler' ? (
                        <Text style={styles.playerStatText}>
                          {player.wickets} wickets ({player.matches} matches)
                        </Text>
                      ) : (
                        <Text style={styles.playerStatText}>
                          {player.runs} runs, {player.wickets} wickets
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.recentMatchesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Matches</Text>
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={() => setActiveTab('matches')}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              
              {team.recentMatches.map((match: RecentMatchType) => (
                <TouchableOpacity 
                  key={match.id}
                  style={styles.recentMatchCard}
                  onPress={() => viewMatchDetails(match.id)}
                >
                  <View style={styles.recentMatchHeader}>
                    <Text style={styles.recentMatchDate}>{match.date}</Text>
                    <Text style={styles.recentMatchVenue}>{match.venue}</Text>
                  </View>
                  
                  <View style={styles.teamsContainer}>
                    <View style={styles.teamRow}>
                      <Image source={{ uri: match.team1.logo }} style={styles.matchTeamLogo} />
                      <Text style={styles.matchTeamName}>{match.team1.name}</Text>
                      <Text style={styles.matchTeamScore}>
                        {match.team1.score}/{match.team1.wickets}
                      </Text>
                    </View>
                    
                    <View style={styles.teamRow}>
                      <Image source={{ uri: match.team2.logo }} style={styles.matchTeamLogo} />
                      <Text style={styles.matchTeamName}>{match.team2.name}</Text>
                      <Text style={styles.matchTeamScore}>
                        {match.team2.score}/{match.team2.wickets}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.matchResult}>{match.result}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        {/* Players Tab Content */}
        {activeTab === 'players' && (
          <View style={styles.playersContainer}>
            <Text style={styles.sectionTitle}>Team Players</Text>
            
            {team.players.map((player: PlayerType) => (
              <TouchableOpacity 
                key={player.id}
                style={styles.playerCard}
                onPress={() => viewPlayerProfile(player.id)}
              >
                <Image source={{ uri: player.avatar }} style={styles.playerCardAvatar} />
                
                <View style={styles.playerCardInfo}>
                  <Text style={styles.playerCardName}>{player.name}</Text>
                  <View style={styles.playerRoleContainer}>
                    <Text style={styles.playerCardRole}>{player.role}</Text>
                  </View>
                  
                  <View style={styles.playerCardStats}>
                    <Text style={styles.playerCardStat}>Matches: {player.matches}</Text>
                    {player.role !== 'Bowler' && (
                      <Text style={styles.playerCardStat}>Runs: {player.runs}</Text>
                    )}
                    {player.role !== 'Batsman' && (
                      <Text style={styles.playerCardStat}>Wickets: {player.wickets}</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.playerCardArrow}>
                  <ChevronLeft size={20} color="#777" style={{ transform: [{ rotate: '180deg' }] }} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {/* Matches Tab Content */}
        {activeTab === 'matches' && (
          <View style={styles.matchesContainer}>
            <Text style={styles.sectionTitle}>Team Matches</Text>
            
            {team.recentMatches.map((match: RecentMatchType) => (
              <TouchableOpacity 
                key={match.id}
                style={styles.matchCard}
                onPress={() => viewMatchDetails(match.id)}
              >
                <View style={styles.matchCardHeader}>
                  <Text style={styles.matchCardDate}>{match.date}</Text>
                  <Text style={styles.matchCardVenue}>{match.venue}</Text>
                </View>
                
                <View style={styles.matchTeamsContainer}>
                  <View style={styles.matchTeamRow}>
                    <Image source={{ uri: match.team1.logo }} style={styles.matchCardTeamLogo} />
                    <Text style={styles.matchCardTeamName}>{match.team1.name}</Text>
                    <Text style={styles.matchCardTeamScore}>
                      {match.team1.score}/{match.team1.wickets}
                    </Text>
                  </View>
                  
                  <View style={styles.matchTeamRow}>
                    <Image source={{ uri: match.team2.logo }} style={styles.matchCardTeamLogo} />
                    <Text style={styles.matchCardTeamName}>{match.team2.name}</Text>
                    <Text style={styles.matchCardTeamScore}>
                      {match.team2.score}/{match.team2.wickets}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.matchCardResult}>{match.result}</Text>
                
                <View style={styles.viewMatchButton}>
                  <Text style={styles.viewMatchButtonText}>View Match Details</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
