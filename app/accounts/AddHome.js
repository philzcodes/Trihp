import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeIcon from '../../assets/svgIcons/HomeIcon.tsx';
import { Colors, Fonts } from '../../constants';

const AddHome = () => {
  const router = useRouter();
  const [homeAddress, setHomeAddress] = useState('');

  const handleSaveHome = () => {
    if (!homeAddress.trim()) {
      Alert.alert('Error', 'Please enter a home address');
      return;
    }

    Alert.alert(
      'Save Home Address',
      `Save "${homeAddress}" as your home address?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Save', 
          onPress: () => {
            // Handle saving home address
            console.log('Home address saved:', homeAddress);
            router.back();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Entypo name="chevron-left" size={24} color={Colors.whiteColor} />
        </Pressable>
        <Text style={styles.headerTitle}>Add Home</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <HomeIcon />
        </View>

        <Text style={styles.title}>Add Your Home Address</Text>
        <Text style={styles.description}>
          Save your home address for quick access when booking rides.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Home Address</Text>
          <TextInput
            style={styles.textInput}
            value={homeAddress}
            onChangeText={setHomeAddress}
            placeholder="Enter your home address"
            placeholderTextColor={Colors.whiteColor}
            multiline
            numberOfLines={3}
          />
        </View>

        <Pressable style={styles.saveButton} onPress={handleSaveHome}>
          <Text style={styles.saveButtonText}>Save Home Address</Text>
        </Pressable>
      </View>
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
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
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
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    marginBottom: 10,
  },
  textInput: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    borderWidth: 1,
    borderColor: Colors.whiteColor,
    borderRadius: 8,
    padding: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: Colors.yellow,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.blackColor,
    fontWeight: 'bold',
  },
});

export default AddHome;
