import Icon from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../../constants';

const Profile = () => {
  const router = useRouter();

  // Mock user data - replace with actual user data from your state management
  const user = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    image: null,
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userDetail');
              router.replace('/splash');
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const profileOptions = [
    {
      id: 1,
      title: 'Edit Profile',
      description: 'Update your personal information',
      icon: 'user',
      screen: '/profile-edit',
    },
          {
            id: 2,
            title: 'Payment Methods',
            description: 'Manage your payment options',
            icon: 'creditcard',
            screen: '/(tabs)/Payment',
          },
    {
      id: 3,
      title: 'Ride History',
      description: 'View your past rides',
      icon: 'clockcircle',
      screen: '/ride-history',
    },
    {
      id: 4,
      title: 'Settings',
      description: 'App preferences and settings',
      icon: 'setting',
      screen: '/settings',
    },
    {
      id: 5,
      title: 'Transaction History',
      description: 'View all your transactions',
      icon: 'filetext1',
      screen: '/TransactionHistory',
    },
    {
      id: 6,
      title: 'Help & Support',
      description: 'Get help with your account',
      icon: 'questioncircle',
      screen: '/help',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user?.image ? (
              <Image source={{ uri: user.image }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.first_name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.first_name} {user?.last_name}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userPhone}>{user?.phone}</Text>
          </View>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsContainer}>
          {profileOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={() => router.push(option.screen)}
            >
              <View style={styles.optionIcon}>
                <Icon name={option.icon} size={24} color={Colors.yellow} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <Icon name="right" size={16} color={Colors.whiteColor} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#ff4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteColor,
  },
  headerTitle: {
    ...Fonts.Regular,
    fontSize: 24,
    color: Colors.whiteColor,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteColor,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.yellow,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.blackColor,
    borderWidth: 2,
    borderColor: Colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...Fonts.Regular,
    fontSize: 32,
    color: Colors.yellow,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...Fonts.Regular,
    fontSize: 20,
    color: Colors.whiteColor,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor,
    opacity: 0.7,
    marginBottom: 2,
  },
  userPhone: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor,
    opacity: 0.7,
  },
  optionsContainer: {
    padding: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.blackColor,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.whiteColor,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.blackColor,
    borderWidth: 1,
    borderColor: Colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor,
    opacity: 0.7,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blackColor,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  logoutText: {
    ...Fonts.Regular,
    fontSize: 16,
    color: '#ff4444',
    fontWeight: '600',
    marginLeft: 8,
  },
});
