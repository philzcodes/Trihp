import { useFocusEffect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import { Colors, Fonts } from '../../constants';

const TransactionHistory = () => {
  const router = useRouter();
  const [transaction, setTransaction] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock transaction data - replace with actual API calls
  const dummyData = [
    {
      id: 1,
      created_at: '2021-08-03T08:00:00.000Z',
      transaction_type: 'Voucher',
      amount: 1000,
      status: 'Success',
      transaction_id: 'TRIHP-123456',
    },
    {
      id: 2,
      created_at: '2021-08-03T08:00:00.000Z',
      transaction_type: 'Refund',
      amount: 1000,
      status: 'Success',
      transaction_id: 'TRIHP-123456',
    },
    {
      id: 3,
      created_at: '2021-08-03T08:00:00.000Z',
      transaction_type: 'Spent',
      amount: 1000,
      status: 'Success',
      transaction_id: 'TRIHP-123456',
    },
    {
      id: 4,
      created_at: '2021-08-03T08:00:00.000Z',
      transaction_type: 'Spent',
      amount: 1000,
      status: 'Success',
      transaction_id: 'TRIHP-123456',
    },
  ];

  // Handle hardware back button on Android
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.back();
        return true; // Prevent default behavior
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [router])
  );

  useEffect(() => {
    fetchTransactions(selectedFilter);
  }, [selectedFilter]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const fetchTransactions = async (filter) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTransaction(dummyData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount || 0).toFixed(2)}`;
  };

  const formatUTCDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size={'large'} color={Colors.yellow} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Transaction History</Text>
        <Pressable onPress={() => setModalVisible(true)} style={styles.filterButton}>
          <Text style={styles.filterText}>Filter</Text>
        </Pressable>
      </View>
      
      {transaction && transaction.length > 0 ? (
        <FlatList
          data={transaction}
          keyExtractor={(item, index) => item.id + index}
          scrollEnabled
          contentContainerStyle={{ gap: 10, paddingVertical: 30, paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDate}>{formatUTCDate(item?.created_at)}</Text>
                <View style={styles.transactionInfo}>
                  <View style={styles.transactionIcon} />
                  <View style={styles.transactionTextContainer}>
                    <View style={styles.transactionHeader}>
                      <View>
                        <Text style={styles.transactionType}>{item.transaction_type}</Text>
                        <Text style={{ ...Fonts.Regular, color: Colors.whiteColor, opacity: 0.7, fontSize: 14 }}>{formatTime(item?.created_at)}</Text>
                      </View>
                      <Text style={styles.transactionAmount}>{formatCurrency(item.amount)}</Text>
                    </View>
                    <View style={styles.transactionFooter}>
                      <View>
                        <Text style={styles.transactionIdLabel}>Status</Text>
                        <Text style={styles.transactionId}>{item.status}</Text>
                      </View>
                      <View>
                        <Text style={styles.transactionIdLabel}>Transaction ID</Text>
                        <Text style={styles.transactionId}>{item.transaction_id}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.noTransactionsContainer}>
          <Text style={styles.noTransactionsText}>No Transaction Record Found</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.yellow,
    borderRadius: 6,
  },
  filterText: {
    ...Fonts.Regular,
    fontSize: 12,
    color: Colors.blackColor,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blackColor,
  },
  transactionItem: {
    padding: 15,
    backgroundColor: '#171717',
    gap: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  transactionDetails: {
    gap: 10,
  },
  transactionDate: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    fontSize: 12,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  transactionIcon: {
    width: 45,
    height: 45,
    backgroundColor: Colors.whiteColor,
    borderRadius: 22.5,
    opacity: 0.1,
  },
  transactionTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionType: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    fontWeight: '600',
  },
  transactionAmount: {
    ...Fonts.Regular,
    fontSize: 18,
    color: '#199D5B',
    fontWeight: 'bold',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  transactionIdLabel: {
    ...Fonts.Regular,
    fontSize: 11,
    color: Colors.whiteColor,
    opacity: 0.7,
  },
  transactionId: {
    ...Fonts.Regular,
    fontSize: 12,
    color: Colors.whiteColor,
  },
  noTransactionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTransactionsText: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    fontSize: 16,
  },
});

export default TransactionHistory;