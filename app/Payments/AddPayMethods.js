import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BackHeader from '../../components/BackHeader';
import CardModal from '../../components/Modals/CardModal';
import MobileMoneyModal from '../../components/Modals/MobileMoneyModal';
import { STATUS_BAR_HEIGHT } from '../../constants/Measurements';
import { Colors, Fonts } from '../../constants/Styles';

const AFRIMONEY_LOGO = require('../../assets/images/paymentMode/afrimoney.png');

const AddPayMethods = () => {
  const navigation = useRouter();
  const [isCardModalVisible, setCardModalVisible] = useState(false);
  const [isMobileMoneyModalVisible, setMobileMoneyModalVisible] = useState(false);

  const paymentMethods = [
    {
      id: 1,
      name: 'Afrimoney',
      subtext: '',
      isLogo: true,
      logo: AFRIMONEY_LOGO,
      backgroundColor: '#000000',
      onPress: () => navigation.push('/Payments/AddAfrimoneyWallet'),
    },
    {
      id: 2,
      name: 'Cash top up',
      subtext: 'Top tup to your Trihp wallet',
      icon: 'wallet-outline',
      backgroundColor: '#000000',
      onPress: () => navigation.navigate('AddMoney'),
    },
  ];

  const handleMethodPress = (method) => {
    method.onPress();
  };

  return (
    <View style={[styles.container, { paddingTop: STATUS_BAR_HEIGHT }]}>
      <BackHeader title="Add Payment Method" onPress={() => navigation.goBack()} />

      <View style={styles.contentArea}>
        <Text style={styles.headerText}>Add Payment Method</Text>
        <Text style={styles.subText}>
          You'll only be charged when you order a ride
        </Text>

        <View style={styles.separator} />

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.methodsList}>
            {paymentMethods.map((method) => (
              <Pressable
                key={method.id}
                style={({ pressed }) => [
                  styles.methodCard,
                  { 
                    backgroundColor: method.backgroundColor,
                    opacity: pressed ? 0.85 : 1,
                  }
                ]}
                onPress={() => handleMethodPress(method)}
              >
                <View style={styles.cardContent}>
                  {method.isLogo ? (
                    <View style={styles.logoContainer}>
                      <Image 
                        source={method.logo} 
                        style={styles.logoImage}
                        resizeMode="contain"
                      />
                    </View>
                  ) : (
                    <View style={styles.iconContainer}>
                      <Ionicons 
                        name={method.icon} 
                        size={32} 
                        color={Colors.whiteColor} 
                      />
                    </View>
                  )}

                  <View style={styles.textContainer}>
                    <Text style={styles.methodName}>{method.name}</Text>
                    {method.subtext ? (
                      <Text style={styles.methodSubtext}>{method.subtext}</Text>
                    ) : null}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      <CardModal 
        isVisible={isCardModalVisible} 
        onClose={() => setCardModalVisible(false)} 
      />
      <MobileMoneyModal 
        isVisible={isMobileMoneyModalVisible} 
        onClose={() => setMobileMoneyModalVisible(false)} 
      />
    </View>
  );
};

export default AddPayMethods;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerText: {
    ...Fonts.GrandMedium,
    fontSize: 32,
    color: Colors.whiteColor,
    marginTop: 24,
    marginBottom: 8,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subText: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    opacity: 0.65,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: -20,
    marginBottom: 32,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  methodsList: {
    gap: 16,
  },
  methodCard: {
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    minHeight: 90,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.96)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoImage: {
    width: 50,
    height: 24,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  methodName: {
    ...Fonts.Medium,
    fontSize: 18,
    color: Colors.whiteColor,
    fontWeight: '600',
    marginBottom: 2,
  },
  methodSubtext: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor,
    opacity: 0.7,
    lineHeight: 18,
    marginTop: 4,
  },
});