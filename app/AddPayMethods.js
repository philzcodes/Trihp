import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../constants';
import { FontAwesome6 } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';

const AddPayMethods = () => {
  const router = useRouter();
  const [isCardModalVisible, setCardModalVisible] = useState(false);
  const [isMobileMoneyModalVisible, setMobileMoneyModalVisible] = useState(false);

  const paymentMethods = [
    {
      id: 1,
      name: 'Credit/Debit Card',
      icon: <FontAwesome6 name="credit-card" size={30} color={'#D91010'} />,
      onPress: () => setCardModalVisible(true),
    },
    {
      id: 2,
      name: 'Mobile Money',
      icon: <Foundation name="dollar" size={30} color={Colors.whiteColor} />,
      onPress: () => setMobileMoneyModalVisible(true),
    },
    { 
      id: 3, 
      name: 'Cash', 
      icon: <FontAwesome6 name="money-bill" size={30} color={'#2CA96D'} />, 
      onPress: () => router.push('/add-money') 
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Payment Method</Text>
      </View>
      
      <View>
        <Text style={styles.headerText}>Add Payment Method</Text>
        <Text style={{ ...Fonts.Regular, color: Colors.whiteColor, paddingHorizontal: 20, fontSize: 14 }}>
          You'll only be charged when you order a ride
        </Text>
      </View>
      
      <View style={{ height: 10, borderRadius: 50, backgroundColor: Colors.whiteColor, marginVertical: 30, marginHorizontal: 20 }} />
      
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
  headerText: {
    ...Fonts.Regular,
    fontSize: 24,
    color: Colors.whiteColor,
    marginTop: 20,
    paddingHorizontal: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 10,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.whiteColor,
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

export default AddPayMethods;
