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
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Camera, Plus, Trash2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';

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

interface Team {
  id: string;
  name: string;
  logo: string;
  establishedYear: number;
  homeGround: string;
  players: Player[];
}

export default function EditTeam() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [teamName, setTeamName] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [homeGround, setHomeGround] = useState('');
  const [logo, setLogo] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [captainId, setCaptainId] = useState<string>('');

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
        ],
      };
      setTeam(mockTeam);
      setTeamName(mockTeam.name);
      setEstablishedYear(mockTeam.establishedYear.toString());
      setHomeGround(mockTeam.homeGround);
      setLogo(mockTeam.logo);
      setPlayers(mockTeam.players);
      const captain = mockTeam.players.find(p => p.isCaptain);
      if (captain) {
        setCaptainId(captain.id);
      }
    } catch (error) {
      console.error('Failed to load team data:', error);
      Alert.alert('Error', 'Failed to load team data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setLogo(result.assets[0].uri);
    }
  };

  const handleAddPlayer = () => {
    router.push('/(organizer)/player/create');
  };

  const handleRemovePlayer = (playerId: string) => {
    Alert.alert(
      'Remove Player',
      'Are you sure you want to remove this player from the team?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPlayers(players.filter(p => p.id !== playerId));
            if (captainId === playerId) {
              setCaptainId('');
            }
          },
        },
      ]
    );
  };

  const handleSetCaptain = (playerId: string) => {
    setCaptainId(playerId);
    setPlayers(
      players.map(p => ({
        ...p,
        isCaptain: p.id === playerId,
      }))
    );
  };

  const handleSave = async () => {
    try {
      const updatedTeam = {
        id,
        name: teamName,
        logo,
        establishedYear: parseInt(establishedYear, 10),
        homeGround,
        players,
      };

      // TODO: Implement API call to update team
      console.log('Saving team:', updatedTeam);

      router.back();
    } catch (error) {
      console.error('Failed to save team:', error);
      Alert.alert('Error', 'Failed to save team');
    }
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
          <Text style={styles.headerTitle}>Edit Team</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.logoSection}>
          <TouchableOpacity onPress={handlePickImage} style={styles.logoContainer}>
            {logo ? (
              <Image source={{ uri: logo }} style={styles.logo} />
            ) : (
              <Camera size={40} color="#666" />
            )}
          </TouchableOpacity>
          <Text style={styles.logoHint}>Tap to change team logo</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Team Name</Text>
            <TextInput
              style={styles.input}
              value={teamName}
              onChangeText={setTeamName}
              placeholder="Enter team name"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Established Year</Text>
            <TextInput
              style={styles.input}
              value={establishedYear}
              onChangeText={setEstablishedYear}
              placeholder="Enter established year"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Home Ground</Text>
            <TextInput
              style={styles.input}
              value={homeGround}
              onChangeText={setHomeGround}
              placeholder="Enter home ground"
            />
          </View>

          <View style={styles.playersSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Players</Text>
              <TouchableOpacity onPress={handleAddPlayer} style={styles.addButton}>
                <Plus size={20} color="#DC143C" />
                <Text style={styles.addButtonText}>Add Player</Text>
              </TouchableOpacity>
            </View>

            {players.map(player => (
              <View key={player.id} style={styles.playerCard}>
                <Image source={{ uri: player.image }} style={styles.playerImage} />
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerRole}>{player.role}</Text>
                </View>
                <View style={styles.playerActions}>
                  <TouchableOpacity
                    onPress={() => handleSetCaptain(player.id)}
                    style={[
                      styles.captainButton,
                      captainId === player.id && styles.captainButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.captainButtonText,
                        captainId === player.id && styles.captainButtonTextActive,
                      ]}
                    >
                      Captain
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleRemovePlayer(player.id)}
                    style={styles.removeButton}
                  >
                    <Trash2 size={20} color="#DC143C" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  saveButtonText: {
    color: '#DC143C',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  logoSection: {
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  logoHint: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  playersSection: {
    marginTop: 24,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  addButtonText: {
    marginLeft: 4,
    color: '#DC143C',
    fontWeight: '500',
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  playerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  playerRole: {
    fontSize: 14,
    color: '#666',
  },
  playerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  captainButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DC143C',
  },
  captainButtonActive: {
    backgroundColor: '#DC143C',
  },
  captainButtonText: {
    color: '#DC143C',
    fontSize: 12,
    fontWeight: '500',
  },
  captainButtonTextActive: {
    color: '#fff',
  },
  removeButton: {
    padding: 8,
  },
});
