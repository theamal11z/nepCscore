import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router, Stack } from 'expo-router';
import {
  Users,
  User,
  ChevronLeft,
  Check,
  Plus,
  X,
  Upload,
  Trash2,
  Award,
} from 'lucide-react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Type definitions
interface Player {
  id: string;
  name: string;
  role: string;
  isSelected: boolean;
  avatar: string;
}

interface PlayerRole {
  id: string;
  name: string;
}

// Mock data
const mockPlayers: Player[] = [
  { id: '1', name: 'Gyanendra Malla', role: 'Batsman', isSelected: false, avatar: 'https://via.placeholder.com/60' },
  { id: '2', name: 'Sandeep Lamichhane', role: 'Bowler', isSelected: false, avatar: 'https://via.placeholder.com/60' },
  { id: '3', name: 'Binod Bhandari', role: 'Wicket-keeper', isSelected: false, avatar: 'https://via.placeholder.com/60' },
  { id: '4', name: 'Karan KC', role: 'Bowler', isSelected: false, avatar: 'https://via.placeholder.com/60' },
  { id: '5', name: 'Rohit Paudel', role: 'Batsman', isSelected: false, avatar: 'https://via.placeholder.com/60' },
  { id: '6', name: 'Dipendra Singh Airee', role: 'All-rounder', isSelected: false, avatar: 'https://via.placeholder.com/60' },
  { id: '7', name: 'Sompal Kami', role: 'All-rounder', isSelected: false, avatar: 'https://via.placeholder.com/60' },
  { id: '8', name: 'Kushal Bhurtel', role: 'Batsman', isSelected: false, avatar: 'https://via.placeholder.com/60' },
];

const playerRoles: PlayerRole[] = [
  { id: 'batsman', name: 'Batsman' },
  { id: 'bowler', name: 'Bowler' },
  { id: 'all-rounder', name: 'All-rounder' },
  { id: 'wicket-keeper', name: 'Wicket-keeper' },
  { id: 'captain', name: 'Captain' },
];

