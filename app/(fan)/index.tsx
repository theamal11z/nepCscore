import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Calendar, Search, Settings } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

import Header from '@/components/Header';
import LiveMatchCard from '@/components/LiveMatchCard';
import UpcomingMatchCard from '@/components/UpcomingMatchCard';
import { getMatches } from '@/utils/api';

export default function FanHomeScreen() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getMatches();
      setLiveMatches(data.liveMatches);
      setUpcomingMatches(data.upcomingMatches);
      setRecentMatches(data.recentMatches);
    } catch (error) {
      console.error('Failed to load matches:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const openMatch = (matchId) => {
    router.push(`/match/${matchId}`);
  };

  const filterMatches = (tab) => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header title="Matches" />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <LinearGradient
          colors={['#DC143C', '#8B0000']}
          style={styles.gradientHeader}
        >
          <View style={styles.searchBar}>
            <Search size={20} color="#777" />
            <Text style={styles.searchText}>Search matches, teams...</Text>
          </View>
          
          <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[styles.filterTab, activeTab === 'all' && styles.activeFilterTab]}
              onPress={() => filterMatches('all')}
            >
              <Text style={[styles.filterTabText, activeTab === 'all' && styles.activeFilterTabText]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, activeTab === 'live' && styles.activeFilterTab]}
              onPress={() => filterMatches('live')}
            >
              <Text style={[styles.filterTabText, activeTab === 'live' && styles.activeFilterTabText]}>
                Live
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, activeTab === 'upcoming' && styles.activeFilterTab]}
              onPress={() => filterMatches('upcoming')}
            >
              <Text style={[styles.filterTabText, activeTab === 'upcoming' && styles.activeFilterTabText]}>
                Upcoming
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, activeTab === 'recent' && styles.activeFilterTab]}
              onPress={() => filterMatches('recent')}
            >
              <Text style={[styles.filterTabText, activeTab === 'recent' && styles.activeFilterTabText]}>
                Results
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Live Matches Section */}
          {(activeTab === 'all' || activeTab === 'live') && liveMatches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Live Matches</Text>
                <View style={styles.liveDot} />
              </View>

              {liveMatches.map((match) => (
                <LiveMatchCard 
                  key={match.id}
                  match={match}
                  onPress={() => openMatch(match.id)}
                />
              ))}
            </View>
          )}

          {/* Upcoming Matches Section */}
          {(activeTab === 'all' || activeTab === 'upcoming') && upcomingMatches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Matches</Text>
                <TouchableOpacity style={styles.calendarButton}>
                  <Calendar size={16} color="#777" />
                </TouchableOpacity>
              </View>

              {upcomingMatches.map((match) => (
                <UpcomingMatchCard 
                  key={match.id}
                  match={match}
                  onPress={() => openMatch(match.id)}
                />
              ))}

              {upcomingMatches.length > 2 && (
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>View All Upcoming Matches</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Recent Results Section */}
          {(activeTab === 'all' || activeTab === 'recent') && recentMatches.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Results</Text>

              {recentMatches.map((match) => (
                <TouchableOpacity 
                  key={match.id} 
                  style={styles.recentMatchCard}
                  onPress={() => openMatch(match.id)}
                >
                  <View style={styles.recentMatchHeader}>
                    <Text style={styles.recentMatchDate}>{match.date}</Text>
                    <Text style={styles.recentMatchVenue}>{match.venue}</Text>
                  </View>
                  
                  <View style={styles.teamsContainer}>
                    <View style={styles.teamRow}>
                      <Image source={{ uri: match.team1.logo }} style={styles.teamLogo} />
                      <Text style={styles.teamName}>{match.team1.name}</Text>
                      <Text style={styles.teamScore}>{match.team1.score}/{match.team1.wickets}</Text>
                    </View>
                    
                    <View style={styles.teamRow}>
                      <Image source={{ uri: match.team2.logo }} style={styles.teamLogo} />
                      <Text style={styles.teamName}>{match.team2.name}</Text>
                      <Text style={styles.teamScore}>{match.team2.score}/{match.team2.wickets}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.matchResult}>{match.result}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* No Matches Message */}
          {((activeTab === 'live' && liveMatches.length === 0) ||
            (activeTab === 'upcoming' && upcomingMatches.length === 0) ||
            (activeTab === 'recent' && recentMatches.length === 0)) && (
            <View style={styles.noMatchesContainer}>
              <Text style={styles.noMatchesText}>No matches found</Text>
            </View>
          )}
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
  gradientHeader: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchText: {
    marginLeft: 8,
    color: '#777',
    fontSize: 14,
  },
  filterTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeFilterTab: {
    backgroundColor: '#FFFFFF',
  },
  filterTabText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 13,
  },
  activeFilterTabText: {
    color: '#DC143C',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#121212',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC143C',
    marginLeft: 8,
  },
  calendarButton: {
    marginLeft: 'auto',
  },
  viewAllButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    marginTop: 12,
  },
  viewAllText: {
    color: '#777',
    fontWeight: '500',
    fontSize: 14,
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
  teamLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  teamName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#121212',
  },
  teamScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#121212',
  },
  matchResult: {
    fontSize: 12,
    color: '#DC143C',
    fontWeight: '500',
  },
  noMatchesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noMatchesText: {
    fontSize: 16,
    color: '#777',
  },
});