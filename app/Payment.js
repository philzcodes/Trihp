import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BackButton } from '../components';
import { Colors, Fonts } from '../constants';

const Payment = () => {
  const router = useRouter();
  const [walletAmount] = useState(2500.00);
  const [owing] = useState(false);
  const [owedAmount] = useState(0);

  const paymentMethods = [
    {
      id: 1,
      type: 'mastercard',
      cardNumber: '4444',
      expiryDate: '12/25',
      holder: 'John Doe',
      icon: 'card',
    },
    {
      id: 2,
      type: 'visa',
      cardNumber: '1234',
      expiryDate: '11/24',
      holder: 'John Doe',
      icon: 'card',
    },
  ];

  const vouchers = [
    {
      id: 1,
      name: '$5 Signup bonus',
      validUntil: '26 Sept to 20 Sept',
      icon: 'gift',
    },
  ];

  const handleCardPress = (card) => {
    Alert.alert('Card Details', `${card.type} ending in ${card.cardNumber}`);
  };

  const handleAddPaymentMethod = () => {
    Alert.alert('Add Payment', 'Add payment method feature coming soon!');
  };

  const handleAddMoney = () => {
    Alert.alert('Add Money', 'Add money to wallet feature coming soon!');
  };

  const handleTransactionHistory = () => {
    router.push('/transaction-history');
  };

  const handleAddVoucher = () => {
    Alert.alert('Add Voucher', 'Add voucher code feature coming soon!');
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.back()} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Payment</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {owing && (
          <View style={styles.owingContainer}>
            <View style={styles.owingContent}>
              <Ionicons name="alert-circle" size={24} color={Colors.whiteColor} />
              <Text style={styles.owingText}>Please pay ₦{owedAmount}</Text>
            </View>
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.walletContainer}>
          <View style={styles.walletHeader}>
            <Ionicons name="wallet" size={25} color={Colors.yellow} />
            <Text style={styles.walletTitle}>Trihp Wallet</Text>
          </View>
          <Text style={styles.walletAmount}>₦{walletAmount.toFixed(2)}</Text>
          <TouchableOpacity style={styles.addMoneyButton} onPress={handleAddMoney}>
            <Ionicons name="add" size={12} color={Colors.blackColor} />
            <Text style={styles.addMoneyText}>Add Money</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Payment Methods</Text>
        
        <View style={styles.paymentMethodsContainer}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={styles.paymentMethod}
              onPress={() => handleCardPress(method)}
            >
              <View style={styles.paymentIcon}>
                <Ionicons name={method.icon} size={20} color={Colors.whiteColor} />
              </View>
              <Text style={styles.paymentText}>
                {method.type} ****{method.cardNumber}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addPaymentMethod} onPress={handleAddPaymentMethod}>
          <Ionicons name="add" size={15} color={Colors.whiteColor} />
          <Text style={styles.addPaymentText}>Add Payment Method</Text>
        </TouchableOpacity>

        <View style={styles.voucherSection}>
          <View style={styles.voucherHeader}>
            <Text style={styles.sectionTitle}>Voucher</Text>
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
          
          {vouchers.map((voucher) => (
            <View key={voucher.id} style={styles.voucherItem}>
              <View style={styles.voucherIcon}>
                <Ionicons name={voucher.icon} size={20} color={Colors.yellow} />
              </View>
              <View style={styles.voucherInfo}>
                <Text style={styles.voucherName}>{voucher.name}</Text>
                <Text style={styles.voucherValid}>{voucher.validUntil}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addVoucherButton} onPress={handleAddVoucher}>
            <Ionicons name="add" size={15} color={Colors.whiteColor} />
            <Text style={styles.addVoucherText}>Add Voucher code</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.transactionHistory} onPress={handleTransactionHistory}>
          <View style={styles.transactionContent}>
            <Ionicons name="document-text" size={23} color={Colors.yellow} />
            <Text style={styles.transactionText}>Transaction History</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={Colors.whiteColor} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    ...Fonts.TextBold,
    fontSize: 24,
    color: Colors.whiteColor,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  owingContainer: {
    height: 50,
    borderRadius: 50,
    backgroundColor: '#FF00004A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  owingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  owingText: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    fontSize: 16,
  },
  detailsButton: {
    backgroundColor: '#FE00005C',
    borderRadius: 36,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  detailsButtonText: {
    ...Fonts.Medium,
    color: Colors.whiteColor,
    fontSize: 12,
  },
  walletContainer: {
    backgroundColor: Colors.grey12,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    rowGap: 10,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  walletTitle: {
    ...Fonts.Medium,
    fontSize: 16,
    color: Colors.whiteColor,
  },
  walletAmount: {
    ...Fonts.GrandMedium,
    fontSize: 38,
    color: Colors.whiteColor,
    paddingBottom: 8,
  },
  addMoneyButton: {
    borderRadius: 50,
    alignSelf: 'flex-start',
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 15,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  addMoneyText: {
    ...Fonts.Regular,
    color: Colors.blackColor,
    fontSize: 14,
  },
  sectionTitle: {
    ...Fonts.GrandHeavy,
    fontSize: 16,
    color: Colors.whiteColor,
    marginTop: 20,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey12,
  },
  paymentMethodsContainer: {
    marginBottom: 10,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: Colors.grey12,
  },
  paymentIcon: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentText: {
    ...Fonts.Medium,
    fontSize: 14,
    color: Colors.whiteColor,
    textTransform: 'capitalize',
  },
  addPaymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#171717',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  addPaymentText: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    fontSize: 16,
    marginLeft: 10,
  },
  voucherSection: {
    marginTop: 20,
  },
  voucherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey12,
    marginBottom: 15,
  },
  voucherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 15,
  },
  voucherIcon: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voucherInfo: {
    flex: 1,
  },
  voucherName: {
    ...Fonts.Medium,
    fontSize: 14,
    color: Colors.whiteColor,
  },
  voucherValid: {
    ...Fonts.Regular,
    fontSize: 12,
    color: Colors.grey14,
  },
  addVoucherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#171717',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  addVoucherText: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    fontSize: 16,
    marginLeft: 10,
  },
  transactionHistory: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#171717',
    marginTop: 5,
    marginBottom: 30,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  transactionText: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
  },
});
