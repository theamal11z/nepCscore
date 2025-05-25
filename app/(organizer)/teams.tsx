import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { 
  Search, 
  Plus, 
  ChevronRight, 
  Users, 
  Trophy,
  Edit2,
  Trash2,
  AlertCircle,
  Filter,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Type definitions
interface Player {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface Team {
  id: string;
  name: string;
  logo: string;
  established: string;
  captain: string;
  homeGround: string;
  playerCount: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  players: Player[];
}

// Mock data
const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Kathmandu Kings',
    logo: 'https://via.placeholder.com/80',
    established: '2018',
    captain: 'Gyanendra Malla',
    homeGround: 'Tribhuvan University Ground',
    playerCount: 16,
    matchesPlayed: 45,
    wins: 28,
    losses: 17,
    players: [
      {
        id: '1',
        name: 'Gyanendra Malla',
        role: 'Batsman',
        avatar: 'https://via.placeholder.com/60',
      },
      {
        id: '2',
        name: 'Sandeep Lamichhane',
        role: 'Bowler',
        avatar: 'https://via.placeholder.com/60',
      },
    ],
  },
  {
    id: '2',
    name: 'Pokhara Rhinos',
    logo: 'https://via.placeholder.com/80',
    established: '2019',
    captain: 'Binod Bhandari',
    homeGround: 'Pokhara Stadium',
    playerCount: 15,
    matchesPlayed: 42,
    wins: 20,
    losses: 22,
    players: [
      {
        id: '3',
        name: 'Binod Bhandari',
        role: 'Wicket-keeper',
        avatar: 'https://via.placeholder.com/60',
      },
      {
        id: '4',
        name: 'Karan KC',
        role: 'Bowler',
        avatar: 'https://via.placeholder.com/60',
      },
    ],
  },
  {
    id: '3',
    name: 'Biratnagar Warriors',
    logo: 'https://via.placeholder.com/80',
    established: '2017',
    captain: 'Rohit Paudel',
    homeGround: 'Biratnagar Cricket Ground',
    playerCount: 16,
    matchesPlayed: 48,
    wins: 29,
    losses: 19,
    players: [
      {
        id: '5',
        name: 'Rohit Paudel',
        role: 'Batsman',
        avatar: 'https://via.placeholder.com/60',
      },
      {
        id: '6',
        name: 'Dipendra Singh Airee',
        role: 'All-rounder',
        avatar: 'https://via.placeholder.com/60',
      },
    ],
  },
  {
    id: '4',
    name: 'Chitwan Tigers',
    logo: 'https://via.placeholder.com/80',
    established: '2019',
    captain: 'Sompal Kami',
    homeGround: 'Bharatpur Cricket Ground',
    playerCount: 15,
    matchesPlayed: 40,
    wins: 18,
    losses: 22,
    players: [
      {
        id: '7',
        name: 'Sompal Kami',
        role: 'All-rounder',
        avatar: 'https://via.placeholder.com/60',
      },
      {
        id: '8',
        name: 'Kamal Singh Airee',
        role: 'Bowler',
        avatar: 'https://via.placeholder.com/60',
      },
    ],
  },
  {
    id: '5',
    name: 'Lalitpur Patriots',
    logo: 'https://via.placeholder.com/80',
    established: '2018',
    captain: 'Kushal Bhurtel',
    homeGround: 'Kirtipur Cricket Ground',
    playerCount: 16,
    matchesPlayed: 44,
    wins: 24,
    losses: 20,
    players: [
      {
        id: '9',
        name: 'Kushal Bhurtel',
        role: 'Batsman',
        avatar: 'https://via.placeholder.com/60',
      },
      {
        id: '10',
        name: 'Lalit Rajbanshi',
        role: 'Bowler',
        avatar: 'https://via.placeholder.com/60',
      },
    ],
  },
];