export default function CreateTeamScreen() {
  // Use default insets as fallback in case the hook doesn't work
  let insets = { top: Platform.OS === 'ios' ? 20 : 0, bottom: 0, left: 0, right: 0 };
  
  try {
    // Try to get the insets from the hook
    const safeAreaInsets = useSafeAreaInsets();
    // Only update if we actually got valid insets
    if (safeAreaInsets && typeof safeAreaInsets.top === 'number') {
      insets = safeAreaInsets;
    }
  } catch (error) {
    console.warn('Error using safe area insets:', error);
  }

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [teamName, setTeamName] = useState('');
  const [teamLogo, setTeamLogo] = useState('https://via.placeholder.com/120');
  const [established, setEstablished] = useState('');
  const [homeGround, setHomeGround] = useState('');
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  // Player state
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerRole, setNewPlayerRole] = useState<string | null>(null);
  
  // Dropdown open state
  const [captainOpen, setCaptainOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  
  // Form validation
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setIsLoading(true);
    // Simulate API calls
    setTimeout(() => {
      setPlayers(mockPlayers);
      setIsLoading(false);
    }, 1000);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!teamName.trim()) {
      newErrors.teamName = 'Team name is required';
    }

    if (!established.trim()) {
      newErrors.established = 'Established year is required';
    } else if (isNaN(Number(established)) || Number(established) < 1900 || Number(established) > new Date().getFullYear()) {
      newErrors.established = 'Please enter a valid year';
    }

    if (!homeGround.trim()) {
      newErrors.homeGround = 'Home ground is required';
    }

    if (selectedPlayers.length === 0) {
      newErrors.players = 'At least one player is required';
    }

    if (!captainId) {
      newErrors.captain = 'Captain selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveTeam = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    setIsSaving(true);

    // Prepare team data
    const teamData = {
      name: teamName,
      logo: teamLogo,
      established,
      homeGround,
      captainId,
      description,
      website,
      isFeatured,
      isVerified,
      players: selectedPlayers,
    };

    // Simulate API call to save team
    setTimeout(() => {
      console.log('Team data:', teamData);
      setIsSaving(false);
      Alert.alert(
        'Success',
        'Team created successfully',
        [
          {
            text: 'View Teams',
            onPress: () => router.navigate({
              pathname: '/(organizer)/teams'
            }),
          },
          {
            text: 'Create Another',
            onPress: () => {
              // Reset form
              setTeamName('');
              setEstablished('');
              setHomeGround('');
              setDescription('');
              setWebsite('');
              setSelectedPlayers([]);
              setCaptainId(null);
            },
          },
        ]
      );
    }, 1500);
  };

  const handlePlayerSelection = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
      
      // If this was the captain, reset captain
      if (captainId === playerId) {
        setCaptainId(null);
      }
    } else {
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };

  const handleAddNewPlayer = () => {
    if (!newPlayerName.trim()) {
      Alert.alert('Error', 'Player name is required');
      return;
    }

    if (!newPlayerRole) {
      Alert.alert('Error', 'Player role is required');
      return;
    }

    const newPlayerId = `new-${Date.now()}`;
    const roleName = playerRoles.find(role => role.id === newPlayerRole)?.name || '';
    
    const newPlayer: Player = {
      id: newPlayerId,
      name: newPlayerName,
      role: roleName,
      isSelected: true,
      avatar: 'https://via.placeholder.com/60',
    };

    setPlayers([...players, newPlayer]);
    setSelectedPlayers([...selectedPlayers, newPlayerId]);
    setNewPlayerName('');
    setNewPlayerRole(null);
  };

  const handleUploadLogo = () => {
    Alert.alert(
      'Upload Team Logo',
      'This feature will allow you to upload a team logo from your device or take a new photo.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => console.log('Upload logo functionality would be implemented here'),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DC143C" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: 'Create Team',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTitleStyle: {
            color: '#121212',
            fontSize: 18,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ChevronLeft size={24} color="#121212" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Team Information</Text>

          <View style={styles.logoSection}>
            <Image source={{ uri: teamLogo }} style={styles.logoPreview} />
            <TouchableOpacity
              style={styles.uploadLogoButton}
              onPress={handleUploadLogo}
            >
              <Upload size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.uploadLogoText}>Upload Logo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Team Name *</Text>
            <TextInput
              style={[styles.input, errors.teamName && styles.inputError]}
              placeholder="Enter team name"
              value={teamName}
              onChangeText={setTeamName}
            />
            {errors.teamName && (
              <Text style={styles.errorText}>{errors.teamName}</Text>
            )}
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Established Year *</Text>
              <TextInput
                style={[styles.input, errors.established && styles.inputError]}
                placeholder="e.g., 2018"
                value={established}
                onChangeText={setEstablished}
                keyboardType="numeric"
                maxLength={4}
              />
              {errors.established && (
                <Text style={styles.errorText}>{errors.established}</Text>
              )}
            </View>

            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Home Ground *</Text>
              <TextInput
                style={[styles.input, errors.homeGround && styles.inputError]}
                placeholder="Enter home ground"
                value={homeGround}
                onChangeText={setHomeGround}
              />
              {errors.homeGround && (
                <Text style={styles.errorText}>{errors.homeGround}</Text>
              )}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Team Website</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter team website URL"
              value={website}
              onChangeText={setWebsite}
              keyboardType="url"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter team description, history, or achievements"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Team Players</Text>
          <Text style={styles.sectionDescription}>
            Select players for this team and assign a captain.
          </Text>

          {errors.players && (
            <Text style={[styles.errorText, { marginBottom: 12 }]}>{errors.players}</Text>
          )}

          <View style={styles.playerSelectionContainer}>
            {players.map(player => (
              <TouchableOpacity
                key={player.id}
                style={[
                  styles.playerItem,
                  selectedPlayers.includes(player.id) && styles.playerItemSelected,
                  captainId === player.id && styles.captainItem,
                ]}
                onPress={() => handlePlayerSelection(player.id)}
              >
                <Image source={{ uri: player.avatar }} style={styles.playerAvatar} />
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerRole}>{player.role}</Text>
                </View>
                {captainId === player.id && (
                  <View style={styles.captainBadge}>
                    <Award size={14} color="#FFFFFF" />
                    <Text style={styles.captainText}>Captain</Text>
                  </View>
                )}
                {selectedPlayers.includes(player.id) ? (
                  <TouchableOpacity 
                    style={styles.playerSelectedIndicator}
                    onPress={() => handlePlayerSelection(player.id)}
                  >
                    <Check size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={styles.playerAddIndicator}
                    onPress={() => handlePlayerSelection(player.id)}
                  >
                    <Plus size={16} color="#DC143C" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.addPlayerContainer}>
            <Text style={styles.addPlayerTitle}>Add New Player</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Player Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter player name"
                value={newPlayerName}
                onChangeText={setNewPlayerName}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Player Role</Text>
              <DropDownPicker
                open={roleOpen}
                value={newPlayerRole}
                items={playerRoles.map(role => ({
                  label: role.name,
                  value: role.id,
                }))}
                setOpen={setRoleOpen}
                setValue={setNewPlayerRole}
                placeholder="Select player role"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                listItemContainerStyle={styles.dropdownItem}
                placeholderStyle={styles.dropdownPlaceholder}
                zIndex={3000}
                zIndexInverse={1000}
              />
            </View>
            
            <TouchableOpacity
              style={styles.addPlayerButton}
              onPress={handleAddNewPlayer}
            >
              <Plus size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.addPlayerButtonText}>Add Player</Text>
            </TouchableOpacity>
          </View>

          {selectedPlayers.length > 0 && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Team Captain *</Text>
              <DropDownPicker
                open={captainOpen}
                value={captainId}
                items={players
                  .filter(player => selectedPlayers.includes(player.id))
                  .map(player => ({
                    label: player.name,
                    value: player.id,
                  }))}
                setOpen={setCaptainOpen}
                setValue={setCaptainId}
                placeholder="Select team captain"
                style={[styles.dropdown, errors.captain && styles.dropdownError]}
                dropDownContainerStyle={styles.dropdownContainer}
                listItemContainerStyle={styles.dropdownItem}
                placeholderStyle={styles.dropdownPlaceholder}
                zIndex={2000}
                zIndexInverse={2000}
              />
              {errors.captain && (
                <Text style={styles.errorText}>{errors.captain}</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Additional Options</Text>

          <View style={styles.switchContainer}>
            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Featured Team</Text>
              <Switch
                value={isFeatured}
                onValueChange={setIsFeatured}
                trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <Text style={styles.switchDescription}>
              Highlight this team on the home page and in search results
            </Text>
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Verified Team</Text>
              <Switch
                value={isVerified}
                onValueChange={setIsVerified}
                trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <Text style={styles.switchDescription}>
              Mark this team as officially verified in the system
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.navigate({
              pathname: '/(organizer)/create'
            })}
            disabled={isSaving}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveTeam}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Check size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>Create Team</Text>
              </>
            )}
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#777',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 50,
  },
  backButton: {
    marginLeft: 8,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#777',
    marginBottom: 16,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  uploadLogoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC143C',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  uploadLogoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#DC3545',
  },
  errorText: {
    color: '#DC3545',
    fontSize: 12,
    marginTop: 4,
  },
  dropdown: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    minHeight: 45,
  },
  dropdownError: {
    borderColor: '#DC3545',
  },
  dropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownPlaceholder: {
    color: '#999',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  textArea: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
  },
  playerSelectionContainer: {
    marginBottom: 24,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  playerItemSelected: {
    borderColor: '#DC143C',
    backgroundColor: 'rgba(220, 20, 60, 0.05)',
  },
  captainItem: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  captainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  captainText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  playerRole: {
    fontSize: 14,
    color: '#777',
  },
  playerSelectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DC143C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerAddIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPlayerContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  addPlayerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  addPlayerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC143C',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 8,
  },
  addPlayerButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  switchContainer: {
    marginBottom: 16,
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  switchDescription: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#DC143C',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
