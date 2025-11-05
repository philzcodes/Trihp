import { Entypo, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Colors, Fonts } from '../../constants';

// Legal documents list
const LEGAL_DOCUMENTS = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    url: 'https://trihp.com/privacy-policy', // Update with actual URL if different
  },
  {
    id: 'terms',
    title: 'Terms and Conditions',
    url: 'https://trihp.com/terms-and-condition',
  },
];

const LegalScreen = () => {
  const router = useRouter();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [webViewLoading, setWebViewLoading] = useState(true);

  const handleDocumentPress = (document) => {
    setSelectedDocument(document);
    setWebViewLoading(true);
  };

  const closeModal = () => {
    setSelectedDocument(null);
    setWebViewLoading(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Entypo name="chevron-left" size={26} color={Colors.whiteColor || '#FFFFFF'} />
        </Pressable>
        <Text style={styles.headerTitle}>Legal</Text>
      </View>

      {/* Legal Documents List */}
      <ScrollView style={styles.content}>
        {LEGAL_DOCUMENTS.map((document) => (
          <TouchableOpacity
            key={document.id}
            style={styles.documentItem}
            onPress={() => handleDocumentPress(document)}
            activeOpacity={0.7}
          >
            <Text style={styles.documentTitle}>{document.title}</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.grey8 || '#999'} />
          </TouchableOpacity>
        ))}
        <View style={{ height: 50 }} />
      </ScrollView>

      {/* WebView Modal for selected document */}
      {selectedDocument && (
        <Modal
          visible={!!selectedDocument}
          animationType="slide"
          transparent={false}
          onRequestClose={closeModal}
        >
          <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedDocument.title}</Text>
              <TouchableOpacity
                onPress={closeModal}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={Colors.whiteColor} />
              </TouchableOpacity>
            </View>
            
            {webViewLoading && (
              <View style={styles.webViewLoader}>
                <ActivityIndicator size="large" color={Colors.yellow || '#FFD700'} />
                <Text style={styles.loadingText}>Loading {selectedDocument.title}...</Text>
              </View>
            )}
            
            <WebView
              source={{ uri: selectedDocument.url }}
              style={styles.webView}
              onLoadStart={() => setWebViewLoading(true)}
              onLoadEnd={() => setWebViewLoading(false)}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('WebView error: ', nativeEvent);
                setWebViewLoading(false);
              }}
            />
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor || '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    paddingRight: 10,
    paddingVertical: 5,
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.whiteColor || '#FFFFFF',
    fontWeight: '600',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.grey11 || '#2A2A2A',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 15,
  },
  documentTitle: {
    ...Fonts.TextBold,
    fontSize: 16,
    color: Colors.whiteColor || '#FFFFFF',
    flex: 1,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.blackColor || '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey11 || '#2A2A2A',
  },
  modalTitle: {
    ...Fonts.TextBold,
    fontSize: 20,
    color: Colors.whiteColor || '#FFF',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  webView: {
    flex: 1,
    backgroundColor: Colors.blackColor || '#000',
  },
  webViewLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blackColor || '#000',
    zIndex: 1,
  },
  loadingText: {
    ...Fonts.Regular,
    color: Colors.whiteColor || '#FFF',
    marginTop: 10,
    fontSize: 14,
  },
});

export default LegalScreen;
