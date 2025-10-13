import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from '@expo/vector-icons/AntDesign';
import { Colors, Fonts } from '../constants';

const Offers = ({ posts }) => {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openOfferModal = (offer) => {
    setSelectedOffer(offer);
    setModalVisible(true);
  };

  const closeOfferModal = () => {
    setModalVisible(false);
    setSelectedOffer(null);
  };

  const renderOfferItem = ({ item }) => (
    <TouchableOpacity
      style={styles.offerItem}
      onPress={() => openOfferModal(item)}
    >
      <Image source={item.image} style={styles.offerImage} />
      <View style={styles.offerContent}>
        <Text style={styles.offerTitle}>{item.title}</Text>
        <Text style={styles.offerDescription}>{item.description}</Text>
        <View style={styles.offerFooter}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Icon name="right" size={16} color={Colors.yellow} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOfferItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Offer Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeOfferModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Offer Details</Text>
              <TouchableOpacity onPress={closeOfferModal}>
                <Icon name="close" size={24} color={Colors.whiteColor} />
              </TouchableOpacity>
            </View>

            {selectedOffer && (
              <ScrollView style={styles.modalContent}>
                <Image source={selectedOffer.image} style={styles.modalImage} />
                
                <Text style={styles.modalOfferTitle}>{selectedOffer.title}</Text>
                <Text style={styles.modalOfferDescription}>
                  {selectedOffer.description}
                </Text>

                {selectedOffer.redemptionSteps && (
                  <View style={styles.stepsContainer}>
                    <Text style={styles.stepsTitle}>How to Redeem:</Text>
                    {selectedOffer.redemptionSteps.map((step, index) => (
                      <View key={index} style={styles.stepItem}>
                        <Text style={styles.stepNumber}>{index + 1}</Text>
                        <Text style={styles.stepText}>{step}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {selectedOffer.terms && (
                  <View style={styles.termsContainer}>
                    <Text style={styles.termsTitle}>Terms & Conditions:</Text>
                    <Text style={styles.termsText}>{selectedOffer.terms}</Text>
                  </View>
                )}

                <TouchableOpacity style={styles.redeemButton}>
                  <Text style={styles.redeemButtonText}>Redeem Offer</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Offers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  offerItem: {
    backgroundColor: Colors.blackColor,
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.whiteColor,
  },
  offerImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  offerContent: {
    padding: 15,
  },
  offerTitle: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.yellow,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  offerDescription: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor,
    marginBottom: 12,
    lineHeight: 20,
  },
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewDetailsText: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.yellow,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.blackColor,
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: Colors.whiteColor,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteColor,
  },
  modalTitle: {
    ...Fonts.Regular,
    fontSize: 18,
    color: Colors.yellow,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalOfferTitle: {
    ...Fonts.Regular,
    fontSize: 20,
    color: Colors.yellow,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalOfferDescription: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.whiteColor,
    marginBottom: 20,
    lineHeight: 24,
  },
  stepsContainer: {
    marginBottom: 20,
  },
  stepsTitle: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.yellow,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  stepNumber: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.yellow,
    fontWeight: 'bold',
    width: 20,
    textAlign: 'center',
  },
  stepText: {
    ...Fonts.Regular,
    fontSize: 14,
    color: Colors.whiteColor,
    flex: 1,
    marginLeft: 10,
    lineHeight: 20,
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsTitle: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.yellow,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  termsText: {
    ...Fonts.Regular,
    fontSize: 12,
    color: Colors.whiteColor,
    lineHeight: 18,
  },
  redeemButton: {
    backgroundColor: Colors.yellow,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  redeemButtonText: {
    ...Fonts.Regular,
    fontSize: 16,
    color: Colors.blackColor,
    fontWeight: 'bold',
  },
});
