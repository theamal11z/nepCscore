// This is a mock API service for demonstration purposes
// In a real app, you would make actual API calls to a backend server

import { getCurrentUser } from './auth';

// Utility function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for teams
const mockTeams = [
  {
    id: '1',
    name: 'Kathmandu Kings',
    logo: 'https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg',
    matches: 25,
    win: 18,
    loss: 7,
    isFollowing: true,
  },
  {
    id: '2',
    name: 'Pokhara Rhinos',
    logo: 'https://images.pexels.com/photos/2250394/pexels-photo-2250394.jpeg',
    matches: 25,
    win: 15,
    loss: 10,
    isFollowing: false,
  },
  {
    id: '3',
    name: 'Chitwan Tigers',
    logo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    matches: 25,
    win: 16,
    loss: 9,
    isFollowing: true,
  },
  {
    id: '4',
    name: 'Biratnagar Warriors',
    logo: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
    matches: 25,
    win: 12,
    loss: 13,
    isFollowing: false,
  },
  {
    id: '5',
    name: 'Lalitpur Patriots',
    logo: 'https://images.pexels.com/photos/3608542/pexels-photo-3608542.jpeg',
    matches: 25,
    win: 14,
    loss: 11,
    isFollowing: true,
  },
  {
    id: '6',
    name: 'Bhairahawa Gladiators',
    logo: 'https://images.pexels.com/photos/2531429/pexels-photo-2531429.jpeg',
    matches: 25,
    win: 13,
    loss: 12,
    isFollowing: false,
  },
];

// Mock data for matches
const mockLiveMatches = [
  {
    id: '1',
    venue: 'Tribhuvan University Ground, Kirtipur',
    matchType: 'T20',
    status: 'Kathmandu Kings needs 62 runs in 42 balls',
    team1: {
      name: 'Pokhara Rhinos',
      logo: 'https://images.pexels.com/photos/2250394/pexels-photo-2250394.jpeg',
      score: 165,
      wickets: 7,
      overs: '20.0',
    },
    team2: {
      name: 'Kathmandu Kings',
      logo: 'https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg',
      score: 104,
      wickets: 3,
      overs: '13.0',
    },
    currentBatting: 'team2',
    recentBalls: ['1', '0', '4', 'W', '6', '2'],
  },
  {
    id: '2',
    venue: 'Mulpani Cricket Ground, Kathmandu',
    matchType: 'ODI',
    status: 'Chitwan Tigers needs 87 runs in 72 balls',
    team1: {
      name: 'Biratnagar Warriors',
      logo: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
      score: 223,
      wickets: 10,
      overs: '47.3',
    },
    team2: {
      name: 'Chitwan Tigers',
      logo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      score: 137,
      wickets: 4,
      overs: '38.0',
    },
    currentBatting: 'team2',
    recentBalls: ['0', '1', '1', '4', '0', '1'],
  },
];

const mockUpcomingMatches = [
  {
    id: '3',
    date: 'JUN 15',
    time: '3:00 PM',
    venue: 'Tribhuvan University Ground, Kirtipur',
    matchType: 'T20',
    team1: {
      name: 'Lalitpur Patriots',
      logo: 'https://images.pexels.com/photos/3608542/pexels-photo-3608542.jpeg',
    },
    team2: {
      name: 'Bhairahawa Gladiators',
      logo: 'https://images.pexels.com/photos/2531429/pexels-photo-2531429.jpeg',
    },
  },
  {
    id: '4',
    date: 'JUN 17',
    time: '10:00 AM',
    venue: 'Mulpani Cricket Ground, Kathmandu',
    matchType: 'ODI',
    team1: {
      name: 'Kathmandu Kings',
      logo: 'https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg',
    },
    team2: {
      name: 'Chitwan Tigers',
      logo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    },
  },
  {
    id: '5',
    date: 'JUN 20',
    time: '2:30 PM',
    venue: 'Pokhara Stadium, Pokhara',
    matchType: 'T20',
    team1: {
      name: 'Pokhara Rhinos',
      logo: 'https://images.pexels.com/photos/2250394/pexels-photo-2250394.jpeg',
    },
    team2: {
      name: 'Biratnagar Warriors',
      logo: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
    },
  },
];

