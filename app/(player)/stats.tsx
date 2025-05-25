import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import {
  User,
  BarChart2,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { LineChart, BarChart } from 'react-native-chart-kit';

interface BattingStats {
  matches: number;
  innings: number;
  runs: number;
  ballsFaced: number;
  average: number;
  strikeRate: number;
  highestScore: number;
  fifties: number;
  hundreds: number;
  fours: number;
  sixes: number;
  notOuts: number;
}

interface BowlingStats {
  matches: number;
  innings: number;
  overs: number;
  balls: number;
  wickets: number;
  economy: number;
  average: number;
  bestFigures: string;
  threeWickets: number;
  fiveWickets: number;
  maidens: number;
  dotBallPercentage: number;
}

interface FieldingStats {
  matches: number;
  catches: number;
  runOuts: number;
  stumpings: number;
}

interface PerformanceHistory {
  matchDate: string;
  matchId: string;
  matchTitle: string;
  runs?: number;
  wickets?: number;
}

interface StatsData {
  batting: BattingStats;
  bowling: BowlingStats;
  fielding: FieldingStats;
  performanceHistory: PerformanceHistory[];
}

// Mock API function to fetch stats data
const getPlayerStats = async (): Promise<StatsData> => {
  // In a real app, this would be an API call
  return {
    batting: {
      matches: 45,
      innings: 43,
      runs: 1250,
      ballsFaced: 950,
      average: 35.5,
      strikeRate: 131.6,
      highestScore: 98,
      fifties: 8,
      hundreds: 0,
      fours: 112,
      sixes: 43,
      notOuts: 6,
    },
    bowling: {
      matches: 45,
      innings: 38,
      overs: 120.4,
      balls: 724,
      wickets: 30,
      economy: 7.25,
      average: 24.2,
      bestFigures: '3/25',
      threeWickets: 2,
      fiveWickets: 0,
      maidens: 3,
      dotBallPercentage: 38.5,
    },
    fielding: {
      matches: 45,
      catches: 18,
      runOuts: 5,
      stumpings: 0,
    },
    performanceHistory: [
      {
        matchDate: '2025-05-20',
        matchId: 'm1',
        matchTitle: 'vs Chitwan Tigers',
        runs: 62,
        wickets: 2,
      },
      {
        matchDate: '2025-05-15',
        matchId: 'm2',
        matchTitle: 'vs Bhairahawa Gladiators',
        runs: 34,
        wickets: 0,
      },
      {
        matchDate: '2025-05-10',
        matchId: 'm3',
        matchTitle: 'vs Lalitpur Patriots',
        runs: 55,
        wickets: 1,
      },
      {
        matchDate: '2025-05-05',
        matchId: 'm4',
        matchTitle: 'vs Pokhara Rhinos',
        runs: 28,
        wickets: 3,
      },
      {
        matchDate: '2025-04-28',
        matchId: 'm5',
        matchTitle: 'vs Biratnagar Warriors',
        runs: 41,
        wickets: 0,
      },
    ],
  };
};

const screenWidth = Dimensions.get('window').width - 32;

export default function PlayerStats() {
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'batting' | 'bowling' | 'fielding'>('batting');

  useEffect(() => {
    loadStatsData();
  }, []);

  const loadStatsData = async () => {
    setIsLoading(true);
    try {
      const data = await getPlayerStats();
      setStatsData(data);
    } catch (error) {
      console.error('Failed to load stats data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !statsData) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>
      </View>
    );
  }

  // Prepare chart data
  const runsData = {
    labels: statsData.performanceHistory.map(p => p.matchTitle.split(' ')[1]),
    datasets: [
      {
        data: statsData.performanceHistory.map(p => p.runs || 0),
        color: (opacity = 1) => `rgba(220, 20, 60, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const wicketsData = {
    labels: statsData.performanceHistory.map(p => p.matchTitle.split(' ')[1]),
    datasets: [
      {
        data: statsData.performanceHistory.map(p => p.wickets || 0),
        color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  const renderBattingStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.sectionSubtitle}>Career Batting</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.batting.matches}</Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.batting.runs}</Text>
          <Text style={styles.statLabel}>Runs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.batting.average.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Average</Text>
        </View>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.batting.strikeRate.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Strike Rate</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.batting.highestScore}</Text>
          <Text style={styles.statLabel}>Highest</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.batting.notOuts}</Text>
          <Text style={styles.statLabel}>Not Outs</Text>
        </View>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.batting.fifties}</Text>
          <Text style={styles.statLabel}>50s</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.batting.hundreds}</Text>
          <Text style={styles.statLabel}>100s</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.batting.fours}</Text>
          <Text style={styles.statLabel}>4s</Text>
        </View>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.batting.sixes}</Text>
          <Text style={styles.statLabel}>6s</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.batting.ballsFaced}</Text>
          <Text style={styles.statLabel}>Balls Faced</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.batting.innings}</Text>
          <Text style={styles.statLabel}>Innings</Text>
        </View>
      </View>

      <Text style={styles.sectionSubtitle}>Recent Runs</Text>
      <LineChart
        data={runsData}
        width={screenWidth}
        height={200}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );

  const renderBowlingStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.sectionSubtitle}>Career Bowling</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.bowling.matches}</Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.bowling.wickets}</Text>
          <Text style={styles.statLabel}>Wickets</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.bowling.economy.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Economy</Text>
        </View>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.bowling.average.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Average</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.bowling.bestFigures}</Text>
          <Text style={styles.statLabel}>Best</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.bowling.maidens}</Text>
          <Text style={styles.statLabel}>Maidens</Text>
        </View>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.bowling.threeWickets}</Text>
          <Text style={styles.statLabel}>3W+</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.bowling.fiveWickets}</Text>
          <Text style={styles.statLabel}>5W+</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.bowling.dotBallPercentage.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Dot %</Text>
        </View>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.bowling.overs.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Overs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.bowling.balls}</Text>
          <Text style={styles.statLabel}>Balls</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.bowling.innings}</Text>
          <Text style={styles.statLabel}>Innings</Text>
        </View>
      </View>

      <Text style={styles.sectionSubtitle}>Recent Wickets</Text>
      <BarChart
        data={wicketsData}
        width={screenWidth}
        height={200}
        chartConfig={chartConfig}
        style={styles.chart}
        fromZero
      />
    </View>
  );

  const renderFieldingStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.sectionSubtitle}>Career Fielding</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.fielding.matches}</Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.fielding.catches}</Text>
          <Text style={styles.statLabel}>Catches</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.fielding.runOuts}</Text>
          <Text style={styles.statLabel}>Run Outs</Text>
        </View>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{statsData.fielding.stumpings}</Text>
          <Text style={styles.statLabel}>Stumpings</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {statsData.fielding.catches + statsData.fielding.runOuts + statsData.fielding.stumpings}
          </Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {((statsData.fielding.catches + statsData.fielding.runOuts + statsData.fielding.stumpings) / 
              statsData.fielding.matches).toFixed(2)}
          </Text>
          <Text style={styles.statLabel}>Per Match</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#DC143C', '#8B0000']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Statistics</Text>
        </View>
      </LinearGradient>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'batting' && styles.tabButtonActive]}
          onPress={() => setActiveTab('batting')}
        >
          <Text 
            style={[styles.tabButtonText, activeTab === 'batting' && styles.tabButtonTextActive]}
          >
            Batting
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'bowling' && styles.tabButtonActive]}
          onPress={() => setActiveTab('bowling')}
        >
          <Text 
            style={[styles.tabButtonText, activeTab === 'bowling' && styles.tabButtonTextActive]}
          >
            Bowling
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'fielding' && styles.tabButtonActive]}
          onPress={() => setActiveTab('fielding')}
        >
          <Text 
            style={[styles.tabButtonText, activeTab === 'fielding' && styles.tabButtonTextActive]}
          >
            Fielding
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'batting' && renderBattingStats()}
        {activeTab === 'bowling' && renderBowlingStats()}
        {activeTab === 'fielding' && renderFieldingStats()}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.push('/(player)/')}
        >
          <User size={24} color="#666" />
          <Text style={styles.navLabel}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonActive]}
          onPress={() => {}}
        >
          <BarChart2 size={24} color="#DC143C" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Statistics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.push('/(player)/training')}
        >
          <TrendingUp size={24} color="#666" />
          <Text style={styles.navLabel}>Training</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.push('/(player)/settings')}
        >
          <Settings size={24} color="#666" />
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#DC143C',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  tabButtonTextActive: {
    color: '#DC143C',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 16,
  },
  statsContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: 16,
    paddingHorizontal: 8,
    height: 64,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonActive: {
    borderTopWidth: 2,
    borderTopColor: '#DC143C',
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  navLabelActive: {
    color: '#DC143C',
    fontWeight: '500',
  },
});
