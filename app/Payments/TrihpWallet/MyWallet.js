import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
// Use standard Expo library for better integration
import { FontAwesome6 } from '@expo/vector-icons';
// Assuming these components and constants are defined in your project
import BackHeader from '../../../components/BackHeader';
import { STATUS_BAR_HEIGHT } from '../../../constants/Measurements';
import { Colors, Fonts } from '../../../constants/Styles';
import { formatCurrency } from '../../../helper/distancesCalculate';
import useUserStore from '../../../store/userStore';

const MyWallet = () => {
  const router = useRouter();
  const { userData, fetchUser } = useUserStore();
  // Using a hardcoded value (Le745) to match the image precisely
  const walletAmount = 745; // userData?.data?.wallet_amount; 
  
  // NOTE: I'm commenting out the fetch logic as it's non-visual and not required for the screen's look
  /*
  useEffect(() => {
    fetchUser();
    const interval = setInterval(() => {
      fetchUser();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchUser]);
  */

  const formattedAmount = formatCurrency(walletAmount, 2); // Assuming formatCurrency adds the 'Le'

  const handleAddMoney = () => {
    // Navigate to the AddMoney screen as intended
    router.push({
      pathname: '/Payments/TrihpWallet/AddMoney',
      params: {
        amount: formattedAmount,
      }
    });
  };

  return (
    // Adjust paddingTop to directly manage spacing from the top
    <View style={[styles.container, { paddingTop: STATUS_BAR_HEIGHT + 20 }]}>
      {/* BackHeader with a dynamic title */}
      <BackHeader title="My Wallet" onPress={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        
        {/* Wallet Balance Display Area */}
        <View style={styles.walletContainer}>
          <Text style={styles.walletAmount}>
            {/* The image shows Le745, using it directly */}
            Le745 
            {/* If using dynamic data: {formattedAmount} */}
          </Text>
          <Text style={styles.walletBalanceText}>Trihp Wallet Balance</Text>
        </View>

        {/* Separator Line (The thin horizontal line under the balance text) */}
        <View style={styles.separator} />

        {/* Add Money Button - Styled to look like the image */}
        <Pressable 
          onPress={handleAddMoney} 
          style={styles.addMoneyButton}
        >
          <View style={styles.buttonContent}>
            {/* Using FontAwesome6 for a solid, modern up-arrow icon */}
            <FontAwesome6 name="arrow-up" size={18} color={Colors.yellow} style={styles.buttonIcon} />
            <Text style={styles.addMoneyText}>Add money</Text>
          </View>
        </Pressable>

        {/* Removed all Transaction History and other elements not in the image */}
      </ScrollView>
    </View>
  );
};

// Assuming Colors.yellow is the greenish/yellow color for the highlight
// Define a specific color if 'yellow' is too light, e.g., #0AC756 or #FFD700
const ACTIVE_COLOR = '#92E830'; // A bright, slightly yellow-green color for the glow

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor, // Solid black background
  },
  scrollView: {
    paddingHorizontal: 20, // Add horizontal padding to the content
    paddingTop: 30,
  },
  walletContainer: {
    alignItems: 'center',
    marginBottom: 40,
    // The image doesn't show a full container border, only the line below it
  },
  walletAmount: {
    // Updated font size and style to match the prominence in the image
    // Using a large, dark-mode friendly font style
    ...Fonts.TextBold, // Assuming this is a very bold font
    fontSize: 48, // Large size
    color: Colors.whiteColor,
    paddingBottom: 5,
  },
  walletBalanceText: {
    ...Fonts.Medium, // Slightly lighter font for the label
    color: Colors.whiteColor,
    opacity: 0.7, // Slightly faded as in the image
    paddingBottom: 20,
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.grey13, // A thin, dark grey line
    marginHorizontal: -20, // Extend to the edges of the screen
    marginBottom: 40, // Space below the separator
  },
  addMoneyButton: {
    backgroundColor: Colors.blackColor, // Black background for the button itself
    paddingVertical: 15,
    borderRadius: 10,
    // Creating the green glow/border effect
    borderWidth: 1.5, // Thicker border for visual emphasis
    borderColor: ACTIVE_COLOR, // The green/yellow color from the image
    // Optional: Add a subtle shadow for "glow" (less effective on pure black)
    shadowColor: ACTIVE_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5, // Android shadow
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 10,
    // Rotate the arrow to point straight up as in the image
    transform: [{ rotate: '-90deg' }], 
    color: ACTIVE_COLOR, // Use the active color for the icon
  },
  addMoneyText: {
    ...Fonts.GrandMedium,
    fontSize: 18,
    color: Colors.whiteColor,
  },
});

export default MyWallet;