const mockRecentMatches = [
  {
    id: '6',
    date: 'JUN 10',
    venue: 'Tribhuvan University Ground, Kirtipur',
    team1: {
      name: 'Pokhara Rhinos',
      logo: 'https://images.pexels.com/photos/2250394/pexels-photo-2250394.jpeg',
      score: 182,
      wickets: 6,
    },
    team2: {
      name: 'Bhairahawa Gladiators',
      logo: 'https://images.pexels.com/photos/2531429/pexels-photo-2531429.jpeg',
      score: 165,
      wickets: 9,
    },
    result: 'Pokhara Rhinos won by 17 runs',
  },
  {
    id: '7',
    date: 'JUN 8',
    venue: 'Mulpani Cricket Ground, Kathmandu',
    team1: {
      name: 'Lalitpur Patriots',
      logo: 'https://images.pexels.com/photos/3608542/pexels-photo-3608542.jpeg',
      score: 145,
      wickets: 10,
    },
    team2: {
      name: 'Kathmandu Kings',
      logo: 'https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg',
      score: 146,
      wickets: 4,
    },
    result: 'Kathmandu Kings won by 6 wickets',
  },
  {
    id: '8',
    date: 'JUN 5',
    venue: 'Pokhara Stadium, Pokhara',
    team1: {
      name: 'Chitwan Tigers',
      logo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      score: 176,
      wickets: 8,
    },
    team2: {
      name: 'Biratnagar Warriors',
      logo: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
      score: 155,
      wickets: 9,
    },
    result: 'Chitwan Tigers won by 21 runs',
  },
];

// Mock organizer dashboard data
const mockOrganizerData = {
  organizerName: 'Cricket Nepal',
  organizerAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
  organizationName: 'Nepal Cricket Association',
  stats: {
    totalMatches: 68,
    activeTeams: 12,
    totalPlayers: 156,
    fanEngagement: 87,
  },
  liveMatches: [
    {
      id: '1',
      venue: 'Tribhuvan University Ground, Kirtipur',
      team1: {
        name: 'Pokhara Rhinos',
        logo: 'https://images.pexels.com/photos/2250394/pexels-photo-2250394.jpeg',
        score: 165,
        wickets: 7,
        overs: '20.0',
      },
      team2: {
        name: 'Kathmandu Kings',
        logo: 'https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg',
        score: 104,
        wickets: 3,
        overs: '13.0',
      },
    },
  ],
  upcomingMatches: [
    {
      id: '3',
      date: 'JUN 15',
      time: '3:00 PM',
      venue: 'Tribhuvan University Ground, Kirtipur',
      team1: {
        name: 'Lalitpur Patriots',
        logo: 'https://images.pexels.com/photos/3608542/pexels-photo-3608542.jpeg',
      },
      team2: {
        name: 'Bhairahawa Gladiators',
        logo: 'https://images.pexels.com/photos/2531429/pexels-photo-2531429.jpeg',
      },
    },
    {
      id: '4',
      date: 'JUN 17',
      time: '10:00 AM',
      venue: 'Mulpani Cricket Ground, Kathmandu',
      team1: {
        name: 'Kathmandu Kings',
        logo: 'https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg',
      },
      team2: {
        name: 'Chitwan Tigers',
        logo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      },
    },
  ],
  recentActivities: [
    {
      text: 'Match created: Lalitpur Patriots vs Bhairahawa Gladiators',
      time: '2 hours ago',
      dotColor: '#4CAF50',
    },
    {
      text: 'Score updated: Pokhara Rhinos 165/7 (20.0)',
      time: '3 hours ago',
      dotColor: '#2196F3',
    },
    {
      text: 'New player added: Kushal Bhurtel to Kathmandu Kings',
      time: '1 day ago',
      dotColor: '#FF9800',
    },
    {
      text: 'Team updated: Chitwan Tigers logo changed',
      time: '2 days ago',
      dotColor: '#9C27B0',
    },
  ],
};

