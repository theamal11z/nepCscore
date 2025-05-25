import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

// Import icons individually
import { User } from 'lucide-react-native';
import { Users } from 'lucide-react-native';
import { Trophy } from 'lucide-react-native';
import { Settings } from 'lucide-react-native';
import { Search } from 'lucide-react-native';
import { Filter } from 'lucide-react-native';
import { UserPlus } from 'lucide-react-native';
import { Edit2 } from 'lucide-react-native';
import { Lock } from 'lucide-react-native';
import { Unlock } from 'lucide-react-native';
import { Trash2 } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';
import { X } from 'lucide-react-native';
import { ArrowUpDown } from 'lucide-react-native';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  role: 'player' | 'organizer' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  lastActive: string;
  joinDate: string;
  teamName?: string;
  teamLogo?: string;
}

// Mock API function to fetch users data
const getUsersData = async (): Promise<UserProfile[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: 'u1',
      name: 'Paras Khadka',
      email: 'paras.khadka@example.com',
      phone: '+977 98XXXXXXXX',
      avatar: 'https://via.placeholder.com/60',
      role: 'player',
      status: 'active',
      lastActive: '2025-05-25T09:30:00',
      joinDate: '2025-01-15',
      teamName: 'Kathmandu Kings',
      teamLogo: 'https://via.placeholder.com/40',
    },
    {
      id: 'u2',
      name: 'Sandeep Lamichhane',
      email: 'sandeep.lamichhane@example.com',
      phone: '+977 98XXXXXXXX',
      avatar: 'https://via.placeholder.com/60',
      role: 'player',
      status: 'active',
      lastActive: '2025-05-24T16:45:00',
      joinDate: '2025-01-20',
      teamName: 'Pokhara Rhinos',
      teamLogo: 'https://via.placeholder.com/40',
    },
    {
      id: 'u3',
      name: 'Binod Das',
      email: 'binod.das@example.com',
      phone: '+977 98XXXXXXXX',
      avatar: 'https://via.placeholder.com/60',
      role: 'organizer',
      status: 'active',
      lastActive: '2025-05-25T11:15:00',
      joinDate: '2024-12-10',
    },
    {
      id: 'u4',
      name: 'Pubudu Dassanayake',
      email: 'pubudu.dassanayake@example.com',
      phone: '+977 98XXXXXXXX',
      avatar: 'https://via.placeholder.com/60',
      role: 'organizer',
      status: 'inactive',
      lastActive: '2025-05-15T10:30:00',
      joinDate: '2024-11-05',
    },
    {
      id: 'u5',
      name: 'Gyanendra Malla',
      email: 'gyanendra.malla@example.com',
      phone: '+977 98XXXXXXXX',
      avatar: 'https://via.placeholder.com/60',
      role: 'player',
      status: 'suspended',
      lastActive: '2025-05-10T14:20:00',
      joinDate: '2025-02-01',
      teamName: 'Chitwan Tigers',
      teamLogo: 'https://via.placeholder.com/40',
    },
  ];
};

