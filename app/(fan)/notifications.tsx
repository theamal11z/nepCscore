import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Bell, MessageCircle, Calendar, Trophy, Heart, Star, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

import Header from '@/components/Header';

// Mock data for notifications
const mockNotifications = [
  {
    id: '1',
    type: 'live',
    title: 'Match Started',
    message: 'Kathmandu Kings vs Pokhara Rhinos match has started',
    time: '2 minutes ago',
    teamLogo1: 'https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg',
    teamLogo2: 'https://images.pexels.com/photos/2250394/pexels-photo-2250394.jpeg',
    matchId: '1',
    read: false,
  },
  {
    id: '2',
    type: 'score',
    title: 'Wicket Alert',
    message: 'Sandeep Lamichhane takes another wicket! Chitwan Tigers: 87/4 (12.3)',
    time: '15 minutes ago',
    teamLogo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    matchId: '2',
    read: false,
  },
  {
    id: '3',
    type: 'player',
    title: 'Player Milestone',
    message: 'Kushal Bhurtel reaches 1000 runs in T20 matches!',
    time: '2 hours ago',
    playerAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    playerId: '2',
    read: true,
  },
  {
    id: '4',
    type: 'match',
    title: 'Match Reminder',
    message: 'Lalitpur Patriots vs Bhairahawa Gladiators starts in 2 hours',
    time: '3 hours ago',
    teamLogo1: 'https://images.pexels.com/photos/3608542/pexels-photo-3608542.jpeg',
    teamLogo2: 'https://images.pexels.com/photos/2531429/pexels-photo-2531429.jpeg',
    matchId: '3',
    read: true,
  },
  {
    id: '5',
    type: 'result',
    title: 'Match Result',
    message: 'Pokhara Rhinos won by 17 runs against Bhairahawa Gladiators',
    time: '1 day ago',
    teamLogo: 'https://images.pexels.com/photos/2250394/pexels-photo-2250394.jpeg',
    matchId: '6',
    read: true,
  },
  {
    id: '6',
    type: 'team',
    title: 'Team Update',
    message: 'Kathmandu Kings has added a new player: Anil Sah',
    time: '2 days ago',
    teamLogo: 'https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg',
    teamId: '1',
    read: true,
  },
  {
    id: '7',
    type: 'like',
    title: 'New Likes',
    message: 'Your comment on Chitwan Tigers match received 24 likes',
    time: '3 days ago',
    teamLogo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    matchId: '8',
    read: true,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // all, matches, players, teams

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'matches') return ['live', 'score', 'match', 'result'].includes(notification.type);
    if (activeTab === 'players') return notification.type === 'player';
    if (activeTab === 'teams') return notification.type === 'team';
    return true;
  });

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });
    setNotifications(updatedNotifications);
  };

  const handleNotificationPress = (notification) => {
    markAsRead(notification.id);
    
    // Navigate based on notification type
    if (['live', 'score', 'match', 'result'].includes(notification.type) && notification.matchId) {
      router.push(`/match/${notification.matchId}`);
    } else if (notification.type === 'player' && notification.playerId) {
      router.push(`/player/${notification.playerId}`);
    } else if (notification.type === 'team' && notification.teamId) {
      router.push(`/team/${notification.teamId}`);
    }
  };

  const renderNotificationIcon = (type) => {
    switch (type) {
      case 'live':
        return <Bell size={20} color="#DC143C" />;
      case 'score':
        return <Trophy size={20} color="#4CAF50" />;
      case 'player':
        return <Users size={20} color="#2196F3" />;
      case 'match':
        return <Calendar size={20} color="#FF9800" />;
      case 'result':
        return <Trophy size={20} color="#9C27B0" />;
      case 'team':
        return <Users size={20} color="#795548" />;
      case 'like':
        return <Heart size={20} color="#F44336" />;
      default:
        return <Bell size={20} color="#777" />;
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationIconContainer}>
        {renderNotificationIcon(item.type)}
      </View>
      
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
      
      <View style={styles.notificationMedia}>
        {item.teamLogo1 && item.teamLogo2 ? (
          <View style={styles.teamLogosContainer}>
            <Image source={{ uri: item.teamLogo1 }} style={styles.teamLogo} />
            <View style={styles.vsCircle}>
              <Text style={styles.vsText}>vs</Text>
            </View>
            <Image source={{ uri: item.teamLogo2 }} style={styles.teamLogo} />
          </View>
        ) : item.teamLogo ? (
          <Image source={{ uri: item.teamLogo }} style={styles.singleLogo} />
        ) : item.playerAvatar ? (
          <Image source={{ uri: item.playerAvatar }} style={styles.playerAvatar} />
        ) : null}
      </View>
      
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header title="Notifications" rightIcon="none" />
      
      <LinearGradient
        colors={['#DC143C', '#8B0000']}
        style={styles.filterContainer}
      >
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[styles.filterTab, activeTab === 'all' && styles.activeFilterTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.filterTabText, activeTab === 'all' && styles.activeFilterTabText]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, activeTab === 'matches' && styles.activeFilterTab]}
            onPress={() => setActiveTab('matches')}
          >
            <Text style={[styles.filterTabText, activeTab === 'matches' && styles.activeFilterTabText]}>
              Matches
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, activeTab === 'players' && styles.activeFilterTab]}
            onPress={() => setActiveTab('players')}
          >
            <Text style={[styles.filterTabText, activeTab === 'players' && styles.activeFilterTabText]}>
              Players
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, activeTab === 'teams' && styles.activeFilterTab]}
            onPress={() => setActiveTab('teams')}
          >
            <Text style={[styles.filterTabText, activeTab === 'teams' && styles.activeFilterTabText]}>
              Teams
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          setTimeout(() => setRefreshing(false), 1000);
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  filterContainer: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  filterTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeFilterTab: {
    backgroundColor: '#FFFFFF',
  },
  filterTabText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 13,
  },
  activeFilterTabText: {
    color: '#DC143C',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    position: 'relative',
  },
  unreadNotification: {
    backgroundColor: '#FFEBEE',
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
    color: '#777',
  },
  notificationMedia: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamLogosContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 50,
  },
  teamLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    marginVertical: 2,
  },
  vsCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  vsText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#777',
  },
  singleLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC143C',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
});
