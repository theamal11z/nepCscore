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
} from 'react-native';
import { router, Stack } from 'expo-router';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  Info,
  ChevronDown,
  ChevronLeft,
  Check,
  AlertCircle,
} from 'lucide-react-native';
// Using a conditional import for DateTimePicker to handle potential missing module
let DateTimePicker: any;
try {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
} catch (error) {
  console.warn('DateTimePicker module not found, using fallback');
  // Creating a fallback component
  DateTimePicker = ({ value, onChange, mode }: any) => (
    <TouchableOpacity style={{padding: 10, backgroundColor: '#f0f0f0'}}>
      <Text>Select {mode === 'date' ? 'Date' : 'Time'}</Text>
    </TouchableOpacity>
  );
}
import DropDownPicker from 'react-native-dropdown-picker';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Type definitions
interface Team {
  id: string;
  name: string;
  logo: string;
}

interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
}

interface Tournament {
  id: string;
  name: string;
  format: string;
  startDate: string;
  endDate: string;
}

// Mock data
const mockTeams: Team[] = [
  { id: '1', name: 'Kathmandu Kings', logo: 'https://via.placeholder.com/80' },
  { id: '2', name: 'Pokhara Rhinos', logo: 'https://via.placeholder.com/80' },
  { id: '3', name: 'Biratnagar Warriors', logo: 'https://via.placeholder.com/80' },
  { id: '4', name: 'Chitwan Tigers', logo: 'https://via.placeholder.com/80' },
  { id: '5', name: 'Lalitpur Patriots', logo: 'https://via.placeholder.com/80' },
];

const mockVenues: Venue[] = [
  { id: '1', name: 'Tribhuvan University Ground', location: 'Kathmandu', capacity: 15000 },
  { id: '2', name: 'Pokhara Stadium', location: 'Pokhara', capacity: 10000 },
  { id: '3', name: 'Bharatpur Cricket Ground', location: 'Chitwan', capacity: 8000 },
  { id: '4', name: 'Biratnagar Cricket Ground', location: 'Biratnagar', capacity: 7500 },
  { id: '5', name: 'Kirtipur Cricket Ground', location: 'Kirtipur', capacity: 12000 },
];

const mockTournaments: Tournament[] = [
  { id: '1', name: 'Nepal Premier League 2025', format: 'T20', startDate: '2025-03-01', endDate: '2025-04-15' },
  { id: '2', name: 'Everest Cup 2025', format: 'ODI', startDate: '2025-05-10', endDate: '2025-06-05' },
  { id: '3', name: 'Himalayan Trophy', format: 'T20', startDate: '2025-07-01', endDate: '2025-07-20' },
];

const matchFormats = [
  { label: 'T20', value: 't20' },
  { label: 'ODI (50 Overs)', value: 'odi' },
  { label: 'Test Match', value: 'test' },
  { label: 'T10', value: 't10' },
  { label: 'Custom', value: 'custom' },
];

