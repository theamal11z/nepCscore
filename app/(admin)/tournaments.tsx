import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

// Import icons individually
import { User } from 'lucide-react-native';
import { Users } from 'lucide-react-native';
import { Trophy } from 'lucide-react-native';
import { Settings } from 'lucide-react-native';
import { Search } from 'lucide-react-native';
import { Filter } from 'lucide-react-native';
import { Plus } from 'lucide-react-native';
import { Calendar } from 'lucide-react-native';
import { MapPin } from 'lucide-react-native';
import { Edit2 } from 'lucide-react-native';
import { Eye } from 'lucide-react-native';
import { Trash2 } from 'lucide-react-native';
import { X } from 'lucide-react-native';
import { ArrowUpDown } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';

interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  logo: string;
  teams: number;
  matches: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  organizer: {
    id: string;
    name: string;
    avatar: string;
  };
  format: 'T20' | 'ODI' | 'Test' | 'Mixed';
}

// Mock API function to fetch tournaments data
const getTournamentsData = async (): Promise<Tournament[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: 't1',
      name: 'Nepal Premier League 2025',
      startDate: '2025-05-15',
      endDate: '2025-06-20',
      location: 'Multiple venues across Nepal',
      logo: 'https://via.placeholder.com/60',
      teams: 8,
      matches: 31,
      status: 'ongoing',
      organizer: {
        id: 'o1',
        name: 'Nepal Cricket Board',
        avatar: 'https://via.placeholder.com/40',
      },
      format: 'T20',
    },
    {
      id: 't2',
      name: 'Everest T20 Cup',
      startDate: '2025-05-10',
      endDate: '2025-05-30',
      location: 'Tribhuvan University Ground, Kirtipur',
      logo: 'https://via.placeholder.com/60',
      teams: 6,
      matches: 16,
      status: 'ongoing',
      organizer: {
        id: 'o2',
        name: 'Everest Sports Management',
        avatar: 'https://via.placeholder.com/40',
      },
      format: 'T20',
    },
    {
      id: 't3',
      name: 'Kathmandu Mayor Cup',
      startDate: '2025-07-05',
      endDate: '2025-07-25',
      location: 'Kirtipur Cricket Ground',
      logo: 'https://via.placeholder.com/60',
      teams: 10,
      matches: 25,
      status: 'upcoming',
      organizer: {
        id: 'o3',
        name: 'Kathmandu Metropolitan City',
        avatar: 'https://via.placeholder.com/40',
      },
      format: 'T20',
    },
    {
      id: 't4',
      name: 'Pokhara Premier League',
      startDate: '2025-04-05',
      endDate: '2025-04-25',
      location: 'Pokhara Rangasala',
      logo: 'https://via.placeholder.com/60',
      teams: 6,
      matches: 17,
      status: 'completed',
      organizer: {
        id: 'o4',
        name: 'Pokhara Sports Club',
        avatar: 'https://via.placeholder.com/40',
      },
      format: 'T20',
    },
    {
      id: 't5',
      name: 'Dhangadhi Premier League',
      startDate: '2025-03-10',
      endDate: '2025-03-28',
      location: 'SSP Cricket Ground, Dhangadhi',
      logo: 'https://via.placeholder.com/60',
      teams: 6,
      matches: 17,
      status: 'completed',
      organizer: {
        id: 'o5',
        name: 'Dhangadhi Cricket Academy',
        avatar: 'https://via.placeholder.com/40',
      },
      format: 'T20',
    },
    {
      id: 't6',
      name: 'Nepal ODI Series',
      startDate: '2025-08-15',
      endDate: '2025-08-30',
      location: 'Tribhuvan University Ground, Kirtipur',
      logo: 'https://via.placeholder.com/60',
      teams: 4,
      matches: 6,
      status: 'upcoming',
      organizer: {
        id: 'o1',
        name: 'Nepal Cricket Board',
        avatar: 'https://via.placeholder.com/40',
      },
      format: 'ODI',
    },
  ];
};

