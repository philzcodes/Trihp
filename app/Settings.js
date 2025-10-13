import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { BackButton } from '../components';
import { Colors, Fonts } from '../constants';

const Settings = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Profile',
          icon: 'person',
          onPress: () => router.push('/profile'),
        },
        {
          id: 'payment',
          title: 'Payment Methods',
          icon: 'card',
          onPress: () => router.push('/payment'),
        },
        {
          id: 'security',
          title: 'Security & Privacy',
          icon: 'shield-checkmark',
          onPress: () => Alert.alert('Security', 'Security settings coming soon!'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          icon: 'notifications',
          type: 'switch',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: 'location',
          title: 'Location Services',
          icon: 'location',
          type: 'switch',
          value: locationServices,
          onToggle: setLocationServices,
        },
        {
          id: 'darkMode',
          title: 'Dark Mode',
          icon: 'moon',
          type: 'switch',
          value: darkMode,
          onToggle: setDarkMode,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help Center',
          icon: 'help-circle',
          onPress: () => router.push('/help'),
        },
        {
          id: 'contact',
          title: 'Contact Us',
          icon: 'mail',
          onPress: () => Alert.alert('Contact', 'Contact support feature coming soon!'),
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          icon: 'chatbubble',
          onPress: () => Alert.alert('Feedback', 'Feedback feature coming soon!'),
        },
      ],
    },
    {
      title: 'Legal',
      items: [
        {
          id: 'terms',
          title: 'Terms of Service',
          icon: 'document-text',
          onPress: () => Alert.alert('Terms', 'Terms of Service coming soon!'),
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          icon: 'lock-closed',
          onPress: () => Alert.alert('Privacy', 'Privacy Policy coming soon!'),
        },
      ],
    },
  ];

  const handleLogout = () => {
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
          onPress: () => {
            // Handle logout logic
            router.replace('/login');
          },
        },
      ]
    );
  };

  const renderSettingItem = (item) => {
    if (item.type === 'switch') {
      return (
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <View style={styles.settingIcon}>
              <Ionicons name={item.icon} size={20} color={Colors.whiteColor} />
            </View>
            <Text style={styles.settingText}>{item.title}</Text>
          </View>
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: Colors.grey10, true: Colors.yellow }}
            thumbColor={item.value ? Colors.blackColor : Colors.grey14}
          />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.settingItem} onPress={item.onPress}>
        <View style={styles.settingContent}>
          <View style={styles.settingIcon}>
            <Ionicons name={item.icon} size={20} color={Colors.whiteColor} />
          </View>
          <Text style={styles.settingText}>{item.title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.grey14} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.back()} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <View key={item.id}>
                  {renderSettingItem(item)}
                  {itemIndex < section.items.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.logoutContent}>
            <Ionicons name="log-out" size={20} color={Colors.red} />
            <Text style={styles.logoutText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    ...Fonts.TextBold,
    fontSize: 24,
    color: Colors.whiteColor,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    ...Fonts.TextBold,
    fontSize: 18,
    color: Colors.whiteColor,
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  sectionContent: {
    backgroundColor: Colors.grey11,
    borderRadius: 15,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 30,
    alignItems: 'center',
    marginRight: 15,
  },
  settingText: {
    ...Fonts.Medium,
    fontSize: 16,
    color: Colors.whiteColor,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.grey10,
    marginLeft: 45,
  },
  logoutButton: {
    backgroundColor: Colors.grey11,
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    ...Fonts.Medium,
    fontSize: 16,
    color: Colors.red,
    marginLeft: 15,
  },
});
