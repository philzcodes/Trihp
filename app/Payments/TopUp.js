import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../../constants/Styles';

const TopUp = () => {
  const router = useRouter();
  const { balance, topUpAmount } = useLocalSearchParams();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);

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
      cardNumber: '5555',
      image: require('../../assets/images/paymentMode/afrimoney.png'),
      expiryDate: '12/23',
      holder: 'Stephen',
    },
  ];

  const onConfirmPayment = async () => {
    setLoading(true);
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      console.log('Payment processed successfully');
      
      // Navigate back to payment screen
      router.back();
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Top Up Method</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Current Balance</Text>
          <Text style={styles.balanceValue}>{balance || '$250.50'}</Text>
        </View>
        
        <Text style={styles.heading}>Choose a top up method to add money to your Trihp wallet</Text>
        
        <FlatList
          data={dummyCardInfo}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable 
              style={[
                styles.paymentMethodContainer,
                selectedPaymentMethod?.id === item?.id && styles.selectedPaymentMethod
              ]} 
              onPress={() => setSelectedPaymentMethod(item)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image source={item.image} style={{ height: 34, width: 34 }} />
                <Text style={{ ...Fonts.Regular, textTransform: 'capitalize', fontSize: 14, color: Colors.whiteColor }}>
                  {`${item.type} ${item.type == 'mastercard' ? `******${item.cardNumber}` : ''}`}
                </Text>
              </View>
              <MaterialCommunityIcons
                name={selectedPaymentMethod?.id === item?.id ? 'radiobox-marked' : 'radiobox-blank'}
                size={22}
                color={Colors.whiteColor}
              />
            </Pressable>
          )}
          ListHeaderComponent={
            <Text style={styles.optionsHeader}>Options</Text>
          }
          ListEmptyComponent={
            <TouchableOpacity onPress={() => router.push('/add-payment-methods')}>
              <Text style={styles.addPaymentText}>Add Payment</Text>
            </TouchableOpacity>
          }
        />
        
        <View style={styles.footer}>
          <Pressable
            style={[
              styles.proceedButton,
              !selectedPaymentMethod && styles.disabledButton
            ]}
            onPress={onConfirmPayment}
            disabled={!selectedPaymentMethod || loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.blackColor} />
            ) : (
              <Text style={[
                styles.proceedButtonText,
                !selectedPaymentMethod && styles.disabledButtonText
              ]}>
                Proceed
              </Text>
            )}
          </Pressable>
        </View>
      </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteColor,
    marginBottom: 20,
  },
  balanceText: {
    ...Fonts.Medium,
    fontSize: 14,
    color: Colors.whiteColor,
  },
  balanceValue: {
    ...Fonts.Regular,
    fontSize: 35,
    color: Colors.whiteColor,
    fontWeight: 'bold',
  },
  heading: {
    ...Fonts.Regular,
    marginVertical: 20,
    fontSize: 14,
    color: Colors.whiteColor,
    paddingTop: 10,
  },
  optionsHeader: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    paddingVertical: 10,
    fontSize: 16,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedPaymentMethod: {
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: Colors.yellow,
  },
  addPaymentText: {
    ...Fonts.Regular,
    color: Colors.yellow,
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  footer: {
    marginTop: 20,
  },
  proceedButton: {
    backgroundColor: Colors.yellow,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.whiteColor,
    opacity: 0.3,
  },
  proceedButtonText: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.blackColor,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: Colors.blackColor,
    opacity: 0.5,
  },
});

export default TopUp;
