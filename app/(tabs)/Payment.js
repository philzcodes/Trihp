import { AntDesign, Feather, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// NOTE: You'll need to define Colors and Fonts in your constants file.
// Assuming Colors.blackColor is a dark/black color and Colors.whiteColor is white.
// I'll define some color and font constants for this example to work.

const Colors = {
    blackColor: '#000000',
    whiteColor: '#FFFFFF',
    darkGray: '#171717',
    lightGray: '#A9A9A9',
    yellow: '#FFC700', // Used a standard yellow for the wallet icon, adjust as needed.
    trihpCard: '#1E1E1E', // Dark background for the wallet card
    afrimoneyPurple: '#C04286', // The purple color in the image
    defaultBadge: '#D3D3D3', // Light gray for the Default badge background
};

// Mock Fonts object based on usage in the old code, replace with your actual import
const Fonts = {
    Regular: { fontFamily: 'System' }, // Placeholder for your regular font style
    Medium: { fontFamily: 'System' }, // Placeholder for your medium font style
};



const Payment = () => {
    const router = useRouter();

    // The data is modified slightly to match the image's content more closely
    const dummyCardInfo = [
        {
            id: '1',
            type: 'Afrimoney',
            lastFour: '9873',
            isDefault: false,
            // Assuming this is the local path for the Afrimoney logo
            image: require('../../assets/images/paymentMode/afrimoney.png'), 
        },
        {
            id: '2',
            type: 'Afrimoney',
            lastFour: '3452',
            isDefault: true, // Set to true to show the 'Default' badge
            image: require('../../assets/images/paymentMode/afrimoney.png'),
        },
    ];

    // Mock user data
    const userInfo = {
        data: {
            wallet_amount: 525, // Updated to match the image
        }
    };
    const walletAmount = userInfo?.data?.wallet_amount;

    const [cardInfo] = useState(dummyCardInfo); // No need to setCardInfo if it's static

    // State for the notification
    const owing = true;
    const owedAmount = 100; // Mock owed amount

    // Animation for the "Please pay" notification (retained from old code)
    const pulseAnim = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        if (owing) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ]),
            ).start();
        }
    }, [pulseAnim, owing]);

    const formatCurrency = (amount, decimals = 0) => {
        // Formats to match the image: $525 (no decimal places shown)
        return `$${parseFloat(amount || 0).toFixed(decimals)}`;
    };

    const handleCardPress = (item) => {
        // Navigation logic
        router.push('/Payments/ManageMobileMoney');
    };
    
    // --- Helper Components for Cleanliness ---

    const Header = () => (
        <View style={styles.header}>
            <Pressable onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={24} color={Colors.whiteColor} />
            </Pressable>
            <Text style={styles.headerTitle}>Payment</Text>
        </View>
    );

    const PaymentNotification = () => owing && (
        <Animated.View
            style={[
                styles.paymentNotification,
                { transform: [{ scale: pulseAnim }] },
            ]}
        >
            <View style={styles.notificationContent}>
                <MaterialCommunityIcons name="alert-circle" size={24} color={Colors.whiteColor} />
                <Text style={styles.notificationText}>
                    Please pay {formatCurrency(owedAmount, 2)}
                </Text>
            </View>
            <Pressable 
                style={styles.notificationButton} 
                onPress={() => router.push('/Payments/PayOutstanding')}
            >
                <Text style={styles.notificationButtonText}>Details</Text>
            </Pressable>
        </Animated.View>
    );

    const TrihpWallet = () => (
        <Pressable style={styles.walletContainer} onPress={() => {/* Handle wallet tap to view details */}}>
            <View style={styles.walletDetails}>
                <View style={styles.walletHeader}>
                    <Fontisto name="wallet" size={25} color={Colors.yellow} />
                    <Text style={styles.walletTitle}>Trihp Wallet</Text>
                </View>
                <Text style={styles.walletAmount}>{formatCurrency(walletAmount, 0)}</Text>
                <Pressable
                    style={styles.addButton}
                    onPress={() => router.push({
                        pathname: '/Payments/TrihpWallet/AddMoney',
                        params: { amount: formatCurrency(walletAmount, 2 || 0) }
                    })}
                >
                    <Feather name="plus" size={20} color={Colors.whiteColor} /> 
                    <Text style={styles.addButtonText}>Add Money</Text>
                </Pressable>
            </View>
            {/* The small chevron on the right side of the card */}
           <Pressable onPress={() => router.push('/Payments/TrihpWallet/MyWallet')} style={styles.walletChevron}>
                <AntDesign name="right" size={20} color={Colors.whiteColor} />
           </Pressable>
        </Pressable>
    );

    const PaymentMethodItem = ({ item }) => (
        <Pressable key={item.id} style={styles.paymentMethodItem} onPress={() => handleCardPress(item)}>
            {/* Using a placeholder View for the Afrimoney icon/image to mimic the image's aspect ratio and color */}
            <View style={styles.afrimoneyIconPlaceholder}> 
                {/* Replace this with your actual Image component if you have the local asset */}
                {/* <Image source={item.image} style={styles.afrimoneyImage} /> */}
                <Text style={styles.afrimoneyText}>A</Text> 
            </View> 
            <View style={styles.methodInfo}>
                <Text style={styles.methodText}>{item.type}</Text>
                <Text style={styles.methodNumber}>***{item.lastFour}</Text>
            </View>
            {item.isDefault && (
                <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                </View>
            )}
        </Pressable>
    );

    const AddPaymentMethod = () => (
        <Pressable style={styles.addPaymentMethod} onPress={() => router.push('/Payments/AddPayMethods')}>
            <Feather name="plus" size={24} color={Colors.whiteColor} />
            <Text style={styles.addPaymentText}>Add Payment Method</Text>
        </Pressable>
    );


    // --- Main Render ---

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
            <Header />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
                <PaymentNotification />

                <TrihpWallet />

                <Text style={styles.sectionTitle}>Payment Methods</Text>
                
                <View style={styles.paymentMethodsList}>
                    {cardInfo.map((item) => (
                        <PaymentMethodItem key={item.id} item={item} />
                    ))}
                </View>

                <AddPaymentMethod />
                
                {/* Removed the extra Voucher and Transaction History sections for a closer match to the provided image content */}
            </ScrollView>

        </SafeAreaView>
    );
};


