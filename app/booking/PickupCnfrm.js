import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Back from '../../assets/svgIcons/Back';
import TriphButton from '../../components/TriphButton';
import { Colors, Fonts } from '../../constants';
import Constant from '../../helper/Constant';
import Loader from '../../helper/Loader';
import { showWarning } from '../../helper/Toaster';
import customMapStyle from '../../utils/Map.json';

const PickupCnfrm = ({ route }) => {
  const data = route?.params;
  const mapRef = useRef(null);
  const { height } = useWindowDimensions();
  const mapHeight = height * 0.8;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [originCoordinates, setOriginCoordinates] = useState({
    latitude: data?.orginCoordinates?.latitude,
    longitude: data?.orginCoordinates?.longitude,
  });

  const [pickupLocation, setPickupLocation] = useState(data?.orginLocation);

  const region = {
    ...originCoordinates,
    latitudeDelta: 0.0037653946957192375,
    longitudeDelta: 0.001982487738132477,
  };

  const getAddressDestination = async (lat, long) => {
    try {
      let address = await Location.reverseGeocodeAsync({ latitude: lat, longitude: long });
      if (address.length > 0) {
        const formattedAddress = [
          address[0].name,
          address[0].street,
          address[0].city,
          address[0].region,
          address[0].country
        ].filter(Boolean).join(', ');
        setPickupLocation(formattedAddress);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const creatRide = async () => {
    try {
      setLoading(true);
      const userInfo = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(userInfo)?.token;
      const Url = Constant.baseUrl + Constant.createRide;
      const details = {
        pickup_latitude: originCoordinates?.latitude,
        pickup_longitude: originCoordinates?.longitude,
        drop_latitude: data?.destinationCoordinates?.latitude,
        drop_longitude: data?.destinationCoordinates?.longitude,
        pickup_location_name: pickupLocation,
        drop_location_name: data?.destinationLocation,
        pay_for: data?.paymentMethod,
        amount: data?.amount.toFixed(0),
        distance: data?.distances,
        ride_category: data?.vehicle_category_id,
        transaction_id: '',
        payment_type: data?.paymentMethod,
      };
      const response = await axios.post(Url, details, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.data?.status == 200) {
        console.log('response', response?.data);
        const datas = {
          ...details,
          id: response?.data?.some?.id,
        };
        router.push('/booking/FetchingRide', { info: datas });
      } else {
        throw new Error(response?.data?.message || 'Failed to create ride');
      }
    } catch (error) {
      console.error('Error creating ride:', error?.response?.data);
      showWarning('Failed to create ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        customMapStyle={customMapStyle}
        mapType="standard"
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        onRegionChangeComplete={(newRegion) => {
          setOriginCoordinates({
            latitude: newRegion?.latitude,
            longitude: newRegion?.longitude,
          });
          getAddressDestination(newRegion?.latitude, newRegion?.longitude);
        }}
        style={{ height: mapHeight, width: '100%' }}
        initialRegion={region}
      />
      <View style={{ position: 'absolute', top: '36%', left: '45%' }}>
        <Image source={require('../../assets/images/pin.png')} style={{ height: 50, aspectRatio: 1 }} resizeMode="contain" />
      </View>

      <Pressable style={[styles.backButton, { top: Platform.OS == 'ios' ? 60 : 20 }]} onPress={() => router.back()}>
        <Back />
      </Pressable>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
          backgroundColor: Colors.blackColor,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
      >
        <Text
          style={{
            ...Fonts.Regular,
            fontSize: 16,
            textAlign: 'center',
            padding: 20,
          }}
        >
          Confirm Your Pickup Location
        </Text>
        <View style={{ width: '100%', height: 1, backgroundColor: Colors.grey11 }} />
        {/* Confirm Pickup */}
        <View style={{ marginHorizontal: 20 }}>
          <View style={{ paddingVertical: 10, paddingHorizontal: 30, justifyItems: 'center' }}>
            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 20 }}>
              <Icon2 name="location" size={20} color={Colors.whiteColor} />
              <Text style={{ ...Fonts.Regular, color: Colors.whiteColor, textAlign: 'center' }}>{pickupLocation}</Text>
            </View>
            <Pressable
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginVertical: 10 }}
              onPress={() => router.push('/booking/SearchScreen')}
            >
              <View style={{ backgroundColor: Colors.grey11, padding: 5, borderRadius: 50 }}>
                <Icon2 name="add" size={20} color={Colors.whiteColor} />
              </View>
              <Text style={{ ...Fonts.GrandLight, color: Colors.whiteColor, marginLeft: 10 }}>Add or change</Text>
            </Pressable>
          </View>
          <TriphButton
            text="Confirm Pickup"
            onPress={() => {
              creatRide();
            }}
            extraStyle={styles.tripButton}
            extraTextStyle={{ color: Colors.blackColor }}
          />
        </View>
      </View>
      <Loader modalVisible={loading} setModalVisible={setLoading} />
    </View>
  );
};

export default PickupCnfrm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  tripButton: {
    marginVertical: 30,
  },
});
