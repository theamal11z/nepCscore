import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, MapPin } from 'lucide-react-native';

interface Team {
  name: string;
  logo: string;
}

interface Match {
  id: string;
  date: string;
  time: string;
  venue: string;
  matchType: string;
  team1: Team;
  team2: Team;
}

interface UpcomingMatchCardProps {
  match: Match;
  onPress?: () => void;
}

export default function UpcomingMatchCard({ match, onPress }: UpcomingMatchCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.dateContainer}>
        <View style={styles.dateContent}>
          <Text style={styles.month}>{match.date.split(' ')[0]}</Text>
          <Text style={styles.day}>{match.date.split(' ')[1]}</Text>
        </View>
      </View>

      <View style={styles.matchInfo}>
        <View style={styles.infoRow}>
          <View style={styles.matchTypeContainer}>
            <Text style={styles.matchTypeText}>{match.matchType}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Calendar size={12} color="#777" />
            <Text style={styles.timeText}>{match.time}</Text>
          </View>
        </View>

        <View style={styles.teamsContainer}>
          <View style={styles.teamRow}>
            <Image source={{ uri: match.team1.logo }} style={styles.teamLogo} />
            <Text style={styles.teamName}>{match.team1.name}</Text>
          </View>
          
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          
          <View style={styles.teamRow}>
            <Image source={{ uri: match.team2.logo }} style={styles.teamLogo} />
            <Text style={styles.teamName}>{match.team2.name}</Text>
          </View>
        </View>

        <View style={styles.venueRow}>
          <MapPin size={12} color="#777" />
          <Text style={styles.venueText}>{match.venue}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  dateContainer: {
    backgroundColor: '#DC143C',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateContent: {
    alignItems: 'center',
  },
  month: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  day: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  matchInfo: {
    flex: 1,
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  matchTypeContainer: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  matchTypeText: {
    fontSize: 10,
    color: '#777',
    fontWeight: '500',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
  },
  teamsContainer: {
    marginVertical: 8,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  teamLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#121212',
  },
  vsContainer: {
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  vsText: {
    fontSize: 12,
    color: '#777',
    fontWeight: '500',
    textAlign: 'center',
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueText: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
  },
});