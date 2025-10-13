import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../constants';
import { FontAwesome6 } from '@expo/vector-icons';

const AddMoney = () => {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const quickAmounts = [10, 25, 50, 100, 200, 500];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmount = (amount) => {
    setCustomAmount(amount);
    setSelectedAmount('');
  };

  const handleAddMoney = () => {
    const amount = selectedAmount || customAmount;
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    Alert.alert(
      'Add Money',
      `Add $${amount} to your Trihp Wallet?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            // Handle add money logic here
            Alert.alert('Success', `$${amount} added to your wallet!`);
            router.back();
          }
        }
      ]
    );
  };

  const currentAmount = selectedAmount || customAmount;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Money</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>$250.50</Text>
        </View>

        <View style={styles.amountSection}>
          <Text style={styles.sectionTitle}>Quick Amounts</Text>
          <View style={styles.quickAmountsContainer}>
            {quickAmounts.map((amount) => (
              <Pressable
                key={amount}
                style={[
                  styles.amountButton,
                  selectedAmount === amount.toString() && styles.selectedAmountButton
                ]}
                onPress={() => handleAmountSelect(amount.toString())}
              >
                <Text style={[
                  styles.amountButtonText,
                  selectedAmount === amount.toString() && styles.selectedAmountButtonText
                ]}>
                  ${amount}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.customAmountSection}>
          <Text style={styles.sectionTitle}>Custom Amount</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={customAmount}
              onChangeText={handleCustomAmount}
              placeholder="0.00"
              placeholderTextColor={Colors.whiteColor}
              keyboardType="numeric"
              maxLength={8}
            />
          </View>
        </View>

        <View style={styles.paymentMethodsSection}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Pressable style={styles.paymentMethodCard}>
            <FontAwesome6 name="credit-card" size={24} color={Colors.yellow} />
            <Text style={styles.paymentMethodText}>Credit/Debit Card</Text>
            <FontAwesome6 name="chevron-right" size={16} color={Colors.whiteColor} />
          </Pressable>
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount to Add</Text>
            <Text style={styles.summaryValue}>${currentAmount || '0.00'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Processing Fee</Text>
            <Text style={styles.summaryValue}>$0.00</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${currentAmount || '0.00'}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable 
          style={[
            styles.addMoneyButton,
            !currentAmount && styles.disabledButton
          ]}
          onPress={handleAddMoney}
          disabled={!currentAmount}
        >
          <Text style={styles.addMoneyButtonText}>Add Money</Text>
        </Pressable>
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
    paddingHorizontal: 20,
  },
  balanceContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteColor,
    marginBottom: 30,
  },
  balanceLabel: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    opacity: 0.7,
    marginBottom: 8,
  },
  balanceAmount: {
    ...Fonts.Regular,
    fontSize: 36,
    color: Colors.whiteColor,
    fontWeight: 'bold',
  },
  amountSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    ...Fonts.Regular,
    fontSize: 18,
    color: Colors.whiteColor,
    fontWeight: '600',
    marginBottom: 15,
  },
  quickAmountsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amountButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.whiteColor,
    backgroundColor: 'transparent',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedAmountButton: {
    backgroundColor: Colors.yellow,
    borderColor: Colors.yellow,
  },
  amountButtonText: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    fontWeight: '600',
  },
  selectedAmountButtonText: {
    color: Colors.blackColor,
  },
  customAmountSection: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.whiteColor,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  dollarSign: {
    ...Fonts.Regular,
    fontSize: 24,
    color: Colors.whiteColor,
    fontWeight: 'bold',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    ...Fonts.Regular,
    fontSize: 24,
    color: Colors.whiteColor,
    fontWeight: 'bold',
  },
  paymentMethodsSection: {
    marginBottom: 30,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: Colors.whiteColor,
    borderRadius: 8,
    backgroundColor: '#171717',
  },
  paymentMethodText: {
    flex: 1,
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    marginLeft: 12,
  },
  summarySection: {
    backgroundColor: '#171717',
    borderRadius: 8,
    padding: 15,
    marginBottom: 30,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.whiteColor,
    paddingTop: 10,
    marginTop: 10,
  },
  summaryLabel: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor,
    opacity: 0.7,
  },
  summaryValue: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor,
  },
  totalLabel: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    fontWeight: 'bold',
  },
  totalValue: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.yellow,
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.whiteColor,
  },
  addMoneyButton: {
    backgroundColor: Colors.yellow,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.whiteColor,
    opacity: 0.3,
  },
  addMoneyButtonText: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.blackColor,
    fontWeight: 'bold',
  },
});

export default AddMoney;
