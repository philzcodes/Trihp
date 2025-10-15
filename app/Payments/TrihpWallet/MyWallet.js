import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon2 from 'react-native-vector-icons/FontAwesome6';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import serviceBg from '../../../assets/images/service_bg.png';
import BackHeader from '../../../components/BackHeader';
import { STATUS_BAR_HEIGHT } from '../../../constants/Measurements';
import { Colors, Fonts } from '../../../constants/Styles';
import { formatCurrency } from '../../../helper/distancesCalculate';
import useUserStore from '../../../store/userStore';
const MyWallet = () => {
  const navigation = useNavigation();
  const { userData, fetchUser } = useUserStore();
  const walletAmount = userData?.data?.wallet_amount;

  useEffect(() => {
    fetchUser();
    const interval = setInterval(() => {
      fetchUser();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchUser]);

  return (
    <View style={[styles.container, { paddingTop: STATUS_BAR_HEIGHT + 20 }]}>
      <BackHeader title="My Wallet" onPress={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        <View style={styles.walletContainer}>
          <Text style={styles.walletAmount}>{formatCurrency(walletAmount)}</Text>
          <Text style={styles.walletBalanceText}>Trihp Wallet Balance</Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginLeft: 15 }}>
          <Pressable
            onPress={() =>
              navigation.navigate('AddMoney', {
                amount: formatCurrency(walletAmount, 2),
              })
            }
            style={{
              width: '29%',
              aligItems: 'center',
              borderColor: Colors.grey10,
              borderWidth: 1,
              borderRadius: 15,
              marginBottom: 30,
              marginHorizontal: 7,
              margin: 'auto',
              marginTop: 10,
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', ...Fonts.Regular, fontSize: 12, paddingTop: 10 }}>{}</Text>
            <ImageBackground source={serviceBg} style={{ justifyContent: 'center', paddingBottom: 15, height: 65, paddingLeft: 10 }}>
              <Icon2 name="arrow-up-long" size={20} color={'#0AC756'} />
              <Text style={{ color: '#fff', ...Fonts.Regular, fontSize: 14, paddingTop: 10 }}>{'Add Money'}</Text>
              <View style={{ padding: 10 }} />
            </ImageBackground>
          </Pressable>
        </View>

        <View>
          <Pressable style={styles.transactionHistory} onPress={() => navigation.navigate('TransactionHistory')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Icon name="text-box-outline" size={20} color={Colors.yellow} />
              <Text style={styles.transactionText}>Transaction History</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  scrollView: {
    paddingVertical: 30,
  },
  walletContainer: {
    alignItems: 'center',
    marginBottom: 40,
    borderColor: Colors.grey13,
    borderBottomWidth: 1,
  },
  walletAmount: {
    ...Fonts.TextBold,
    fontSize: 36,
    color: Colors.whiteColor,
    paddingBottom: 10,
  },
  walletBalanceText: {
    ...Fonts.Medium,
    color: Colors.whiteColor,
    paddingBottom: 5,
  },
  transactionHistory: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginVertical: 20,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    backgroundColor: '#3A3A3A',
  },
  transactionText: {
    ...Fonts.GrandMedium,
    fontSize: 18,
    paddingTop: 5,
  },
});

export default MyWallet;
