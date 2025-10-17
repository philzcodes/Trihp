import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BackHeader from '../../components/BackHeader';
import RemoveWalletModal from '../../components/Modals/Removewalletmodal';
import { STATUS_BAR_HEIGHT } from '../../constants/Measurements';
import { Colors, Fonts } from '../../constants/Styles';

const AFRIMONEY_LOGO = require('../../assets/images/paymentMode/afrimoney.png');

const ManageMobileMoney = () => {
  const router = useRouter();

  // Get wallet details from params
  const {
    walletName = 'Afrimoney',
    walletNickname = 'Wallet Nickname',
    accountNumber = '****2344',
    walletLogo = AFRIMONEY_LOGO,
    backgroundColor = '#95246D',
  } = route.params || {};

  const [isRemoveModalVisible, setRemoveModalVisible] = useState(false);

  const handleEdit = () => {
    // Navigate to edit wallet screen
    navigation.navigate('EditWallet', {
      walletName,
      walletNickname,
      accountNumber,
      walletLogo,
      backgroundColor,
    });
  };

  const handleRemove = () => {
    setRemoveModalVisible(true);
  };

  const confirmRemove = () => {
    // Handle wallet removal logic
    console.log('Wallet removed');
    setRemoveModalVisible(false);
    router.back();
  };

  const cancelRemove = () => {
    setRemoveModalVisible(false);
  };

  return (
    <View style={[styles.container, { paddingTop: STATUS_BAR_HEIGHT }]}>
      <BackHeader
        title="Manage Mobile Money"
        onPress={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Wallet Card Section */}
        <View style={styles.walletSection}>
          <View style={styles.walletInfo}>
            <View style={styles.walletTextContainer}>
              <Text style={styles.walletName}>{walletName}</Text>
              <Text style={styles.walletNickname}>{walletNickname}</Text>
              <Text style={styles.accountNumber}>{accountNumber}</Text>
            </View>

            <View style={[styles.logoContainer, { backgroundColor }]}>
              <Image
                source={walletLogo}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Edit Button */}
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionButtonPressed,
            ]}
            onPress={handleEdit}
          >
            <View style={styles.actionContent}>
              <MaterialCommunityIcons
                name="pencil"
                size={24}
                color={Colors.whiteColor}
                style={styles.actionIcon}
              />
              <Text style={styles.actionText}>Edit</Text>
            </View>
          </Pressable>

          {/* Separator Line */}
          <View style={styles.actionSeparator} />

          {/* Remove Button */}
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.removeButton,
              pressed && styles.actionButtonPressed,
            ]}
            onPress={handleRemove}
          >
            <View style={styles.actionContent}>
              <View style={styles.removeIconContainer}>
                <Ionicons
                  name="remove"
                  size={24}
                  color="#FF3B30"
                />
              </View>
              <Text style={styles.removeText}>Remove {walletName} Wallet</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>

      {/* Remove Wallet Confirmation Modal */}
      <RemoveWalletModal
        isVisible={isRemoveModalVisible}
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
        walletName={walletName}
        accountNumber={accountNumber}
      />
    </View>
  );
};

export default ManageMobileMoney;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  walletSection: {
    marginBottom: 40,
  },
  walletInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  walletTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  walletName: {
    ...Fonts.GrandMedium,
    fontSize: 32,
    color: Colors.whiteColor,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  walletNickname: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    opacity: 0.6,
    marginBottom: 12,
  },
  accountNumber: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    opacity: 0.6,
    letterSpacing: 1,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  logoImage: {
    width: 70,
    height: 32,
  },
  actionsContainer: {
    gap: 0,
  },
  actionButton: {
    paddingVertical: 20,
  },
  actionButtonPressed: {
    opacity: 0.6,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 16,
  },
  actionText: {
    ...Fonts.Regular,
    fontSize: 18,
    color: Colors.whiteColor,
    fontWeight: '400',
  },
  actionSeparator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },
  removeButton: {
    paddingVertical: 20,
  },
  removeIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  removeText: {
    ...Fonts.Regular,
    fontSize: 18,
    color: '#FF3B30',
    fontWeight: '400',
  },
});