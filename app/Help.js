import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BackButton } from '../components';
import { Colors, Fonts } from '../constants';

const Help = () => {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState({});

  const helpSections = [
    {
      title: 'Getting Started',
      items: [
        {
          id: 'how-to-book',
          question: 'How do I book a ride?',
          answer: 'To book a ride, simply open the app, enter your pickup and destination locations, select your preferred ride type, and confirm your booking.',
        },
        {
          id: 'payment-methods',
          question: 'What payment methods do you accept?',
          answer: 'We accept credit cards, debit cards, mobile money, and cash payments. You can also use your Trihp wallet balance.',
        },
        {
          id: 'cancel-ride',
          question: 'Can I cancel my ride?',
          answer: 'Yes, you can cancel your ride before the driver arrives. Cancellation fees may apply depending on the timing.',
        },
      ],
    },
    {
      title: 'Account & Profile',
      items: [
        {
          id: 'change-profile',
          question: 'How do I update my profile?',
          answer: 'Go to Settings > Profile to update your personal information, profile picture, and contact details.',
        },
        {
          id: 'reset-password',
          question: 'How do I reset my password?',
          answer: 'On the login screen, tap "Forgot Password" and enter your email address. We\'ll send you reset instructions.',
        },
      ],
    },
    {
      title: 'Payment & Billing',
      items: [
        {
          id: 'payment-issues',
          question: 'I\'m having trouble with payments',
          answer: 'Check your payment method details and ensure you have sufficient funds. Contact support if issues persist.',
        },
        {
          id: 'refunds',
          question: 'How do I get a refund?',
          answer: 'Refunds are processed automatically for cancelled rides. Contact support for other refund requests.',
        },
      ],
    },
    {
      title: 'Safety & Security',
      items: [
        {
          id: 'safety-features',
          question: 'What safety features do you have?',
          answer: 'We provide real-time tracking, driver verification, emergency contacts, and 24/7 support for your safety.',
        },
        {
          id: 'report-issue',
          question: 'How do I report a safety concern?',
          answer: 'Contact our support team immediately or use the in-app emergency button if you feel unsafe.',
        },
      ],
    },
  ];

  const contactOptions = [
    {
      id: 'email',
      title: 'Email Support',
      subtitle: 'Get help via email',
      icon: 'mail',
      action: () => Alert.alert('Email Support', 'Send us an email at support@trihp.com'),
    },
    {
      id: 'phone',
      title: 'Phone Support',
      subtitle: 'Call us directly',
      icon: 'call',
      action: () => Alert.alert('Phone Support', 'Call us at +234 800 TRIP (8747)'),
    },
    {
      id: 'chat',
      title: 'Live Chat',
      subtitle: 'Chat with our support team',
      icon: 'chatbubble',
      action: () => Alert.alert('Live Chat', 'Live chat feature coming soon!'),
    },
  ];

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const renderFAQItem = (item) => {
    const isExpanded = expandedItems[item.id];
    
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.faqItem}
        onPress={() => toggleExpanded(item.id)}
      >
        <View style={styles.faqHeader}>
          <Text style={styles.faqQuestion}>{item.question}</Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={Colors.whiteColor}
          />
        </View>
        {isExpanded && (
          <Text style={styles.faqAnswer}>{item.answer}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.back()} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Help Center</Text>
        <Text style={styles.subtitle}>Find answers to common questions</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {helpSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <View key={item.id}>
                  {renderFAQItem(item)}
                  {itemIndex < section.items.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Still need help?</Text>
          <Text style={styles.contactSubtitle}>Get in touch with our support team</Text>
          
          <View style={styles.contactOptions}>
            {contactOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.contactOption}
                onPress={option.action}
              >
                <View style={styles.contactIcon}>
                  <Ionicons name={option.icon} size={24} color={Colors.yellow} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactOptionTitle}>{option.title}</Text>
                  <Text style={styles.contactOptionSubtitle}>{option.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.grey14} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Help;

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
    marginBottom: 5,
  },
  subtitle: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.grey14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 25,
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
  faqItem: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    ...Fonts.Medium,
    fontSize: 16,
    color: Colors.whiteColor,
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.grey14,
    lineHeight: 20,
    marginTop: 15,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.grey10,
  },
  contactSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  contactTitle: {
    ...Fonts.TextBold,
    fontSize: 20,
    color: Colors.whiteColor,
    marginBottom: 5,
  },
  contactSubtitle: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.grey14,
    marginBottom: 20,
  },
  contactOptions: {
    backgroundColor: Colors.grey11,
    borderRadius: 15,
    overflow: 'hidden',
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.grey10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactOptionTitle: {
    ...Fonts.Medium,
    fontSize: 16,
    color: Colors.whiteColor,
    marginBottom: 2,
  },
  contactOptionSubtitle: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.grey14,
  },
});
