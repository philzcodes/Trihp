import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import BackHeader from '../../components/BackHeader';
import FilterModal from '../../components/Modals/FilterModal';
import { Colors, Fonts } from '../../constants/Styles';
import Constant from '../../helper/Constant';
import { formatCurrency } from '../../helper/distancesCalculate';
import { formatTime, formatUTCDate } from '../../helper/formatDate';

const Transactions = () => {
  const navigation = useNavigation();
  const [transaction, setTransaction] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [loading, setLoading] = useState(false);

  // const dummyData = [
  //   {
  //     id: 1,
  //     created_at: '2021-08-03T08:00:00.000Z',
  //     transaction_type: 'Voucher',
  //     amount: 1000,
  //     status: 'Success',
  //     transaction_id: 'TRIHP-123456',
  //   },
  //   {
  //     id: 2,
  //     created_at: '2021-08-03T08:00:00.000Z',
  //     transaction_type: 'Refund',
  //     amount: 1000,
  //     status: 'Success',
  //     transaction_id: 'TRIHP-123456',
  //   },
  //   {
  //     id: 3,
  //     created_at: '2021-08-03T08:00:00.000Z',
  //     transaction_type: 'Spent',
  //     amount: 1000,
  //     status: 'Success',
  //     transaction_id: 'TRIHP-123456',
  //   },
  //   {
  //     id: 4,
  //     created_at: '2021-08-03T08:00:00.000Z',
  //     transaction_type: 'Spent',
  //     amount: 1000,
  //     status: 'Success',
  //     transaction_id: 'TRIHP-123456',
  //   },
  // ];

  useEffect(() => {
    fetchTransactions(selectedFilter);
  }, [selectedFilter]);

  // useEffect(() => {
  //   setTransaction(dummyData);
  // }, []);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const fetchTransactions = async (filter) => {
    setLoading(true);
    try {
      const data = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(data)?.token;
      const Url = `${Constant.baseUrl}trihpWallet${filter && filter !== 'All' ? `?filter=${filter}` : ''}`;
      console.log('Url', Url);
      const res = await axios.get(Url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        setTransaction(res?.data);
      } else {
        console.log('Failed to fetch transaction data');
      }
    } catch (error) {
      // showError(error.message);
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={'large'} color={Colors.yellow} />
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <BackHeader
        title="Transactions Details"
        styles={{ fontSize: 10 }}
        onPress={() => navigation.goBack()}
        iconFilter
        onFilterPress={() => setModalVisible(true)}
      />
      {transaction && transaction.length > 0 ? (
        <FlatList
          data={transaction}
          keyExtractor={(item, index) => item.id + index}
          scrollEnabled
          contentContainerStyle={{ gap: 10, paddingVertical: 30 }}
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
                        <Text style={{ ...Fonts.Regular, color: Colors.grey5, fontSize: 14 }}>{formatTime(item?.created_at)}</Text>
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
      <FilterModal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        onApply={() => setModalVisible(false)}
        onFilterChange={handleFilterChange}
        initialFilter={selectedFilter}
      />
    </View>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blackColor,
  },
  transactionItem: {
    padding: 15,
    backgroundColor: '#171717',
    gap: 10,
    marginBottom: 15,
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
    backgroundColor: Colors.grey10,
    borderRadius: 22.5,
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
    ...Fonts.GrandMedium,
    color: Colors.whiteColor,
  },
  transactionAmount: {
    ...Fonts.GrandHeavy,

    fontSize: 18,
    color: '#199D5B',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  transactionStatusLabel: {
    ...Fonts.Medium,
    fontSize: 16,
    color: Colors.whiteColor,
  },
  transactionStatus: {
    ...Fonts.TextBold,
    color: Colors.whiteColor,
  },
  transactionIdLabel: {
    ...Fonts.Regular,
    fontSize: 11,
    color: Colors.whiteColor,
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
  },
});
