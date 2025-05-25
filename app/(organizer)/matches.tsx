import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Filter, 
  Plus, 
  ChevronRight, 
  Edit2,
  Trash2,
  AlertCircle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from '@/components/Header';

// Type definitions
interface Match {
  id: string;
  title: string;
  tournament?: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  date: string;
  time: string;
  venue: string;
  team1: {
    id: string;
    name: string;
    logo: string;
    score?: number;
    wickets?: number;
    overs?: number;
  };
  team2: {
    id: string;
    name: string;
    logo: string;
    score?: number;
    wickets?: number;
    overs?: number;
  };
  result?: string;
}

// Mock data
const mockMatches: Match[] = [
  {
    id: '1',
    title: 'Regular Season Match',
    tournament: 'Nepal Premier League',
    status: 'upcoming',
    date: '2025-05-28',
    time: '14:00',
    venue: 'Tribhuvan University Ground, Kirtipur',
    team1: {
      id: '1',
      name: 'Kathmandu Kings',
      logo: 'https://via.placeholder.com/60',
    },
    team2: {
      id: '2',
      name: 'Pokhara Rhinos',
      logo: 'https://via.placeholder.com/60',
    }
  },
  {
    id: '2',
    title: 'Semifinal Match',
    tournament: 'Nepal Premier League',
    status: 'live',
    date: '2025-05-25',
    time: '13:00',
    venue: 'Tribhuvan University Ground, Kirtipur',
    team1: {
      id: '3',
      name: 'Biratnagar Warriors',
      logo: 'https://via.placeholder.com/60',
      score: 165,
      wickets: 5,
      overs: 18.2,
    },
    team2: {
      id: '4',
      name: 'Chitwan Tigers',
      logo: 'https://via.placeholder.com/60',
      score: 120,
      wickets: 3,
      overs: 15.0,
    }
  },
  {
    id: '3',
    title: 'Final Match',
    tournament: 'Everest Premier League',
    status: 'completed',
    date: '2025-05-20',
    time: '15:00',
    venue: 'Kirtipur Cricket Ground',
    team1: {
      id: '5',
      name: 'Lalitpur Patriots',
      logo: 'https://via.placeholder.com/60',
      score: 187,
      wickets: 9,
      overs: 20.0,
    },
    team2: {
      id: '6',
      name: 'Bhairahawa Gladiators',
      logo: 'https://via.placeholder.com/60',
      score: 154,
      wickets: 10,
      overs: 18.3,
    },
    result: 'Lalitpur Patriots won by 33 runs'
  },
  {
    id: '4',
    title: 'Regular Season Match',
    tournament: 'Dhangadhi Premier League',
    status: 'cancelled',
    date: '2025-05-22',
    time: '12:00',
    venue: 'Fapla Cricket Ground, Dhangadhi',
    team1: {
      id: '7',
      name: 'CYC Attariya',
      logo: 'https://via.placeholder.com/60',
    },
    team2: {
      id: '8',
      name: 'Mahendranagar United',
      logo: 'https://via.placeholder.com/60',
    },
    result: 'Cancelled due to rain'
  },
  {
    id: '5',
    title: 'Regular Season Match',
    tournament: 'Nepal Premier League',
    status: 'upcoming',
    date: '2025-05-30',
    time: '15:00',
    venue: 'Tribhuvan University Ground, Kirtipur',
    team1: {
      id: '9',
      name: 'Janakpur Royals',
      logo: 'https://via.placeholder.com/60',
    },
    team2: {
      id: '10',
      name: 'Birgunj Blazers',
      logo: 'https://via.placeholder.com/60',
    }
  },
];

