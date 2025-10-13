import { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ImageBackground, Animated, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Fontisto } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../../constants';

const Payment = () => {
  const router = useRouter();

  const dummyCardInfo = [
    {
      id: '1',
      type: 'mastercard',
      cardNumber: '4444',
      image: require('../../assets/images/paymentMode/mastercard.png'),
      expiryDate: '12/23',
      holder: 'Stephen',
    },
    {
      id: '2',
      type: 'afrimoney',
      cardNumber: '2344',
      image: require('../../assets/images/paymentMode/afrimoney.png'),
      expiryDate: '11/24',
      walletHolder: 'Moshood',
    },
  ];

  // Mock user data - replace with actual user data from your state management
  const userInfo = {
    data: {
      wallet_amount: 250.50
    }
  };
  const walletAmount = userInfo?.data?.wallet_amount;

  const [cardInfo, setCardInfo] = useState(dummyCardInfo);
  const [isEditCardVisible, setEditCardModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
  }, [pulseAnim]);

  const formatCurrency = (amount, decimals = 2) => {
    return `$${parseFloat(amount || 0).toFixed(decimals)}`;
  };

  const owing = true;
  const owedAmount = 100;

  const handleCardPress = (item) => {
    setSelectedCard(item);
    setEditCardModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        {owing && (
          <Animated.View
            style={{
              height: 50,
              borderRadius: 50,
              backgroundColor: '#FF00004A',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              marginHorizontal: 20,
              marginBottom: 15,
              transform: [{ scale: pulseAnim }],
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <MaterialCommunityIcons name="alert-circle" size={24} color={Colors.whiteColor} />
              <Text style={{ ...Fonts.Regular, color: Colors.whiteColor, fontSize: 16 }}>Please pay {formatCurrency(owedAmount)}</Text>
            </View>
            <Pressable style={{ backgroundColor: '#FE00005C', borderRadius: 36 }} onPress={() => router.push('/transaction-history')}>
              <Text
                style={{
                  ...Fonts.Medium,
                  color: Colors.whiteColor,
                  fontSize: 12,
                  paddingTop: 4,
                  paddingVertical: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                }}
              >
                Details
              </Text>
            </Pressable>
          </Animated.View>
        )}
        
        <ImageBackground
          source={require('../../assets/images/paymentBanner.png')}
          style={styles.walletContainer}
          imageStyle={{ borderRadius: 10 }}
        >
          <View style={styles.walletHeader}>
            <Fontisto name="wallet" size={25} color={Colors.yellow} />
            <Text style={styles.walletTitle}>Trihp Wallet</Text>
          </View>
          <Text style={styles.walletAmount}>{formatCurrency(walletAmount, 2)}</Text>
          <Pressable
            style={styles.addButton}
            onPress={() =>
              router.push('/add-money', {
                amount: formatCurrency(walletAmount, 2 || 0),
              })
            }
          >
            <Fontisto name="plus-a" size={12} color={Colors.blackColor} />
            <Text style={styles.addButtonText}>Add Money</Text>
          </Pressable>
        </ImageBackground>

        <Text style={styles.sectionTitle}>Payment Methods</Text>
        {/* Payment List */}
        <View>
          {cardInfo.map((item) => (
            <Pressable key={item.id} style={styles.voucher} onPress={() => handleCardPress(item)}>
              <Image source={item.image} style={{ height: 25, width: 25 }} />
              <Text style={styles.voucherText}>{`${item.type} ${item.type == 'mastercard' ? `******${item.cardNumber}` : ''}`}</Text>
            </Pressable>
          ))}
        </View>
        {/* Payment List End */}
        <Pressable style={styles.addPaymentMethod} onPress={() => router.push('/add-payment-methods')}>
          <Fontisto
            name="plus-a"
            style={{
              ...Fonts.Regular,
              fontSize: 15,
              color: Colors.whiteColor,
            }}
          />
          <Text style={styles.addPaymentText}>Add Payment Method</Text>
        </Pressable>
        
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingBottom: 5,
              borderBottomWidth: 1,
              borderBottomColor: Colors.whiteColor,
              marginTop: 20,
            }}
          >
            <Text style={{ color: Colors.whiteColor, ...Fonts.Regular, fontSize: 16, fontWeight: 'bold' }}>Voucher</Text>
            <Text
              style={{
                ...Fonts.Medium,
                fontSize: 12,
                color: Colors.blackColor,
                backgroundColor: Colors.whiteColor,
                paddingHorizontal: 10,
                borderRadius: 40,
              }}
            >
              Details
            </Text>
          </View>
          {/* Voucher List */}
          <View style={styles.voucher}>
            <Image source={require('../../assets/images/paymentMode/voucher.png')} />
            <View>
              <Text style={styles.voucherText}>{`${'$5 Signup bonus' || 'vouchername'}`} </Text>
              <Text style={{ ...Fonts.Regular, fontSize: 12, color: Colors.whiteColor, opacity: 0.7 }}>26 Sept to 20 Sept</Text>
            </View>
          </View>

          {/* Voucher List End */}
          <Pressable style={[styles.addPaymentMethod, { marginBottom: 10 }]}>
            <Fontisto
              name="plus-a"
              style={{
                ...Fonts.Regular,
                fontSize: 15,
                color: Colors.whiteColor,
              }}
            />
            <Text style={styles.addPaymentText}>Add Voucher code</Text>
          </Pressable>
        </View>

        <View>
          <Pressable style={styles.transactionHistory} onPress={() => router.push('/transaction-history')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <MaterialCommunityIcons name="text-box-outline" size={23} color={Colors.yellow} />
              <Text style={styles.transactionText}>Transaction History</Text>
            </View>
            <Octicons name="chevron-right" size={22} color={Colors.whiteColor} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteColor,
  },
  headerTitle: {
    ...Fonts.Regular,
    fontSize: 24,
    color: Colors.whiteColor,
    fontWeight: 'bold',
  },
  scrollView: {
    paddingVertical: 15,
  },
  walletContainer: {
    padding: 20,
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    overflow: 'hidden',
    rowGap: 10,
    marginHorizontal: 20,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  walletTitle: {
    ...Fonts.Medium,
    fontSize: 16,
    color: Colors.blackColor,
  },
  walletAmount: {
    ...Fonts.Regular,
    fontSize: 38,
    paddingBottom: 8,
    color: Colors.blackColor,
    fontWeight: 'bold',
  },
  addButton: {
    borderRadius: 50,
    alignSelf: 'flex-start',
    backgroundColor: Colors.blackColor,
    paddingHorizontal: 15,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  addButtonText: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    fontSize: 14,
    paddingTop: 4,
  },
  sectionTitle: {
    ...Fonts.Regular,
    fontSize: 16,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteColor,
    color: Colors.whiteColor,
    fontWeight: 'bold',
  },
  addPaymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#171717',
    overflow: 'hidden',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  addPaymentText: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    fontSize: 16,
    marginLeft: 10,
    paddingTop: 3,
  },
  voucher: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: Colors.whiteColor,
    paddingHorizontal: 20,
  },
  voucherText: {
    ...Fonts.Medium,
    fontSize: 14,
    color: Colors.whiteColor,
    textTransform: 'capitalize',
  },
  transactionHistory: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#171717',
    marginTop: 5,
  },
  transactionText: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
  },
});

export default Payment;
