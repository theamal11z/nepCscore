import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Share2, MessageCircle, ThumbsUp, Star, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// TypeScript interfaces for match data
interface BatsmanType {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  onStrike?: boolean;
  dismissal?: string;
}

interface BowlerType {
  id: string;
  name: string;
  overs: string;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

interface TeamType {
  id: string;
  name: string;
  logo: string;
  score: number;
  wickets: number;
  overs: string;
  battingOrder: number;
}

interface InningType {
  batting: BatsmanType[];
  bowling: BowlerType[];
  extras: number;
  total: {
    runs: number;
    wickets: number;
    overs: string;
  };
}

interface ScorecardType {
  innings1: InningType;
  innings2: InningType;
}

interface CommentType {
  id: string;
  user: string;
  text: string;
  time: string;
  likes: number;
}

interface PollOptionType {
  id: string;
  text: string;
  votes: number;
}

interface PollType {
  id: string;
  question: string;
  options: PollOptionType[];
  totalVotes: number;
  userVoted: string | null;
}

interface MatchType {
  id: string;
  status: string;
  venue: string;
  matchType: string;
  matchStatus: string;
  team1: TeamType;
  team2: TeamType;
  currentBatting: string;
  currentInning: number;
  tossWinner: string;
  tossDecision: string;
  currentBatsmen: BatsmanType[];
  currentBowler: BowlerType;
  recentBalls: string[];
  scorecard: ScorecardType;
  comments: CommentType[];
  polls: PollType[];
}

interface MatchDataType {
  [key: string]: MatchType;
}

// Mock match data
const mockMatchData: MatchDataType = {
  '1': {
    id: '1',
    status: 'live',
    venue: 'Tribhuvan University Ground, Kirtipur',
    matchType: 'T20',
    matchStatus: 'Kathmandu Kings needs 62 runs in 42 balls',
    team1: {
      id: '1',
      name: 'Pokhara Rhinos',
      logo: 'https://images.pexels.com/photos/2250394/pexels-photo-2250394.jpeg',
      score: 165,
      wickets: 7,
      overs: '20.0',
      battingOrder: 1,
    },
    team2: {
      id: '2',
      name: 'Kathmandu Kings',
      logo: 'https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg',
      score: 104,
      wickets: 3,
      overs: '13.0',
      battingOrder: 2,
    },
    currentBatting: 'team2',
    currentInning: 2,
    tossWinner: 'Pokhara Rhinos',
    tossDecision: 'bat',
    currentBatsmen: [
      { id: '1', name: 'Kushal Bhurtel', runs: 42, balls: 35, fours: 3, sixes: 1, strikeRate: 120.0, onStrike: true },
      { id: '2', name: 'Rohit Paudel', runs: 28, balls: 25, fours: 2, sixes: 0, strikeRate: 112.0, onStrike: false },
    ],
    currentBowler: { id: '3', name: 'Sandeep Lamichhane', overs: '3.0', maidens: 0, runs: 24, wickets: 2, economy: 8.0 },
    recentBalls: ['1', '0', '4', 'W', '6', '2'],
    scorecard: {
      innings1: {
        batting: [
          { id: '4', name: 'Aasif Sheikh', runs: 45, balls: 38, fours: 4, sixes: 1, dismissal: 'c Anil Sah b Sompal Kami', strikeRate: 118.4 },
          { id: '5', name: 'Sunil Dhamala', runs: 32, balls: 30, fours: 3, sixes: 0, dismissal: 'b Sandeep Lamichhane', strikeRate: 106.7 },
          { id: '6', name: 'Binod Bhandari', runs: 28, balls: 25, fours: 2, sixes: 1, dismissal: 'c Dipendra Singh b Karan KC', strikeRate: 112.0 },
          { id: '7', name: 'Sharad Vesawkar', runs: 18, balls: 15, fours: 1, sixes: 0, dismissal: 'run out', strikeRate: 120.0 },
          { id: '8', name: 'Karan KC', runs: 25, balls: 12, fours: 1, sixes: 2, dismissal: 'not out', strikeRate: 208.3 },
          { id: '9', name: 'Sagar Dhakal', runs: 12, balls: 10, fours: 1, sixes: 0, dismissal: 'c Paras Khadka b Sompal Kami', strikeRate: 120.0 },
          { id: '10', name: 'Lalit Rajbanshi', runs: 5, balls: 6, fours: 0, sixes: 0, dismissal: 'b Sandeep Lamichhane', strikeRate: 83.3 },
        ],
        bowling: [
          { id: '3', name: 'Sandeep Lamichhane', overs: '4.0', maidens: 0, runs: 30, wickets: 2, economy: 7.5 },
          { id: '11', name: 'Sompal Kami', overs: '4.0', maidens: 0, runs: 35, wickets: 2, economy: 8.8 },
          { id: '12', name: 'Karan KC', overs: '4.0', maidens: 0, runs: 28, wickets: 1, economy: 7.0 },
          { id: '13', name: 'Dipendra Singh', overs: '4.0', maidens: 0, runs: 32, wickets: 1, economy: 8.0 },
          { id: '14', name: 'Basant Regmi', overs: '4.0', maidens: 0, runs: 40, wickets: 0, economy: 10.0 },
        ],
        extras: 5,
        total: { runs: 165, wickets: 7, overs: '20.0' },
      },
      innings2: {
        batting: [
          { id: '15', name: 'Paras Khadka', runs: 35, balls: 28, fours: 3, sixes: 1, dismissal: 'b Lalit Rajbanshi', strikeRate: 125.0 },
          { id: '16', name: 'Anil Sah', runs: 12, balls: 15, fours: 1, sixes: 0, dismissal: 'lbw b Sagar Dhakal', strikeRate: 80.0 },
          { id: '17', name: 'Dipendra Singh', runs: 14, balls: 10, fours: 2, sixes: 0, dismissal: 'c Binod Bhandari b Karan KC', strikeRate: 140.0 },
          { id: '1', name: 'Kushal Bhurtel', runs: 42, balls: 35, fours: 3, sixes: 1, dismissal: 'not out', strikeRate: 120.0 },
          { id: '2', name: 'Rohit Paudel', runs: 28, balls: 25, fours: 2, sixes: 0, dismissal: 'not out', strikeRate: 112.0 },
        ],
        bowling: [
          { id: '7', name: 'Karan KC', overs: '4.0', maidens: 0, runs: 25, wickets: 1, economy: 6.3 },
          { id: '8', name: 'Sagar Dhakal', overs: '4.0', maidens: 0, runs: 32, wickets: 1, economy: 8.0 },
          { id: '9', name: 'Lalit Rajbanshi', overs: '3.0', maidens: 0, runs: 22, wickets: 1, economy: 7.3 },
          { id: '10', name: 'Sharad Vesawkar', overs: '2.0', maidens: 0, runs: 25, wickets: 0, economy: 12.5 },
        ],
        extras: 2,
        total: { runs: 104, wickets: 3, overs: '13.0' },
      },
    },
    comments: [
      { id: '1', user: 'cricket_fan', text: 'Great batting by Kushal Bhurtel!', time: '5 min ago', likes: 12 },
      { id: '2', user: 'nepal_cricket', text: 'Sandeep Lamichhane bowling superbly today', time: '8 min ago', likes: 24 },
      { id: '3', user: 'sports_lover', text: 'Exciting match! Kings need to accelerate now', time: '15 min ago', likes: 8 },
    ],
    polls: [
      { 
        id: '1', 
        question: 'Who will win this match?', 
        options: [
          { id: '1', text: 'Pokhara Rhinos', votes: 145 },
          { id: '2', text: 'Kathmandu Kings', votes: 187 },
        ],
        totalVotes: 332,
        userVoted: null,
      },
      { 
        id: '2', 
        question: 'Man of the Match?', 
        options: [
          { id: '1', text: 'Kushal Bhurtel', votes: 98 },
          { id: '2', text: 'Sandeep Lamichhane', votes: 112 },
          { id: '3', text: 'Karan KC', votes: 54 },
          { id: '4', text: 'Aasif Sheikh', votes: 72 },
        ],
        totalVotes: 336,
        userVoted: null,
      },
    ],
  },
  '2': {
    id: '2',
    status: 'live',
    venue: 'Mulpani Cricket Ground, Kathmandu',
    matchType: 'ODI',
    matchStatus: 'Chitwan Tigers needs 87 runs in 72 balls',
    team1: {
      id: '3',
      name: 'Biratnagar Warriors',
      logo: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
      score: 223,
      wickets: 10,
      overs: '47.3',
      battingOrder: 1,
    },
    team2: {
      id: '4',
      name: 'Chitwan Tigers',
      logo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      score: 137,
      wickets: 4,
      overs: '38.0',
      battingOrder: 2,
    },
    currentBatting: 'team2',
    currentInning: 2,
    tossWinner: 'Biratnagar Warriors',
    tossDecision: 'bat',
    currentBatsmen: [
      { id: '18', name: 'Arif Sheikh', runs: 45, balls: 62, fours: 3, sixes: 1, strikeRate: 72.6, onStrike: true },
      { id: '19', name: 'Bhim Sharki', runs: 32, balls: 48, fours: 2, sixes: 0, strikeRate: 66.7, onStrike: false },
    ],
    currentBowler: { id: '20', name: 'Pawan Sarraf', overs: '8.0', maidens: 1, runs: 32, wickets: 2, economy: 4.0 },
    recentBalls: ['0', '1', '1', '4', '0', '1'],
    scorecard: {
      innings1: {
        batting: [
          { id: '21', name: 'Prithu Baskota', runs: 65, balls: 78, fours: 7, sixes: 1, dismissal: 'b Mehboob Alam', strikeRate: 83.3 },
          { id: '22', name: 'Dilip Nath', runs: 42, balls: 55, fours: 4, sixes: 0, dismissal: 'c Sagar Kumar b Dipendra Airee', strikeRate: 76.4 },
          { id: '23', name: 'Sagar Pun', runs: 38, balls: 42, fours: 3, sixes: 1, dismissal: 'b Karan KC', strikeRate: 90.5 },
          { id: '24', name: 'Aarif Sheikh', runs: 32, balls: 39, fours: 2, sixes: 0, dismissal: 'c Dipendra Airee b Mehboob Alam', strikeRate: 82.1 },
          { id: '25', name: 'Pawan Sarraf', runs: 25, balls: 30, fours: 2, sixes: 0, dismissal: 'b Karan KC', strikeRate: 83.3 },
          { id: '26', name: 'Bikram Sob', runs: 15, balls: 20, fours: 1, sixes: 0, dismissal: 'b Lalit Rajbanshi', strikeRate: 75.0 },
          { id: '27', name: 'Sompal Kami', runs: 5, balls: 8, fours: 0, sixes: 0, dismissal: 'b Dipendra Airee', strikeRate: 62.5 },
          { id: '28', name: 'Mehboob Alam', runs: 0, balls: 1, fours: 0, sixes: 0, dismissal: 'b Dipendra Airee', strikeRate: 0.0 },
          { id: '29', name: 'Susan Bhari', runs: 0, balls: 2, fours: 0, sixes: 0, dismissal: 'b Lalit Rajbanshi', strikeRate: 0.0 },
          { id: '30', name: 'Avinash Bohara', runs: 1, balls: 3, fours: 0, sixes: 0, dismissal: 'b Karan KC', strikeRate: 33.3 },
        ],
        bowling: [
          { id: '31', name: 'Karan KC', overs: '9.3', maidens: 0, runs: 48, wickets: 3, economy: 5.1 },
          { id: '32', name: 'Lalit Rajbanshi', overs: '10.0', maidens: 1, runs: 45, wickets: 2, economy: 4.5 },
          { id: '33', name: 'Dipendra Airee', overs: '10.0', maidens: 0, runs: 42, wickets: 3, economy: 4.2 },
          { id: '34', name: 'Mehboob Alam', overs: '10.0', maidens: 1, runs: 52, wickets: 2, economy: 5.2 },
          { id: '35', name: 'Sagar Kumar', overs: '8.0', maidens: 0, runs: 36, wickets: 0, economy: 4.5 },
        ],
        extras: 5,
        total: { runs: 223, wickets: 10, overs: '47.3' },
      },
      innings2: {
        batting: [
          { id: '36', name: 'Anil Kumar Sah', runs: 48, balls: 65, fours: 5, sixes: 0, dismissal: 'b Sompal Kami', strikeRate: 73.8 },
          { id: '37', name: 'Sunil Dhamala', runs: 32, balls: 45, fours: 3, sixes: 0, dismissal: 'b Mehboob Alam', strikeRate: 71.1 },
          { id: '38', name: 'Aarif Sheikh', runs: 45, balls: 62, fours: 3, sixes: 1, strikeRate: 72.6, dismissal: 'not out' },
          { id: '39', name: 'Dipendra Airee', runs: 12, balls: 18, fours: 1, sixes: 0, dismissal: 'b Sompal Kami', strikeRate: 66.7 },
          { id: '19', name: 'Bhim Sharki', runs: 32, balls: 48, fours: 2, sixes: 0, dismissal: 'not out', strikeRate: 66.7 },
        ],
        bowling: [
          { id: '40', name: 'Sompal Kami', overs: '10.0', maidens: 1, runs: 42, wickets: 2, economy: 4.2 },
          { id: '41', name: 'Pawan Sarraf', overs: '10.0', maidens: 1, runs: 35, wickets: 0, economy: 3.5 },
          { id: '42', name: 'Mehboob Alam', overs: '10.0', maidens: 0, runs: 38, wickets: 1, economy: 3.8 },
          { id: '43', name: 'Sagar Pun', overs: '8.0', maidens: 0, runs: 22, wickets: 1, economy: 2.8 },
        ],
        extras: 3,
        total: { runs: 137, wickets: 4, overs: '38.0' },
      },
    },
    comments: [
      { id: '1', user: 'cricket_expert', text: 'Great bowling by Sompal Kami today!', time: '10 min ago', likes: 18 },
      { id: '2', user: 'tigers_fan', text: 'Aarif Sheikh playing well under pressure', time: '15 min ago', likes: 12 },
      { id: '3', user: 'nepal_cricket', text: 'Chitwan needs to increase run rate soon', time: '20 min ago', likes: 8 },
    ],
    polls: [
      { 
        id: '1', 
        question: 'Who will win this match?', 
        options: [
          { id: '1', text: 'Biratnagar Warriors', votes: 128 },
          { id: '2', text: 'Chitwan Tigers', votes: 156 },
        ],
        totalVotes: 284,
        userVoted: null,
      },
      { 
        id: '2', 
        question: 'Man of the Match?', 
        options: [
          { id: '1', text: 'Aarif Sheikh', votes: 87 },
          { id: '2', text: 'Sompal Kami', votes: 73 },
          { id: '3', text: 'Karan KC', votes: 65 },
          { id: '4', text: 'Dipendra Airee', votes: 49 },
        ],
        totalVotes: 274,
        userVoted: null,
      },
    ],
  },
};

export default function MatchDetailsScreen() {
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : typeof params.id === 'object' ? params.id[0] : '1';
  const [match, setMatch] = useState<MatchType | null>(null);
  const [activeTab, setActiveTab] = useState('scorecard'); // scorecard, commentary, stats
  const [activeInning, setActiveInning] = useState(0);
  const [activePoll, setActivePoll] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // In a real app, you would fetch the match data from an API
    if (id && mockMatchData[id]) {
      setMatch(mockMatchData[id]);
      // Set active inning to the current one
      setActiveInning(mockMatchData[id].currentInning);
    }
  }, [id]);

  const handleVote = (pollId: string, optionId: string) => {
    // Handle voting in polls
    setActivePoll(pollId);
  };

  const handleComment = () => {
    // Handle new comment
    console.log('Add new comment');
  };

  const handleLikeComment = (commentId: string) => {
    // Handle liking a comment
    console.log('Like comment:', commentId);
  };

  const toggleFollow = () => {
    // Toggle following the match
    console.log('Toggle follow match');
  };

  if (!match) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading match details...</Text>
      </View>
    );
  }

  // Safely accessing nested properties with optional chaining
  const innings1 = match?.scorecard?.innings1;
  const innings2 = match?.scorecard?.innings2;
  const currentInningsData = activeInning === 1 ? innings1 : innings2;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <LinearGradient
        colors={['#DC143C', '#8B0000']}
        style={[
          styles.header,
          { paddingTop: insets.top > 0 ? insets.top : 20 }
        ]}
      >
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
          
          <View style={styles.headerRightActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={toggleFollow}
            >
              <Star 
                size={20} 
                color="#FFFFFF" 
                fill="transparent" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.matchType}>{match.matchType} • {match.venue}</Text>
        
        {/* Match summary section */}
        <View style={styles.matchSummary}>
          <View style={styles.teamContainer}>
            <Image source={{ uri: match.team1.logo }} style={styles.teamLogo} />
            <Text style={styles.teamName}>{match.team1.name}</Text>
            <Text style={styles.teamScore}>
              {match.team1.score}/{match.team1.wickets}
              <Text style={styles.teamOvers}> ({match.team1.overs})</Text>
            </Text>
          </View>
          
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          
          <View style={styles.teamContainer}>
            <Image source={{ uri: match.team2.logo }} style={styles.teamLogo} />
            <Text style={styles.teamName}>{match.team2.name}</Text>
            <Text style={styles.teamScore}>
              {match.team2.score}/{match.team2.wickets}
              <Text style={styles.teamOvers}> ({match.team2.overs})</Text>
            </Text>
          </View>
        </View>
        
        <View style={styles.matchStatusContainer}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <Text style={styles.matchStatusText}>{match.matchStatus}</Text>
        </View>
        
        <View style={styles.recentBallsContainer}>
          {match?.recentBalls.map((ball: string, index: number) => (
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
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'scorecard' && styles.activeTab]}
            onPress={() => setActiveTab('scorecard')}
          >
            <Text style={[styles.tabText, activeTab === 'scorecard' && styles.activeTabText]}>
              Scorecard
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'commentary' && styles.activeTab]}
            onPress={() => setActiveTab('commentary')}
          >
            <Text style={[styles.tabText, activeTab === 'commentary' && styles.activeTabText]}>
              Commentary
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
            onPress={() => setActiveTab('stats')}
          >
            <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
              Info
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        {/* Scorecard Tab Content */}
        {activeTab === 'scorecard' && (
          <View style={styles.scorecardContainer}>
            {/* Inning selector */}
            <View style={styles.inningSelector}>
              <TouchableOpacity
                style={[styles.inningTab, activeInning === 1 && styles.activeInningTab]}
                onPress={() => setActiveInning(1)}
              >
                <Text style={[styles.inningTabText, activeInning === 1 && styles.activeInningTabText]}>
                  {match.team1.name}
                </Text>
                <Text style={[styles.inningScore, activeInning === 1 && styles.activeInningScore]}>
                  {match.team1.score}/{match.team1.wickets} ({match.team1.overs})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.inningTab, activeInning === 2 && styles.activeInningTab]}
                onPress={() => setActiveInning(2)}
              >
                <Text style={[styles.inningTabText, activeInning === 2 && styles.activeInningTabText]}>
                  {match.team2.name}
                </Text>
                <Text style={[styles.inningScore, activeInning === 2 && styles.activeInningScore]}>
                  {match.team2.score}/{match.team2.wickets} ({match.team2.overs})
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Current batsmen section */}
            {activeInning === match.currentInning && match.status === 'live' && (
              <View style={styles.currentBatsmenContainer}>
                <Text style={styles.sectionTitle}>Current Batsmen</Text>
                
                <View style={styles.batsmenTable}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, styles.playerNameCell]}>Batsman</Text>
                    <Text style={styles.tableHeaderCell}>R</Text>
                    <Text style={styles.tableHeaderCell}>B</Text>
                    <Text style={styles.tableHeaderCell}>4s</Text>
                    <Text style={styles.tableHeaderCell}>6s</Text>
                    <Text style={styles.tableHeaderCell}>SR</Text>
                  </View>
                  
                  {match.currentBatsmen.map((batsman) => (
                    <TouchableOpacity 
                      key={batsman.id}
                      style={[styles.tableRow, batsman.onStrike && styles.activePlayerRow]}
                      onPress={() => router.push(`/player/${batsman.id}`)}
                    >
                      <View style={[styles.tableCell, styles.playerNameCell]}>
                        <Text style={styles.playerName}>
                          {batsman.name} {batsman.onStrike && '*'}
                        </Text>
                      </View>
                      <Text style={styles.tableCell}>{batsman.runs}</Text>
                      <Text style={styles.tableCell}>{batsman.balls}</Text>
                      <Text style={styles.tableCell}>{batsman.fours}</Text>
                      <Text style={styles.tableCell}>{batsman.sixes}</Text>
                      <Text style={styles.tableCell}>{batsman.strikeRate}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <View style={styles.currentBowlerContainer}>
                  <Text style={styles.sectionTitle}>Current Bowler</Text>
                  
                  <TouchableOpacity 
                    style={styles.currentBowlerCard}
                    onPress={() => router.push(`/player/${match.currentBowler.id}`)}
                  >
                    <Text style={styles.bowlerName}>{match.currentBowler.name}</Text>
                    <View style={styles.bowlerStats}>
                      <View style={styles.bowlerStat}>
                        <Text style={styles.bowlerStatValue}>{match.currentBowler.overs}</Text>
                        <Text style={styles.bowlerStatLabel}>Overs</Text>
                      </View>
                      <View style={styles.bowlerStat}>
                        <Text style={styles.bowlerStatValue}>{match.currentBowler.maidens}</Text>
                        <Text style={styles.bowlerStatLabel}>Maidens</Text>
                      </View>
                      <View style={styles.bowlerStat}>
                        <Text style={styles.bowlerStatValue}>{match.currentBowler.runs}</Text>
                        <Text style={styles.bowlerStatLabel}>Runs</Text>
                      </View>
                      <View style={styles.bowlerStat}>
                        <Text style={styles.bowlerStatValue}>{match.currentBowler.wickets}</Text>
                        <Text style={styles.bowlerStatLabel}>Wickets</Text>
                      </View>
                      <View style={styles.bowlerStat}>
                        <Text style={styles.bowlerStatValue}>{match.currentBowler.economy}</Text>
                        <Text style={styles.bowlerStatLabel}>Economy</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
            {/* Batting scorecard */}
            <View style={styles.battingScorecardContainer}>
              <Text style={styles.sectionTitle}>Batting</Text>
              
              <View style={styles.batsmenTable}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, styles.playerNameCell]}>Batsman</Text>
                  <Text style={styles.tableHeaderCell}>R</Text>
                  <Text style={styles.tableHeaderCell}>B</Text>
                  <Text style={styles.tableHeaderCell}>4s</Text>
                  <Text style={styles.tableHeaderCell}>6s</Text>
                  <Text style={styles.tableHeaderCell}>SR</Text>
                </View>
                
                {currentInningsData.batting.map((batsman) => (
                  <TouchableOpacity 
                    key={batsman.id}
                    style={styles.tableRow}
                    onPress={() => router.push(`/player/${batsman.id}`)}
                  >
                    <View style={[styles.tableCell, styles.playerNameCell]}>
                      <Text style={styles.playerName}>{batsman.name}</Text>
                      <Text style={styles.dismissalText}>{batsman.dismissal}</Text>
                    </View>
                    <Text style={styles.tableCell}>{batsman.runs}</Text>
                    <Text style={styles.tableCell}>{batsman.balls}</Text>
                    <Text style={styles.tableCell}>{batsman.fours}</Text>
                    <Text style={styles.tableCell}>{batsman.sixes}</Text>
                    <Text style={styles.tableCell}>
                      {(batsman.runs / batsman.balls * 100).toFixed(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
                
                <View style={[styles.tableRow, styles.totalRow]}>
                  <View style={[styles.tableCell, styles.playerNameCell]}>
                    <Text style={styles.totalText}>Extras</Text>
                  </View>
                  <Text style={styles.tableCell}>{currentInningsData.extras}</Text>
                  <Text style={styles.tableCell}></Text>
                  <Text style={styles.tableCell}></Text>
                  <Text style={styles.tableCell}></Text>
                  <Text style={styles.tableCell}></Text>
                </View>
                
                <View style={[styles.tableRow, styles.totalRow]}>
                  <View style={[styles.tableCell, styles.playerNameCell]}>
                    <Text style={styles.totalText}>Total</Text>
                  </View>
                  <Text style={styles.tableCell}>{currentInningsData.total.runs}</Text>
                  <Text style={styles.tableCell}></Text>
                  <Text style={styles.tableCell}></Text>
                  <Text style={styles.tableCell}></Text>
                  <Text style={styles.tableCell}>
                    {currentInningsData.total.overs}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Bowling scorecard */}
            <View style={styles.bowlingScorecardContainer}>
              <Text style={styles.sectionTitle}>Bowling</Text>
              
              <View style={styles.bowlersTable}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, styles.playerNameCell]}>Bowler</Text>
                  <Text style={styles.tableHeaderCell}>O</Text>
                  <Text style={styles.tableHeaderCell}>M</Text>
                  <Text style={styles.tableHeaderCell}>R</Text>
                  <Text style={styles.tableHeaderCell}>W</Text>
                  <Text style={styles.tableHeaderCell}>ER</Text>
                </View>
                
                {currentInningsData.bowling.map((bowler) => (
                  <TouchableOpacity 
                    key={bowler.id}
                    style={styles.tableRow}
                    onPress={() => router.push(`/player/${bowler.id}`)}
                  >
                    <View style={[styles.tableCell, styles.playerNameCell]}>
                      <Text style={styles.playerName}>{bowler.name}</Text>
                    </View>
                    <Text style={styles.tableCell}>{bowler.overs}</Text>
                    <Text style={styles.tableCell}>{bowler.maidens}</Text>
                    <Text style={styles.tableCell}>{bowler.runs}</Text>
                    <Text style={styles.tableCell}>{bowler.wickets}</Text>
                    <Text style={styles.tableCell}>{bowler.economy}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerRightActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginLeft: 8,
  },
  matchType: {
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 12,
    opacity: 0.8,
  },
  matchSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  teamContainer: {
    flex: 2,
    alignItems: 'center',
  },
  teamLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  teamName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  teamScore: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  teamOvers: {
    fontSize: 14,
    fontWeight: 'normal',
    opacity: 0.8,
  },
  vsContainer: {
    flex: 1,
    alignItems: 'center',
  },
  vsText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    opacity: 0.6,
  },
  matchStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
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
  matchStatusText: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
  },
  recentBallsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  ballIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  ballText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  specialBallText: {
    color: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#DC143C',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#777',
  },
  activeTabText: {
    color: '#DC143C',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scorecardContainer: {
    padding: 16,
  },
  inningSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 4,
  },
  inningTab: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeInningTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  inningTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#777',
    marginBottom: 2,
  },
  activeInningTabText: {
    color: '#121212',
  },
  inningScore: {
    fontSize: 12,
    color: '#777',
  },
  activeInningScore: {
    color: '#DC143C',
  },
  currentBatsmenContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 12,
  },
  batsmenTable: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    padding: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#777',
    textAlign: 'center',
  },
  playerNameCell: {
    flex: 3,
    alignItems: 'flex-start',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    padding: 8,
  },
  activePlayerRow: {
    backgroundColor: '#FFEBEE',
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: '#121212',
    textAlign: 'center',
  },
  playerName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#121212',
  },
  dismissalText: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },
  totalRow: {
    backgroundColor: '#F8F9FA',
  },
  totalText: {
    fontWeight: 'bold',
    color: '#121212',
  },
  currentBowlerContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  currentBowlerCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
  },
  bowlerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 8,
  },
  bowlerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bowlerStat: {
    alignItems: 'center',
  },
  bowlerStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC143C',
    marginBottom: 2,
  },
  bowlerStatLabel: {
    fontSize: 11,
    color: '#777',
  },
  battingScorecardContainer: {
    marginBottom: 16,
  },
  bowlingScorecardContainer: {
    marginBottom: 16,
  },
  bowlersTable: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 8,
    overflow: 'hidden',
  }
});
