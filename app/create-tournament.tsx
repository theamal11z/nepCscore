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
  Calendar,
  Trophy,
  Users,
  Flag,
  ChevronLeft,
  Check,
  Plus,
  X,
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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Type definitions
interface Team {
  id: string;
  name: string;
  logo: string;
}

interface TournamentFormat {
  id: string;
  name: string;
  description: string;
}

// Mock data
const mockTeams: Team[] = [
  { id: '1', name: 'Kathmandu Kings', logo: 'https://via.placeholder.com/80' },
  { id: '2', name: 'Pokhara Rhinos', logo: 'https://via.placeholder.com/80' },
  { id: '3', name: 'Biratnagar Warriors', logo: 'https://via.placeholder.com/80' },
  { id: '4', name: 'Chitwan Tigers', logo: 'https://via.placeholder.com/80' },
  { id: '5', name: 'Lalitpur Patriots', logo: 'https://via.placeholder.com/80' },
];

const tournamentFormats: TournamentFormat[] = [
  { id: 'league', name: 'League', description: 'Round-robin format where each team plays against all other teams' },
  { id: 'knockout', name: 'Knockout', description: 'Single elimination tournament format' },
  { id: 'group', name: 'Group Stage + Knockout', description: 'Teams are divided into groups, followed by knockout rounds' },
  { id: 'custom', name: 'Custom Format', description: 'Create your own custom tournament format' },
];