export default function CreateMatchScreen() {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [matchTitle, setMatchTitle] = useState('');
  const [tournamentId, setTournamentId] = useState<string | null>(null);
  const [matchDate, setMatchDate] = useState(new Date());
  const [matchTime, setMatchTime] = useState(new Date());
  const [team1Id, setTeam1Id] = useState<string | null>(null);
  const [team2Id, setTeam2Id] = useState<string | null>(null);
  const [venueId, setVenueId] = useState<string | null>(null);
  const [matchFormat, setMatchFormat] = useState<string | null>('t20');
  const [overs, setOvers] = useState('20');
  const [description, setDescription] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [allowTicketSales, setAllowTicketSales] = useState(false);
  
  // Dropdown open state
  const [tournamentOpen, setTournamentOpen] = useState(false);
  const [team1Open, setTeam1Open] = useState(false);
  const [team2Open, setTeam2Open] = useState(false);
  const [venueOpen, setVenueOpen] = useState(false);
  const [formatOpen, setFormatOpen] = useState(false);
  
  // Date/Time picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Data state
  const [teams, setTeams] = useState<Team[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  // Form validation
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setIsLoading(true);
    // Simulate API calls
    setTimeout(() => {
      setTeams(mockTeams);
      setVenues(mockVenues);
      setTournaments(mockTournaments);
      setIsLoading(false);
    }, 1000);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!matchTitle.trim()) {
      newErrors.matchTitle = 'Match title is required';
    }

    if (!team1Id) {
      newErrors.team1 = 'Team 1 is required';
    }

    if (!team2Id) {
      newErrors.team2 = 'Team 2 is required';
    } else if (team1Id === team2Id) {
      newErrors.team2 = 'Teams must be different';
    }

    if (!venueId) {
      newErrors.venue = 'Venue is required';
    }

    if (!matchFormat) {
      newErrors.matchFormat = 'Match format is required';
    }

    if (matchFormat === 'custom' && (!overs || isNaN(Number(overs)) || Number(overs) <= 0)) {
      newErrors.overs = 'Valid number of overs is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveMatch = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    setIsSaving(true);

    // Prepare match data
    const matchData = {
      title: matchTitle,
      tournamentId,
      date: matchDate.toISOString().split('T')[0],
      time: `${matchTime.getHours()}:${matchTime.getMinutes()}:00`,
      team1Id,
      team2Id,
      venueId,
      format: matchFormat,
      overs: matchFormat === 'custom' ? Number(overs) : null,
      description,
      isLive,
      isFeatured,
      allowTicketSales,
      status: 'upcoming',
    };

    // Simulate API call to save match
    setTimeout(() => {
      console.log('Match data:', matchData);
      setIsSaving(false);
      Alert.alert(
        'Success',
        'Match created successfully',
        [
          {
            text: 'View Matches',
            onPress: () => router.navigate({
              pathname: '/(organizer)/matches'
            }),
          },
          {
            text: 'Create Another',
            onPress: () => resetForm(),
          },
        ]
      );
    }, 1500);
  };

  const resetForm = () => {
    setMatchTitle('');
    setTournamentId(null);
    setMatchDate(new Date());
    setMatchTime(new Date());
    setTeam1Id(null);
    setTeam2Id(null);
    setVenueId(null);
    setMatchFormat('t20');
    setOvers('20');
    setDescription('');
    setIsLive(false);
    setIsFeatured(false);
    setAllowTicketSales(false);
    setErrors({});
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || matchDate;
    setShowDatePicker(false);
    setMatchDate(currentDate);
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || matchTime;
    setShowTimePicker(false);
    setMatchTime(currentTime);
  };

  // Prevent dropdown conflicts
  useEffect(() => {
    if (team1Open) {
      setTeam2Open(false);
      setVenueOpen(false);
      setTournamentOpen(false);
      setFormatOpen(false);
    }
  }, [team1Open]);

  useEffect(() => {
    if (team2Open) {
      setTeam1Open(false);
      setVenueOpen(false);
      setTournamentOpen(false);
      setFormatOpen(false);
    }
  }, [team2Open]);

  useEffect(() => {
    if (venueOpen) {
      setTeam1Open(false);
      setTeam2Open(false);
      setTournamentOpen(false);
      setFormatOpen(false);
    }
  }, [venueOpen]);

  useEffect(() => {
    if (tournamentOpen) {
      setTeam1Open(false);
      setTeam2Open(false);
      setVenueOpen(false);
      setFormatOpen(false);
    }
  }, [tournamentOpen]);

  useEffect(() => {
    if (formatOpen) {
      setTeam1Open(false);
      setTeam2Open(false);
      setVenueOpen(false);
      setTournamentOpen(false);
    }
  }, [formatOpen]);

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DC143C" />
        <Text style={styles.loadingText}>Loading match data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: 'Create Match',
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
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Match Title *</Text>
            <TextInput
              style={[styles.input, errors.matchTitle && styles.inputError]}
              placeholder="Enter match title"
              value={matchTitle}
              onChangeText={setMatchTitle}
            />
            {errors.matchTitle && (
              <Text style={styles.errorText}>{errors.matchTitle}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tournament (Optional)</Text>
            <DropDownPicker
              open={tournamentOpen}
              value={tournamentId}
              items={tournaments.map(tournament => ({
                label: tournament.name,
                value: tournament.id,
              }))}
              setOpen={setTournamentOpen}
              setValue={setTournamentId}
              placeholder="Select a tournament"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              listItemContainerStyle={styles.dropdownItem}
              placeholderStyle={styles.dropdownPlaceholder}
              zIndex={5000}
              zIndexInverse={1000}
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Date *</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar size={20} color="#777" style={styles.inputIcon} />
                <Text style={styles.datePickerText}>
                  {formatDate(matchDate)}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={matchDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Time *</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Clock size={20} color="#777" style={styles.inputIcon} />
                <Text style={styles.datePickerText}>
                  {formatTime(matchTime)}
                </Text>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={matchTime}
                  mode="time"
                  display="default"
                  onChange={handleTimeChange}
                />
              )}
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Teams</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Team 1 *</Text>
            <DropDownPicker
              open={team1Open}
              value={team1Id}
              items={teams.map(team => ({
                label: team.name,
                value: team.id,
              }))}
              setOpen={setTeam1Open}
              setValue={setTeam1Id}
              placeholder="Select first team"
              style={[styles.dropdown, errors.team1 && styles.dropdownError]}
              dropDownContainerStyle={styles.dropdownContainer}
              listItemContainerStyle={styles.dropdownItem}
              placeholderStyle={styles.dropdownPlaceholder}
              zIndex={4000}
              zIndexInverse={2000}
            />
            {errors.team1 && (
              <Text style={styles.errorText}>{errors.team1}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Team 2 *</Text>
            <DropDownPicker
              open={team2Open}
              value={team2Id}
              items={teams
                .filter(team => team.id !== team1Id)
                .map(team => ({
                  label: team.name,
                  value: team.id,
                }))}
              setOpen={setTeam2Open}
              setValue={setTeam2Id}
              placeholder="Select second team"
              style={[styles.dropdown, errors.team2 && styles.dropdownError]}
              dropDownContainerStyle={styles.dropdownContainer}
              listItemContainerStyle={styles.dropdownItem}
              placeholderStyle={styles.dropdownPlaceholder}
              zIndex={3000}
              zIndexInverse={3000}
              disabled={!team1Id}
            />
            {errors.team2 && (
              <Text style={styles.errorText}>{errors.team2}</Text>
            )}
          </View>

          {team1Id && team2Id && (
            <View style={styles.teamsPreview}>
              <View style={styles.teamPreviewItem}>
                <Image
                  source={{ uri: teams.find(t => t.id === team1Id)?.logo }}
                  style={styles.teamLogo}
                />
                <Text style={styles.teamName}>
                  {teams.find(t => t.id === team1Id)?.name}
                </Text>
              </View>
              
              <Text style={styles.versusText}>VS</Text>
              
              <View style={styles.teamPreviewItem}>
                <Image
                  source={{ uri: teams.find(t => t.id === team2Id)?.logo }}
                  style={styles.teamLogo}
                />
                <Text style={styles.teamName}>
                  {teams.find(t => t.id === team2Id)?.name}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Venue & Format</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Venue *</Text>
            <DropDownPicker
              open={venueOpen}
              value={venueId}
              items={venues.map(venue => ({
                label: venue.name,
                value: venue.id,
              }))}
              setOpen={setVenueOpen}
              setValue={setVenueId}
              placeholder="Select venue"
              style={[styles.dropdown, errors.venue && styles.dropdownError]}
              dropDownContainerStyle={styles.dropdownContainer}
              listItemContainerStyle={styles.dropdownItem}
              placeholderStyle={styles.dropdownPlaceholder}
              zIndex={2000}
              zIndexInverse={4000}
            />
            {errors.venue && (
              <Text style={styles.errorText}>{errors.venue}</Text>
            )}
          </View>

          {venueId && (
            <View style={styles.venuePreview}>
              <MapPin size={16} color="#777" style={{ marginRight: 8 }} />
              <Text style={styles.venueText}>
                {venues.find(v => v.id === venueId)?.name}, {venues.find(v => v.id === venueId)?.location} (Capacity: {venues.find(v => v.id === venueId)?.capacity})
              </Text>
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Match Format *</Text>
            <DropDownPicker
              open={formatOpen}
              value={matchFormat}
              items={matchFormats}
              setOpen={setFormatOpen}
              setValue={setMatchFormat}
              placeholder="Select match format"
              style={[styles.dropdown, errors.matchFormat && styles.dropdownError]}
              dropDownContainerStyle={styles.dropdownContainer}
              listItemContainerStyle={styles.dropdownItem}
              placeholderStyle={styles.dropdownPlaceholder}
              zIndex={1000}
              zIndexInverse={5000}
            />
            {errors.matchFormat && (
              <Text style={styles.errorText}>{errors.matchFormat}</Text>
            )}
          </View>

          {matchFormat === 'custom' && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Overs per Side *</Text>
              <TextInput
                style={[styles.input, errors.overs && styles.inputError]}
                placeholder="Enter number of overs"
                value={overs}
                onChangeText={setOvers}
                keyboardType="numeric"
              />
              {errors.overs && (
                <Text style={styles.errorText}>{errors.overs}</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Additional Details</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.textArea]}
              placeholder="Enter match description, highlights, or special notes"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Live Match</Text>
              <Switch
                value={isLive}
                onValueChange={setIsLive}
                trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <Text style={styles.switchDescription}>
              Enable live scoring and updates for this match
            </Text>
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Featured Match</Text>
              <Switch
                value={isFeatured}
                onValueChange={setIsFeatured}
                trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <Text style={styles.switchDescription}>
              Highlight this match on the home page and in search results
            </Text>
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Enable Ticket Sales</Text>
              <Switch
                value={allowTicketSales}
                onValueChange={setAllowTicketSales}
                trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <Text style={styles.switchDescription}>
              Allow fans to purchase tickets for this match
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
            onPress={handleSaveMatch}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Check size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>Create Match</Text>
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
    marginBottom: 16,
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
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  inputIcon: {
    marginRight: 8,
  },
  teamsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  teamPreviewItem: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#121212',
    textAlign: 'center',
  },
  versusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC143C',
    marginHorizontal: 16,
  },
  venuePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  venueText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
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
