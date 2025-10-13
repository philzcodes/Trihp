import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native'; // Uncomment if using React Navigation

const AccountInfoScreen = () => {
    // const navigation = useNavigation(); // Uncomment if using React Navigation

    // Hardcoded data to match the image
    const userData = {
        name: 'User Name',
        phoneNumber: '+123-123-1234',
        email: 'username@gmail.com',
        profileImageUri: 'https://i.ibb.co/L5w2R3D/person.jpg', // Replace with a real user image link
    };

    const handleEdit = (field) => {
        console.log(`Edit button pressed for: ${field}`);
        // In a real app, this would navigate to a dedicated edit screen or open a modal.
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()} // {() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account Info</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {/* Profile Picture Section */}
                <View style={styles.profileSection}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={{ uri: userData.profileImageUri }}
                            style={styles.profileImage}
                        />
                        {/* Camera/Edit Icon Button */}
                        <TouchableOpacity style={styles.editProfileButton}>
                            <MaterialIcons name="camera-alt" size={16} color="#000000" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Account Details Sections */}

                {/* Name Field */}
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Name</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailValue}>{userData.name}</Text>
                        <TouchableOpacity onPress={() => handleEdit('Name')}>
                            <MaterialIcons name="edit" size={20} color="#7E7E7E" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.separator} />

                {/* Phone Number Field */}
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Phone Number</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailValue}>{userData.phoneNumber}</Text>
                        <Ionicons name="checkmark-circle" size={20} color="#3CB371" style={styles.verifiedIcon} />
                        <TouchableOpacity onPress={() => handleEdit('Phone Number')}>
                            <MaterialIcons name="edit" size={20} color="#7E7E7E" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.separator} />

                {/* Email Field */}
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Email</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailValue}>{userData.email}</Text>
                        <Ionicons name="checkmark-circle" size={20} color="#3CB371" style={styles.verifiedIcon} />
                        <TouchableOpacity onPress={() => handleEdit('Email')}>
                            <MaterialIcons name="edit" size={20} color="#7E7E7E" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.separator} />
                
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000000', // Solid black background
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#2C2C2C', // Dark gray line
    },
    backButton: {
        paddingRight: 15,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    
    // --- Profile Section Styles ---
    profileSection: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    profileImageContainer: {
        width: 100,
        height: 100,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1, // Subtle border might exist, or just the contrast
        borderColor: '#444444', 
    },
    editProfileButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FFFFFF', // White circle background
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2, // A small black border to match the image
        borderColor: '#000000', 
        shadowColor: '#000', // Optional: for a subtle lift effect
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },

    // --- Detail Item Styles (Label/Value structure) ---
    detailItem: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    detailLabel: {
        color: '#7E7E7E', // Muted gray for the label
        fontSize: 14,
        marginBottom: 4,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    detailValue: {
        color: '#FFFFFF', // White for the value/username/email
        fontSize: 18,
        fontWeight: '500', // Slightly bolded to stand out
        flex: 1, // Allows text to take space
    },
    verifiedIcon: {
        marginLeft: 10, // Space between phone number/email and checkmark
        marginRight: 10, // Space between checkmark and edit icon
    },
    separator: {
        height: 1,
        backgroundColor: '#1A1A1A', // Very dark gray, slightly lighter than the background for a subtle line
        marginHorizontal: 16,
    }
});

export default AccountInfoScreen;