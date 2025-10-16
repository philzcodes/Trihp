import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import InsufficientFundsModal from '../../../components/Modals/InsufficientFundsModal';
import PaySuccessModal from '../../../components/Modals/PaySuccessModal';
import TriphButton from '../../../components/TriphButton';
import { STATUS_BAR_HEIGHT } from '../../../constants/Measurements';
import { Colors } from '../../../constants/Styles';
import { showSucess } from '../../../helper/Toaster';

const TopUp = () => {
  const router = useRouter();
  const { balance, topUpAmount } = useLocalSearchParams();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isInsufficientFundsModalVisible, setIsInsufficientFundsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const dummyCardInfo = [
    {
      id: '1',
      type: 'Afrimoney',
      cardNumber: '2345',
      image: require('../../../assets/images/paymentMode/afrimoney.png'),
      expiryDate: '12/23',
      holder: 'Stephen',
    },
    {
      id: '2',
      type: 'Afrimoney',
      cardNumber: '9873',
      image: require('../../../assets/images/paymentMode/afrimoney.png'),
      expiryDate: '12/23',
      holder: 'Stephen',
    },
  ];

  const onConfirmPayment = async () => {
    setLoading(true);
    
    // Mock API call - simulate network delay and random success/failure
    setTimeout(() => {
      setLoading(false);
      
      // Simulate random success/failure (70% success rate)
      const isSuccess = Math.random() > 0.3;
      
      if (isSuccess) {
        setIsSuccessModalVisible(true);
        showSucess('Top-up successful! Your wallet has been credited.');
      } else {
        setIsInsufficientFundsModalVisible(true);
      }
    }, 2000); // 2 second delay to simulate API call
    
    // Original API call code (commented out for testing)
    
    // const user = await AsyncStorage.getItem('userDetail');
    // const token = JSON.parse(user)?.token;
    // const param = {
    //   amount: topUpAmount,
    //   currency: 'USD',
    //   paymentMethod: selectedPaymentMethod?.type,
    // };

    // const url = Constant.baseUrl + 'process-payment';
    // try {
    //   const response = await axios.post(url, param, {
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //       Accept: '*/*',
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
    //   if (response?.status === 200) {
    //     setLoading(false);
    //     setIsModalVisible(true);
    //     showSucess(response?.data?.message);
    //   }
    // } catch (error) {
    //   setLoading(false);
    //   console.error('Error processing payment:', error?.response?.data);
    // }
    
  };

  const renderPaymentMethod = ({ item }) => {
    const isSelected = selectedPaymentMethod?.id === item?.id;
    
    return (
      <Pressable 
        style={styles.paymentMethodCard} 
        onPress={() => setSelectedPaymentMethod(item)}
        android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
      >
        <View style={styles.paymentMethodContent}>
          <Image source={item.image} style={styles.paymentMethodImage} resizeMode="contain" />
          <View style={styles.paymentMethodInfo}>
            <Text style={styles.paymentMethodName}>{item.type}</Text>
            <Text style={styles.paymentMethodNumber}>***{item.cardNumber}</Text>
          </View>
        </View>
        <View style={styles.radioButtonContainer}>
          {isSelected ? (
            <View style={styles.radioButtonSelected}>
              <View style={styles.radioButtonInner} />
            </View>
          ) : (
            <View style={styles.radioButtonUnselected} />
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.whiteColor} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Select top up Method</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.contentContainer}>
        {/* Current Balance Section */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>${balance || '745'}</Text>
          </View>
          <View style={styles.divider} />
        </View>

        {/* Description Text */}
        <Text style={styles.descriptionText}>
          Choose a top up method to add money to your Trihp wallet
        </Text>

        {/* Options Section */}
        <View style={styles.optionsSection}>
          <Text style={styles.optionsTitle}>Options</Text>
          
          <FlatList
            data={dummyCardInfo}
            keyExtractor={(item) => item.id}
            renderItem={renderPaymentMethod}
            contentContainerStyle={styles.paymentMethodsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <TouchableOpacity 
                onPress={() => router.push('/Payments/AddPayMethods')}
                style={styles.addPaymentButton}
              >
                <Text style={styles.addPaymentText}>+ Add Payment Method</Text>
              </TouchableOpacity>
            }
          />
        </View>

        {/* Proceed Button */}
        <View style={styles.buttonContainer}>
          <TriphButton
            text="Proceed"
            onPress={onConfirmPayment}
            loading={loading}
            disabled={!selectedPaymentMethod}
            bgColor={{ backgroundColor: selectedPaymentMethod ? Colors.yellow : Colors.grey10 }}
          />
        </View>
      </View>

      <PaySuccessModal 
        isVisible={isSuccessModalVisible} 
        onClose={() => {
          setIsSuccessModalVisible(false);
          router.back();
        }} 
        amount={topUpAmount} 
      />

      <InsufficientFundsModal 
        isVisible={isInsufficientFundsModalVisible} 
        onClose={() => setIsInsufficientFundsModalVisible(false)}
        onCancel={() => setIsInsufficientFundsModalVisible(false)}
      />
    </View>
  );
};

export default TopUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT + 10 : STATUS_BAR_HEIGHT + 16,
    backgroundColor: '#000000',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  headerPlaceholder: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  balanceSection: {
    marginBottom: 20,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A2A',
    width: '100%',
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '300',
    color: '#FFFFFF',
    lineHeight: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  optionsSection: {
    flex: 1,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  paymentMethodsList: {
    flexGrow: 1,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 16,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  paymentMethodNumber: {
    fontSize: 14,
    fontWeight: '300',
    color: '#808080',
  },
  radioButtonContainer: {
    paddingLeft: 16,
  },
  radioButtonSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  radioButtonUnselected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  addPaymentButton: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  addPaymentText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.yellow,
  },
  buttonContainer: {
    paddingVertical: 20,
  },
});