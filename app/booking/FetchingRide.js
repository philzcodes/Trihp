import BottomSheet from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import PaymentModal from '../../components/Modals/PaymentTypeModal';
import TriphButton from '../../components/TriphButton';
import { Colors, Fonts } from '../../constants';
import Constant from '../../helper/Constant';

const FetchingRide = (props) => {
  const paymentMode = [
    { id: '1', image: require('../../assets/images/paymentMode/cash.png'), name: 'cash', label: 'Cash' },
    { id: '2', image: require('../../assets/images/paymentMode/wallet.png'), name: 'wallet', label: 'Trihp Wallet' },
    { id: '3', image: require('../../assets/images/paymentMode/card.png'), name: 'card', label: 'Credit / Debit Card' },
    { id: '4', image: require('../../assets/images/paymentMode/afrimoney.png'), name: 'afrimoney', label: 'AfriMoney' },
  ];
  
  const { info: data } = props.route?.params || {};
  const rideId = data?.id;
  const mapRef = useRef(null);
  const router = useRouter();
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['30', '50%', '65%'], []);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);
  const [isFetching, setIsFetching] = useState(true);
  const intervalIdRef = useRef(null);
  const timeoutIdRef = useRef(null);
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const aspectRatio = width / height;
  const latitudeDelta = 0.01;
  const longitudeDelta = latitudeDelta * aspectRatio;
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(data?.payment_type ? paymentMode.find((item) => item.name === data.payment_type) : '');

  const region = useMemo(
    () => ({
      latitude: data?.pickup_latitude,
      longitude: data?.pickup_longitude,
      latitudeDelta,
      longitudeDelta,
    }),
    [data, latitudeDelta, longitudeDelta]
  );

  const handleBottomSheetChange = (index) => {
    setBottomSheetHeight(height * 0.3);
  };

  const mapHeight = height - bottomSheetHeight;

  const getRideDetails = useCallback(async () => {
    try {
      const userDetail = await AsyncStorage.getItem('userDetail');
      const { token } = JSON.parse(userDetail);
      const Url = `${Constant.baseUrl}driver-detail`;
      const res = await axios.post(Url, { id: rideId }, { headers: { Authorization: `Bearer ${token}` } });
      if (res?.data?.status === 200 && res?.data?.driver) {
        setIsFetching(false);
        clearInterval(intervalIdRef.current);
        clearTimeout(timeoutIdRef.current);
        router.push('/booking/DriverFoundScreen', { data: res?.data });
      }
    } catch (error) {
      console.error('Error fetching driver details:', error?.response?.data);
    }
  }, [rideId, router]);

  useEffect(() => {
    if (!isFetching) return;

    intervalIdRef.current = setInterval(() => {
      getRideDetails();
    }, 2000);

    timeoutIdRef.current = setTimeout(() => {
      clearInterval(intervalIdRef.current);
    }, 120000);

    return () => {
      clearInterval(intervalIdRef.current);
      clearTimeout(timeoutIdRef.current);
    };
  }, [getRideDetails, isFetching]);

  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
    setPaymentModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Use React Native Maps (Expo compatible) */}
      <MapView
        ref={mapRef}
        style={[styles.map, { height: mapHeight }]}
        provider={Platform.OS === 'android' ? 'google' : null}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker coordinate={region}>
          <Image 
            source={require('../../assets/images/pin.png')} 
            style={styles.markerImage} 
            resizeMode="contain" 
          />
        </Marker>
      </MapView>

      {/* Rest of your BottomSheet code remains exactly the same */}
      <BottomSheet
        ref={bottomSheetModalRef}
        index={2}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        handleIndicatorStyle={styles.bottomSheetIndicator}
        backgroundStyle={styles.bottomSheetBackground}
        enableOverDrag={false}
        bottomInset={insets.bottom}
        onChange={handleBottomSheetChange}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.modalTitle}>Confirming your Trip</Text>
          <Text style={styles.modalMessage}>Please wait while we find you a driver</Text>
          {isFetching && <LottieView source={require('../../assets/svgIcons/spinner.json')} autoPlay loop style={styles.lottie} />}
          
          <View style={styles.locationContainer}>
            <Icon name="location-pin" size={20} color={Colors.whiteColor} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationText}>{data?.pickup_location_name}</Text>
            </View>
            <Pressable onPress={() => router.push('/booking/SearchScreen')}>
              <Text style={styles.addOrChangeText}>Add or Change</Text>
            </Pressable>
          </View>

          <View>
            <View style={styles.paymentHeader}>
              <Pressable style={styles.paymentPressable} onPress={() => setPaymentModal(true)}>
                <View style={styles.paymentMethodContainer}>
                  <Image source={paymentMethod?.image} style={styles.paymentImage} resizeMode="contain" />
                  <Text style={styles.paymentMethodName}>{paymentMethod?.name}</Text>
                  <Icon name="keyboard-arrow-right" size={30} color="#fff" />
                </View>
              </Pressable>
              <Text style={styles.paymentText}>${data?.amount}</Text>
            </View>
            
            <TriphButton
              text="Cancel Trip"
              extraStyle={[styles.tripButton]}
              onPress={() => router.push('/booking/RideCancelScreen', { isFetching: isFetching, rideId: rideId })}
              bgColor={{ backgroundColor: Colors.red }}
            />
          </View>
        </View>
      </BottomSheet>

      <PaymentModal
        visible={paymentModal}
        setVisible={setPaymentModal}
        amount={data?.amount}
        isWallet={false}
        selectedPaymentMethod={paymentMethod}
        setSelectedPaymentMethod={handlePaymentMethod}
      />
    </View>
  );
};

// Your styles remain exactly the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  map: {
    width: '100%',
  },
  markerImage: {
    width: 40,
    height: 40,
  },
  bottomSheetIndicator: {
    backgroundColor: Colors.grey,
  },
  bottomSheetBackground: {
    backgroundColor: Colors.blackColor,
    borderRadius: 35,
  },
  bottomSheetContent: {
    paddingVertical: 10,
  },
  modalTitle: {
    ...Fonts.Regular,
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'center',
    color: Colors.whiteColor,
  },
  modalMessage: {
    ...Fonts.GrandLight,
    fontSize: 13,
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.grey14,
  },
  lottie: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey14,
    borderColor: Colors.grey12,
    padding: 10,
    paddingVertical: 20,
  },
  locationTextContainer: {
    flex: 1,
    paddingRight: 15,
  },
  locationText: {
    ...Fonts.Regular,
    fontSize: 13,
    color: Colors.whiteColor,
    marginLeft: 10,
  },
  addOrChangeText: {
    ...Fonts.Medium,
    fontSize: 15,
    color: Colors.blueDark2,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: Colors.grey12,
    justifyContent: 'space-between',
  },
  paymentPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentText: {
    ...Fonts.Regular,
    fontSize: 30,
    color: Colors.whiteColor,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentImage: {
    height: 25,
    width: 25,
  },
  paymentMethodName: {
    ...Fonts.Regular,
    fontSize: 16,
    marginLeft: 10,
    textTransform: 'capitalize',
    color: Colors.whiteColor,
  },
  tripButton: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
});

export default FetchingRide;
