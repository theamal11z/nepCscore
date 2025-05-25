import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Import icons
import { Edit2, Trash2, Award, Users, Calendar, MapPin, Clock, Trophy } from 'lucide-react-native';

// Types
interface TournamentDetail {
  id: string;
  name: string;
  format: string;
  status: string;
  startDate: string;
  endDate: string;
  teams: number;
  matches: number;
  completed: number;
  venue: string;
  logo?: string;
  description?: string;
}

// Mock data - replace with actual API calls
const getTournamentDetails = async (id: string): Promise<TournamentDetail> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id,
    name: 'Premier Cricket League 2025',
    format: 'T20',
    status: 'In Progress',
    startDate: '2025-05-01',
    endDate: '2025-06-30',
    teams: 8,
    matches: 56,
    completed: 24,
    venue: 'Multiple Venues',
    logo: 'https://via.placeholder.com/100',
    description: 'The premier cricket league featuring the top teams from across Nepal.'
  };
};

export default function TournamentDetailScreen() {
  const { id } = useLocalSearchParams();
  const [tournament, setTournament] = useState<TournamentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTournamentData();
  }, [id]);

  const loadTournamentData = async () => {
    setIsLoading(true);
    try {
      const data = await getTournamentDetails(id as string);
      setTournament(data);
    } catch (error) {
      console.error('Failed to load tournament data:', error);
      Alert.alert('Error', 'Failed to load tournament data');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTournamentData();
    setRefreshing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Tournament',
      'Are you sure you want to delete this tournament? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // API call to delete tournament
            Alert.alert('Success', 'Tournament deleted successfully');
            router.back();
          } 
        },
      ]
    );
  };

  if (isLoading && !tournament) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading tournament details...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Stack.Screen 
        options={{
          title: tournament?.name || 'Tournament Details',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                onPress={() => router.push(`/(admin)/tournament/edit/${id}`)}
                style={styles.headerButton}
              >
                <Edit2 size={20} color="#333333" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleDelete}
                style={styles.headerButton}
              >
                <Trash2 size={20} color="#E53935" />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />

      {tournament && (
        <>
          <View style={styles.headerSection}>
            <View style={styles.tournamentHeader}>
              {tournament.logo ? (
                <Image source={{ uri: tournament.logo }} style={styles.logo} />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <Trophy size={40} color="#E53935" />
                </View>
              )}
              <View style={styles.headerInfo}>
                <Text style={styles.tournamentName}>{tournament.name}</Text>
                <View style={styles.statusContainer}>
                  <Text 
                    style={[styles.statusText, 
                      tournament.status === 'In Progress' ? styles.statusInProgress :
                      tournament.status === 'Upcoming' ? styles.statusUpcoming :
                      styles.statusCompleted
                    ]}
                  >  
                    {tournament.status}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.dateVenueContainer}>
              <View style={styles.infoRow}>
                <Calendar size={16} color="#666" />
                <Text style={styles.infoText}>
                  {tournament.startDate} - {tournament.endDate}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <MapPin size={16} color="#666" />
                <Text style={styles.infoText}>{tournament.venue}</Text>
              </View>
            </View>

            {tournament.description && (
              <Text style={styles.description}>{tournament.description}</Text>
            )}
          </View>

          <View style={styles.statsContainer}>
            <LinearGradient
              colors={['#E53935', '#D32F2F']}
              style={styles.statsCard}
            >
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{tournament.format}</Text>
                <Text style={styles.statLabel}>Format</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{tournament.teams}</Text>
                <Text style={styles.statLabel}>Teams</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{tournament.matches}</Text>
                <Text style={styles.statLabel}>Matches</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push(`/(admin)/tournament/teams/${id}`)}
            >
              <Users size={24} color="#E53935" />
              <Text style={styles.actionButtonText}>Teams</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push(`/(admin)/tournament/matches/${id}`)}
            >
              <Calendar size={24} color="#E53935" />
              <Text style={styles.actionButtonText}>Matches</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Tournament Progress</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(tournament.completed / tournament.matches) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {tournament.completed} of {tournament.matches} matches completed
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerButtons: {
    flexDirection: 'row',
    marginRight: 10,
  },
  headerButton: {
    marginLeft: 15,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  tournamentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  tournamentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  statusContainer: {
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  statusInProgress: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
  },
  statusUpcoming: {
    backgroundColor: '#E8F5E9',
    color: '#388E3C',
  },
  statusCompleted: {
    backgroundColor: '#FFEBEE',
    color: '#D32F2F',
  },
  dateVenueContainer: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#666666',
    fontSize: 14,
  },
  description: {
    color: '#666666',
    fontSize: 14,
    lineHeight: 20,
  },
  statsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionButtonText: {
    marginTop: 8,
    color: '#333333',
    fontWeight: '500',
  },
  progressSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E53935',
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    color: '#666666',
  },
});
