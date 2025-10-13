import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Terms from '../../assets/svgIcons/Terms.tsx';
import { Colors, Fonts } from '../../constants';

const Legal = () => {
  const router = useRouter();

  const legalOptions = [
    {
      id: 1,
      title: 'Terms of Service',
      description: 'Read our terms and conditions',
      onPress: () => {
        // Handle terms of service
        console.log('Terms of Service');
      },
    },
    {
      id: 2,
      title: 'Privacy Policy',
      description: 'Learn how we protect your data',
      onPress: () => {
        // Handle privacy policy
        console.log('Privacy Policy');
      },
    },
    {
      id: 3,
      title: 'Cookie Policy',
      description: 'Information about our use of cookies',
      onPress: () => {
        // Handle cookie policy
        console.log('Cookie Policy');
      },
    },
    {
      id: 4,
      title: 'Licenses',
      description: 'Third-party licenses and acknowledgments',
      onPress: () => {
        // Handle licenses
        console.log('Licenses');
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Entypo name="chevron-left" size={24} color={Colors.whiteColor} />
        </Pressable>
        <Text style={styles.headerTitle}>Legal</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <Terms />
        </View>

        <Text style={styles.title}>Legal Information</Text>
        <Text style={styles.description}>
          Important legal documents and policies for using Trihp.
        </Text>

        <View style={styles.optionsContainer}>
          {legalOptions.map((option) => (
            <Pressable
              key={option.id}
              style={styles.optionItem}
              onPress={option.onPress}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <Entypo name="chevron-right" size={20} color={Colors.whiteColor} />
            </Pressable>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            For questions about our legal policies, please contact us at legal@trihp.com
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteColor,
  },
  backButton: {
    marginRight: 20,
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    ...Fonts.Regular,
    fontSize: 24,
    color: Colors.whiteColor,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 40,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171717',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.whiteColor,
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
  footer: {
    padding: 20,
    backgroundColor: '#171717',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.whiteColor,
  },
  footerText: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default Legal;
