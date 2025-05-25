import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  backgroundColor: string;
  textColor: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  backgroundColor,
  textColor,
}: StatsCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
      <View style={[styles.iconContainer, { backgroundColor }]}>
        {icon}
      </View>
      <Text style={[styles.value, { color: textColor }]}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#777',
  },
});