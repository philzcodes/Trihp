import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import BackArrow from '../../../assets/svgIcons/BackArrow';
import TriphButton from '../../../components/TriphButton';
import { STATUS_BAR_HEIGHT } from '../../../constants/Measurements';
import { Colors, Fonts } from '../../../constants/Styles';

const AddMoney = ({ route }) => {
  const amount = route?.params?.amount;
  const navigation = useNavigation();
  const [price, setPrice] = useState('');
  const isDisabled = !price || parseInt(price, 10) < 20;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView 
  contentContainerStyle={{ 
    flexGrow: 1, 
    paddingTop: STATUS_BAR_HEIGHT + 20, 
    paddingBottom: 40, 
  }} 
  keyboardShouldPersistTaps="handled"
>
        <View style={styles.header}>
          <View>
            <BackArrow onPress={() => navigation.goBack()} />
          </View>
          <Text style={styles.headerText}>Add Money to Trihp wallet</Text>
        </View>
        <View style={{ margin: 20, justifyContent: 'space-between', flex: 1 }}>
          {/* info */}
          <View>
            <View style={styles.infoContainer}>
              <View style={styles.walletHeader}>
                <Icon name="wallet" size={20} color={Colors.yellow} />
                <Text style={styles.walletTitle}>Trihp Wallet</Text>
              </View>
              <View style={styles.walletHeader}>
                <Text style={styles.infoText}>Current Balance: {amount}</Text>
              </View>
            </View>
            <View style={{ marginVertical: 0 }}>
              <Text style={{ ...Fonts.TextBold, color: Colors.whiteColor, fontSize: 18, textAlign: 'center' }}>
                Add Money to Your Trihp Wallet
              </Text>
              <Text style={{ ...Fonts.GrandLight, color: Colors.whiteColor, fontSize: 14, textAlign: 'center' }}>
                Trihp wallet can only be used to pay for rides
              </Text>
            </View>
          </View>

          {/* input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                value={price}
                onChangeText={(e) => setPrice(e)}
                keyboardType="number-pad"
                cursorColor={Colors.grey14}
                placeholder="0"
                autoFocus={true}
                placeholderStyle={{ fontSize: 40 }}
                maxLength={4}
                style={styles.input}
              />
            </View>
            <Text style={styles.minimumAmountText}>Minimum Amount: $20</Text>
          </View>
          {/*  button*/}
          <TriphButton
            text="Add Amount"
            onPress={() => {
              navigation.navigate('TopUp', { balance: amount, topUpAmount: price });
            }}
            disabled={isDisabled}
            bgColor={{ backgroundColor: isDisabled ? Colors.grey10 : Colors.yellow }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddMoney;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  header: {
    padding: 10,
    paddingVertical: 15,
    backgroundColor: Colors.lightBlack,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? STATUS_BAR_HEIGHT : 0,
    justifyContent: 'space-between',
  },
  headerText: {
    ...Fonts.Medium,
    fontSize: 20,
    marginLeft: 20,
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  walletHeader: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  walletTitle: {
    ...Fonts.TextBold,
    fontSize: 16,
    color: Colors.whiteColor,
    paddingTop: 2,
  },
  infoText: {
    ...Fonts.Regular,
    fontSize: 13,
  },
  descriptionText: {
    ...Fonts.Regular,
    fontSize: 15,
    lineHeight: 19,
  },

  inputContainer: {
    flex: 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  dollarSign: {
    ...Fonts.Regular,
    fontSize: 40,
    color: Colors.whiteColor,
  },
  input: {
    ...Fonts.Regular,
    fontSize: 40,
    color: Colors.whiteColor,
  },
  minimumAmountText: {
    ...Fonts.Regular,
    color: Colors.grey2,
  },
});
