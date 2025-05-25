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
  Edit2,
  Trash2,
  Users,
  Trophy,
  Calendar,
  Star,
  Shield,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

interface Player {
  id: string;
  name: string;
  role: string;
  matches: number;
  runs: number;
  wickets: number;
  average: number;
  isCaptain: boolean;
  image: string;
}

interface TeamStats {
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  totalRuns: number;
  totalWickets: number;
  winPercentage: number;
}

interface Team {
  id: string;
  name: string;
  logo: string;
  establishedYear: number;
  homeGround: string;
  players: Player[];
  stats: TeamStats;
}

export default function TeamDetailView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTeamData();
  }, [id]);

  const loadTeamData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockTeam: Team = {
        id,
        name: 'Kathmandu Kings',
        logo: 'https://via.placeholder.com/100',
        establishedYear: 2020,
        homeGround: 'Tribhuvan University Ground',
        players: [
          {
            id: '1',
            name: 'Paras Khadka',
            role: 'All-rounder',
            matches: 45,
            runs: 1250,
            wickets: 30,
            average: 35.5,
            isCaptain: true,
            image: 'https://via.placeholder.com/60',
          },
          // Add more mock players...
        ],
        stats: {
          totalMatches: 50,
          wins: 30,
          losses: 15,
          draws: 5,
          totalRuns: 5000,
          totalWickets: 250,
          winPercentage: 60,
        },
      };
      setTeam(mockTeam);
    } catch (error) {
      console.error('Failed to load team data:', error);
      Alert.alert('Error', 'Failed to load team data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTeam = () => {
    router.push(`/(organizer)/team/edit/${id}`);
  };

  const handleDeleteTeam = () => {
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
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Implement team deletion
              router.back();
            } catch (error) {
              console.error('Failed to delete team:', error);
              Alert.alert('Error', 'Failed to delete team');
            }
          },
        },
      ]
    );
  };

  if (isLoading || !team) {
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
          <Text style={styles.headerTitle}>{team.name}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleEditTeam} style={styles.actionButton}>
              <Edit2 size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteTeam} style={styles.actionButton}>
              <Trash2 size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.teamInfo}>
          <Image source={{ uri: team.logo }} style={styles.teamLogo} />
          <View style={styles.teamDetails}>
            <Text style={styles.establishedYear}>Est. {team.establishedYear}</Text>
            <Text style={styles.homeGround}>{team.homeGround}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statsCard}>
            <Trophy size={24} color="#DC143C" />
            <Text style={styles.statsValue}>{team.stats.wins}</Text>
            <Text style={styles.statsLabel}>Wins</Text>
          </View>
          <View style={styles.statsCard}>
            <Calendar size={24} color="#1976D2" />
            <Text style={styles.statsValue}>{team.stats.totalMatches}</Text>
            <Text style={styles.statsLabel}>Matches</Text>
          </View>
          <View style={styles.statsCard}>
            <Star size={24} color="#FFC107" />
            <Text style={styles.statsValue}>{team.stats.winPercentage}%</Text>
            <Text style={styles.statsLabel}>Win Rate</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Squad</Text>
            <Users size={20} color="#666" />
          </View>
          {team.players.map((player) => (
            <TouchableOpacity
              key={player.id}
              style={styles.playerCard}
              onPress={() => router.push(`/(organizer)/player/${player.id}`)}
            >
              <Image source={{ uri: player.image }} style={styles.playerImage} />
              <View style={styles.playerInfo}>
                <View style={styles.playerNameRow}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  {player.isCaptain && (
                    <View style={styles.captainBadge}>
                      <Shield size={12} color="#DC143C" />
                      <Text style={styles.captainText}>Captain</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.playerRole}>{player.role}</Text>
                <View style={styles.playerStats}>
                  <Text style={styles.playerStatItem}>M: {player.matches}</Text>
                  <Text style={styles.playerStatItem}>R: {player.runs}</Text>
                  <Text style={styles.playerStatItem}>W: {player.wickets}</Text>
                  <Text style={styles.playerStatItem}>Avg: {player.average}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  teamInfo: {
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  teamLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  teamDetails: {
    alignItems: 'center',
  },
  establishedYear: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  homeGround: {
    fontSize: 14,
    color: '#999',
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  statsCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statsLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerCard: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  playerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  captainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  captainText: {
    fontSize: 12,
    color: '#DC143C',
    marginLeft: 4,
  },
  playerRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  playerStats: {
    flexDirection: 'row',
    gap: 12,
  },
  playerStatItem: {
    fontSize: 12,
    color: '#999',
  },
});
