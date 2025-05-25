import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Filter, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

import Header from '@/components/Header';

// Mock data for players
const mockPlayers = [
  {
    id: '1',
    name: 'Sandeep Lamichhane',
    role: 'Bowler',
    team: 'Kathmandu Kings',
    teamLogo: 'https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
    matches: 56,
    runs: 320,
    wickets: 89,
    isFollowing: true,
  },
  {
    id: '2',
    name: 'Kushal Bhurtel',
    role: 'Batsman',
    team: 'Pokhara Rhinos',
    teamLogo: 'https://images.pexels.com/photos/2250394/pexels-photo-2250394.jpeg',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    matches: 42,
    runs: 1245,
    wickets: 5,
    isFollowing: false,
  },
  {
    id: '3',
    name: 'Rohit Paudel',
    role: 'All-rounder',
    team: 'Chitwan Tigers',
    teamLogo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg',
    matches: 38,
    runs: 862,
    wickets: 23,
    isFollowing: true,
  },
  {
    id: '4',
    name: 'Dipendra Singh Airee',
    role: 'All-rounder',
    team: 'Biratnagar Warriors',
    teamLogo: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    matches: 45,
    runs: 1105,
    wickets: 28,
    isFollowing: false,
  },
  {
    id: '5',
    name: 'Karan KC',
    role: 'Bowler',
    team: 'Lalitpur Patriots',
    teamLogo: 'https://images.pexels.com/photos/3608542/pexels-photo-3608542.jpeg',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    matches: 52,
    runs: 215,
    wickets: 76,
    isFollowing: true,
  },
  {
    id: '6',
    name: 'Aasif Sheikh',
    role: 'Batsman',
    team: 'Bhairahawa Gladiators',
    teamLogo: 'https://images.pexels.com/photos/2531429/pexels-photo-2531429.jpeg',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
    matches: 40,
    runs: 1356,
    wickets: 0,
    isFollowing: false,
  },
];

export default function PlayersScreen() {
  const [players, setPlayers] = useState(mockPlayers);
  const [filteredPlayers, setFilteredPlayers] = useState(mockPlayers);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, followed, batsmen, bowlers, allrounders

  useEffect(() => {
    filterPlayers();
  }, [searchQuery, filter, players]);

  const filterPlayers = () => {
    let result = players;
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(player => 
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.team.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply role/following filter
    if (filter === 'followed') {
      result = result.filter(player => player.isFollowing);
    } else if (filter === 'batsmen') {
      result = result.filter(player => player.role === 'Batsman');
    } else if (filter === 'bowlers') {
      result = result.filter(player => player.role === 'Bowler');
    } else if (filter === 'allrounders') {
      result = result.filter(player => player.role === 'All-rounder');
    }
    
    setFilteredPlayers(result);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const toggleFollow = (playerId) => {
    const updatedPlayers = players.map(player => {
      if (player.id === playerId) {
        return { ...player, isFollowing: !player.isFollowing };
      }
      return player;
    });
    setPlayers(updatedPlayers);
  };

  const viewPlayerProfile = (playerId) => {
    router.push(`/player/${playerId}`);
  };

  const renderPlayerCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.playerCard}
      onPress={() => viewPlayerProfile(item.id)}
    >
      <Image source={{ uri: item.avatar }} style={styles.playerAvatar} />
      
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.name}</Text>
        <View style={styles.playerDetails}>
          <View style={styles.roleContainer}>
            <Text style={styles.playerRole}>{item.role}</Text>
          </View>
          <View style={styles.teamInfo}>
            <Image source={{ uri: item.teamLogo }} style={styles.teamLogo} />
            <Text style={styles.teamName}>{item.team}</Text>
          </View>
        </View>
        <View style={styles.playerStats}>
          <Text style={styles.playerStat}>Matches: {item.matches}</Text>
          {item.role !== 'Bowler' && (
            <Text style={styles.playerStat}>Runs: {item.runs}</Text>
          )}
          {item.role !== 'Batsman' && (
            <Text style={styles.playerStat}>Wickets: {item.wickets}</Text>
          )}
        </View>
      </View>
      
      <TouchableOpacity 
        style={[
          styles.followButton, 
          item.isFollowing && styles.followingButton
        ]}
        onPress={() => toggleFollow(item.id)}
      >
        <Star 
          size={16} 
          color={item.isFollowing ? '#DC143C' : '#777'} 
          fill={item.isFollowing ? '#DC143C' : 'transparent'} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header title="Players" />
      
      <LinearGradient
        colors={['#DC143C', '#8B0000']}
        style={styles.searchContainer}
      >
        <View style={styles.searchBar}>
          <Search size={20} color="#777" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search players..."
            placeholderTextColor="#777"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterTabText, filter === 'all' && styles.activeFilterTabText]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'followed' && styles.activeFilterTab]}
            onPress={() => setFilter('followed')}
          >
            <Text style={[styles.filterTabText, filter === 'followed' && styles.activeFilterTabText]}>
              Following
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'batsmen' && styles.activeFilterTab]}
            onPress={() => setFilter('batsmen')}
          >
            <Text style={[styles.filterTabText, filter === 'batsmen' && styles.activeFilterTabText]}>
              Batsmen
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'bowlers' && styles.activeFilterTab]}
            onPress={() => setFilter('bowlers')}
          >
            <Text style={[styles.filterTabText, filter === 'bowlers' && styles.activeFilterTabText]}>
              Bowlers
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredPlayers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPlayerCard}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          setTimeout(() => setRefreshing(false), 1000);
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No players match your search' : 'No players available'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  searchContainer: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 20,
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
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#121212',
  },
  filterTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
    marginBottom: 8,
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
  listContent: {
    padding: 16,
    paddingBottom: 24,
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
  playerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 4,
  },
  playerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  roleContainer: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  playerRole: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamLogo: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
  },
  teamName: {
    fontSize: 12,
    color: '#777',
  },
  playerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerStat: {
    fontSize: 12,
    color: '#777',
    marginRight: 12,
  },
  followButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  followingButton: {
    backgroundColor: '#FFEBEE',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
});