export default function CreateTournamentScreen() {
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
  const [tournamentName, setTournamentName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)); // Default to 2 weeks from now
  const [formatId, setFormatId] = useState<string | null>('league');
  const [maxTeams, setMaxTeams] = useState('8');
  const [registrationDeadline, setRegistrationDeadline] = useState(new Date());
  const [isPublic, setIsPublic] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  
  // Dropdown open state
  const [formatOpen, setFormatOpen] = useState(false);
  const [teamsOpen, setTeamsOpen] = useState(false);
  
  // Date picker state
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  
  // Teams state
  const [teams, setTeams] = useState<Team[]>([]);

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
      setIsLoading(false);
    }, 1000);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!tournamentName.trim()) {
      newErrors.tournamentName = 'Tournament name is required';
    }

    if (!formatId) {
      newErrors.format = 'Tournament format is required';
    }

    if (!maxTeams || isNaN(Number(maxTeams)) || Number(maxTeams) <= 1) {
      newErrors.maxTeams = 'Valid number of teams is required (minimum 2)';
    }

    if (endDate < startDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (registrationDeadline > startDate) {
      newErrors.registrationDeadline = 'Registration deadline must be before start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveTournament = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    setIsSaving(true);

    // Prepare tournament data
    const tournamentData = {
      name: tournamentName,
      description,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      format: formatId,
      maxTeams: Number(maxTeams),
      registrationDeadline: registrationDeadline.toISOString().split('T')[0],
      isPublic,
      isFeatured,
      teams: selectedTeams,
    };

    // Simulate API call to save tournament
    setTimeout(() => {
      console.log('Tournament data:', tournamentData);
      setIsSaving(false);
      Alert.alert(
        'Success',
        'Tournament created successfully',
        [
          {
            text: 'View Tournaments',
            onPress: () => router.navigate({
              pathname: '/(organizer)' as any
            }),
          },
          {
            text: 'Create Another',
            onPress: () => {
              // Reset form
              setTournamentName('');
              setDescription('');
              setStartDate(new Date());
              setEndDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000));
              setFormatId('league');
              setMaxTeams('8');
              setRegistrationDeadline(new Date());
              setSelectedTeams([]);
            },
          },
        ]
      );
    }, 1500);
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
    
    // If end date is before start date, update end date
    if (endDate < currentDate) {
      setEndDate(new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000)); // Default to 2 weeks after start
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  const handleDeadlineChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || registrationDeadline;
    setShowDeadlinePicker(false);
    setRegistrationDeadline(currentDate);
  };

  const handleTeamSelection = (teamId: string) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(selectedTeams.filter(id => id !== teamId));
    } else {
      if (selectedTeams.length < Number(maxTeams)) {
        setSelectedTeams([...selectedTeams, teamId]);
      } else {
        Alert.alert('Maximum Teams Reached', `You can only select up to ${maxTeams} teams`);
      }
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
          title: 'Create Tournament',
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
          <Text style={styles.sectionTitle}>Tournament Information</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tournament Name *</Text>
            <TextInput
              style={[styles.input, errors.tournamentName && styles.inputError]}
              placeholder="Enter tournament name"
              value={tournamentName}
              onChangeText={setTournamentName}
            />
            {errors.tournamentName && (
              <Text style={styles.errorText}>{errors.tournamentName}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.textArea]}
              placeholder="Enter tournament description, rules, or special notes"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Start Date *</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Calendar size={20} color="#777" style={styles.inputIcon} />
                <Text style={styles.datePickerText}>
                  {formatDate(startDate)}
                </Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={handleStartDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>End Date *</Text>
              <TouchableOpacity
                style={[styles.datePickerButton, errors.endDate && styles.inputError]}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Calendar size={20} color="#777" style={styles.inputIcon} />
                <Text style={styles.datePickerText}>
                  {formatDate(endDate)}
                </Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={handleEndDateChange}
                  minimumDate={startDate}
                />
              )}
              {errors.endDate && (
                <Text style={styles.errorText}>{errors.endDate}</Text>
              )}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Registration Deadline *</Text>
            <TouchableOpacity
              style={[styles.datePickerButton, errors.registrationDeadline && styles.inputError]}
              onPress={() => setShowDeadlinePicker(true)}
            >
              <Calendar size={20} color="#777" style={styles.inputIcon} />
              <Text style={styles.datePickerText}>
                {formatDate(registrationDeadline)}
              </Text>
            </TouchableOpacity>
            {showDeadlinePicker && (
              <DateTimePicker
                value={registrationDeadline}
                mode="date"
                display="default"
                onChange={handleDeadlineChange}
                maximumDate={startDate}
              />
            )}
            {errors.registrationDeadline && (
              <Text style={styles.errorText}>{errors.registrationDeadline}</Text>
            )}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Tournament Format</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Format *</Text>
            <DropDownPicker
              open={formatOpen}
              value={formatId}
              items={tournamentFormats.map(format => ({
                label: format.name,
                value: format.id,
              }))}
              setOpen={setFormatOpen}
              setValue={setFormatId}
              placeholder="Select tournament format"
              style={[styles.dropdown, errors.format && styles.dropdownError]}
              dropDownContainerStyle={styles.dropdownContainer}
              listItemContainerStyle={styles.dropdownItem}
              placeholderStyle={styles.dropdownPlaceholder}
              zIndex={3000}
              zIndexInverse={1000}
            />
            {errors.format && (
              <Text style={styles.errorText}>{errors.format}</Text>
            )}
          </View>

          {formatId && (
            <View style={styles.formatInfo}>
              <Trophy size={20} color="#DC143C" style={{ marginRight: 8 }} />
              <Text style={styles.formatDescription}>
                {tournamentFormats.find(format => format.id === formatId)?.description}
              </Text>
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Maximum Number of Teams *</Text>
            <TextInput
              style={[styles.input, errors.maxTeams && styles.inputError]}
              placeholder="Enter maximum number of teams"
              value={maxTeams}
              onChangeText={setMaxTeams}
              keyboardType="numeric"
            />
            {errors.maxTeams && (
              <Text style={styles.errorText}>{errors.maxTeams}</Text>
            )}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Teams</Text>
          <Text style={styles.sectionDescription}>
            Select teams to participate in this tournament. You can add up to {maxTeams} teams.
          </Text>

          <View style={styles.teamSelectionContainer}>
            {teams.map(team => (
              <TouchableOpacity
                key={team.id}
                style={[
                  styles.teamItem,
                  selectedTeams.includes(team.id) && styles.teamItemSelected,
                ]}
                onPress={() => handleTeamSelection(team.id)}
              >
                <Image source={{ uri: team.logo }} style={styles.teamLogo} />
                <Text style={styles.teamName}>{team.name}</Text>
                {selectedTeams.includes(team.id) ? (
                  <View style={styles.teamSelectedIndicator}>
                    <Check size={16} color="#FFFFFF" />
                  </View>
                ) : (
                  <View style={styles.teamAddIndicator}>
                    <Plus size={16} color="#DC143C" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.addNewTeamButton}>
            <Plus size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.addNewTeamText}>Add New Team</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Additional Options</Text>

          <View style={styles.switchContainer}>
            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Public Tournament</Text>
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <Text style={styles.switchDescription}>
              Make this tournament visible to all users and fans
            </Text>
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Featured Tournament</Text>
              <Switch
                value={isFeatured}
                onValueChange={setIsFeatured}
                trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <Text style={styles.switchDescription}>
              Highlight this tournament on the home page and in search results
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
            onPress={handleSaveTournament}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Check size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>Create Tournament</Text>
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
  formatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  formatDescription: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  teamSelectionContainer: {
    marginBottom: 16,
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  teamItemSelected: {
    borderColor: '#DC143C',
    backgroundColor: 'rgba(220, 20, 60, 0.05)',
  },
  teamLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  teamName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  teamSelectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DC143C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamAddIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNewTeamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC143C',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 8,
  },
  addNewTeamText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
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
