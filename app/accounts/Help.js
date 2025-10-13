import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../../constants';

const Help = () => {
  const router = useRouter();

  const helpTopics = [
    {
      id: 1,
      title: 'Getting Started',
      description: 'Learn how to use Trihp',
      icon: 'help-circle',
    },
    {
      id: 2,
      title: 'Payment Issues',
      description: 'Troubleshoot payment problems',
      icon: 'credit-card',
    },
    {
      id: 3,
      title: 'Ride Problems',
      description: 'Report issues with rides',
      icon: 'car',
    },
    {
      id: 4,
      title: 'Account Support',
      description: 'Manage your account',
      icon: 'account',
    },
    {
      id: 5,
      title: 'Contact Support',
      description: 'Get in touch with our team',
      icon: 'message',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>How can we help you?</Text>
          <Text style={styles.welcomeDescription}>
            Find answers to common questions or contact our support team.
          </Text>
        </View>

        <View style={styles.topicsContainer}>
          {helpTopics.map((topic) => (
            <Pressable key={topic.id} style={styles.topicItem}>
              <View style={styles.topicIcon}>
                <MaterialCommunityIcons name={topic.icon} size={24} color={Colors.yellow} />
              </View>
              <View style={styles.topicContent}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDescription}>{topic.description}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.whiteColor} />
            </Pressable>
          ))}
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Still need help?</Text>
          <Text style={styles.contactDescription}>
            Contact our support team directly
          </Text>
          
          <View style={styles.contactMethods}>
            <Pressable style={styles.contactMethod}>
              <MaterialCommunityIcons name="email" size={20} color={Colors.yellow} />
              <Text style={styles.contactMethodText}>support@trihp.com</Text>
            </Pressable>
            
            <Pressable style={styles.contactMethod}>
              <MaterialCommunityIcons name="phone" size={20} color={Colors.yellow} />
              <Text style={styles.contactMethodText}>+1 (555) 123-4567</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 30,
  },
  welcomeTitle: {
    ...Fonts.Regular,
    fontSize: 20,
    color: Colors.whiteColor,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeDescription: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor,
    opacity: 0.7,
    lineHeight: 20,
  },
  topicsContainer: {
    marginBottom: 30,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171717',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.whiteColor,
  },
  topicIcon: {
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
  topicContent: {
    flex: 1,
  },
  topicTitle: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    fontWeight: '600',
    marginBottom: 4,
  },
  topicDescription: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor,
    opacity: 0.7,
  },
  contactSection: {
    backgroundColor: '#171717',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.whiteColor,
  },
  contactTitle: {
    ...Fonts.Regular,
    fontSize: 18,
    color: Colors.whiteColor,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contactDescription: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor,
    opacity: 0.7,
    marginBottom: 20,
  },
  contactMethods: {
    gap: 12,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactMethodText: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
  },
});

export default Help;