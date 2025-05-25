import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ProgressBar } from 'react-native-paper';

// Import icons individually to avoid reference errors
import { User } from 'lucide-react-native';
import { BarChart2 } from 'lucide-react-native';
import { TrendingUp } from 'lucide-react-native';
import { Settings } from 'lucide-react-native';
import { Calendar } from 'lucide-react-native';
import { Clock } from 'lucide-react-native';
import { PlayCircle } from 'lucide-react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { AlertCircle } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';

interface TrainingSession {
  id: string;
  title: string;
  type: 'batting' | 'bowling' | 'fielding' | 'fitness';
  date: string;
  time: string;
  duration: number; // in minutes
  location: string;
  coach: string;
  isCompleted: boolean;
  exercises: TrainingExercise[];
}

interface TrainingExercise {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  isCompleted: boolean;
  videoUrl?: string;
}

interface TrainingProgress {
  battingSkills: number; // 0-100
  bowlingSkills: number; // 0-100
  fieldingSkills: number; // 0-100
  fitnessLevel: number; // 0-100
  weeklySessionsCompleted: number;
  weeklySessionsTotal: number;
  monthlyProgress: {
    month: string;
    battingProgress: number;
    bowlingProgress: number;
    fieldingProgress: number;
  }[];
}

interface TrainingData {
  upcomingSessions: TrainingSession[];
  completedSessions: TrainingSession[];
  progress: TrainingProgress;
}

// Mock API function to fetch training data
const getTrainingData = async (): Promise<TrainingData> => {
  // In a real app, this would be an API call
  return {
    upcomingSessions: [
      {
        id: 's1',
        title: 'Power Hitting Session',
        type: 'batting',
        date: '2025-05-26',
        time: '09:00',
        duration: 90,
        location: 'Tribhuvan University Ground',
        coach: 'Pubudu Dassanayake',
        isCompleted: false,
        exercises: [
          {
            id: 'e1',
            title: 'Straight Drive Practice',
            description: 'Focus on maintaining balance and follow-through',
            duration: 20,
            isCompleted: false,
          },
          {
            id: 'e2',
            title: 'Pull Shot Practice',
            description: 'Work on getting into position early',
            duration: 20,
            isCompleted: false,
            videoUrl: 'https://example.com/video1',
          },
          {
            id: 'e3',
            title: 'Power Hitting Drills',
            description: 'Focus on timing and power generation',
            duration: 30,
            isCompleted: false,
          },
        ],
      },
      {
        id: 's2',
        title: 'Bowling Accuracy Training',
        type: 'bowling',
        date: '2025-05-28',
        time: '14:00',
        duration: 60,
        location: 'Kirtipur Cricket Ground',
        coach: 'Binod Das',
        isCompleted: false,
        exercises: [
          {
            id: 'e4',
            title: 'Yorker Practice',
            description: 'Focus on consistent line and length',
            duration: 15,
            isCompleted: false,
          },
          {
            id: 'e5',
            title: 'Slow Ball Variations',
            description: 'Practice different grips and release points',
            duration: 15,
            isCompleted: false,
            videoUrl: 'https://example.com/video2',
          },
          {
            id: 'e6',
            title: 'Death Bowling',
            description: 'Focus on yorkers and wide yorkers',
            duration: 15,
            isCompleted: false,
          },
        ],
      },
    ],
    completedSessions: [
      {
        id: 's3',
        title: 'Fitness Session',
        type: 'fitness',
        date: '2025-05-22',
        time: '08:00',
        duration: 60,
        location: 'Team Gym',
        coach: 'Sandip Lamichhane',
        isCompleted: true,
        exercises: [
          {
            id: 'e7',
            title: 'Cardio Workout',
            description: '30 minutes running on treadmill',
            duration: 30,
            isCompleted: true,
          },
          {
            id: 'e8',
            title: 'Strength Training',
            description: 'Focus on core and lower body',
            duration: 30,
            isCompleted: true,
          },
        ],
      },
    ],
    progress: {
      battingSkills: 75,
      bowlingSkills: 68,
      fieldingSkills: 82,
      fitnessLevel: 88,
      weeklySessionsCompleted: 3,
      weeklySessionsTotal: 5,
      monthlyProgress: [
        {
          month: 'Jan',
          battingProgress: 65,
          bowlingProgress: 60,
          fieldingProgress: 70,
        },
        {
          month: 'Feb',
          battingProgress: 68,
          bowlingProgress: 62,
          fieldingProgress: 72,
        },
        {
          month: 'Mar',
          battingProgress: 70,
          bowlingProgress: 65,
          fieldingProgress: 75,
        },
        {
          month: 'Apr',
          battingProgress: 72,
          bowlingProgress: 67,
          fieldingProgress: 78,
        },
        {
          month: 'May',
          battingProgress: 75,
          bowlingProgress: 68,
          fieldingProgress: 82,
        },
      ],
    },
  };
};