// API functions
export async function getTeams() {
  await delay(500);
  return mockTeams;
}

export async function getMatches() {
  await delay(800);
  return {
    liveMatches: mockLiveMatches,
    upcomingMatches: mockUpcomingMatches,
    recentMatches: mockRecentMatches,
  };
}

export async function getOrganizerData() {
  await delay(1000);
  return mockOrganizerData;
}

export async function getTeamDetails(teamId: string) {
  await delay(800);
  const team = mockTeams.find(t => t.id === teamId);
  if (!team) throw new Error('Team not found');
  
  return {
    ...team,
    players: [
      {
        id: '1',
        name: 'Sandeep Lamichhane',
        role: 'Bowler',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
        matches: 56,
        runs: 320,
        wickets: 89,
        average: 18.5,
      },
      {
        id: '2',
        name: 'Kushal Bhurtel',
        role: 'Batsman',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
        matches: 42,
        runs: 1245,
        wickets: 5,
        average: 32.8,
      },
      {
        id: '3',
        name: 'Rohit Paudel',
        role: 'All-rounder',
        avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg',
        matches: 38,
        runs: 862,
        wickets: 23,
        average: 24.2,
      },
    ],
    recentMatches: mockRecentMatches.filter(
      m => m.team1.name === team.name || m.team2.name === team.name
    ).slice(0, 3),
    stats: {
      totalWins: team.win,
      totalLosses: team.loss,
      winPercentage: Math.round((team.win / team.matches) * 100),
      highestScore: 195,
      lowestScore: 98,
    }
  };
}

export async function getMatchDetails(matchId: string) {
  await delay(700);
  
  // Find match in one of the match lists
  let match = [...mockLiveMatches, ...mockUpcomingMatches, ...mockRecentMatches].find(
    m => m.id === matchId
  );
  
  if (!match) throw new Error('Match not found');
  
  // For live matches, add additional data
  if (mockLiveMatches.find(m => m.id === matchId)) {
    return {
      ...match,
      scoreboard: {
        currentInnings: (match as any).currentBatting === 'team1' ? 1 : 2,
        currentBatsmen: [
          { 
            name: 'Kushal Bhurtel', 
            runs: 42, 
            balls: 35, 
            fours: 3, 
            sixes: 1, 
            strikeRate: 120.0 
          },
          { 
            name: 'Rohit Paudel', 
            runs: 28, 
            balls: 21, 
            fours: 2, 
            sixes: 1, 
            strikeRate: 133.3 
          }
        ],
        currentBowler: { 
          name: 'Sandeep Lamichhane', 
          overs: '3.4', 
          maidens: 0, 
          runs: 28, 
          wickets: 2, 
          economy: 7.6 
        },
        lastWicket: {
          player: 'Dipendra Singh Airee',
          runs: 15,
          balls: 12,
          dismissalType: 'c Karan KC b Sandeep Lamichhane',
          over: '12.2',
        },
        partnership: {
          runs: 28,
          balls: 16,
        },
        requiredRunRate: 8.85,
        currentRunRate: 8.0,
      },
      commentary: [
        { 
          over: '13.0', 
          ball: '6', 
          description: 'Fuller delivery outside off, driven through covers for TWO runs.'
        },
        { 
          over: '13.0', 
          ball: '5', 
          description: 'Short ball, pulled towards midwicket for SIX! Great shot!'
        },
        { 
          over: '13.0', 
          ball: '4', 
          description: 'WICKET! Caught at mid-on. Poor shot selection.'
        },
        { 
          over: '13.0', 
          ball: '3', 
          description: 'Good length delivery, pushed for FOUR through point!'
        },
        { 
          over: '13.0', 
          ball: '2', 
          description: 'Defended back to the bowler. No run.'
        },
        { 
          over: '13.0', 
          ball: '1', 
          description: 'Full toss, driven for a single to long-off.'
        },
      ],
      poll: {
        question: 'Who will win this match?',
        options: [
          { id: '1', text: match.team1.name, votes: 342 },
          { id: '2', text: match.team2.name, votes: 285 },
        ],
        totalVotes: 627,
      }
    };
  }
  
  return match;
}