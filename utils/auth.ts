import AsyncStorage from '@react-native-async-storage/async-storage';

// In a real app, you would use a proper authentication system
// This is just a placeholder for demo purposes

interface User {
  id: string;
  name: string;
  email: string;
  role: 'fan' | 'player' | 'organizer' | 'admin';
  avatar?: string;
}

const DEMO_USERS: Record<string, User> = {
  'fan@example.com': {
    id: '1',
    name: 'Cricket Fan',
    email: 'fan@example.com',
    role: 'fan',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
  },
  'player@example.com': {
    id: '2',
    name: 'Cricket Player',
    email: 'player@example.com',
    role: 'player',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
  },
  'organizer@example.com': {
    id: '3',
    name: 'Cricket Organizer',
    email: 'organizer@example.com',
    role: 'organizer',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
  },
  'admin@example.com': {
    id: '4',
    name: 'Cricket Admin',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
  },
};

export async function login(email: string, password: string): Promise<string> {
  // In a real app, you would verify credentials with a server
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = DEMO_USERS[email];
      if (user && password === 'password') {
        // Save user info to AsyncStorage
        AsyncStorage.setItem('user', JSON.stringify(user));
        resolve(user.role);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const userJson = await AsyncStorage.getItem('user');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Error logging out:', error);
  }
}