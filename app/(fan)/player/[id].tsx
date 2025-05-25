import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Star, ChevronLeft, Share2, Calendar, Trophy, TrendingUp } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import StatsCard from '@/components/StatsCard';

// Mock player data
const mockPlayerData = {
  '1': {
    id: '1',
    name: 'Sandeep Lamichhane',
    role: 'Bowler',
    team: 'Kathmandu Kings',
    teamLogo: 'https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
    matches: 56,
    runs: 320,
    wickets: 89,
    average: 18.5,
    economy: 6.2,
    strikeRate: 145.8,
    highestScore: 42,
    bestBowling: '5/15',
    isFollowing: true,
    bio: 'Sandeep Lamichhane is a Nepalese cricketer who is the first Nepalese player to play in the Indian Premier League. He is a leg spin bowler.',
    recentPerformances: [
      {
        matchId: '1',
        against: 'Pokhara Rhinos',
        date: 'JUN 12, 2025',
        runs: 12,
        wickets: 3,
        economy: 5.8,
      },
      {
        matchId: '6',
        against: 'Bhairahawa Gladiators',
        date: 'JUN 10, 2025',
        runs: 8,
        wickets: 4,
        economy: 4.5,
      },
      {
        matchId: '8',
        against: 'Biratnagar Warriors',
        date: 'JUN 5, 2025',
        runs: 15,
        wickets: 2,
        economy: 6.2,
      },
    ],
    careerStats: {
      matches: {
        t20: 56,
        odi: 32,
        test: 8,
      },
      batting: {
        runs: 320,
        average: 8.4,
        strikeRate: 75.2,
        fifties: 0,
        hundreds: 0,
      },
      bowling: {
        wickets: 89,
        economy: 6.2,
        average: 18.5,
        fiveWickets: 3,
      },
    },
  },
  '2': {
    id: '2',
    name: 'Kushal Bhurtel',
    role: 'Batsman',
    team: 'Pokhara Rhinos',
    teamLogo: 'https://images.pexels.com/photos/2250394/pexels-photo-2250394.jpeg',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    matches: 42,
    runs: 1245,
    wickets: 5,
    average: 32.8,
    economy: 8.5,
    strikeRate: 142.3,
    highestScore: 88,
    bestBowling: '2/24',
    isFollowing: false,
    bio: 'Kushal Bhurtel is a Nepalese cricketer who plays as a right-handed batsman. He made his Twenty20 International debut for Nepal against the Netherlands in April 2021.',
    recentPerformances: [
      {
        matchId: '1',
        against: 'Kathmandu Kings',
        date: 'JUN 12, 2025',
        runs: 65,
        wickets: 0,
        economy: 0,
      },
      {
        matchId: '5',
        against: 'Biratnagar Warriors',
        date: 'JUN 20, 2025',
        runs: 42,
        wickets: 1,
        economy: 7.5,
      },
      {
        matchId: '6',
        against: 'Bhairahawa Gladiators',
        date: 'JUN 10, 2025',
        runs: 78,
        wickets: 0,
        economy: 0,
      },
    ],
    careerStats: {
      matches: {
        t20: 42,
        odi: 28,
        test: 5,
      },
      batting: {
        runs: 1245,
        average: 32.8,
        strikeRate: 142.3,
        fifties: 8,
        hundreds: 0,
      },
      bowling: {
        wickets: 5,
        economy: 8.5,
        average: 42.6,
        fiveWickets: 0,
      },
    },
  },
};

