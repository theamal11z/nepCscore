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
import { Search, Star, Filter } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

import Header from '@/components/Header';
import { getTeams } from '@/utils/api';

export default function TeamsScreen() {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, followed

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    filterTeams();
  }, [searchQuery, filter, teams]);

  const loadTeams = async () => {
    setRefreshing(true);
    try {
      const teamsData = await getTeams();
      setTeams(teamsData);
      setFilteredTeams(teamsData);
    } catch (error) {
      console.error('Failed to load teams:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const filterTeams = () => {
    let result = teams;
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(team => 
        team.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply followed filter
    if (filter === 'followed') {
      result = result.filter(team => team.isFollowing);
    }
    
    setFilteredTeams(result);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const toggleFollow = (teamId) => {
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        return { ...team, isFollowing: !team.isFollowing };
      }
      return team;
    });
    setTeams(updatedTeams);
  };

  const viewTeamDetails = (teamId) => {
    router.push(`/team/${teamId}`);
  };

  const renderTeamCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.teamCard}
      onPress={() => viewTeamDetails(item.id)}
    >
      <Image source={{ uri: item.logo }} style={styles.teamLogo} />
      
      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{item.name}</Text>
        <View style={styles.teamStats}>
          <Text style={styles.teamStat}>Matches: {item.matches}</Text>
          <Text style={styles.teamStat}>Win: {item.win}</Text>
          <Text style={styles.teamStat}>Loss: {item.loss}</Text>
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
      <Header title="Teams" />
      
      <LinearGradient
        colors={['#DC143C', '#8B0000']}
        style={styles.searchContainer}
      >
        <View style={styles.searchBar}>
          <Search size={20} color="#777" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search teams..."
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
              All Teams
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
          <TouchableOpacity style={styles.filterIconButton}>
            <Filter size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredTeams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTeamCard}
        refreshing={refreshing}
        onRefresh={loadTeams}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No teams match your search' : 'No teams available'}
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
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
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
  filterIconButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    marginLeft: 'auto',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  teamCard: {
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
  teamLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 4,
  },
  teamStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamStat: {
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