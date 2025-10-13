import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BackButton, TriphButton, TriphInput } from '../components';
import { Colors, Fonts } from '../constants';

const Profile = () => {
  const router = useRouter();
  const [user] = useState({
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '+234 800 000 0000',
    image: null,
  });

  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [alternateNumber, setAlternateNumber] = useState('');
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [showAlternateNumberInput, setShowAlternateNumberInput] = useState(false);

  const handleUpdate = () => {
    Alert.alert('Success', 'Profile updated successfully!');
    setShowUpdateButton(false);
    setAlternateNumber('');
    setShowAlternateNumberInput(false);
  };

  const handleAddAlternateNumber = () => {
    setShowAlternateNumberInput(!showAlternateNumberInput);
  };

  const handleChangeProfilePicture = () => {
    Alert.alert('Profile Picture', 'Change profile picture feature coming soon!');
  };

  const handleVerifyPhone = () => {
    Alert.alert('Phone Verification', 'Phone verification feature coming soon!');
  };

  const handleVerifyEmail = () => {
    Alert.alert('Email Verification', 'Email verification feature coming soon!');
  };

  const handleInputChange = (field, value) => {
    setShowUpdateButton(true);
    switch (field) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'alternateNumber':
        setAlternateNumber(value);
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.back()} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Account Info</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity style={styles.profileImageWrapper} onPress={handleChangeProfilePicture}>
            {user.image ? (
              <Image source={{ uri: user.image }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImageText}>
                  {firstName.charAt(0)}{lastName.charAt(0)}
                </Text>
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={16} color={Colors.blackColor} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Name</Text>
          <TriphInput
            value={`${firstName} ${lastName}`.trim()}
            onChangeText={(value) => {
              const names = value.split(' ');
              setFirstName(names[0] || '');
              setLastName(names.slice(1).join(' ') || '');
              setShowUpdateButton(true);
            }}
            placeholder="Full Name"
            extraContainerStyle={styles.inputContainer}
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TouchableOpacity style={styles.inputWrapper} onPress={handleVerifyPhone}>
            <TriphInput
              value={phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Phone Number"
              extraContainerStyle={[styles.inputContainer, styles.disabledInput]}
              editable={false}
            />
            <View style={styles.verifyButton}>
              <Text style={styles.verifyButtonText}>Verify</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.alternateNumberContainer} onPress={handleAddAlternateNumber}>
          <Text style={styles.alternateNumberText}>Add alternate mobile number</Text>
          <Ionicons name="add" size={25} color={Colors.whiteColor} />
        </TouchableOpacity>

        {showAlternateNumberInput && (
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Alternate Number</Text>
            <TriphInput
              value={alternateNumber}
              onChangeText={(value) => handleInputChange('alternateNumber', value)}
              placeholder="Alternate mobile number"
              keyboardType="phone-pad"
              extraContainerStyle={styles.inputContainer}
            />
          </View>
        )}

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Email</Text>
          <TouchableOpacity style={styles.inputWrapper} onPress={handleVerifyEmail}>
            <TriphInput
              value={email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Email Address"
              keyboardType="email-address"
              extraContainerStyle={[styles.inputContainer, styles.disabledInput]}
              editable={false}
            />
            <View style={styles.verifyButton}>
              <Text style={styles.verifyButtonText}>Verify</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showUpdateButton && (
        <View style={styles.updateButtonContainer}>
          <TriphButton text="Update" onPress={handleUpdate} />
        </View>
      )}
    </View>
  );
};

export default Profile;

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
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageWrapper: {
    position: 'relative',
    borderWidth: 2,
    borderColor: Colors.whiteColor,
    borderRadius: 100,
    padding: 2,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: Colors.grey11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    ...Fonts.TextBold,
    fontSize: 24,
    color: Colors.whiteColor,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    ...Fonts.Medium,
    fontSize: 16,
    color: Colors.whiteColor,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 0,
  },
  disabledInput: {
    opacity: 0.7,
  },
  inputWrapper: {
    position: 'relative',
  },
  verifyButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: Colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  verifyButtonText: {
    ...Fonts.Medium,
    fontSize: 12,
    color: Colors.blackColor,
  },
  alternateNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.grey11,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  alternateNumberText: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
  },
});
