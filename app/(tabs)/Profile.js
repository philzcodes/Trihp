import { AntDesign, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AccountScreen = () => {
    const router = useRouter();

    const navigateToProfile = () => {
        router.push('/accounts/AccountInfo');
    };

    const navigateToHome = () => {
        router.push('/accounts/AddHome');
    };

    const navigateToWork = () => {
        router.push('/accounts/AddWork');
    };

    const navigateToLegal = () => {
        router.push('/accounts/Legal');
    };

    const navigateToHelpCenter = () => {
        router.push('/accounts/Help');
    };

    const navigateToRideHistory = () => {
        router.push('/accounts/RideHistory');
    };

    const navigateToReferAFriend = () => {
        // Placeholder for refer a friend functionality
        console.log('Navigate to Refer a friend');
    };

    const navigateToDriveAndEarn = () => {
        // Placeholder for drive & earn functionality
        console.log('Navigate to Drive & earn with Trihp');
    };

    const navigateToChangePassword = () => {
        router.push('/accounts/ChangePassword');
    };

    const handleSignOut = async () => {
        try {
            await AsyncStorage.removeItem('userDetail');
            router.replace('/splash');
        } catch (error) {
            console.error('Error during logout:', error);
            // Still navigate even if there's an error
            router.replace('/splash');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>John Doe</Text>
                <Image
                    source={{ uri: 'https://i.ibb.co/L5w2R3D/person.jpg' }} // Replace with actual user image URI
                    style={styles.profileImage}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.section}>
                    <TouchableOpacity style={styles.menuItem} onPress={navigateToProfile}>
                        <MaterialIcons name="person-outline" size={24} color="#FFFFFF" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Profile</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="#7E7E7E" style={styles.arrowIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={navigateToHome}>
                        <Ionicons name="home-outline" size={24} color="#FFFFFF" style={styles.menuIcon} />
                        <View>
                            <Text style={styles.menuText}>Add Home</Text>
                            <Text style={styles.menuSubText}>15 Ozumba Mbadiwe Avn, Victoria Island</Text>
                        </View>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="#7E7E7E" style={styles.arrowIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={navigateToWork}>
                        <Ionicons name="business-outline" size={24} color="#FFFFFF" style={styles.menuIcon} />
                        <View>
                            <Text style={styles.menuText}>Add Work</Text>
                            <Text style={styles.menuSubText}>15 Ozumba Mbadiwe Avn, Victoria Island</Text>
                        </View>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="#7E7E7E" style={styles.arrowIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={navigateToLegal}>
                        <FontAwesome5 name="balance-scale" size={20} color="#FFFFFF" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Legal</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="#7E7E7E" style={styles.arrowIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={navigateToHelpCenter}>
                        <MaterialIcons name="help-outline" size={24} color="#FFFFFF" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Help Center</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="#7E7E7E" style={styles.arrowIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={navigateToRideHistory}>
                        <MaterialIcons name="history" size={24} color="#FFFFFF" style={styles.menuIcon} />
                        <Text style={styles.menuText}>My Ride History</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="#7E7E7E" style={styles.arrowIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={navigateToReferAFriend}>
                        <AntDesign name="sharealt" size={22} color="#FFFFFF" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Refer a friend</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="#7E7E7E" style={styles.arrowIcon} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.driveEarnContainer} onPress={navigateToDriveAndEarn}>
                    <FontAwesome5 name="car" size={18} color="#FFD700" style={styles.driveEarnIcon} />
                    <Text style={styles.driveEarnText}>Drive & earn with Trihp</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="#FFD700" style={styles.driveEarnArrow} />
                </TouchableOpacity>

                <View style={styles.securitySection}>
                    <Text style={styles.securityHeaderText}>Security</Text>
                    <TouchableOpacity style={styles.menuItem} onPress={navigateToChangePassword}>
                        <MaterialIcons name="lock-outline" size={24} color="#FFFFFF" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Change Password</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="#7E7E7E" style={styles.arrowIcon} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Text style={styles.signOutText}>Sign out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000000', // Black background
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#2C2C2C', // Darker gray for subtle line
    },
    backButton: {
        paddingRight: 15,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
        flex: 1,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#444', // Placeholder background for image
    },
    scrollViewContent: {
        paddingBottom: 20, // Give some space at the bottom
    },
    section: {
        marginTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#2C2C2C',
    },
    menuIcon: {
        marginRight: 15,
    },
    menuText: {
        color: '#FFFFFF',
        fontSize: 16,
        flex: 1, // Allows text to take available space
    },
    menuSubText: {
        color: '#A0A0A0', // Lighter gray for subtext
        fontSize: 12,
        marginTop: 2,
    },
    arrowIcon: {
        marginLeft: 'auto', // Pushes arrow to the right
    },
    driveEarnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A', // Slightly lighter dark background
        borderRadius: 8,
        marginHorizontal: 16,
        paddingVertical: 15,
        paddingHorizontal: 16,
        marginTop: 20,
        marginBottom: 10,
    },
    driveEarnIcon: {
        marginRight: 15,
    },
    driveEarnText: {
        color: '#FFD700', // Gold color for highlight
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    driveEarnArrow: {
        marginLeft: 'auto',
    },
    securitySection: {
        marginTop: 20,
    },
    securityHeaderText: {
        color: '#7E7E7E',
        fontSize: 14,
        fontWeight: '500',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: 0.5,
        borderTopColor: '#2C2C2C',
        borderBottomWidth: 0.5,
        borderBottomColor: '#2C2C2C',
    },
    signOutButton: {
        paddingVertical: 15,
        paddingHorizontal: 16,
        marginTop: 30,
    },
    signOutText: {
        color: '#FF3B30', // Red color for sign out
        fontSize: 16,
        fontWeight: '500',
    },
});

export default AccountScreen;