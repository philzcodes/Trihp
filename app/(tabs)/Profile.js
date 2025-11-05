import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react'; // Import useState and useEffect
import { Image, Modal, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Import Modal, RefreshControl, Alert
import { SafeAreaView } from 'react-native-safe-area-context';
import { authAPI, riderAPI } from '../../api/services';
import useUserStore from '../../store/userStore';

const AccountScreen = () => {
    const router = useRouter();
    const { logout, token, getUserName } = useUserStore();
    
    // State to control the visibility of the sign-out modal
    const [isSignOutModalVisible, setSignOutModalVisible] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    // State for rider profile data
    const [riderProfile, setRiderProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // --- Data Fetching Functions ---
    
    const fetchRiderProfile = async () => {
        try {
            setError(null);
            const profile = await riderAPI.getRiderProfile();
            // Backend returns user data with rider relation
            setRiderProfile({
                firstName: profile.data?.firstName || profile.firstName || 'User',
                lastName: profile.data?.lastName || profile.lastName || '',
                homeAddress: profile.data?.rider?.homeAddress || profile.rider?.homeAddress || null,
                workAddress: profile.data?.rider?.workAddress || profile.rider?.workAddress || null,
                walletBalance: profile.data?.rider?.walletBalance || profile.rider?.walletBalance || 0,
            });
        } catch (err) {
            console.error('Error fetching rider profile:', err);
            // Use fallback data from userStore if API fails
            setRiderProfile({
                firstName: getUserName()?.split(' ')[0] || 'User',
                lastName: getUserName()?.split(' ')[1] || '',
                homeAddress: null,
                workAddress: null,
                walletBalance: 0,
            });
            // Don't show error alert for now since backend is not fully implemented
            console.warn('Using fallback profile data');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchRiderProfile();
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchRiderProfile();
    }, []);

    // --- Navigation Handlers (Kept the same for functionality) ---

    const navigateToProfile = () => { router.push('/accounts/AccountInfo'); };
    const navigateToHome = () => { router.push('/accounts/AddHome'); };
    const navigateToWork = () => { router.push('/accounts/AddWork'); };
    const navigateToLegal = () => { router.push('/accounts/Legal'); };
    const navigateToHelpCenter = () => { router.push('/accounts/Help'); };
    const navigateToRideHistory = () => { router.push('/accounts/RideHistory'); };
    const navigateToReferAFriend = () => { router.push('/accounts/Refer'); };
    const navigateToDriveAndEarn = () => { console.log('Navigate to Drive & earn with Trihp'); };
    const navigateToChangePassword = () => { router.push('/accounts/ChangePassword'); };

    // --- Sign Out Logic ---

    // 1. Open the modal
    const promptSignOut = () => {
        setSignOutModalVisible(true);
    };

    // 2. Execute sign out
    const confirmSignOut = async () => {
        setSignOutModalVisible(false); // Close modal immediately
        try {
            setIsLoggingOut(true);
            
            // Call logout API if token exists
            if (token) {
                try {
                    await authAPI.logout();
                    console.log('Logout API call successful');
                } catch (apiError) {
                    console.error('Logout API error:', apiError);
                    // Continue with local logout even if API fails
                }
            }
            
            // Clear local storage and state
            await logout();
            
            // Navigate to login screen
            router.replace('/(auth)/Login');
            
        } catch (error) {
            console.error('Error during logout:', error);
            // Fallback navigation even on error
            router.replace('/(auth)/Login');
        } finally {
            setIsLoggingOut(false);
        }
    };

    // 3. Cancel sign out
    const cancelSignOut = () => {
        setSignOutModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Main Screen Content */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {riderProfile ? `${riderProfile.firstName} ${riderProfile.lastName}` : (getUserName() || 'Profile')}
                </Text>
                <Image
                    source={{ uri: 'https://i.ibb.co/L5w2R3D/person.jpg' }}
                    style={styles.profileImage}
                />
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
                {/* Wallet Balance Section */}
                {riderProfile && (
                    <View style={styles.walletSection}>
                        <View style={styles.walletCard}>
                            <MaterialIcons name="account-balance-wallet" size={24} color="#FFD700" />
                            <View style={styles.walletInfo}>
                                <Text style={styles.walletLabel}>Trihp Wallet</Text>
                                <Text style={styles.walletBalance}>
                                    ${riderProfile.walletBalance ? riderProfile.walletBalance.toFixed(2) : '0.00'}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    {/* ... Your menu items ... */}
                    <TouchableOpacity style={styles.menuItem} onPress={navigateToProfile}>
                        <MaterialIcons name="person-outline" size={24} color="#FFFFFF" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Profile</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="#7E7E7E" style={styles.arrowIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={navigateToHome}>
                        <Ionicons name="home-outline" size={24} color="#FFFFFF" style={styles.menuIcon} />
                        <View style={styles.menuItemTextWrapper}>
                            <Text style={styles.menuText}>Add Home</Text>
                            <Text style={styles.menuSubText}>
                                {riderProfile?.homeAddress || 'Tap to add home address'}
                            </Text>
                        </View>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="#7E7E7E" style={styles.arrowIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={navigateToWork}>
                        <Ionicons name="business-outline" size={24} color="#FFFFFF" style={styles.menuIcon} />
                        <View style={styles.menuItemTextWrapper}>
                            <Text style={styles.menuText}>Add Work</Text>
                            <Text style={styles.menuSubText}>
                                {riderProfile?.workAddress || 'Tap to add work address'}
                            </Text>
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

                    {
                    __DEV__ && (  
                    <TouchableOpacity style={styles.menuItem} onPress={navigateToReferAFriend}>
                        <MaterialIcons name="share" size={22} color="#FFFFFF" style={styles.menuIcon} />
                        <Text style={styles.menuText}>Refer a friend</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="#7E7E7E" style={styles.arrowIcon} />
                    </TouchableOpacity>
                  )
                  }
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

                {/* Modified Sign Out Button to open modal */}
                <TouchableOpacity style={styles.signOutButton} onPress={promptSignOut}>
                    <Text style={styles.signOutText}>Sign out</Text>
                </TouchableOpacity>
                </ScrollView>
            )}
            
            {/* --- Sign Out Confirmation Modal --- */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isSignOutModalVisible}
                onRequestClose={cancelSignOut} // Handle Android back button
            >
                <View style={modalStyles.overlay}>
                    <View style={modalStyles.modalView}>
                        
                        {/* Question Text */}
                        <Text style={modalStyles.modalText}>Are you sure you want to sign out?</Text>

                        {/* Confirm Button (Yellow) */}
                        <TouchableOpacity 
                            style={[modalStyles.button, modalStyles.confirmButton, isLoggingOut && modalStyles.buttonDisabled]} 
                            onPress={confirmSignOut}
                            disabled={isLoggingOut}
                        >
                            <Text style={modalStyles.confirmButtonText}>
                                {isLoggingOut ? 'Signing Out...' : 'Confirm Sign Out'}
                            </Text>
                        </TouchableOpacity>

                        {/* Cancel Button (White/Bordered) */}
                        <TouchableOpacity 
                            style={[modalStyles.button, modalStyles.cancelButton]} 
                            onPress={cancelSignOut}
                        >
                            <Text style={modalStyles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

// --- MODAL STYLES ---
const modalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        // Semi-transparent black background
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        justifyContent: 'flex-end', // Push modal to the bottom
    },
    modalView: {
        backgroundColor: '#000000', // Black card background
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 25,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    button: {
        width: '100%',
        borderRadius: 12, // More rounded than the buttons in the image, matching common modern UI
        padding: 18,
        alignItems: 'center',
        marginVertical: 8,
    },
    confirmButton: {
        backgroundColor: '#FFD700', // Bright yellow
    },
    confirmButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '700',
    },
    cancelButton: {
        // Transparent background, white border/text
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#FFFFFF', 
    },
    cancelButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});


// --- ACCOUNT SCREEN STYLES (Existing styles updated for clarity) ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        // The image shows a darker gray for the background, so use a slightly lighter shade for the border
        borderBottomWidth: 0.5,
        borderBottomColor: '#2C2C2C', 
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
        backgroundColor: '#444',
        marginLeft: 10,
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    walletSection: {
        paddingHorizontal: 16,
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#2C2C2C',
    },
    walletCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2C2C2C',
    },
    walletInfo: {
        marginLeft: 15,
        flex: 1,
    },
    walletLabel: {
        color: '#A0A0A0',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    walletBalance: {
        color: '#FFD700',
        fontSize: 20,
        fontWeight: '700',
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
    section: {
        // No top margin needed since the first item borders the header line
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
        width: 30, // Fixed width for alignment
        textAlign: 'left',
        marginRight: 15,
    },
    menuItemTextWrapper: {
        flex: 1,
    },
    menuText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500', // Medium weight for menu items
        // Fix flex: 1 conflict by placing it on the wrapper or removing it here
    },
    menuSubText: {
        color: '#A0A0A0',
        fontSize: 12,
        marginTop: 2,
    },
    arrowIcon: {
        marginLeft: 'auto',
    },
    driveEarnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // Note: The screenshot doesn't show a background box for this, only colored text/icon
        // Reverting to the look in the image: just yellow text, no background/border
        marginHorizontal: 16,
        paddingVertical: 15, // Increase vertical padding for spacing
        marginTop: 20,
        marginBottom: 10,
    },
    driveEarnIcon: {
        marginRight: 15,
    },
    driveEarnText: {
        color: '#FFD700',
        fontSize: 14, // Looks smaller than the main menu text in the image
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
        // The image shows the text right above the Change Password item, without top/bottom borders.
        // I'll adjust to match the vertical spacing better.
    },
    signOutButton: {
        paddingVertical: 15,
        paddingHorizontal: 16,
        marginTop: 30,
        borderTopWidth: 0.5, // Add a separator line above sign out
        borderTopColor: '#2C2C2C',
    },
    signOutText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default AccountScreen;