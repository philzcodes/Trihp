import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { STATUS_BAR_HEIGHT } from '../../constants/Measurements';
// import RNFetchBlob from 'rn-fetch-blob';
import BackHeader from '../../components/BackHeader';
import TriphButton from '../../components/TriphButton';
import { Colors, Fonts } from '../../constants/Styles';
import Constant from '../../helper/Constant';
import { showError, showSuccess } from '../../helper/Toaster';
import { formatTime, formatUTCDateTime } from '../../helper/formatDate';

const GenerateReciept = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { item: Info } = params;
  const [loading, setLoading] = useState(false);

  const onDownload = async () => {
    setLoading(true);
    try {
      const data = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(data)?.token;
      const Url = `${Constant.baseUrl}get-Ride`;
      const params = { id: Info?.id };

      const response = await axios.post(Url, params, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.status === 200) {
        const { pdfPath } = response.data;
        const { config, fs } = RNFetchBlob;
        let localFile = fs.dirs.DocumentDir + '/downloadedFile.pdf';

        if (Platform.OS === 'android') {
          localFile = fs.dirs.DownloadDir + '/downloadedFile.pdf';
        }

        config({
          fileCache: true,
          path: localFile,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            mime: 'application/pdf',
            description: 'Downloading PDF',
            title: 'downloadedFile.pdf',
          },
        })
          .fetch('GET', pdfPath, { Authorization: `Bearer ${token}` })
          .then((res) => {
            console.log('The file saved to ', res.path());
            showSuccess('PDF downloaded successfully');
          })
          .catch((err) => {
            console.error('Download Error:', err.message || err);
            showError('Error downloading PDF');
          });
      } else {
        showError('Failed to fetch PDF');
      }
    } catch (error) {
      console.error('Error fetching PDF:', error.message || error);
      showError('Error fetching PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: STATUS_BAR_HEIGHT + 20 }]}>
      <BackHeader title="Trihp Wallet" onPress={() => router.back()} />
      <View style={styles.content}>
        <Text style={styles.greeting}>Hello John,</Text>
        <Text style={styles.thankYou}>Thank you for using Trihp. {Info.ride_category}</Text>
        <Text style={styles.enjoyedRide}>We hope you enjoyed your ride</Text>
        <View style={{ marginVertical: 10 }} />
        <View style={styles.row}>
          <Text style={{ ...Fonts.GrandHeavy, fontSize: 28, color: Colors.whiteColor }}>Total</Text>
          <Text style={{ ...Fonts.GrandMedium, fontSize: 26, color: Colors.whiteColor }}>{Info.total}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ride Fee</Text>
          <Text style={styles.value}>{Info.ridefee}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Waiting Fee</Text>
          <Text style={styles.value}>{Info.ridefee}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tax</Text>
          <Text style={styles.value}>{Info.tax}</Text>
        </View>

        <Text style={styles.title}>Detail</Text>
        <Image source={require('../../assets/images/banner.jpg')} style={styles.image} />

        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{formatUTCDateTime(Info.created_at)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{formatTime(Info.created_at)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Distance</Text>
          <Text style={styles.value}>53km</Text>
        </View>
        <View style={{ marginTop: 30 }}>
          <TriphButton text="Save Receipt" onPress={onDownload} loading={loading} />
        </View>
      </View>
    </View>
  );
};

export default GenerateReciept;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  greeting: {
    ...Fonts.TextBold,
    fontSize: 16,
    paddingBottom: 20,
  },
  content: {
    marginHorizontal: 15,
  },
  thankYou: {
    ...Fonts.TextBold,
    fontSize: 16,
    // paddingBottom: 10,
  },
  enjoyedRide: {
    fontSize: 14,
    paddingBottom: 10,
    color: Colors.whiteColor,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    ...Fonts.Regular,
    fontSize: 14,
  },
  value: {
    color: Colors.whiteColor,
    ...Fonts.GrandLight,
    fontSize: 14,
  },
  title: {
    ...Fonts.GrandMedium,
    fontSize: 16,
    marginVertical: 10,
  },
  image: {
    marginBottom: 10,
    // paddingHorizontal: 40,
  },
});
