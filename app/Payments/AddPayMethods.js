import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { default as Icon, default as Icon3 } from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/Foundation';
import BackHeader from '../../components/BackHeader';
import CardModal from '../../components/Modals/CardModal';
import MobileMoneyModal from '../../components/Modals/MobileMoneyModal';
import { STATUS_BAR_HEIGHT } from '../../constants/Measurements';
import { Colors, Fonts } from '../../constants/Styles';

const AddPayMethods = () => {
  const navigation = useNavigation();
  const [isCardModalVisible, setCardModalVisible] = useState(false);
  const [isMobileMoneyModalVisible, setMobileMoneyModalVisible] = useState(false);

  const paymentMethods = [
    {
      id: 1,
      name: 'Credit/Debit Card',
      icon: <Icon name="credit-card" size={30} color={'#D91010'} />,
      onPress: () => setCardModalVisible(true),
    },
    {
      id: 2,
      name: 'Mobile Money',
      icon: <Icon2 name="dollar" size={30} color={Colors.whiteColor} />,
      onPress: () => setMobileMoneyModalVisible(true),
    },
    { id: 3, name: 'Cash', icon: <Icon3 name="money-bill" size={30} color={'#2CA96D'} />, onPress: () => navigation.navigate('AddMoney') },
  ];
  return (
    <View style={[styles.container, { paddingTop: STATUS_BAR_HEIGHT + 20 }]}>
      <BackHeader title="Add Payment Method" onPress={() => navigation.goBack()} />
      <View>
        <Text style={styles.headerText}>Add Payment Method</Text>
        <Text style={{ ...Fonts.Regular, color: Colors.whiteColor, paddingHorizontal: 20, fontSize: 14 }}>
          You'll only be charged when you order a ride
        </Text>
      </View>
      <View style={{ height: 10, borderRadius: 50, backgroundColor: Colors.grey11, marginVertical: 30 }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        <View style={styles.row}>
          {paymentMethods.map((method) => (
            <Pressable key={method.id} style={styles.card} onPress={method.onPress}>
              <View style={styles.addCard}>
                {method.icon}

                <Text style={styles.addCardText}>{method.name}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <CardModal isVisible={isCardModalVisible} onClose={() => setCardModalVisible(false)} />
      <MobileMoneyModal isVisible={isMobileMoneyModalVisible} onClose={() => setMobileMoneyModalVisible(false)} />
    </View>
  );
};

export default AddPayMethods;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  headerText: {
    ...Fonts.GrandMedium,
    fontSize: 24,
    color: Colors.whiteColor,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  scrollView: {
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.grey14,
    borderRadius: 10,
    overflow: 'hidden',
  },
  addCard: {
    justifyContent: 'center',
    paddingVertical: 5,
    paddingTop: 10,
    paddingLeft: 8,
  },
  addCardText: {
    ...Fonts.Medium,
    fontSize: 13,
    color: Colors.whiteColor,
    marginTop: 10,
  },
});