export default function PlayerTraining() {
  const [trainingData, setTrainingData] = useState<TrainingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTrainingData();
  }, []);

  const loadTrainingData = async () => {
    setIsLoading(true);
    try {
      const data = await getTrainingData();
      setTrainingData(data);
    } catch (error) {
      console.error('Failed to load training data:', error);
      Alert.alert('Error', 'Failed to load training data');
    } finally {
      setIsLoading(false);
    }
  };

  const markSessionComplete = (sessionId: string) => {
    if (!trainingData) return;
    
    // Find the session and mark it as completed
    const updatedUpcomingSessions = trainingData.upcomingSessions.filter(
      session => session.id !== sessionId
    );
    
    const sessionToComplete = trainingData.upcomingSessions.find(
      session => session.id === sessionId
    );
    
    if (sessionToComplete) {
      const completedSession = {
        ...sessionToComplete,
        isCompleted: true,
        exercises: sessionToComplete.exercises.map(ex => ({
          ...ex,
          isCompleted: true,
        })),
      };
      
      setTrainingData({
        ...trainingData,
        upcomingSessions: updatedUpcomingSessions,
        completedSessions: [completedSession, ...trainingData.completedSessions],
      });
      
      Alert.alert('Success', 'Training session marked as completed');
    }
  };

  const handleViewSessionDetails = (session: TrainingSession) => {
    // In a real app, navigate to a detail view
    router.push({
      pathname: '/(player)/training/session',
      params: { id: session.id },
    });
  };

  if (isLoading || !trainingData) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#DC143C', '#8B0000']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Training & Development</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skill Progress</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Batting</Text>
                <Text style={styles.progressValue}>{trainingData.progress.battingSkills}%</Text>
              </View>
              <ProgressBar
                progress={trainingData.progress.battingSkills / 100}
                color="#DC143C"
                style={styles.progressBar}
              />
            </View>
            
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Bowling</Text>
                <Text style={styles.progressValue}>{trainingData.progress.bowlingSkills}%</Text>
              </View>
              <ProgressBar
                progress={trainingData.progress.bowlingSkills / 100}
                color="#1E90FF"
                style={styles.progressBar}
              />
            </View>
            
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Fielding</Text>
                <Text style={styles.progressValue}>{trainingData.progress.fieldingSkills}%</Text>
              </View>
              <ProgressBar
                progress={trainingData.progress.fieldingSkills / 100}
                color="#32CD32"
                style={styles.progressBar}
              />
            </View>
            
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Fitness</Text>
                <Text style={styles.progressValue}>{trainingData.progress.fitnessLevel}%</Text>
              </View>
              <ProgressBar
                progress={trainingData.progress.fitnessLevel / 100}
                color="#FF8C00"
                style={styles.progressBar}
              />
            </View>
          </View>
          
          <View style={styles.weeklyProgress}>
            <Text style={styles.weeklyProgressText}>Weekly Sessions: </Text>
            <Text style={styles.weeklyProgressValue}>
              {trainingData.progress.weeklySessionsCompleted} / {trainingData.progress.weeklySessionsTotal}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
          
          {trainingData.upcomingSessions.length === 0 ? (
            <Text style={styles.emptyStateText}>No upcoming training sessions</Text>
          ) : (
            trainingData.upcomingSessions.map(session => (
              <View key={session.id} style={styles.sessionCard}>
                <TouchableOpacity
                  style={styles.sessionHeader}
                  onPress={() => handleViewSessionDetails(session)}
                >
                  <View style={styles.sessionTitleContainer}>
                    <View
                      style={[
                        styles.sessionTypeIndicator,
                        { backgroundColor: getSessionTypeColor(session.type) },
                      ]}
                    />
                    <Text style={styles.sessionTitle}>{session.title}</Text>
                  </View>
                  <ChevronRight size={20} color="#666" />
                </TouchableOpacity>
                
                <View style={styles.sessionInfo}>
                  <View style={styles.sessionInfoItem}>
                    <Calendar size={16} color="#666" />
                    <Text style={styles.sessionInfoText}>
                      {new Date(session.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.sessionInfoItem}>
                    <Clock size={16} color="#666" />
                    <Text style={styles.sessionInfoText}>{session.time}</Text>
                  </View>
                </View>
                
                <View style={styles.sessionExercises}>
                  <Text style={styles.sessionSubtitle}>Exercises:</Text>
                  {session.exercises.slice(0, 2).map((exercise) => (
                    <View key={exercise.id} style={styles.exerciseItem}>
                      <View style={styles.exerciseHeader}>
                        <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                        {exercise.videoUrl && (
                          <TouchableOpacity style={styles.videoButton}>
                            <PlayCircle size={16} color="#DC143C" />
                            <Text style={styles.videoButtonText}>Watch</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                      <Text style={styles.exerciseDuration}>{exercise.duration} min</Text>
                    </View>
                  ))}
                  {session.exercises.length > 2 && (
                    <Text style={styles.moreExercisesText}>
                      +{session.exercises.length - 2} more exercises
                    </Text>
                  )}
                </View>
                
                <TouchableOpacity
                  style={styles.markCompleteButton}
                  onPress={() => markSessionComplete(session.id)}
                >
                  <CheckCircle2 size={20} color="#fff" />
                  <Text style={styles.markCompleteButtonText}>
                    Mark as Completed
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Completed Sessions</Text>
            <TouchableOpacity onPress={() => router.push('/(player)/training/history')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {trainingData.completedSessions.length === 0 ? (
            <Text style={styles.emptyStateText}>No completed training sessions yet</Text>
          ) : (
            trainingData.completedSessions.map(session => (
              <TouchableOpacity 
                key={session.id} 
                style={styles.completedSessionCard}
                onPress={() => handleViewSessionDetails(session)}
              >
                <View style={styles.completedSessionHeader}>
                  <View style={styles.sessionTitleContainer}>
                    <View
                      style={[
                        styles.sessionTypeIndicator,
                        { backgroundColor: getSessionTypeColor(session.type) },
                      ]}
                    />
                    <Text style={styles.completedSessionTitle}>{session.title}</Text>
                  </View>
                  <Text style={styles.completedDate}>
                    {new Date(session.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.completedSessionInfo}>
                  {session.exercises.length} exercises • {session.duration} min
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
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
          style={styles.navButton} 
          onPress={() => router.push('/(player)/stats')}
        >
          <BarChart2 size={24} color="#666" />
          <Text style={styles.navLabel}>Statistics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonActive]}
          onPress={() => {}}
        >
          <TrendingUp size={24} color="#DC143C" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Training</Text>
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

// Helper function to get color based on training type
const getSessionTypeColor = (type: string) => {
  switch (type) {
    case 'batting':
      return '#DC143C';
    case 'bowling':
      return '#1E90FF';
    case 'fielding':
      return '#32CD32';
    case 'fitness':
      return '#FF8C00';
    default:
      return '#666';
  }
};

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
  content: {
    flex: 1,
  },
  section: {
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#DC143C',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressItem: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  weeklyProgress: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  weeklyProgressText: {
    fontSize: 16,
    fontWeight: '500',
  },
  weeklyProgressValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sessionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionTypeIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 8,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  sessionInfo: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 16,
  },
  sessionInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionInfoText: {
    fontSize: 14,
    color: '#666',
  },
  sessionExercises: {
    padding: 16,
  },
  sessionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  exerciseItem: {
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  exerciseTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  exerciseDuration: {
    fontSize: 12,
    color: '#666',
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  videoButtonText: {
    fontSize: 12,
    color: '#DC143C',
  },
  moreExercisesText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  markCompleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC143C',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  markCompleteButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  completedSessionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  completedSessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completedSessionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  completedDate: {
    fontSize: 14,
    color: '#666',
  },
  completedSessionInfo: {
    fontSize: 14,
    color: '#666',
  },
  emptyStateText: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
    fontStyle: 'italic',
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
