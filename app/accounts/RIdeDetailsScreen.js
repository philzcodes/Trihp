import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'; // Import necessary icon sets
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RideDetailsScreen = () => {
    // Dummy data to simulate the screen content
    const rideData = {
        tripId: '564843',
        date: '26 Sept',
        time: '9:42 pm',
        driverName: 'Jonathan',
        vehicleDetails: 'MM1428',
        vehicleImage: 'https://i.imgur.com/K85i7P8.png', // Placeholder image URL for a white car
        pickupLocation: 'Hamilton bus Stop',
        dropoffLocation: 'Main Peninsular Rd',
        pickupTime: '9:42 pm',
        dropoffTime: '10:42 pm',
        paymentType: 'Cash',
        fare: 'Le25',
        rideRating: 5, // Assuming a 5-star rating from the image
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <MaterialIcons
                    key={i}
                    name={i < rating ? 'star' : 'star-border'}
                    size={20}
                    color="#FFD700" // Gold color for stars
                    style={{ marginRight: 2 }}
                />
            );
        }
        return <View style={styles.starsContainer}>{stars}</View>;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ride Details</Text>
                <Text style={styles.tripIdText}>TRIP ID : #{rideData.tripId}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* Date and Time */}
                <Text style={styles.dateTimeText}>{rideData.date} - {rideData.time}</Text>

                {/* Map Placeholder */}
                <View style={styles.mapPlaceholder}>
                    {/* This would typically be a map component, but for replication, a plain view */}
                    {/* You could integrate react-native-maps here if actual map functionality is needed */}
                    <Image
                        source={require('../../assets/map-placeholder.png')} // Replace with a local image or actual map
                        style={styles.mapImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Ride Status */}
                <View style={styles.rideStatusContainer}>
                    <Text style={styles.trihpSmoothText}>Trihp Smooth</Text>
                    <Text style={styles.completedText}>Completed</Text>
                </View>

                {/* Driver Info */}
                <View style={styles.driverInfoContainer}>
                    <Image source={{ uri: rideData.vehicleImage }} style={styles.vehicleImage} />
                    <View style={styles.driverDetails}>
                        <Text style={styles.driverName}>{rideData.driverName}</Text>
                        <Text style={styles.vehicleDetailsText}>Vehicle details - {rideData.vehicleDetails}</Text>
                    </View>
                    {renderStars(rideData.rideRating)}
                </View>

                {/* Ride Route */}
                <View style={styles.routeContainer}>
                    <View style={styles.routeIconLine}>
                        <View style={[styles.routeIcon, styles.pickupIcon]} />
                        <View style={styles.routeLine} />
                        <View style={[styles.routeIcon, styles.dropoffIcon]} />
                    </View>
                    <View style={styles.routeDetails}>
                        <View style={styles.routeItem}>
                            <Text style={styles.locationText}>{rideData.pickupLocation}</Text>
                            <Text style={styles.timeText}>{rideData.pickupTime}</Text>
                        </View>
                        <View style={styles.routeItem}>
                            <Text style={styles.locationText}>{rideData.dropoffLocation}</Text>
                            <Text style={styles.timeText}>{rideData.dropoffTime}</Text>
                        </View>
                    </View>
                </View>

                {/* Payment Type */}
                <View style={styles.paymentContainer}>
                    <Text style={styles.paymentTypeText}>Payment Type:</Text>
                    <View style={styles.paymentMethod}>
                        <FontAwesome name="money" size={18} color="#4CAF50" />
                        <Text style={styles.paymentMethodText}>{rideData.paymentType}</Text>
                    </View>
                    <Text style={styles.fareText}>{rideData.fare}</Text>
                </View>

                {/* Ride Rating */}
                <View style={styles.rideRatingContainer}>
                    <Text style={styles.rideRatingLabel}>Ride Rating</Text>
                    {renderStars(rideData.rideRating)}
                </View>

                {/* Get Help Button */}
                <TouchableOpacity style={styles.helpButton}>
                    <MaterialIcons name="chat-bubble" size={20} color="#FFD700" />
                    <Text style={styles.helpButtonText}>Get help with ride</Text>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="white" />
                </TouchableOpacity>
            </ScrollView>

            {/* Receipt Button */}
            <View style={styles.receiptContainer}>
                <TouchableOpacity style={styles.receiptButton}>
                    <MaterialIcons name="receipt" size={20} color="#FFD700" />
                    <Text style={styles.receiptButtonText}>Receipt</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000', // Overall background is black
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#000',
        borderBottomWidth: StyleSheet.hairlineWidth, // Thin separator
        borderBottomColor: '#333',
    },
    backButton: {
        paddingRight: 10,
    },
    headerTitle: {
        flex: 1,
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: -24, // Offset for back button to center the title
    },
    tripIdText: {
        color: '#888',
        fontSize: 12,
    },
    container: {
        paddingBottom: 20, // Add padding for the scrollable content
    },
    dateTimeText: {
        color: '#999',
        fontSize: 13,
        textAlign: 'center',
        marginVertical: 15,
    },
    mapPlaceholder: {
        width: '90%',
        height: 150,
        backgroundColor: '#222', // Dark background for the map area
        alignSelf: 'center',
        borderRadius: 8,
        overflow: 'hidden', // Ensures the image respects the border radius
    },
    mapImage: {
        width: '100%',
        height: '100%',
        // The image in the example is mostly abstract lines, a placeholder image works well
    },
    rideStatusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 20,
        paddingBottom: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#333',
    },
    trihpSmoothText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    completedText: {
        color: '#4CAF50', // Green color
        fontSize: 14,
        fontWeight: '600',
    },
    driverInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#333',
    },
    vehicleImage: {
        width: 60,
        height: 40,
        resizeMode: 'contain',
        marginRight: 15,
    },
    driverDetails: {
        flex: 1,
    },
    driverName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    vehicleDetailsText: {
        color: '#999',
        fontSize: 13,
        marginTop: 2,
    },
    starsContainer: {
        flexDirection: 'row',
    },
    routeContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#333',
    },
    routeIconLine: {
        alignItems: 'center',
        marginRight: 15,
    },
    routeIcon: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#FFD700', // Gold border
    },
    pickupIcon: {
        backgroundColor: '#FFD700', // Filled gold circle for pickup
    },
    dropoffIcon: {
        backgroundColor: 'transparent', // Hollow circle for dropoff
    },
    routeLine: {
        width: 2,
        height: 40, // Adjust height based on content
        backgroundColor: '#FFD700', // Gold line
        marginVertical: 4,
    },
    routeDetails: {
        flex: 1,
        justifyContent: 'space-between', // Pushes items to top and bottom
    },
    routeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 30, // Ensure consistent spacing
    },
    locationText: {
        color: 'white',
        fontSize: 14,
    },
    timeText: {
        color: '#999',
        fontSize: 13,
    },
    paymentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#333',
    },
    paymentTypeText: {
        color: 'white',
        fontSize: 14,
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Allows it to take space
        justifyContent: 'flex-start', // Pushes content to the left
        marginLeft: 10, // Adjust spacing from "Payment Type:"
    },
    paymentMethodText: {
        color: 'white',
        fontSize: 14,
        marginLeft: 5,
    },
    fareText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    rideRatingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#333',
    },
    rideRatingLabel: {
        color: 'white',
        fontSize: 14,
    },
    helpButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1C1C1E', // Darker gray for the button background
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginHorizontal: 20,
        marginTop: 20,
    },
    helpButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        flex: 1, // Allows text to take available space
        marginLeft: 10,
    },
    receiptContainer: {
        backgroundColor: '#000', // Footer background
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#333',
        paddingVertical: 10,
        alignItems: 'center',
        paddingBottom: 20, // To account for bottom safe area
    },
    receiptButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    receiptButtonText: {
        color: '#FFD700', // Gold color
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default RideDetailsScreen;