export default function TeamsScreen() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'wins' | 'established'>('name');
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Simulate API call
    const fetchTeams = () => {
      setIsLoading(true);
      setTimeout(() => {
        setTeams(mockTeams);
        setFilteredTeams(mockTeams);
        setIsLoading(false);
      }, 500);
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    filterAndSortTeams();
  }, [searchQuery, sortBy, teams]);

  const filterAndSortTeams = () => {
    let result = [...teams];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        team =>
          team.name.toLowerCase().includes(query) ||
          team.captain.toLowerCase().includes(query) ||
          team.homeGround.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'wins') {
        return b.wins - a.wins; // Descending order
      } else {
        // Sort by established (year)
        return parseInt(b.established) - parseInt(a.established);
      }
    });

    setFilteredTeams(result);
  };

  const handleSortChange = (value: 'name' | 'wins' | 'established') => {
    setSortBy(value);
  };

  const navigateToTeamDetails = (teamId: string) => {
    router.push(`/team/${teamId}`);
  };

  const handleCreateTeam = () => {
    router.push('/create-team');
  };

  const handleEditTeam = (teamId: string) => {
    router.push(`/edit-team/${teamId}`);
  };

  const handleDeleteTeam = (teamId: string) => {
    Alert.alert(
      'Delete Team',
      'Are you sure you want to delete this team? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const updatedTeams = teams.filter(team => team.id !== teamId);
            setTeams(updatedTeams);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderTeamCard = ({ item }: { item: Team }) => {
    const winPercentage = item.matchesPlayed > 0
      ? Math.round((item.wins / item.matchesPlayed) * 100)
      : 0;

    return (
      <TouchableOpacity
        style={styles.teamCard}
        onPress={() => navigateToTeamDetails(item.id)}
      >
        <View style={styles.teamHeader}>
          <Image source={{ uri: item.logo }} style={styles.teamLogo} />
          
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{item.name}</Text>
            <Text style={styles.teamDetail}>Established: {item.established}</Text>
            <Text style={styles.teamDetail}>Captain: {item.captain}</Text>
          </View>
        </View>

        <View style={styles.teamStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.playerCount}</Text>
            <Text style={styles.statLabel}>Players</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.matchesPlayed}</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.wins}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{winPercentage}%</Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
        </View>

        <View style={styles.teamActions}>
          <TouchableOpacity 
            style={styles.viewButton}
            onPress={() => navigateToTeamDetails(item.id)}
          >
            <Text style={styles.viewButtonText}>View Details</Text>
            <ChevronRight size={16} color="#DC143C" />
          </TouchableOpacity>

          <View style={styles.managementButtons}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => handleEditTeam(item.id)}
            >
              <Edit2 size={18} color="#555" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => handleDeleteTeam(item.id)}
            >
              <Trash2 size={18} color="#DC3545" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <AlertCircle size={48} color="#DC143C" />
      <Text style={styles.emptyTitle}>No teams found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'Try changing your search query'
          : 'Create your first team to get started'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateTeam}
        >
          <Text style={styles.createButtonText}>Create Team</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#DC143C', '#8B0000']}
        style={[styles.header, { paddingTop: insets.top > 0 ? insets.top : 20 }]}
      >
        <Text style={styles.headerTitle}>Teams</Text>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#777" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search teams..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateTeam}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Sort by:</Text>
          
          <View style={styles.filterOptions}>
            <TouchableOpacity
              style={[
                styles.filterOption,
                sortBy === 'name' && styles.filterOptionActive,
              ]}
              onPress={() => handleSortChange('name')}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  sortBy === 'name' && styles.filterOptionTextActive,
                ]}
              >
                Name
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterOption,
                sortBy === 'wins' && styles.filterOptionActive,
              ]}
              onPress={() => handleSortChange('wins')}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  sortBy === 'wins' && styles.filterOptionTextActive,
                ]}
              >
                Wins
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterOption,
                sortBy === 'established' && styles.filterOptionActive,
              ]}
              onPress={() => handleSortChange('established')}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  sortBy === 'established' && styles.filterOptionTextActive,
                ]}
              >
                Newest
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      
      <FlatList
        data={filteredTeams}
        renderItem={renderTeamCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  createButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 12,
  },
  filterOptions: {
    flexDirection: 'row',
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    marginRight: 8,
  },
  filterOptionActive: {
    backgroundColor: '#FFFFFF',
  },
  filterOptionText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: '#DC143C',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Extra padding at the bottom
  },
  teamCard: {
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
  teamHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  teamLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  teamInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 6,
  },
  teamDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  teamStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC143C',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#777',
  },
  teamActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    color: '#DC143C',
    fontWeight: '500',
    marginRight: 4,
  },
  managementButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#121212',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
