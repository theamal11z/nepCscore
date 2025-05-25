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
  MapPin,
  Building,
  ChevronLeft,
  Check,
  Upload,
  Info,
  Wifi,
  AlertCircle,
  Clock,
  Coffee,
  Umbrella,
  Car,
  ParkingSquare,
  Bus,
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Type definitions
interface Facility {
  id: string;
  name: string;
  icon: string;
  isAvailable: boolean;
}

export default function CreateVenueScreen() {
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
  const [venueName, setVenueName] = useState('');
  const [venueImage, setVenueImage] = useState('https://via.placeholder.com/300x150');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [pitchType, setPitchType] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [isFloodlit, setIsFloodlit] = useState(false);
  const [isCovered, setIsCovered] = useState(false);
  
  // Facilities state
  const [facilities, setFacilities] = useState<Facility[]>([
    { id: 'parking', name: 'Parking', icon: 'ParkingSquare', isAvailable: false },
    { id: 'food', name: 'Food & Beverage', icon: 'Coffee', isAvailable: false },
    { id: 'wifi', name: 'WiFi', icon: 'Wifi', isAvailable: false },
    { id: 'shelter', name: 'Shelter', icon: 'Umbrella', isAvailable: false },
    { id: 'public_transport', name: 'Public Transport', icon: 'Bus', isAvailable: false },
  ]);

  // Form validation
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!venueName.trim()) {
      newErrors.venueName = 'Venue name is required';
    }

    if (!location.trim()) {
      newErrors.location = 'Location address is required';
    }

    if (!city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!capacity.trim()) {
      newErrors.capacity = 'Seating capacity is required';
    } else if (isNaN(Number(capacity)) || Number(capacity) <= 0) {
      newErrors.capacity = 'Please enter a valid capacity number';
    }

    if (establishedYear && (isNaN(Number(establishedYear)) || Number(establishedYear) < 1800 || Number(establishedYear) > new Date().getFullYear())) {
      newErrors.establishedYear = 'Please enter a valid year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveVenue = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    setIsSaving(true);

    // Prepare venue data
    const venueData = {
      name: venueName,
      image: venueImage,
      location,
      city,
      capacity: Number(capacity),
      description,
      establishedYear: establishedYear ? Number(establishedYear) : null,
      pitchType,
      dimensions,
      isFloodlit,
      isCovered,
      facilities: facilities.filter(f => f.isAvailable).map(f => f.id),
    };

    // Simulate API call to save venue
    setTimeout(() => {
      console.log('Venue data:', venueData);
      setIsSaving(false);
      Alert.alert(
        'Success',
        'Venue created successfully',
        [
          {
            text: 'View Venues',
            onPress: () => router.navigate({
              pathname: '/(organizer)' as any
            }),
          },
          {
            text: 'Create Another',
            onPress: () => {
              // Reset form
              setVenueName('');
              setLocation('');
              setCity('');
              setCapacity('');
              setDescription('');
              setEstablishedYear('');
              setPitchType('');
              setDimensions('');
              setFacilities(facilities.map(f => ({ ...f, isAvailable: false })));
            },
          },
        ]
      );
    }, 1500);
  };

  const toggleFacility = (facilityId: string) => {
    setFacilities(
      facilities.map(facility => 
        facility.id === facilityId 
          ? { ...facility, isAvailable: !facility.isAvailable } 
          : facility
      )
    );
  };

  const handleUploadImage = () => {
    Alert.alert(
      'Upload Venue Image',
      'This feature will allow you to upload a venue image from your device or take a new photo.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => console.log('Upload image functionality would be implemented here'),
        },
      ]
    );
  };

  const renderFacilityIcon = (iconName: string) => {
    switch (iconName) {
      case 'ParkingSquare':
        return <ParkingSquare size={24} color="#555" />;
      case 'Coffee':
        return <Coffee size={24} color="#555" />;
      case 'Wifi':
        return <Wifi size={24} color="#555" />;
      case 'Umbrella':
        return <Umbrella size={24} color="#555" />;
      case 'Bus':
        return <Bus size={24} color="#555" />;
      default:
        return <Info size={24} color="#555" />;
    }
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
          title: 'Create Venue',
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
          <Text style={styles.sectionTitle}>Venue Information</Text>

          <View style={styles.imageSection}>
            <Image source={{ uri: venueImage }} style={styles.venueImage} />
            <TouchableOpacity
              style={styles.uploadImageButton}
              onPress={handleUploadImage}
            >
              <Upload size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.uploadImageText}>Upload Image</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Venue Name *</Text>
            <TextInput
              style={[styles.input, errors.venueName && styles.inputError]}
              placeholder="Enter venue name"
              value={venueName}
              onChangeText={setVenueName}
            />
            {errors.venueName && (
              <Text style={styles.errorText}>{errors.venueName}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={[styles.input, errors.location && styles.inputError]}
              placeholder="Enter venue address"
              value={location}
              onChangeText={setLocation}
            />
            {errors.location && (
              <Text style={styles.errorText}>{errors.location}</Text>
            )}
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={[styles.input, errors.city && styles.inputError]}
                placeholder="Enter city"
                value={city}
                onChangeText={setCity}
              />
              {errors.city && (
                <Text style={styles.errorText}>{errors.city}</Text>
              )}
            </View>

            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Capacity *</Text>
              <TextInput
                style={[styles.input, errors.capacity && styles.inputError]}
                placeholder="e.g., 10000"
                value={capacity}
                onChangeText={setCapacity}
                keyboardType="numeric"
              />
              {errors.capacity && (
                <Text style={styles.errorText}>{errors.capacity}</Text>
              )}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter venue description, history, or notable features"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Ground Details</Text>

          <View style={styles.rowContainer}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Established Year</Text>
              <TextInput
                style={[styles.input, errors.establishedYear && styles.inputError]}
                placeholder="e.g., 1980"
                value={establishedYear}
                onChangeText={setEstablishedYear}
                keyboardType="numeric"
                maxLength={4}
              />
              {errors.establishedYear && (
                <Text style={styles.errorText}>{errors.establishedYear}</Text>
              )}
            </View>

            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Pitch Type</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Clay, Grass"
                value={pitchType}
                onChangeText={setPitchType}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Dimensions</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 150x140 meters"
              value={dimensions}
              onChangeText={setDimensions}
            />
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Floodlit</Text>
              <Switch
                value={isFloodlit}
                onValueChange={setIsFloodlit}
                trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <Text style={styles.switchDescription}>
              Venue has floodlights for night matches
            </Text>
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Covered Seating</Text>
              <Switch
                value={isCovered}
                onValueChange={setIsCovered}
                trackColor={{ false: '#e0e0e0', true: '#DC143C' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <Text style={styles.switchDescription}>
              Venue has covered seating areas for spectators
            </Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Facilities</Text>
          <Text style={styles.sectionDescription}>
            Select the facilities available at this venue.
          </Text>

          <View style={styles.facilitiesContainer}>
            {facilities.map(facility => (
              <TouchableOpacity
                key={facility.id}
                style={[
                  styles.facilityItem,
                  facility.isAvailable && styles.facilityItemActive,
                ]}
                onPress={() => toggleFacility(facility.id)}
              >
                <View style={styles.facilityIcon}>
                  {renderFacilityIcon(facility.icon)}
                </View>
                <Text style={styles.facilityName}>{facility.name}</Text>
                <View style={[
                  styles.facilityStatus,
                  facility.isAvailable ? styles.facilityStatusActive : styles.facilityStatusInactive,
                ]}>
                  {facility.isAvailable && <Check size={16} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.mapPlaceholder}>
          <MapPin size={32} color="#DC143C" />
          <Text style={styles.mapPlaceholderText}>
            Map integration will be available here
          </Text>
          <Text style={styles.mapPlaceholderSubtext}>
            Users will be able to select the precise location on a map
          </Text>
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
            onPress={handleSaveVenue}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Check size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>Create Venue</Text>
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
  imageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  venueImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC143C',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  uploadImageText: {
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
  facilitiesContainer: {
    marginBottom: 16,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  facilityItemActive: {
    borderColor: '#DC143C',
    backgroundColor: 'rgba(220, 20, 60, 0.05)',
  },
  facilityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  facilityName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  facilityStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  facilityStatusActive: {
    backgroundColor: '#DC143C',
  },
  facilityStatusInactive: {
    backgroundColor: '#E0E0E0',
  },
  mapPlaceholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
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