export default function TournamentsManagement() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedFormatFilter, setSelectedFormatFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<{ field: string; ascending: boolean }>({
    field: 'startDate',
    ascending: false,
  });

  useEffect(() => {
    loadTournamentsData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedStatusFilter, selectedFormatFilter, tournaments, sortBy]);

  const loadTournamentsData = async () => {
    setIsLoading(true);
    try {
      const data = await getTournamentsData();
      setTournaments(data);
      setFilteredTournaments(data);
    } catch (error) {
      console.error('Failed to load tournaments data:', error);
      Alert.alert('Error', 'Failed to load tournaments data');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTournamentsData();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let result = [...tournaments];

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const lowercaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        tournament =>
          tournament.name.toLowerCase().includes(lowercaseQuery) ||
          tournament.organizer.name.toLowerCase().includes(lowercaseQuery) ||
          tournament.location.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Apply status filter
    if (selectedStatusFilter !== 'all') {
      result = result.filter(tournament => tournament.status === selectedStatusFilter);
    }

    // Apply format filter
    if (selectedFormatFilter !== 'all') {
      result = result.filter(tournament => tournament.format === selectedFormatFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;

      // Determine which field to sort by
      switch (sortBy.field) {
        case 'name':
          valueA = a.name;
          valueB = b.name;
          break;
        case 'startDate':
          valueA = new Date(a.startDate).getTime();
          valueB = new Date(b.startDate).getTime();
          break;
        case 'teams':
          valueA = a.teams;
          valueB = b.teams;
          break;
        case 'matches':
          valueA = a.matches;
          valueB = b.matches;
          break;
        default:
          valueA = new Date(a.startDate).getTime();
          valueB = new Date(b.startDate).getTime();
      }

      // Perform the comparison
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortBy.ascending
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        // For dates or numbers
        return sortBy.ascending ? (valueA - valueB) : (valueB - valueA);
      }
    });

    setFilteredTournaments(result);
  };

  const toggleSortDirection = (field: string) => {
    if (sortBy.field === field) {
      setSortBy({ field, ascending: !sortBy.ascending });
    } else {
      setSortBy({ field, ascending: true });
    }
  };

  const handleTournamentAction = (tournamentId: string, action: 'view' | 'edit' | 'delete') => {
    switch (action) {
      case 'view':
        router.push(`/(admin)/tournament/${tournamentId}`);
        break;
      case 'edit':
        router.push(`/(admin)/tournament/edit/${tournamentId}`);
        break;
      case 'delete':
        Alert.alert(
          'Delete Tournament',
          'Are you sure you want to delete this tournament? This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                // In a real app, this would call an API
                setTournaments(tournaments.filter(t => t.id !== tournamentId));
              },
            },
          ]
        );
        break;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return { backgroundColor: '#E6F7FF', color: '#1E90FF' };
      case 'ongoing':
        return { backgroundColor: '#E6FFFA', color: '#20B2AA' };
      case 'completed':
        return { backgroundColor: '#F5F5F5', color: '#888888' };
      case 'cancelled':
        return { backgroundColor: '#FFE5E5', color: '#DC143C' };
      default:
        return { backgroundColor: '#E6FFFA', color: '#20B2AA' };
    }
  };

  if (isLoading && tournaments.length === 0) {
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
          <Text style={styles.headerTitle}>Tournament Management</Text>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => router.push('/(admin)/tournament/create')}
          >
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tournaments..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Filters</Text>
          
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status:</Text>
            <View style={styles.filterOptions}>
              {['all', 'upcoming', 'ongoing', 'completed', 'cancelled'].map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterOption,
                    selectedStatusFilter === status && styles.filterOptionSelected,
                  ]}
                  onPress={() => setSelectedStatusFilter(status)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedStatusFilter === status && styles.filterOptionTextSelected,
                    ]}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Format:</Text>
            <View style={styles.filterOptions}>
              {['all', 'T20', 'ODI', 'Test', 'Mixed'].map(format => (
                <TouchableOpacity
                  key={format}
                  style={[
                    styles.filterOption,
                    selectedFormatFilter === format && styles.filterOptionSelected,
                  ]}
                  onPress={() => setSelectedFormatFilter(format)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedFormatFilter === format && styles.filterOptionTextSelected,
                    ]}
                  >
                    {format === 'all' ? 'All' : format}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      <View style={styles.sortHeader}>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => toggleSortDirection('name')}
        >
          <Text 
            style={[
              styles.sortButtonText, 
              sortBy.field === 'name' && styles.sortButtonTextActive
            ]}
          >
            Name
          </Text>
          {sortBy.field === 'name' && (
            <ArrowUpDown size={14} color={sortBy.field === 'name' ? '#DC143C' : '#666'} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => toggleSortDirection('startDate')}
        >
          <Text 
            style={[
              styles.sortButtonText, 
              sortBy.field === 'startDate' && styles.sortButtonTextActive
            ]}
          >
            Date
          </Text>
          {sortBy.field === 'startDate' && (
            <ArrowUpDown size={14} color={sortBy.field === 'startDate' ? '#DC143C' : '#666'} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => toggleSortDirection('teams')}
        >
          <Text 
            style={[
              styles.sortButtonText, 
              sortBy.field === 'teams' && styles.sortButtonTextActive
            ]}
          >
            Teams
          </Text>
          {sortBy.field === 'teams' && (
            <ArrowUpDown size={14} color={sortBy.field === 'teams' ? '#DC143C' : '#666'} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#DC143C']} />
        }
      >
        {filteredTournaments.length === 0 ? (
          <Text style={styles.emptyStateText}>
            No tournaments found. Try adjusting your search or filters.
          </Text>
        ) : (
          filteredTournaments.map(tournament => (
            <View
              key={tournament.id}
              style={styles.tournamentCard}
            >
              <TouchableOpacity 
                style={styles.tournamentHeader}
                onPress={() => router.push(`/(admin)/tournament/${tournament.id}`)}
              >
                <Image source={{ uri: tournament.logo }} style={styles.tournamentLogo} />
                <View style={styles.tournamentInfo}>
                  <Text style={styles.tournamentName}>{tournament.name}</Text>
                  <View style={styles.tournamentMeta}>
                    <View 
                      style={[
                        styles.statusBadge, 
                        { backgroundColor: getStatusBadgeColor(tournament.status).backgroundColor }
                      ]}
                    >
                      <Text 
                        style={[
                          styles.statusText, 
                          { color: getStatusBadgeColor(tournament.status).color }
                        ]}
                      >
                        {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                      </Text>
                    </View>
                    <Text style={styles.formatText}>{tournament.format}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              
              <View style={styles.tournamentDetails}>
                <View style={styles.detailItem}>
                  <Calendar size={16} color="#666" />
                  <Text style={styles.detailText}>
                    {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.detailItem}>
                  <MapPin size={16} color="#666" />
                  <Text style={styles.detailText} numberOfLines={1}>{tournament.location}</Text>
                </View>
                
                <View style={styles.detailStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{tournament.teams}</Text>
                    <Text style={styles.statLabel}>Teams</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{tournament.matches}</Text>
                    <Text style={styles.statLabel}>Matches</Text>
                  </View>
                </View>
                
                <View style={styles.organizer}>
                  <Text style={styles.organizerLabel}>Organizer:</Text>
                  <View style={styles.organizerInfo}>
                    <Image source={{ uri: tournament.organizer.avatar }} style={styles.organizerAvatar} />
                    <Text style={styles.organizerName}>{tournament.organizer.name}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.tournamentActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleTournamentAction(tournament.id, 'view')}
                >
                  <Eye size={16} color="#fff" />
                  <Text style={styles.actionButtonText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.actionButtonOutline]}
                  onPress={() => handleTournamentAction(tournament.id, 'edit')}
                >
                  <Edit2 size={16} color="#DC143C" />
                  <Text style={styles.actionButtonOutlineText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.actionButtonOutline, styles.actionButtonDanger]}
                  onPress={() => handleTournamentAction(tournament.id, 'delete')}
                >
                  <Trash2 size={16} color="#DC143C" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.push('/(admin)/')}
        >
          <User size={24} color="#666" />
          <Text style={styles.navLabel}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push('/(admin)/users')}
        >
          <Users size={24} color="#666" />
          <Text style={styles.navLabel}>Users</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonActive]}
        >
          <Trophy size={24} color="#DC143C" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Tournaments</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.push('/(admin)/settings')}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    padding: 8,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },
  filterOptionSelected: {
    backgroundColor: '#DC143C',
    borderColor: '#DC143C',
  },
  filterOptionText: {
    fontSize: 12,
    color: '#666',
  },
  filterOptionTextSelected: {
    color: '#fff',
  },
  sortHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  sortButtonTextActive: {
    color: '#DC143C',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  tournamentCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tournamentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tournamentLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  tournamentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  formatText: {
    fontSize: 12,
    color: '#666',
  },
  tournamentDetails: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  detailStats: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 12,
  },
  statItem: {
    marginRight: 24,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  organizer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  organizerName: {
    fontSize: 14,
    color: '#333',
  },
  tournamentActions: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'flex-start',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC143C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  actionButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#DC143C',
  },
  actionButtonDanger: {
    borderColor: '#DC143C',
    paddingHorizontal: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 8,
  },
  actionButtonOutlineText: {
    color: '#DC143C',
    fontWeight: '500',
    marginLeft: 8,
  },
  emptyStateText: {
    textAlign: 'center',
    padding: 24,
    color: '#666',
    fontStyle: 'italic',
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
