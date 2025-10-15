import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Constant from '../../../helper/Constant';
// import querystring from 'querystring';
import axios from 'axios';
// import { useStripe } from '@stripe/stripe-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { showSucess } from '../../../helper/Toaster';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import BackHeader from '../../../components/BackHeader';
import PaySuccessModal from '../../../components/Modals/PayMethodSuccessModal';
import TriphButton from '../../../components/TriphButton';
import { Colors, Fonts } from '../../../constants/Styles';
const TopUp = () => {
  const router = useRouter();
  const { balance, topUpAmount } = useLocalSearchParams();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const dummyCardInfo = [
    {
      id: '1',
      type: 'mastercard',
      cardNumber: '4444',
      image: require('../../../assets/images/paymentMode/mastercard.png'),
      expiryDate: '12/23',
      holder: 'Stephen',
    },
    {
      id: '2',
      type: 'Afrimoney',
      cardNumber: '5555',
      image: require('../../../assets/images/paymentMode/afrimoney.png'),
      expiryDate: '12/23',
      holder: 'Stephen',
    },
    // Add more dummy data if needed
  ];

  const fetchPaymentSheetParams = async () => {
    const user = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(user)?.token;
    const param = {
      amount: topUpAmount,
      currency: 'USD',
    };

    console.log('price', topUpAmount);
    const url = Constant.baseUrl + 'wallet-recharge';
    try {
      const response = await axios.post(url, querystring.stringify(param), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.status === 200) {
        const { ephemeralKey, paymentIntent, stripe_customer_id } = response?.data;
        return {
          paymentIntent,
          ephemeralKey,
          stripe_customer_id,
        };
      }
    } catch (error) {
      console.error('Error fetching payment sheet params:', error?.response?.data);
    }
  };

  //   const onConfirmStripe = async () => {
  //     setLoading(true);
  //     const { paymentIntent, ephemeralKey, stripe_customer_id } = await fetchPaymentSheetParams();
  //     const { error } = await initPaymentSheet({
  //       merchantDisplayName: 'Trihp Inc.',
  //       customerId: stripe_customer_id,
  //       customerEphemeralKeySecret: ephemeralKey,
  //       paymentIntentClientSecret: paymentIntent,
  //       allowsDelayedPaymentMethods: true,
  //       defaultBillingDetails: {
  //         name: 'Trihp',
  //       },
  //     });
  //     if (!error) {
  //       const presentResult = await presentPaymentSheet();
  //       if (presentResult.error) {
  //         setLoading(false);
  //         console.log('error h payment me');
  //       } else {
  //         const user = await AsyncStorage.getItem('userDetail');
  //         const token = JSON.parse(user)?.token;
  //         const param = {
  //           paymentIntentId: paymentIntent,
  //         };
  //         const url = Constant.baseUrl + 'payment-status';
  //         try {
  //           console.log("it's working");
  //           const response = await axios.post(url, querystring.stringify(param), {
  //             headers: {
  //               'Content-Type': 'application/x-www-form-urlencoded',
  //               Accept: '*/*',
  //               Authorization: `Bearer ${token}`,
  //             },
  //           });
  //           if (response?.status === 200) {
  //             setPrice('');
  //             showSucess(response?.data?.message);
  //             navigation.goBack();
  //           }
  //         } catch (error) {
  //           setLoading(false);
  //           console.error('Error fetching payment sheet params:', error?.response?.data);
  //         }
  //       }
  //     }
  //   };

  const onConfirmPayment = async () => {
    setLoading(true);
    const user = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(user)?.token;
    const param = {
      amount: topUpAmount,
      currency: 'USD',
      paymentMethod: selectedPaymentMethod?.type,
    };

    const url = Constant.baseUrl + 'process-payment';
    try {
      const response = await axios.post(url, param, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.status === 200) {
        setLoading(false);
        setIsModalVisible(true);
        showSucess(response?.data?.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error processing payment:', error?.response?.data);
    }
  };
  console.log(isModalVisible);
  return (
    <View style={styles.container}>
      <BackHeader title="Select Top Up Method" onPress={() => router.back()} />
      <View style={{ margin: 20, justifyContent: 'space-between', flex: 1 }}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Current Balance</Text>
          <Text style={styles.balanceValue}>{balance}</Text>
        </View>
        <Text style={styles.heading}>Choose a top up method to add money to your Trihp wallet</Text>
        <FlatList
          data={dummyCardInfo}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable style={styles.paymentMethodContainer} onPress={() => setSelectedPaymentMethod(item)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image source={item.image} style={{ height: 34, width: 34 }} />
                <Text style={{ ...Fonts.Regular, textTransform: 'capitalize', fontSize: 14 }}>{`${item.type} ${
                  item.type == 'mastercard' ? `******${item.cardNumber}` : ''
                }`}</Text>
              </View>
              <Icon
                name={selectedPaymentMethod?.id === item?.id ? 'radiobox-marked' : 'radiobox-blank'}
                size={22}
                color={Colors.whiteColor}
              />
            </Pressable>
          )}
          ListHeaderComponent={
            <Text
              style={{
                ...Fonts.Regular,
                color: Colors.whiteColor,
                paddingVertical: 10,
                fontSize: 16,
              }}
            >
              Options
            </Text>
          }
          ListEmptyComponent={
            <TouchableOpacity onPress={() => router.push('/Payments/AddPayMethods')}>
              <Text style={styles.addPaymentText}>Add Payment</Text>
            </TouchableOpacity>
          }
        />
        <TriphButton
          text="Proceed"
          onPress={onConfirmPayment}
          loading={loading}
          disabled={!selectedPaymentMethod}
          bgColor={{ backgroundColor: selectedPaymentMethod ? Colors.yellow : Colors.grey10 }}
        />
      </View>
      <PaySuccessModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} amount={topUpAmount} />
    </View>
  );
};

export default TopUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey11,
  },
  balanceText: {
    ...Fonts.Medium,
    fontSize: 14,
    color: Colors.whiteColor,
  },
  balanceValue: {
    fontSize: 35,
    color: Colors.whiteColor,
  },
  heading: {
    ...Fonts.Regular,
    marginVertical: 20,
    fontSize: 14,
    color: Colors.whiteColor,
    paddingTop: 10,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  addPaymentText: {
    color: Colors.yellow,
    textAlign: 'center',
  },
});