export default function UsersManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<{ field: string; ascending: boolean }>({
    field: 'name',
    ascending: true,
  });

  useEffect(() => {
    loadUsersData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedRoleFilter, selectedStatusFilter, users, sortBy]);

  const loadUsersData = async () => {
    setIsLoading(true);
    try {
      const data = await getUsersData();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Failed to load users data:', error);
      Alert.alert('Error', 'Failed to load users data');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsersData();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let result = [...users];

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const lowercaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        user =>
          user.name.toLowerCase().includes(lowercaseQuery) ||
          user.email.toLowerCase().includes(lowercaseQuery) ||
          (user.phone && user.phone.includes(searchQuery))
      );
    }

    // Apply role filter
    if (selectedRoleFilter !== 'all') {
      result = result.filter(user => user.role === selectedRoleFilter);
    }

    // Apply status filter
    if (selectedStatusFilter !== 'all') {
      result = result.filter(user => user.status === selectedStatusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;

      // Determine which field to sort by
      switch (sortBy.field) {
        case 'name':
          valueA = a.name;
          valueB = b.name;
          break;
        case 'role':
          valueA = a.role;
          valueB = b.role;
          break;
        case 'joinDate':
          valueA = new Date(a.joinDate).getTime();
          valueB = new Date(b.joinDate).getTime();
          break;
        case 'lastActive':
          valueA = new Date(a.lastActive).getTime();
          valueB = new Date(b.lastActive).getTime();
          break;
        default:
          valueA = a.name;
          valueB = b.name;
      }

      // Perform the comparison
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortBy.ascending
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        // For dates or numbers
        return sortBy.ascending ? (valueA - valueB) : (valueB - valueA);
      }
    });

    setFilteredUsers(result);
  };

  const toggleSortDirection = (field: string) => {
    if (sortBy.field === field) {
      setSortBy({ field, ascending: !sortBy.ascending });
    } else {
      setSortBy({ field, ascending: true });
    }
  };

  const handleUserAction = (userId: string, action: 'edit' | 'suspend' | 'activate' | 'delete') => {
    switch (action) {
      case 'edit':
        router.push(`/(admin)/user/edit/${userId}`);
        break;
      case 'suspend':
        Alert.alert(
          'Suspend User',
          'Are you sure you want to suspend this user?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Suspend',
              style: 'destructive',
              onPress: () => {
                // In a real app, this would call an API
                setUsers(users.map(user => 
                  user.id === userId ? { ...user, status: 'suspended' } : user
                ));
              },
            },
          ]
        );
        break;
      case 'activate':
        // In a real app, this would call an API
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: 'active' } : user
        ));
        break;
      case 'delete':
        Alert.alert(
          'Delete User',
          'Are you sure you want to delete this user? This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                // In a real app, this would call an API
                setUsers(users.filter(user => user.id !== userId));
              },
            },
          ]
        );
        break;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return { backgroundColor: '#E6FFFA', color: '#20B2AA' };
      case 'inactive':
        return { backgroundColor: '#F5F5F5', color: '#888888' };
      case 'suspended':
        return { backgroundColor: '#FFE5E5', color: '#DC143C' };
      default:
        return { backgroundColor: '#E6FFFA', color: '#20B2AA' };
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'player':
        return '#1E90FF';
      case 'organizer':
        return '#FF8C00';
      case 'admin':
        return '#DC143C';
      default:
        return '#666';
    }
  };

  if (isLoading && users.length === 0) {
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
          <Text style={styles.headerTitle}>User Management</Text>
          <TouchableOpacity 
            style={styles.addUserButton} 
            onPress={() => router.push('/(admin)/user/create')}
          >
            <UserPlus size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Filters</Text>
          
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Role:</Text>
            <View style={styles.filterOptions}>
              {['all', 'player', 'organizer', 'admin'].map(role => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.filterOption,
                    selectedRoleFilter === role && styles.filterOptionSelected,
                  ]}
                  onPress={() => setSelectedRoleFilter(role)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedRoleFilter === role && styles.filterOptionTextSelected,
                    ]}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status:</Text>
            <View style={styles.filterOptions}>
              {['all', 'active', 'inactive', 'suspended'].map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterOption,
                    selectedStatusFilter === status && styles.filterOptionSelected,
                  ]}
                  onPress={() => setSelectedStatusFilter(status)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedStatusFilter === status && styles.filterOptionTextSelected,
                    ]}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      <View style={styles.sortHeader}>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => toggleSortDirection('name')}
        >
          <Text 
            style={[
              styles.sortButtonText, 
              sortBy.field === 'name' && styles.sortButtonTextActive
            ]}
          >
            Name
          </Text>
          {sortBy.field === 'name' && (
            <ArrowUpDown size={14} color={sortBy.field === 'name' ? '#DC143C' : '#666'} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => toggleSortDirection('role')}
        >
          <Text 
            style={[
              styles.sortButtonText, 
              sortBy.field === 'role' && styles.sortButtonTextActive
            ]}
          >
            Role
          </Text>
          {sortBy.field === 'role' && (
            <ArrowUpDown size={14} color={sortBy.field === 'role' ? '#DC143C' : '#666'} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => toggleSortDirection('lastActive')}
        >
          <Text 
            style={[
              styles.sortButtonText, 
              sortBy.field === 'lastActive' && styles.sortButtonTextActive
            ]}
          >
            Last Active
          </Text>
          {sortBy.field === 'lastActive' && (
            <ArrowUpDown size={14} color={sortBy.field === 'lastActive' ? '#DC143C' : '#666'} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#DC143C']} />
        }
      >
        {filteredUsers.length === 0 ? (
          <Text style={styles.emptyStateText}>
            No users found. Try adjusting your search or filters.
          </Text>
        ) : (
          filteredUsers.map(user => (
            <TouchableOpacity
              key={user.id}
              style={styles.userCard}
              onPress={() => router.push(`/(admin)/user/${user.id}`)}
            >
              <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.userMeta}>
                  <Text 
                    style={[
                      styles.userRole, 
                      { color: getRoleColor(user.role) }
                    ]}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Text>
                  <View 
                    style={[
                      styles.statusBadge, 
                      { backgroundColor: getStatusBadgeColor(user.status).backgroundColor }
                    ]}
                  >
                    <Text 
                      style={[
                        styles.statusText, 
                        { color: getStatusBadgeColor(user.status).color }
                      ]}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.userActions}>
                <TouchableOpacity 
                  style={styles.userAction}
                  onPress={() => handleUserAction(user.id, 'edit')}
                >
                  <Edit2 size={16} color="#666" />
                </TouchableOpacity>
                {user.status === 'active' ? (
                  <TouchableOpacity 
                    style={styles.userAction}
                    onPress={() => handleUserAction(user.id, 'suspend')}
                  >
                    <Lock size={16} color="#DC143C" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={styles.userAction}
                    onPress={() => handleUserAction(user.id, 'activate')}
                  >
                    <Unlock size={16} color="#20B2AA" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={styles.userAction}
                  onPress={() => handleUserAction(user.id, 'delete')}
                >
                  <Trash2 size={16} color="#666" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.push('/(admin)/')}
        >
          <User size={24} color="#666" />
          <Text style={styles.navLabel}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonActive]}
        >
          <Users size={24} color="#DC143C" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Users</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.push('/(admin)/tournaments')}
        >
          <Trophy size={24} color="#666" />
          <Text style={styles.navLabel}>Tournaments</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.push('/(admin)/settings')}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addUserButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    padding: 8,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },
  filterOptionSelected: {
    backgroundColor: '#DC143C',
    borderColor: '#DC143C',
  },
  filterOptionText: {
    fontSize: 12,
    color: '#666',
  },
  filterOptionTextSelected: {
    color: '#fff',
  },
  sortHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  sortButtonTextActive: {
    color: '#DC143C',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRole: {
    fontSize: 12,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAction: {
    padding: 8,
  },
  emptyStateText: {
    textAlign: 'center',
    padding: 24,
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
