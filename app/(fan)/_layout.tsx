import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Tv, Users, User, Bell } from 'lucide-react-native';

export default function FanTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#DC143C',
        tabBarInactiveTintColor: '#777777',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color, size }) => (
            <Tv size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="teams"
        options={{
          title: 'Teams',
          tabBarIcon: ({ color, size }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="players"
        options={{
          title: 'Players',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Updates',
          tabBarIcon: ({ color, size }) => (
            <Bell size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});