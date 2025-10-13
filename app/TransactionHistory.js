import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { BackButton } from '../components';
import { Colors, Fonts } from '../constants';

const TransactionHistory = () => {
  const router = useRouter();

  // Mock transaction data
  const [transactions] = useState([
    {
      id: 1,
      type: 'ride_payment',
      amount: -1200,
      description: 'Ride from Victoria Island to Ikoyi',
      date: '2024-01-15',
      time: '14:30',
      status: 'completed',
      paymentMethod: 'Trihp Wallet',
    },
    {
      id: 2,
      type: 'wallet_topup',
      amount: 5000,
      description: 'Wallet top-up via Bank Transfer',
      date: '2024-01-14',
      time: '09:15',
      status: 'completed',
      paymentMethod: 'Bank Transfer',
    },
    {
      id: 3,
      type: 'refund',
      amount: 800,
      description: 'Refund for cancelled ride',
      date: '2024-01-13',
      time: '18:45',
      status: 'completed',
      paymentMethod: 'Original Payment',
    },
    {
      id: 4,
      type: 'ride_payment',
      amount: -2100,
      description: 'Ride from Lekki to Surulere',
      date: '2024-01-12',
      time: '16:20',
      status: 'completed',
      paymentMethod: 'Credit Card',
    },
    {
      id: 5,
      type: 'bonus',
      amount: 500,
      description: 'Welcome bonus',
      date: '2024-01-10',
      time: '10:00',
      status: 'completed',
      paymentMethod: 'System',
    },
  ]);

  const formatAmount = (amount) => {
    const formattedAmount = Math.abs(amount).toLocaleString();
    return amount < 0 ? `-₦${formattedAmount}` : `+₦${formattedAmount}`;
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'ride_payment':
        return 'car';
      case 'wallet_topup':
        return 'add-circle';
      case 'refund':
        return 'arrow-undo';
      case 'bonus':
        return 'gift';
      default:
        return 'card';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'ride_payment':
        return Colors.red;
      case 'wallet_topup':
      case 'refund':
      case 'bonus':
        return Colors.green;
      default:
        return Colors.whiteColor;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Ionicons
          name={getTransactionIcon(item.type)}
          size={24}
          color={getTransactionColor(item.type)}
        />
      </View>
      
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>
          {formatDate(item.date)} at {item.time}
        </Text>
        <Text style={styles.paymentMethod}>{item.paymentMethod}</Text>
      </View>
      
      <View style={styles.transactionAmount}>
        <Text style={[
          styles.amountText,
          { color: item.amount < 0 ? Colors.red : Colors.green }
        ]}>
          {formatAmount(item.amount)}
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'completed' ? Colors.green : Colors.red }
        ]}>
          <Text style={styles.statusText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt" size={64} color={Colors.grey14} />
      <Text style={styles.emptyText}>No transactions found</Text>
      <Text style={styles.emptySubtext}>Your transaction history will appear here</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.back()} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Transaction History</Text>
        <Text style={styles.subtitle}>Track all your payments and transactions</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Spent</Text>
          <Text style={styles.summaryAmount}>₦3,300</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Earned</Text>
          <Text style={styles.summaryAmount}>₦5,500</Text>
        </View>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
};

export default TransactionHistory;

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
    marginBottom: 5,
  },
  subtitle: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.grey14,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 15,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.grey11,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  summaryLabel: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.grey14,
    marginBottom: 8,
  },
  summaryAmount: {
    ...Fonts.TextBold,
    fontSize: 20,
    color: Colors.whiteColor,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey11,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  transactionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.grey10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    ...Fonts.Medium,
    fontSize: 16,
    color: Colors.whiteColor,
    marginBottom: 4,
  },
  transactionDate: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.grey14,
    marginBottom: 2,
  },
  paymentMethod: {
    ...Fonts.Regular,
    fontSize: 12,
    color: Colors.grey14,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    ...Fonts.TextBold,
    fontSize: 16,
    marginBottom: 5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    ...Fonts.Regular,
    fontSize: 10,
    color: Colors.whiteColor,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    ...Fonts.TextBold,
    fontSize: 18,
    color: Colors.whiteColor,
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.grey14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