export default function PlayerProfileScreen() {
  const { id } = useLocalSearchParams();
  const [player, setPlayer] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, stats, matches
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // In a real app, you would fetch the player data from an API
    if (id && mockPlayerData[id]) {
      setPlayer(mockPlayerData[id]);
      setIsFollowing(mockPlayerData[id].isFollowing);
    }
  }, [id]);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  if (!player) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading player profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header with player image */}
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
              style={styles.followButton}
              onPress={toggleFollow}
            >
              <Star 
                size={20} 
                color="#FFFFFF" 
                fill={isFollowing ? "#FFFFFF" : "transparent"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareButton}>
              <Share2 size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.playerHeaderInfo}>
          <Image 
            source={{ uri: player.avatar }} 
            style={styles.playerAvatar} 
          />
          
          <Text style={styles.playerName}>{player.name}</Text>
          
          <View style={styles.playerBasicInfo}>
            <View style={styles.roleContainer}>
              <Text style={styles.roleText}>{player.role}</Text>
            </View>
            
            <View style={styles.teamContainer}>
              <Image source={{ uri: player.teamLogo }} style={styles.teamLogo} />
              <Text style={styles.teamName}>{player.team}</Text>
            </View>
          </View>
          
          <View style={styles.quickStats}>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{player.matches}</Text>
              <Text style={styles.quickStatLabel}>Matches</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{player.runs}</Text>
              <Text style={styles.quickStatLabel}>Runs</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{player.wickets}</Text>
              <Text style={styles.quickStatLabel}>Wickets</Text>
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
            style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
            onPress={() => setActiveTab('stats')}
          >
            <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
              Statistics
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
        {activeTab === 'overview' && (
          <View style={styles.overviewContainer}>
            <View style={styles.bioSection}>
              <Text style={styles.sectionTitle}>Bio</Text>
              <Text style={styles.bioText}>{player.bio}</Text>
            </View>
            
            <View style={styles.careerHighlightsSection}>
              <Text style={styles.sectionTitle}>Career Highlights</Text>
              
              <View style={styles.highlightsContainer}>
                <View style={styles.highlightItem}>
                  <View style={styles.highlightIconContainer}>
                    <TrendingUp size={20} color="#DC143C" />
                  </View>
                  <View>
                    <Text style={styles.highlightLabel}>Highest Score</Text>
                    <Text style={styles.highlightValue}>{player.highestScore} runs</Text>
                  </View>
                </View>
                
                <View style={styles.highlightItem}>
                  <View style={styles.highlightIconContainer}>
                    <Trophy size={20} color="#DC143C" />
                  </View>
                  <View>
                    <Text style={styles.highlightLabel}>Best Bowling</Text>
                    <Text style={styles.highlightValue}>{player.bestBowling}</Text>
                  </View>
                </View>
                
                <View style={styles.highlightItem}>
                  <View style={styles.highlightIconContainer}>
                    <Calendar size={20} color="#DC143C" />
                  </View>
                  <View>
                    <Text style={styles.highlightLabel}>Career Span</Text>
                    <Text style={styles.highlightValue}>2018 - Present</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.recentPerformancesSection}>
              <Text style={styles.sectionTitle}>Recent Performances</Text>
              
              {player.recentPerformances.map((performance, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.performanceCard}
                  onPress={() => router.push(`/match/${performance.matchId}`)}
                >
                  <View style={styles.performanceHeader}>
                    <Text style={styles.performanceOpponent}>vs {performance.against}</Text>
                    <Text style={styles.performanceDate}>{performance.date}</Text>
                  </View>
                  
                  <View style={styles.performanceStats}>
                    {player.role !== 'Bowler' && (
                      <View style={styles.performanceStat}>
                        <Text style={styles.performanceStatValue}>{performance.runs}</Text>
                        <Text style={styles.performanceStatLabel}>Runs</Text>
                      </View>
                    )}
                    
                    {player.role !== 'Batsman' && (
                      <>
                        <View style={styles.performanceStat}>
                          <Text style={styles.performanceStatValue}>{performance.wickets}</Text>
                          <Text style={styles.performanceStatLabel}>Wickets</Text>
                        </View>
                        
                        <View style={styles.performanceStat}>
                          <Text style={styles.performanceStatValue}>{performance.economy}</Text>
                          <Text style={styles.performanceStatLabel}>Economy</Text>
                        </View>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        {activeTab === 'stats' && (
          <View style={styles.statsContainer}>
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Career Statistics</Text>
              
              <View style={styles.matchTypesContainer}>
                <View style={styles.matchTypeItem}>
                  <Text style={styles.matchTypeValue}>{player.careerStats.matches.t20}</Text>
                  <Text style={styles.matchTypeLabel}>T20</Text>
                </View>
                
                <View style={styles.matchTypeItem}>
                  <Text style={styles.matchTypeValue}>{player.careerStats.matches.odi}</Text>
                  <Text style={styles.matchTypeLabel}>ODI</Text>
                </View>
                
                <View style={styles.matchTypeItem}>
                  <Text style={styles.matchTypeValue}>{player.careerStats.matches.test}</Text>
                  <Text style={styles.matchTypeLabel}>Test</Text>
                </View>
              </View>
              
              <View style={styles.statCardsContainer}>
                <StatsCard 
                  title="Batting Stats"
                  stats={[
                    { label: 'Runs', value: player.careerStats.batting.runs },
                    { label: 'Average', value: player.careerStats.batting.average },
                    { label: 'Strike Rate', value: player.careerStats.batting.strikeRate },
                    { label: 'Fifties', value: player.careerStats.batting.fifties },
                    { label: 'Hundreds', value: player.careerStats.batting.hundreds },
                  ]}
                />
                
                <StatsCard 
                  title="Bowling Stats"
                  stats={[
                    { label: 'Wickets', value: player.careerStats.bowling.wickets },
                    { label: 'Economy', value: player.careerStats.bowling.economy },
                    { label: 'Average', value: player.careerStats.bowling.average },
                    { label: '5 Wickets', value: player.careerStats.bowling.fiveWickets },
                  ]}
                />
              </View>
            </View>
          </View>
        )}
        
        {activeTab === 'matches' && (
          <View style={styles.matchesContainer}>
            <Text style={styles.sectionTitle}>Recent Matches</Text>
            
            {player.recentPerformances.map((match, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.matchCard}
                onPress={() => router.push(`/match/${match.matchId}`)}
              >
                <View style={styles.matchCardHeader}>
                  <Text style={styles.matchCardOpponent}>vs {match.against}</Text>
                  <Text style={styles.matchCardDate}>{match.date}</Text>
                </View>
                
                <View style={styles.matchCardStats}>
                  {player.role !== 'Bowler' && (
                    <View style={styles.matchCardStat}>
                      <Text style={styles.matchCardStatLabel}>Runs</Text>
                      <Text style={styles.matchCardStatValue}>{match.runs}</Text>
                    </View>
                  )}
                  
                  {player.role !== 'Batsman' && (
                    <>
                      <View style={styles.matchCardStat}>
                        <Text style={styles.matchCardStatLabel}>Wickets</Text>
                        <Text style={styles.matchCardStatValue}>{match.wickets}</Text>
                      </View>
                      
                      <View style={styles.matchCardStat}>
                        <Text style={styles.matchCardStatLabel}>Economy</Text>
                        <Text style={styles.matchCardStatValue}>{match.economy}</Text>
                      </View>
                    </>
                  )}
                </View>
                
                <View style={styles.viewMatchButton}>
                  <Text style={styles.viewMatchButtonText}>View Match Details</Text>
                </View>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity style={styles.viewAllMatchesButton}>
              <Text style={styles.viewAllMatchesText}>View All Matches</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');

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
  followButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginRight: 8,
  },
  shareButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  playerHeaderInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  playerAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 12,
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  playerBasicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  roleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  roleText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 12,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  teamLogo: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
  },
  teamName: {
    color: '#FFFFFF',
    fontSize: 12,
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
  bioSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
  },
  careerHighlightsSection: {
    marginBottom: 24,
  },
  highlightsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  highlightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  highlightLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 2,
  },
  highlightValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
  },
  recentPerformancesSection: {
    marginBottom: 24,
  },
  performanceCard: {
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
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  performanceOpponent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#121212',
  },
  performanceDate: {
    fontSize: 12,
    color: '#777',
  },
  performanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  performanceStat: {
    alignItems: 'center',
  },
  performanceStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC143C',
    marginBottom: 4,
  },
  performanceStatLabel: {
    fontSize: 12,
    color: '#777',
  },
  statsContainer: {
    padding: 16,
  },
  statsSection: {
    marginBottom: 24,
  },
  matchTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  matchTypeItem: {
    alignItems: 'center',
  },
  matchTypeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 4,
  },
  matchTypeLabel: {
    fontSize: 12,
    color: '#777',
  },
  statCardsContainer: {
    marginBottom: 16,
  },
  matchesContainer: {
    padding: 16,
  },
  matchCard: {
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
  matchCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  matchCardOpponent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#121212',
  },
  matchCardDate: {
    fontSize: 12,
    color: '#777',
  },
  matchCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  matchCardStat: {
    alignItems: 'center',
  },
  matchCardStatLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },
  matchCardStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#121212',
  },
  viewMatchButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  viewMatchButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  viewAllMatchesButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  viewAllMatchesText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#777',
  },
});
