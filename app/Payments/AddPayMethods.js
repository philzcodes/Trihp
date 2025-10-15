import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
// Use standard Expo library for better integration
import { MaterialCommunityIcons } from '@expo/vector-icons';
// Assuming BackHeader, CardModal, MobileMoneyModal, STATUS_BAR_HEIGHT, Colors, and Fonts are defined in your project
import BackHeader from '../../components/BackHeader';
import CardModal from '../../components/Modals/CardModal';
import MobileMoneyModal from '../../components/Modals/MobileMoneyModal';
import { STATUS_BAR_HEIGHT } from '../../constants/Measurements';
import { Colors, Fonts } from '../../constants/Styles';

// Placeholder for the Afrimoney logo source. Replace with your actual local image import.
// For demonstration, I'll use a local asset path string, but you should use 'require()'
const AFRIMONEY_LOGO = require('../../assets/images/paymentMode/afrimoney.png'); 

const AddPayMethods = () => {
  const navigation = useNavigation();
  // Retaining modals just in case the options lead to them, even if the names don't exactly match
  const [isCardModalVisible, setCardModalVisible] = useState(false);
  const [isMobileMoneyModalVisible, setMobileMoneyModalVisible] = useState(false);

  // Define the payment methods as shown in the image
  const paymentMethods = [
    {
      id: 1,
      name: 'Afrimoney',
      subtext: '', // No subtext shown for Afrimoney
      isLogo: true, // Flag to indicate a logo instead of a generic icon
      logo: AFRIMONEY_LOGO, // The logo source
      backgroundColor: '#95246D', // The purple color from the image
      onPress: () => setMobileMoneyModalVisible(true), // Assuming Afrimoney leads to a Mobile Money flow
    },
    {
      id: 2,
      name: 'Cash top up',
      subtext: 'Top tup to your Trihp wallet',
      icon: <MaterialCommunityIcons name="cash-multiple" size={30} color={Colors.whiteColor} />, // Closest recognizable icon
      backgroundColor: '#2CA96D', // The green color from the image
      onPress: () => navigation.navigate('AddMoney'), // Assuming 'AddMoney' is the route for cash top-up
    },
  ];

  const handleMethodPress = (method) => {
    // In a real app, you'd handle navigation or modal opening here based on the method
    method.onPress();
  };

  return (
    <View style={[styles.container, { paddingTop: STATUS_BAR_HEIGHT }]}>
      {/* BackHeader positioning remains correct for the overall screen structure */}
      <BackHeader title="Add Payment Method" onPress={() => navigation.goBack()} />

      {/* Main Content Area */}
      <View style={styles.contentArea}>
        {/* Main Header and Subtext */}
        <Text style={styles.headerText}>Add Payment Method</Text>
        <Text style={styles.subText}>
          You'll only be charged when you order a ride
        </Text>
        
        {/* Separator Line */}
        <View style={styles.separator} />

        {/* Scrollable List of Payment Options */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.methodsList}>
            {paymentMethods.map((method) => (
              <Pressable
                key={method.id}
                style={[styles.methodCard, { backgroundColor: method.backgroundColor }]}
                onPress={() => handleMethodPress(method)}
              >
                <View style={styles.cardContent}>
                  {/* Icon or Logo */}
                  {method.isLogo ? (
                    <Image source={require('../../assets/images/paymentMode/afrimoney.png')} style={styles.logoImage} /> 
                  ) : (
                    <View style={styles.iconContainer}>{method.icon}</View>
                  )}

                  {/* Text Content */}
                  <View style={styles.textContainer}>
                    <Text style={styles.methodName}>{method.name}</Text>
                    {method.subtext ? (
                      <Text style={styles.methodSubtext}>{method.subtext}</Text>
                    ) : null}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Modals for payment flows */}
      <CardModal isVisible={isCardModalVisible} onClose={() => setCardModalVisible(false)} />
      <MobileMoneyModal isVisible={isMobileMoneyModalVisible} onClose={() => setMobileMoneyModalVisible(false)} />
    </View>
  );
};

export default AddPayMethods;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor, // Assuming a dark background as per image
  },
  contentArea: {
    paddingHorizontal: 20, // Reduced padding from overall container to just content area
    flex: 1,
  },
  headerText: {
    ...Fonts.GrandMedium, // Assuming a bold/semi-bold font style
    fontSize: 24,
    color: Colors.whiteColor,
    marginTop: 20,
    // Removed horizontal padding as it's now on contentArea
  },
  subText: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    opacity: 0.7, // Slightly faded for subtext
    fontSize: 14,
    marginTop: 5,
    marginBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.grey11, // A light grey line
    marginHorizontal: -20, // Extend the line to the edges of the screen
    marginBottom: 30,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  methodsList: {
    gap: 15, // Space between the cards
  },
  methodCard: {
    borderRadius: 10,
    paddingVertical: 15, // Vertical padding inside the card
    paddingHorizontal: 20, // Horizontal padding inside the card
    minHeight: 80, // Ensure a minimum height for visual consistency
    justifyContent: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40, // Fixed width for alignment
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    // The green cash icon seems to have a light green background or is simply the icon on the card's background. 
    // I'll assume the icon itself is a styled component, but I'll leave it as a simple container for now.
  },
  logoImage: {
    width: 80, // Approximate width for the Afrimoney logo
    height: 25, // Approximate height for the Afrimoney logo
    resizeMode: 'contain',
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  methodName: {
    ...Fonts.Medium,
    fontSize: 16,
    color: Colors.whiteColor,
  },
  methodSubtext: {
    ...Fonts.Regular,
    fontSize: 13,
    color: Colors.whiteColor,
    opacity: 0.8,
    marginTop: 3,
  },
});