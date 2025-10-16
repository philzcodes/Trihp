import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import TriphButton from '../../../components/TriphButton';
import { STATUS_BAR_HEIGHT } from '../../../constants/Measurements';
import { Colors } from '../../../constants/Styles';

const AddMoney = () => {
  const router = useRouter();
  const { amount } = useLocalSearchParams();
  const [price, setPrice] = useState('');
  const isDisabled = !price || parseInt(price, 10) < 20;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.whiteColor} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Add Money to Trihp Wallet</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.contentWrapper}>
          {/* Wallet Info Card */}
          <View style={styles.walletInfoCard}>
            <View style={styles.walletRow}>
              <View style={styles.walletTitleContainer}>
                <MaterialCommunityIcons name="wallet" size={22} color={Colors.yellow} />
                <Text style={styles.walletTitle}>Trihp Wallet</Text>
              </View>
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Current Balance: </Text>
                <Text style={styles.balanceAmount}>${amount || '0'}</Text>
              </View>
            </View>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Add Money to Your Trihp Wallet</Text>
            <Text style={styles.subtitle}>Trihp wallet can only be used to pay for rides</Text>
          </View>

          {/* Amount Input Section */}
          <View style={styles.amountInputSection}>
            <View style={styles.amountInputWrapper}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                keyboardType="number-pad"
                cursorColor={Colors.whiteColor}
                placeholder="50"
                placeholderTextColor="#4A4A4A"
                autoFocus={false}
                maxLength={4}
                style={styles.amountInput}
                selectionColor={Colors.whiteColor}
              />
            </View>
            <Text style={styles.minimumText}>Minimum Amount: $20</Text>
          </View>

          {/* Add Amount Button */}
          <View style={styles.buttonContainer}>
            <TriphButton
              text="Add Amount"
              onPress={() => {
                router.push({
                  pathname: '/Payments/TrihpWallet/TopUp',
                  params: { 
                    balance: amount, 
                    topUpAmount: price 
                  }
                });
              }}
              disabled={isDisabled}
              bgColor={{ backgroundColor: isDisabled ? Colors.grey10 : Colors.yellow }}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddMoney;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
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
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  headerPlaceholder: {
    width: 40,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  walletInfoCard: {
    backgroundColor: 'transparent',
    marginBottom: 30,
  },
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#B0B0B0',
  },
  balanceAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '300',
    color: '#B0B0B0',
    textAlign: 'center',
  },
  amountInputSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  currencySymbol: {
    fontSize: 80,
    fontWeight: '400',
    color: '#FFFFFF',
    marginRight: 4,
  },
  amountInput: {
    fontSize: 80,
    fontWeight: '400',
    color: '#FFFFFF',
    minWidth: 150,
    textAlign: 'left',
    padding: 0,
    margin: 0,
  },
  minimumText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#808080',
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
});