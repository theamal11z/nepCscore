import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface Team {
  name: string;
  logo: string;
  score: number;
  wickets: number;
  overs: string;
}

interface Match {
  id: string;
  venue: string;
  matchType: string;
  status: string;
  team1: Team;
  team2: Team;
  currentBatting: 'team1' | 'team2';
  recentBalls: string[];
}

interface LiveMatchCardProps {
  match: Match;
  onPress?: () => void;
}

export default function LiveMatchCard({ match, onPress }: LiveMatchCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <Text style={styles.venueText}>{match.venue}</Text>
        <Text style={styles.matchTypeText}>{match.matchType}</Text>
      </View>

      <View style={styles.teamsContainer}>
        <View style={styles.teamContainer}>
          <Image source={{ uri: match.team1.logo }} style={styles.teamLogo} />
          <Text style={styles.teamName}>{match.team1.name}</Text>
          <View style={styles.scoreContainer}>
            <Text style={[
              styles.teamScore, 
              match.currentBatting === 'team1' && styles.currentBattingScore
            ]}>
              {match.team1.score}/{match.team1.wickets}
            </Text>
            <Text style={styles.oversText}>({match.team1.overs})</Text>
          </View>
          {match.currentBatting === 'team1' && (
            <View style={styles.battingIndicator} />
          )}
        </View>

        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>

        <View style={styles.teamContainer}>
          <Image source={{ uri: match.team2.logo }} style={styles.teamLogo} />
          <Text style={styles.teamName}>{match.team2.name}</Text>
          <View style={styles.scoreContainer}>
            <Text style={[
              styles.teamScore, 
              match.currentBatting === 'team2' && styles.currentBattingScore
            ]}>
              {match.team2.score}/{match.team2.wickets}
            </Text>
            <Text style={styles.oversText}>({match.team2.overs})</Text>
          </View>
          {match.currentBatting === 'team2' && (
            <View style={styles.battingIndicator} />
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.statusText}>{match.status}</Text>
        
        <View style={styles.recentBallsContainer}>
          {match.recentBalls.map((ball, index) => (
            <View 
              key={index} 
              style={[
                styles.ballIndicator,
                ball === 'W' && styles.wicketBall,
                ball === '4' && styles.fourBall,
                ball === '6' && styles.sixBall,
                ball === '0' && styles.dotBall,
              ]}
            >
              <Text style={[
                styles.ballText,
                (ball === 'W' || ball === '4' || ball === '6') && styles.specialBallText
              ]}>
                {ball}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC143C',
    marginRight: 4,
  },
  liveText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#DC143C',
  },
  venueText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#777',
  },
  matchTypeText: {
    marginLeft: 'auto',
    fontSize: 12,
    color: '#777',
    fontWeight: '500',
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  teamLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#121212',
    marginBottom: 4,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  teamScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
  },
  currentBattingScore: {
    color: '#DC143C',
  },
  oversText: {
    fontSize: 12,
    color: '#777',
  },
  battingIndicator: {
    position: 'absolute',
    bottom: -10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC143C',
  },
  vsContainer: {
    paddingHorizontal: 8,
  },
  vsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#777',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 13,
    color: '#777',
    flex: 1,
  },
  recentBallsContainer: {
    flexDirection: 'row',
  },
  ballIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  wicketBall: {
    backgroundColor: '#DC143C',
  },
  fourBall: {
    backgroundColor: '#4CAF50',
  },
  sixBall: {
    backgroundColor: '#2196F3',
  },
  dotBall: {
    backgroundColor: '#E0E0E0',
  },
  ballText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#121212',
  },
  specialBallText: {
    color: '#FFFFFF',
  },
});