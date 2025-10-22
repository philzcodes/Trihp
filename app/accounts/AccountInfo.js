import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { userAPI } from '../../api/services';
import useUserStore from '../../store/userStore';

const AccountInfoScreen = () => {
    const { getUserName } = useUserStore();
    
    // State for user profile data
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // --- Data Fetching Functions ---
    
    const fetchUserProfile = async () => {
        try {
            setError(null);
            const profile = await userAPI.getProfile();
            // Handle different response structures
            const profileData = profile.data || profile;
            setUserProfile({
                firstName: profileData.firstName || profileData.first_name || '',
                lastName: profileData.lastName || profileData.last_name || '',
                email: profileData.email || '',
                phoneNumber: profileData.phoneNumber || profileData.phone_number || '',
                profileImageUri: profileData.profilePicture || profileData.profile_picture || 'https://i.ibb.co/L5w2R3D/person.jpg',
                isEmailVerified: profileData.isEmailVerified || profileData.is_email_verified || false,
                isPhoneVerified: profileData.isPhoneVerified || profileData.is_phone_verified || false,
            });
        } catch (err) {
            console.error('Error fetching user profile:', err);
            // Use fallback data from userStore if API fails
            const userName = getUserName() || 'User Name';
            setUserProfile({
                firstName: userName.split(' ')[0] || 'User',
                lastName: userName.split(' ')[1] || '',
                email: 'user@example.com',
                phoneNumber: '+123-456-7890',
                profileImageUri: 'https://i.ibb.co/L5w2R3D/person.jpg',
                isEmailVerified: false,
                isPhoneVerified: false,
            });
            console.warn('Using fallback profile data - API endpoint not available yet');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchUserProfile();
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleEdit = async (field) => {
        console.log(`Edit button pressed for: ${field}`);
        Alert.alert(
            'Edit Feature',
            `Edit ${field} functionality will be implemented soon.`,
            [{ text: 'OK' }]
        );
        // TODO: Implement actual edit functionality
        // This could navigate to edit screens or open modals
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

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            ) : (
                <ScrollView 
                    contentContainerStyle={styles.scrollViewContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            tintColor="#FFFFFF"
                            colors={["#FFD700"]}
                        />
                    }
                >
                {/* Profile Picture Section */}
                <View style={styles.profileSection}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={{ uri: userProfile?.profileImageUri || 'https://i.ibb.co/L5w2R3D/person.jpg' }}
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
                        <Text style={styles.detailValue}>
                            {userProfile ? `${userProfile.firstName} ${userProfile.lastName}`.trim() : 'Loading...'}
                        </Text>
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
                        <Text style={styles.detailValue}>{userProfile?.phoneNumber || 'Loading...'}</Text>
                        {userProfile?.isPhoneVerified && (
                            <Ionicons name="checkmark-circle" size={20} color="#3CB371" style={styles.verifiedIcon} />
                        )}
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
                        <Text style={styles.detailValue}>{userProfile?.email || 'Loading...'}</Text>
                        {userProfile?.isEmailVerified && (
                            <Ionicons name="checkmark-circle" size={20} color="#3CB371" style={styles.verifiedIcon} />
                        )}
                        <TouchableOpacity onPress={() => handleEdit('Email')}>
                            <MaterialIcons name="edit" size={20} color="#7E7E7E" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.separator} />
                
                </ScrollView>
            )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    loadingText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
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