// Main component
export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Simulate API call
    const fetchMatches = () => {
      setIsLoading(true);
      setTimeout(() => {
        setMatches(mockMatches);
        setFilteredMatches(mockMatches);
        setIsLoading(false);
      }, 500);
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    filterMatches();
  }, [selectedFilter, searchQuery, matches]);

  const filterMatches = () => {
    let result = [...matches];

    // Apply status filter if selected
    if (selectedFilter) {
      result = result.filter(match => match.status === selectedFilter);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        match =>
          match.title.toLowerCase().includes(query) ||
          match.tournament?.toLowerCase().includes(query) ||
          match.team1.name.toLowerCase().includes(query) ||
          match.team2.name.toLowerCase().includes(query) ||
          match.venue.toLowerCase().includes(query)
      );
    }

    setFilteredMatches(result);
  };

  const handleFilterSelect = (filter: string | null) => {
    setSelectedFilter(filter === selectedFilter ? null : filter);
  };

  const navigateToMatchDetails = (matchId: string) => {
    router.push(`/match/${matchId}`);
  };

  const handleCreateMatch = () => {
    router.push('/create');
  };

  const handleEditMatch = (id: string) => {
    router.push({pathname: '/(organizer)/edit-match', params: { id }});
  };

  const handleDeleteMatch = (matchId: string) => {
    // Show confirmation dialog and delete match
    const updatedMatches = matches.filter(match => match.id !== matchId);
    setMatches(updatedMatches);
  };

  const renderMatchCard = ({ item }: { item: Match }) => {
    const getStatusColor = (status: Match['status']) => {
      switch (status) {
        case 'live':
          return '#28A745';
        case 'upcoming':
          return '#FFC107';
        case 'completed':
          return '#6C757D';
        case 'cancelled':
          return '#DC3545';
        default:
          return '#6C757D';
      }
    };

    const handleUpdateScore = () => {
      if (item.status === 'live') {
        router.push(`/(organizer)/update-score?matchId=${item.id}`);
      }
    };

    const isLive = item.status === 'live';
    const isUpcoming = item.status === 'upcoming';
    const isCompleted = item.status === 'completed';
    const isCancelled = item.status === 'cancelled';

    const statusColor = getStatusColor(item.status);

    const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    return (
      <View style={styles.matchCard}>
        <View style={styles.matchCardHeader}>
          <View>
            <Text style={styles.matchTitle}>{item.title}</Text>
            {item.tournament && (
              <Text style={styles.tournamentName}>{item.tournament}</Text>
            )}
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
        
        <View style={styles.matchDetails}>
          <View style={styles.detailRow}>
            <Calendar size={16} color="#777" />
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Clock size={16} color="#777" />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MapPin size={16} color="#777" />
            <Text style={styles.detailText}>{item.venue}</Text>
          </View>
        </View>
        
        <View style={styles.teamsContainer}>
          <View style={styles.teamContainer}>
            <Image source={{ uri: item.team1.logo }} style={styles.teamLogo} />
            <Text style={styles.teamName}>{item.team1.name}</Text>
            {isLive || isCompleted ? (
              <Text style={styles.scoreText}>
                {item.team1.score}/{item.team1.wickets} ({item.team1.overs} ov)
              </Text>
            ) : null}
          </View>
          
          <View style={styles.versusContainer}>
            <Text style={styles.versusText}>VS</Text>
          </View>
          
          <View style={styles.teamContainer}>
            <Image source={{ uri: item.team2.logo }} style={styles.teamLogo} />
            <Text style={styles.teamName}>{item.team2.name}</Text>
            {isLive || isCompleted ? (
              <Text style={styles.scoreText}>
                {item.team2.score}/{item.team2.wickets} ({item.team2.overs} ov)
              </Text>
            ) : null}
          </View>
        </View>
        
        {(isCompleted || isCancelled) && item.result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>{item.result}</Text>
          </View>
        )}
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigateToMatchDetails(item.id)}
          >
            <Text style={styles.actionButtonText}>View Details</Text>
            <ChevronRight size={16} color="#DC143C" />
          </TouchableOpacity>
          
          <View style={styles.matchActions}>
            {item.status === 'live' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.updateScoreButton]}
                onPress={handleUpdateScore}
              >
                <Clock size={16} color="#28A745" />
                <Text style={[styles.actionButtonText, styles.updateScoreText]}>Update Score</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditMatch(item.id)}
            >
              <Edit2 size={16} color="#666" />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteMatch(item.id)}
            >
              <Trash2 size={16} color="#DC3545" />
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <AlertCircle size={48} color="#DC143C" />
      <Text style={styles.emptyTitle}>No matches found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery || selectedFilter
          ? 'Try changing your search or filter'
          : 'Create your first match to get started'}
      </Text>
      {!searchQuery && !selectedFilter && (
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateMatch}
        >
          <Text style={styles.createButtonText}>Create Match</Text>
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
        <Text style={styles.headerTitle}>Matches</Text>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#777" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search matches..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <TouchableOpacity
            style={styles.createMatchButton}
            onPress={handleCreateMatch}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === null && styles.filterButtonActive,
            ]}
            onPress={() => handleFilterSelect(null)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === null && styles.filterButtonTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'upcoming' && styles.filterButtonActive,
            ]}
            onPress={() => handleFilterSelect('upcoming')}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === 'upcoming' && styles.filterButtonTextActive,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'live' && styles.filterButtonActive,
            ]}
            onPress={() => handleFilterSelect('live')}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === 'live' && styles.filterButtonTextActive,
              ]}
            >
              Live
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'completed' && styles.filterButtonActive,
            ]}
            onPress={() => handleFilterSelect('completed')}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === 'completed' && styles.filterButtonTextActive,
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'cancelled' && styles.filterButtonActive,
            ]}
            onPress={() => handleFilterSelect('cancelled')}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === 'cancelled' && styles.filterButtonTextActive,
              ]}
            >
              Cancelled
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
      
      <FlatList
        data={filteredMatches}
        renderItem={renderMatchCard}
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
  createMatchButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  filterContent: {
    paddingRight: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#DC143C',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Extra padding at the bottom
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
    marginBottom: 12,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 4,
  },
  tournamentName: {
    fontSize: 12,
    color: '#777',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  matchDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamContainer: {
    flex: 2,
    alignItems: 'center',
  },
  teamLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#121212',
    marginBottom: 4,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  versusContainer: {
    flex: 1,
    alignItems: 'center',
  },
  versusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC143C',
  },
  resultContainer: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 14,
    color: '#121212',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  matchActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    borderColor: '#DC3545',
  },
  deleteButtonText: {
    color: '#DC3545',
  },
  updateScoreButton: {
    borderColor: '#28A745',
  },
  updateScoreText: {
    color: '#28A745',
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
  createButton: {
    backgroundColor: '#DC143C',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
