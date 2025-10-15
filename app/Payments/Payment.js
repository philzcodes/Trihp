import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Octicons';
import BackHeader from '../../components/BackHeader';
import ManageCreditCard from '../../components/Modals/ManagePayment/ManageCreditCard';
import ManageMobileMoney from '../../components/Modals/ManagePayment/ManageMobileMoney';
import { Colors, Fonts } from '../../constants/Styles';
import { formatCurrency } from '../../helper/distancesCalculate';
import useUserStore from '../../store/userStore';

const Payment = () => {
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
  const navigation = useNavigation();
  const { userData, fetchUser } = useUserStore();
  const walletAmount = userData?.data?.wallet_amount;
  const [cardInfo, setCardInfo] = useState(dummyCardInfo);
  const [isEditCardVisible, setEditCardModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    fetchUser();
    const interval = setInterval(() => {
      fetchUser();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchUser]);

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

  // Card info function
  // const fetchCardInfo = async () => {
  //   try {
  //     const data = await AsyncStorage.getItem('userDetail');
  //     const token = JSON.parse(data)?.token;

  //     const url = `${Constant.baseUrl}fetch-card-info`;
  //     const response = await axios.get(url, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (response?.data?.status === 200) {
  //      setCardInfo(response?.data?.data);
  //     }
  //   } catch (error) {
  //     console.log('Error during API request:', error);
  //     if (error.response) {
  //       console.log('Server responded with non-2xx status:', error.response.data);
  //       showWarning(error?.response?.data?.message);
  //     }  else {
  //       console.log('Error during request setup:', error.message);
  //     }
  //     console.log('Full error object:', error);
  //   }
  // };
  // useEffect(() => {
  //   fetchCardInfo();
  // }, []);

  const owing = true;
  const owedAmount = 100;

  const handleCardPress = (item) => {
    setSelectedCard(item);
    setEditCardModalVisible(true);
  };
  return (
    <View style={[styles.container]}>
      <BackHeader title="Payment" onPress={() => navigation.goBack()} />
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
              <Icon3 name="alert-circle" size={24} color={Colors.whiteColor} />
              <Text style={{ ...Fonts.Regular, color: Colors.whiteColor, fontSize: 16 }}>Please pay {formatCurrency(owedAmount)}</Text>
            </View>
            <Pressable style={{ backgroundColor: '#FE00005C', borderRadius: 36 }} onPress={() => navigation.navigate('')}>
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
            <Icon name="wallet" size={25} color={Colors.yellow} />
            <Text style={styles.walletTitle}>Trihp Wallet</Text>
          </View>
          <Text style={styles.walletAmount}>{formatCurrency(walletAmount, 2)}</Text>
          <Pressable
            style={styles.addButton}
            onPress={() =>
              navigation.navigate('AddMoney', {
                amount: formatCurrency(walletAmount, 2 || 0),
              })
            }
          >
            <Icon name="plus-a" size={12} color={Colors.blackColor} />
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
        <Pressable style={styles.addPaymentMethod} onPress={() => navigation.navigate('AddPayMethods')}>
          <Icon
            name="plus-a"
            style={{
              ...Fonts.GrandMedium,
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
              borderBottomColor: Colors.grey12,
              marginTop: 20,
            }}
          >
            <Text style={{ color: Colors.whiteColor, ...Fonts.GrandHeavy, fontSize: 16 }}>Voucher</Text>
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
              <Text style={styles.voucherText}>{`${'$5 Signup bonus' || vuchername}`} </Text>
              <Text style={{ ...Fonts.Regular, fontSize: 12, color: Colors.grey14 }}>26 Sept to 20 Sept</Text>
            </View>
          </View>

          {/* Voucher List End */}
          <Pressable style={[styles.addPaymentMethod, { marginBottom: 10 }]}>
            <Icon
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
          <Pressable style={styles.transactionHistory} onPress={() => navigation.navigate('TransactionHistory')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Icon3 name="text-box-outline" size={23} color={Colors.yellow} />
              <Text style={styles.transactionText}>Transaction History</Text>
            </View>
            <Icon2 name="chevron-right" size={22} color={Colors.whiteColor} />
          </Pressable>
        </View>
      </ScrollView>
      {selectedCard && selectedCard.type == 'mastercard' && (
        <ManageCreditCard isVisible={isEditCardVisible} onClose={() => setEditCardModalVisible(false)} cardDetails={selectedCard} />
      )}
      {selectedCard && selectedCard.type === 'afrimoney' && (
        <ManageMobileMoney isVisible={isEditCardVisible} onClose={() => setEditCardModalVisible(false)} cardDetails={selectedCard} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
        paddingTop: 20,
    paddingBottom: 50,
  },
  scrollView: {
    paddingVertical: 15,
  },
  walletContainer: {
    padding: 20,
    backgroundColor: Colors.grey12,
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
  },
  walletAmount: {
    ...Fonts.GrandMedium,
    fontSize: 38,
    paddingBottom: 8,
  },
  addButton: {
    borderRadius: 50,
    alignSelf: 'flex-start',
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 15,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  addButtonText: {
    ...Fonts.Regular,
    color: Colors.blackColor,
    fontSize: 14,
    paddingTop: 4,
  },
  sectionTitle: {
    ...Fonts.GrandHeavy,
    fontSize: 16,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey12,
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
    borderColor: Colors.grey12,
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
  },
});

export default Payment;