// --- Stylesheet ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.blackColor,
    },
    // Custom Header Style for minimal look
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        gap: 20,
    },
    headerTitle: {
        ...Fonts.Regular,
        fontSize: 24,
        color: Colors.whiteColor,
        fontWeight: '600', // Slightly less bold than 'bold' for a sleeker look
    },
    scrollView: {
        paddingTop: 0,
        paddingBottom: 20, // Space above the bottom tab bar
    },

    // Payment Notification (Retained and slightly adjusted for clarity)
    paymentNotification: {
        height: 50,
        borderRadius: 50,
        backgroundColor: '#FF00004A', // Red background with transparency
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginHorizontal: 20,
        marginBottom: 15,
    },
    notificationContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    notificationText: {
        ...Fonts.Regular,
        color: Colors.whiteColor,
        fontSize: 16,
    },
    notificationButton: {
        backgroundColor: '#FE00005C', // Darker red/transparent for the button
        borderRadius: 36,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    notificationButtonText: {
        ...Fonts.Medium,
        color: Colors.whiteColor,
        fontSize: 12,
    },

    // Trihp Wallet Card
    walletContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: 20,
        backgroundColor: Colors.trihpCard, // Darker gray/black for the card
        borderRadius: 15,
        marginHorizontal: 15,
        marginBottom: 20,
        height: 180, // Fixed height for a robust look
    },
    walletDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    walletHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    walletTitle: {
        ...Fonts.Medium,
        fontSize: 18, // Slightly larger
        color: Colors.whiteColor,
    },
    walletAmount: {
        ...Fonts.Regular,
        fontSize: 42, // Larger amount text
        color: Colors.whiteColor,
        fontWeight: 'bold',
        paddingBottom: 5,
    },
    addButton: {
        borderRadius: 50,
        alignSelf: 'flex-start',
        backgroundColor: Colors.whiteColor, // White button for contrast
        paddingHorizontal: 15,
        height: 35,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: 10,
    },
    addButtonText: {
        ...Fonts.Regular,
        color: Colors.blackColor,
        fontSize: 14,
        // The padding top adjustment helps vertically align text which can vary by font
        paddingTop: 2, 
    },
    walletChevron: {
        alignSelf: 'center',
        opacity: 0.5,
    },

    // Payment Methods Section
    sectionTitle: {
        ...Fonts.Regular,
        fontSize: 16,
        color: Colors.lightGray, // Gray text for section title
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    paymentMethodsList: {
        backgroundColor: Colors.blackColor, // Keep list background consistent
    },
    paymentMethodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: StyleSheet.hairlineWidth, // Use hairline for subtle separator
        borderBottomColor: Colors.darkGray,
    },
    afrimoneyIconPlaceholder: {
        height: 30,
        width: 45,
        borderRadius: 5,
        backgroundColor: Colors.afrimoneyPurple,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    afrimoneyText: {
        ...Fonts.Medium,
        fontSize: 18,
        color: Colors.whiteColor,
        fontWeight: 'bold',
    },
    methodInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    methodText: {
        ...Fonts.Regular,
        fontSize: 16,
        color: Colors.whiteColor,
        marginRight: 8,
    },
    methodNumber: {
        ...Fonts.Regular,
        fontSize: 16,
        color: Colors.lightGray,
    },
    defaultBadge: {
        backgroundColor: Colors.defaultBadge,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 3,
        marginLeft: 10,
    },
    defaultBadgeText: {
        ...Fonts.Medium,
        fontSize: 12,
        color: Colors.blackColor,
        fontWeight: 'bold',
    },
    
    // Add Payment Method Button
    addPaymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginTop: 10,
    },
    addPaymentText: {
        ...Fonts.Regular,
        color: Colors.whiteColor,
        fontSize: 16,
        marginLeft: 20,
        fontWeight: '500',
    },

});

export default Payment;