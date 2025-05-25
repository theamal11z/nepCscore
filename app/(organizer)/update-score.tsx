import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ChevronLeft, Plus, Minus } from 'lucide-react-native';

interface Player {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
}

interface BowlingStats {
  id: string;
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
}

export default function UpdateScore() {
  const router = useRouter();
  const [currentOver, setCurrentOver] = useState(0);
  const [currentBall, setCurrentBall] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [extras, setExtras] = useState(0);
  const [battingPlayers, setBattingPlayers] = useState<Player[]>([
    { id: '1', name: 'Batsman 1', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
    { id: '2', name: 'Batsman 2', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
  ]);
  const [currentBowler, setCurrentBowler] = useState<BowlingStats>({
    id: '1',
    name: 'Bowler 1',
    overs: 0,
    maidens: 0,
    runs: 0,
    wickets: 0,
  });

  const handleRunsUpdate = (playerId: string, runs: number) => {
    setBattingPlayers(players =>
      players.map(player =>
        player.id === playerId
          ? { ...player, runs: Math.max(0, player.runs + runs), balls: player.balls + (runs !== 0 ? 1 : 0) }
          : player
      )
    );
    setTotalScore(prev => Math.max(0, prev + runs));
    updateOverCount();
  };

  const handleWicket = (playerId: string) => {
    setBattingPlayers(players =>
      players.map(player =>
        player.id === playerId
          ? { ...player, isOut: true }
          : player
      )
    );
    setWickets(prev => prev + 1);
    setCurrentBowler(prev => ({
      ...prev,
      wickets: prev.wickets + 1
    }));
    updateOverCount();

    if (wickets < 9) {
      Alert.alert('New Batsman', 'Please select the next batsman');
    } else {
      Alert.alert('Innings Over', 'All out!');
    }
  };

  const updateOverCount = () => {
    if (currentBall === 5) {
      setCurrentOver(prev => prev + 1);
      setCurrentBall(0);
      setCurrentBowler(prev => ({
        ...prev,
        overs: prev.overs + 1
      }));
    } else {
      setCurrentBall(prev => prev + 1);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Update Score</Text>
      </View>

      <View style={styles.scorecard}>
        <Text style={styles.totalScore}>{totalScore}/{wickets}</Text>
        <Text style={styles.overs}>Overs: {currentOver}.{currentBall}</Text>
      </View>

      <View style={styles.battingSection}>
        {battingPlayers.map((player, index) => (
          !player.isOut && (
            <View key={player.id} style={styles.playerCard}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerStats}>
                {player.runs} ({player.balls}) | 4s: {player.fours} | 6s: {player.sixes}
              </Text>
              <View style={styles.runsButtons}>
                {[0, 1, 2, 3, 4, 6].map(runs => (
                  <TouchableOpacity
                    key={runs}
                    style={styles.runButton}
                    onPress={() => handleRunsUpdate(player.id, runs)}
                  >
                    <Text style={styles.runButtonText}>{runs}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.runButton, styles.wicketButton]}
                  onPress={() => handleWicket(player.id)}
                >
                  <Text style={styles.wicketButtonText}>W</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        ))}
      </View>

      <View style={styles.bowlingSection}>
        <Text style={styles.sectionTitle}>Current Bowler</Text>
        <View style={styles.bowlerCard}>
          <Text style={styles.bowlerName}>{currentBowler.name}</Text>
          <Text style={styles.bowlerStats}>
            {currentBowler.overs}-{currentBowler.maidens}-{currentBowler.runs}-{currentBowler.wickets}
          </Text>
        </View>
      </View>

      <View style={styles.extrasSection}>
        <Text style={styles.sectionTitle}>Extras</Text>
        <View style={styles.extrasControls}>
          <TouchableOpacity 
            style={styles.extraButton}
            onPress={() => setExtras(prev => Math.max(0, prev - 1))}
          >
            <Minus size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.extrasValue}>{extras}</Text>
          <TouchableOpacity 
            style={styles.extraButton}
            onPress={() => setExtras(prev => prev + 1)}
          >
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scorecard: {
    backgroundColor: '#DC143C',
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  totalScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  overs: {
    fontSize: 18,
    color: '#fff',
    marginTop: 8,
  },
  battingSection: {
    padding: 16,
  },
  playerCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  playerStats: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  runsButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  runButton: {
    backgroundColor: '#DC143C',
    borderRadius: 4,
    padding: 12,
    minWidth: 48,
    alignItems: 'center',
  },
  runButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  wicketButton: {
    backgroundColor: '#333',
  },
  wicketButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bowlingSection: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  bowlerCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  bowlerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bowlerStats: {
    fontSize: 16,
    color: '#666',
  },
  extrasSection: {
    padding: 16,
  },
  extrasControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  extraButton: {
    backgroundColor: '#DC143C',
    borderRadius: 4,
    padding: 8,
  },
  extrasValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
