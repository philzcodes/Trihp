import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants'; // Assuming these are defined

// --- MOCK DATA ---
const TOPICS_DATA = [
  { id: '1', title: 'Help with ride' },
  { id: '2', title: 'Account' },
  { id: '3', title: 'Introduction to Trihp' },
];

/**
 * Renders a single topic row item (bullet-point style).
 */
const TopicItem = ({ title, onPress }) => (
  <Pressable style={styles.topicItemContainer} onPress={onPress}>
    <View style={styles.bulletPoint} />
    <Text style={styles.topicTitleText}>{title}</Text>
    {/* Using Entypo for the chevron-right icon, which is thin and sharp */}
    <Entypo name="chevron-right" size={24} color={Colors.lightGreyColor || '#AAAAAA'} />
  </Pressable>
);

const HelpCenterScreen = () => {
  const router = useRouter();

  const handleTopicPress = (topic) => {
    console.log(`Navigating to topic: ${topic}`);
    // In a real app, this would navigate to the FAQ/Article screen
  };

  const handleMessagesPress = () => {
    console.log('Navigating to Messages/Chat History');
    // In a real app, this would navigate to the support message history screen
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Header matching the screenshot */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          {/* Using Entypo for the chevron-left icon */}
          <Entypo name="chevron-left" size={26} color={Colors.whiteColor || '#FFFFFF'} />
        </Pressable>
        <Text style={styles.headerTitle}>Help Center</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* --- Topics Section --- */}
        <Text style={styles.sectionHeader}>Topics</Text>
        <View style={styles.topicsList}>
          {TOPICS_DATA.map((topic) => (
            <TopicItem 
              key={topic.id} 
              title={topic.title} 
              onPress={() => handleTopicPress(topic.title)}
            />
          ))}
        </View>

        {/* --- Messages Section --- */}
        <Text style={styles.sectionHeader}>Messages</Text>
        <Pressable style={styles.messageItemContainer} onPress={handleMessagesPress}>
          <View style={styles.messageIconContainer}>
            {/* Using MaterialCommunityIcons for the chat icon */}
            <MaterialCommunityIcons name="message-text-outline" size={20} color={Colors.whiteColor || '#FFFFFF'} />
          </View>
          <Text style={styles.messageText}>Messages</Text>
          {/* Note: The message item does NOT have a chevron-right in the image, but I'll add a subtle one for UI convention if needed */}
        </Pressable>

        {/* Padding for ScrollView */}
        <View style={{ height: 50 }} />
      </ScrollView>
      
    </SafeAreaView>
  );
};

// --- STYLESHEET ---
const styles = StyleSheet.create({
  // --- Global Styles ---
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor || '#000000', // Deep black background
  },
  
  // --- Header Styles ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    paddingRight: 10,
    paddingVertical: 5, 
  },
  headerTitle: {
    fontSize: 22,
    color: Colors.whiteColor || '#FFFFFF',
    fontWeight: '700', // Bold/Extra-bold to match the image title
    marginLeft: 10,
  },
  
  // --- Content and Sections ---
  content: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 14,
    color: Colors.lightGreyColor || '#AAAAAA',
    fontWeight: '500',
    paddingHorizontal: 20,
    marginTop: 25, // Vertical spacing above the section title
    marginBottom: 10,
  },
  topicsList: {
    // No explicit background for this list section
  },
  topicItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth, // Subtle separator line
    borderBottomColor: Colors.separatorColor || '#333333',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.whiteColor || '#FFFFFF',
    marginRight: 15,
  },
  topicTitleText: {
    flex: 1,
    fontSize: 18,
    color: Colors.whiteColor || '#FFFFFF',
    fontWeight: '500',
  },

  // --- Messages Item (Highlighted) ---
  messageItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.darkHighlight || '#1C1C1C', // Dark background for the highlight
    // No bottom border for the last item in this group
  },
  messageIconContainer: {
    marginRight: 15,
    // The image icon doesn't have a background circle, just the icon
  },
  messageText: {
    fontSize: 18,
    color: Colors.whiteColor || '#FFFFFF',
    fontWeight: '500',
    flex: 1, // Ensures text takes up space
  },
});

export default HelpCenterScreen;