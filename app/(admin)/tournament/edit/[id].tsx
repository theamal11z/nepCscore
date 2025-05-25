import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView 
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, MapPin, Award } from 'lucide-react-native';

// Types
interface TournamentDetail {
  id: string;
  name: string;
  format: string;
  status: string;
  startDate: string;
  endDate: string;
  description: string;
  venue: string;
  maxTeams: number;
  prizePool: string;
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
    description: 'Annual premier cricket tournament',
    venue: 'Multiple Venues',
    maxTeams: 8,
    prizePool: '1000000',
  };
};

export default function TournamentEditScreen() {
  const { id } = useLocalSearchParams();
  const [tournament, setTournament] = useState<TournamentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Date picker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

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

  const handleSave = async () => {
    if (!tournament) return;
    
    setLoading(true);
    try {
      // Validate form
      if (!tournament.name.trim()) {
        Alert.alert('Error', 'Tournament name is required');
        setLoading(false);
        return;
      }

      // API call to save tournament details
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API delay
      Alert.alert('Success', 'Tournament updated successfully');
      router.back();
    } catch (error) {
      console.error('Failed to save tournament:', error);
      Alert.alert('Error', 'Failed to save tournament');
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate && tournament) {
      setTournament({
        ...tournament,
        startDate: selectedDate.toISOString().split('T')[0]
      });
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate && tournament) {
      setTournament({
        ...tournament,
        endDate: selectedDate.toISOString().split('T')[0]
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E53935" />
        <Text style={styles.loadingText}>Loading tournament data...</Text>
      </View>
    );
  }

  if (!tournament) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Tournament not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <Stack.Screen options={{ title: 'Edit Tournament' }} />

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Tournament Details</Text>
          
          <Text style={styles.label}>Tournament Name</Text>
          <TextInput
            value={tournament.name}
            onChangeText={(text) => setTournament({ ...tournament, name: text })}
            style={styles.input}
            placeholder="Enter tournament name"
          />

          <Text style={styles.label}>Format</Text>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerIconContainer}>
              <Award size={18} color="#666" />
            </View>
            <View style={styles.pickerWrapper}>
              <TouchableOpacity 
                style={styles.pickerButton}
                onPress={() => {
                  Alert.alert(
                    'Select Format',
                    'Choose a tournament format',
                    [
                      { text: 'T20', onPress: () => tournament && setTournament({...tournament, format: 'T20'}) },
                      { text: 'ODI', onPress: () => tournament && setTournament({...tournament, format: 'ODI'}) },
                      { text: 'Test', onPress: () => tournament && setTournament({...tournament, format: 'Test'}) },
                      { text: 'Cancel', style: 'cancel' },
                    ]
                  );
                }}
              >
                <Text style={styles.pickerButtonText}>{tournament.format}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>Status</Text>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerWrapper}>
              <TouchableOpacity 
                style={styles.pickerButton}
                onPress={() => {
                  Alert.alert(
                    'Select Status',
                    'Choose a tournament status',
                    [
                      { text: 'Upcoming', onPress: () => tournament && setTournament({...tournament, status: 'Upcoming'}) },
                      { text: 'In Progress', onPress: () => tournament && setTournament({...tournament, status: 'In Progress'}) },
                      { text: 'Completed', onPress: () => tournament && setTournament({...tournament, status: 'Completed'}) },
                      { text: 'Cancel', style: 'cancel' },
                    ]
                  );
                }}
              >
                <Text style={styles.pickerButtonText}>{tournament.status}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>Start Date</Text>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerIconContainer}>
              <Calendar size={18} color="#666" />
            </View>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={styles.dateText}>{tournament.startDate}</Text>
            </TouchableOpacity>
          </View>
          {showStartDatePicker && (
            <DateTimePicker
              value={new Date(tournament.startDate)}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}

          <Text style={styles.label}>End Date</Text>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerIconContainer}>
              <Calendar size={18} color="#666" />
            </View>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={styles.dateText}>{tournament.endDate}</Text>
            </TouchableOpacity>
          </View>
          {showEndDatePicker && (
            <DateTimePicker
              value={new Date(tournament.endDate)}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}

          <Text style={styles.label}>Description</Text>
          <TextInput
            value={tournament.description}
            onChangeText={(text) => setTournament({ ...tournament, description: text })}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            placeholder="Enter tournament description"
          />

          <Text style={styles.label}>Venue</Text>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerIconContainer}>
              <MapPin size={18} color="#666" />
            </View>
            <TextInput
              value={tournament.venue}
              onChangeText={(text) => setTournament({ ...tournament, venue: text })}
              style={[styles.input, { flex: 1 }]}
              placeholder="Enter venue"
            />
          </View>

          <Text style={styles.label}>Maximum Teams</Text>
          <TextInput
            value={tournament.maxTeams.toString()}
            onChangeText={(text) => setTournament({ ...tournament, maxTeams: parseInt(text) || 0 })}
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter maximum number of teams"
          />

          <Text style={styles.label}>Prize Pool</Text>
          <TextInput
            value={tournament.prizePool}
            onChangeText={(text) => setTournament({ ...tournament, prizePool: text })}
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter prize pool amount"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.button, { backgroundColor: '#E53935' }]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  errorText: {
    textAlign: 'center',
    color: '#E53935',
    fontSize: 16,
    marginTop: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
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
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pickerIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  pickerWrapper: {
    flex: 1,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333333',
  },
  datePickerButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E53935',
  },
  cancelButtonText: {
    color: '#E53935',
    fontWeight: '500',
    fontSize: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
  },
});
