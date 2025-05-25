import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { 
  CalendarClock, 
  Users, 
  Trophy, 
  ChevronRight,
  Calendar,
  Map,
  Flag,
  Shield,
  Ticket
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
// Import SafeAreaView directly instead of just the hook
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreateScreen() {
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

  // Navigation methods for creation screens
  const handleCreateMatch = () => {
    router.navigate({
      pathname: '/create-match'
    });
  };

  const handleCreateTournament = () => {
    router.navigate({
      pathname: '/create-tournament'
    });
  };

  const handleCreateTeam = () => {
    router.navigate({
      pathname: '/create-team'
    });
  };

  const handleCreateVenue = () => {
    router.navigate({
      pathname: '/create-venue'
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#DC143C', '#8B0000']}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <Text style={styles.headerTitle}>Create</Text>
        <Text style={styles.headerSubtitle}>
          Create and manage cricket matches, tournaments, teams, and more
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.cardsContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={handleCreateMatch}
            >
              <View style={[styles.cardIconContainer, { backgroundColor: '#E3F2FD' }]}>
                <CalendarClock size={24} color="#1976D2" />
              </View>
              <Text style={styles.cardTitle}>Match</Text>
              <Text style={styles.cardDescription}>
                Create a new cricket match with teams, venue, and match details
              </Text>
              <ChevronRight size={20} color="#777" style={styles.cardArrow} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={handleCreateTournament}
            >
              <View style={[styles.cardIconContainer, { backgroundColor: '#FFEBEE' }]}>
                <Trophy size={24} color="#D32F2F" />
              </View>
              <Text style={styles.cardTitle}>Tournament</Text>
              <Text style={styles.cardDescription}>
                Set up a new cricket tournament with teams, schedule, and format
              </Text>
              <ChevronRight size={20} color="#777" style={styles.cardArrow} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={handleCreateTeam}
            >
              <View style={[styles.cardIconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Users size={24} color="#388E3C" />
              </View>
              <Text style={styles.cardTitle}>Team</Text>
              <Text style={styles.cardDescription}>
                Create a new cricket team with players, staff, and team details
              </Text>
              <ChevronRight size={20} color="#777" style={styles.cardArrow} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={handleCreateVenue}
            >
              <View style={[styles.cardIconContainer, { backgroundColor: '#FFF8E1' }]}>
                <Map size={24} color="#FFA000" />
              </View>
              <Text style={styles.cardTitle}>Venue</Text>
              <Text style={styles.cardDescription}>
                Add a new cricket venue with location, capacity, and facilities
              </Text>
              <ChevronRight size={20} color="#777" style={styles.cardArrow} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Creations</Text>
          
          <View style={styles.recentItemsContainer}>
            <TouchableOpacity style={styles.recentItem}>
              <View style={styles.recentItemContent}>
                <View style={[styles.recentItemIcon, { backgroundColor: '#E3F2FD' }]}>
                  <CalendarClock size={20} color="#1976D2" />
                </View>
                <View style={styles.recentItemDetails}>
                  <Text style={styles.recentItemTitle}>NPL Semifinal Match</Text>
                  <Text style={styles.recentItemDescription}>Created 2 days ago</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#777" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.recentItem}>
              <View style={styles.recentItemContent}>
                <View style={[styles.recentItemIcon, { backgroundColor: '#FFEBEE' }]}>
                  <Trophy size={20} color="#D32F2F" />
                </View>
                <View style={styles.recentItemDetails}>
                  <Text style={styles.recentItemTitle}>Nepal Premier League 2025</Text>
                  <Text style={styles.recentItemDescription}>Created 1 week ago</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#777" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.recentItem}>
              <View style={styles.recentItemContent}>
                <View style={[styles.recentItemIcon, { backgroundColor: '#E8F5E9' }]}>
                  <Users size={20} color="#388E3C" />
                </View>
                <View style={styles.recentItemDetails}>
                  <Text style={styles.recentItemTitle}>Kathmandu Kings</Text>
                  <Text style={styles.recentItemDescription}>Created 3 days ago</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#777" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Templates</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.templatesContainer}
          >
            <TouchableOpacity style={styles.templateCard}>
              <View style={styles.templateIconContainer}>
                <Ticket size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.templateTitle}>T20 Match</Text>
              <Text style={styles.templateDescription}>
                Standard T20 format with 20 overs per side
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.templateCard}>
              <View style={styles.templateIconContainer}>
                <Ticket size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.templateTitle}>ODI Match</Text>
              <Text style={styles.templateDescription}>
                50 overs per side with standard ODI rules
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.templateCard}>
              <View style={styles.templateIconContainer}>
                <Flag size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.templateTitle}>Test Match</Text>
              <Text style={styles.templateDescription}>
                Multi-day test match format with two innings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.templateCard}>
              <View style={styles.templateIconContainer}>
                <Trophy size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.templateTitle}>League Tournament</Text>
              <Text style={styles.templateDescription}>
                Round-robin format with playoffs
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.templateCard}>
              <View style={styles.templateIconContainer}>
                <Shield size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.templateTitle}>Knockout Cup</Text>
              <Text style={styles.templateDescription}>
                Single elimination tournament format
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Resources</Text>
          
          <View style={styles.helpContainer}>
            <TouchableOpacity style={styles.helpCard}>
              <Text style={styles.helpTitle}>Organizer Guide</Text>
              <Text style={styles.helpDescription}>
                Learn how to effectively organize cricket matches and tournaments
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helpCard}>
              <Text style={styles.helpTitle}>Cricket Rules</Text>
              <Text style={styles.helpDescription}>
                Official cricket rules and regulations for different formats
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helpCard}>
              <Text style={styles.helpTitle}>Contact Support</Text>
              <Text style={styles.helpDescription}>
                Get help from our support team for any questions or issues
              </Text>
            </TouchableOpacity>
          </View>
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
  header: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 12,
    color: '#777',
    lineHeight: 18,
    marginBottom: 16,
  },
  cardArrow: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  recentItemsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  recentItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentItemDetails: {
    flex: 1,
  },
  recentItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#121212',
    marginBottom: 4,
  },
  recentItemDescription: {
    fontSize: 12,
    color: '#777',
  },
  templatesContainer: {
    paddingRight: 16,
    paddingBottom: 16,
  },
  templateCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  templateIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DC143C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 8,
  },
  templateDescription: {
    fontSize: 12,
    color: '#777',
    lineHeight: 18,
  },
  helpContainer: {
    marginBottom: 24,
  },
  helpCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 8,
  },
  helpDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});
