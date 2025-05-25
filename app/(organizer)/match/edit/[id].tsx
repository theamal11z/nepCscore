import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Calendar, Clock, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Team {
  id: string;
  name: string;
  logo: string;
}

interface Venue {
  id: string;
  name: string;
  city: string;
  capacity: number;
}

interface Match {
  id: string;
  title: string;
  tournament: string;
  date: string;
  time: string;
  venue: Venue;
  team1: Team;
  team2: Team;
  matchType: 'T20' | 'ODI' | 'Test';
  overs: number;
  status: 'upcoming' | 'live' | 'completed';
}

export default function EditMatch() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [tournament, setTournament] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [venue, setVenue] = useState<Venue | null>(null);
  const [team1, setTeam1] = useState<Team | null>(null);
  const [team2, setTeam2] = useState<Team | null>(null);
  const [matchType, setMatchType] = useState<'T20' | 'ODI' | 'Test'>('T20');
  const [overs, setOvers] = useState('20');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadMatchData();
  }, [id]);

  const loadMatchData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockMatch: Match = {
        id,
        title: 'Qualifier 1',
        tournament: 'Nepal Premier League 2025',
        date: '2025-05-26',
        time: '14:00',
        venue: {
          id: 'v1',
          name: 'Tribhuvan University Ground',
          city: 'Kirtipur',
          capacity: 15000,
        },
        team1: {
          id: 't1',
          name: 'Kathmandu Kings',
          logo: 'https://via.placeholder.com/60',
        },
        team2: {
          id: 't2',
          name: 'Pokhara Rhinos',
          logo: 'https://via.placeholder.com/60',
        },
        matchType: 'T20',
        overs: 20,
        status: 'upcoming',
      };
      setMatch(mockMatch);
      setTitle(mockMatch.title);
      setTournament(mockMatch.tournament);
      setDate(new Date(mockMatch.date));
      setTime(new Date(`${mockMatch.date}T${mockMatch.time}`));
      setVenue(mockMatch.venue);
      setTeam1(mockMatch.team1);
      setTeam2(mockMatch.team2);
      setMatchType(mockMatch.matchType);
      setOvers(mockMatch.overs.toString());
    } catch (error) {
      console.error('Failed to load match data:', error);
      Alert.alert('Error', 'Failed to load match data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleSelectVenue = () => {
    // TODO: Navigate to venue selection screen
    router.push('/(organizer)/venue/select');
  };

  const handleSelectTeam = (teamNumber: 1 | 2) => {
    // TODO: Navigate to team selection screen
    router.push({
      pathname: '/(organizer)/team/select',
      params: { teamNumber },
    });
  };

  const handleSave = async () => {
    try {
      if (!venue || !team1 || !team2) {
        Alert.alert('Error', 'Please select venue and teams');
        return;
      }

      const updatedMatch = {
        id,
        title,
        tournament,
        date: date.toISOString().split('T')[0],
        time: time.toTimeString().split(' ')[0],
        venue,
        team1,
        team2,
        matchType,
        overs: parseInt(overs, 10),
        status: match?.status || 'upcoming',
      };

      // TODO: Implement API call to update match
      console.log('Saving match:', updatedMatch);

      router.back();
    } catch (error) {
      console.error('Failed to save match:', error);
      Alert.alert('Error', 'Failed to save match');
    }
  };

  if (isLoading || !match) {
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
          <Text style={styles.headerTitle}>Edit Match</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Match Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter match title"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tournament</Text>
            <TextInput
              style={styles.input}
              value={tournament}
              onChangeText={setTournament}
              placeholder="Enter tournament name"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Date & Time</Text>
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.dateTimeButton}
              >
                <Calendar size={20} color="#666" />
                <Text style={styles.dateTimeText}>
                  {date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                style={styles.dateTimeButton}
              >
                <Clock size={20} color="#666" />
                <Text style={styles.dateTimeText}>
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Venue</Text>
            <TouchableOpacity
              onPress={handleSelectVenue}
              style={styles.selectButton}
            >
              <MapPin size={20} color="#666" />
              <Text style={styles.selectButtonText}>
                {venue ? venue.name : 'Select Venue'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Teams</Text>
            <View style={styles.teamsContainer}>
              <TouchableOpacity
                onPress={() => handleSelectTeam(1)}
                style={[styles.teamButton, !team1 && styles.teamButtonEmpty]}
              >
                <Text style={styles.teamButtonText}>
                  {team1 ? team1.name : 'Select Team 1'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.vsText}>vs</Text>
              <TouchableOpacity
                onPress={() => handleSelectTeam(2)}
                style={[styles.teamButton, !team2 && styles.teamButtonEmpty]}
              >
                <Text style={styles.teamButtonText}>
                  {team2 ? team2.name : 'Select Team 2'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Match Type</Text>
            <View style={styles.matchTypeContainer}>
              {(['T20', 'ODI', 'Test'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setMatchType(type)}
                  style={[
                    styles.matchTypeButton,
                    matchType === type && styles.matchTypeButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.matchTypeText,
                      matchType === type && styles.matchTypeTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Overs</Text>
            <TextInput
              style={[styles.input, styles.oversInput]}
              value={overs}
              onChangeText={setOvers}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          onChange={handleTimeChange}
          is24Hour={true}
        />
      )}
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
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
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
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    gap: 8,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#333',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    gap: 8,
  },
  selectButtonText: {
    fontSize: 16,
    color: '#333',
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  teamButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  teamButtonEmpty: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  teamButtonText: {
    fontSize: 16,
    color: '#333',
  },
  vsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  matchTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  matchTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DC143C',
    alignItems: 'center',
  },
  matchTypeButtonActive: {
    backgroundColor: '#DC143C',
  },
  matchTypeText: {
    fontSize: 16,
    color: '#DC143C',
    fontWeight: '500',
  },
  matchTypeTextActive: {
    color: '#fff',
  },
  oversInput: {
    width: 100,
  },
});
