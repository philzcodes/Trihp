import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image, Platform, Pressable,
    StyleSheet, Text, View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import UserIcon from '../../assets/images/UserIcon';
import Back from '../../assets/svgIcons/Back';
import PaymentModal from '../../components/Modals/PaymentTypeModal';
import TriphButton from '../../components/TriphButton';
import { Colors, Fonts } from '../../constants';
import Constant from '../../helper/Constant';
import { GOOGLE_MAPS_APIKEY } from '../../utils/Api';

const RideSelection = ({ route }) => {
  const router = useRouter();
  const rideInfo = route?.params?.info;
  const mapRef = useRef(null);
  
  // Payment methods
  const paymentMode = [
    { id: '1', image: require('../../assets/images/paymentMode/cash.png'), name: 'cash', label: 'Cash' },
    { id: '2', image: require('../../assets/images/paymentMode/wallet.png'), name: 'wallet', label: 'Trihp Wallet' },
    { id: '3', image: require('../../assets/images/paymentMode/card.png'), name: 'card', label: 'Credit / Debit Card' },
    { id: '4', image: require('../../assets/images/paymentMode/afrimoney.png'), name: 'afrimoney', label: 'AfriMoney' },
  ];

  // State
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [duration, setDuration] = useState('');
  const [arrivalTime, setArrivalTime] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(paymentMode[0]);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [region, setRegion] = useState(null);
  
  const originCoordinates = rideInfo?.originCoordinates;
  const destinationCoordinates = rideInfo?.destinationCoordinates;

  // Fit map to markers
  useEffect(() => {
    if (mapRef.current && originCoordinates && destinationCoordinates) {
      mapRef.current.fitToCoordinates([originCoordinates, destinationCoordinates], {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  }, [originCoordinates, destinationCoordinates]);

  // Fetch vehicles when region is available
  useEffect(() => {
    if (region) {
      fetchVehicles();
    }
  }, [region]);

  // Get drivers when vehicle is selected
  useEffect(() => {
    if (selectedVehicle) {
      getDriverNearMe();
    }
  }, [selectedVehicle]);

  // Calculate arrival time
  useEffect(() => {
    if (duration) {
      const matches = duration.match(/(\d+) hour|(\d+) mins/g);
      let durationInSeconds = 0;
      
      if (matches) {
        matches.forEach((match) => {
          const parts = match.split(' ');
          if (parts[1].toLowerCase().includes('hour')) {
            durationInSeconds += parseInt(parts[0]) * 3600;
          } else if (parts[1].toLowerCase().includes('min')) {
            durationInSeconds += parseInt(parts[0]) * 60;
          }
        });
        
        if (durationInSeconds > 0) {
          const estimatedArrival = new Date(Date.now() + durationInSeconds * 1000);
          setArrivalTime(estimatedArrival);
        }
      }
    }
  }, [duration]);

  const fetchVehicles = async () => {
    try {
      const ut = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(ut)?.token;
      const response = await axios.post(
        `${Constant.baseUrl}vehicle`,
        { distance: rideInfo?.distance || 5, region: JSON.stringify(region) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.status === 200) {
        setVehicles(response.data.data);
        setSelectedVehicle(response.data.data[0]);
      }
    } catch (err) {
      setError('Failed to load vehicles');
      console.error('Fetch vehicles error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDriverNearMe = async () => {
    if (!originCoordinates || !selectedVehicle) return;
    
    try {
      const ut = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(ut)?.token;
      const response = await axios.post(
        `${Constant.baseUrl}search-driver`,
        {
          pickup_latitude: originCoordinates.latitude,
          pickup_longitude: originCoordinates.longitude,
          vehicle_category_id: selectedVehicle.id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.status === 200) {
        setDrivers(response.data.data);
      }
    } catch (err) {
      console.error('Fetch drivers error:', err);
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleConfirmRide = () => {
    if (!selectedVehicle) return;
    
    router.push('/booking/PickupCnfrm', {
      orginCoordinates: originCoordinates,
      destinationCoordinates: destinationCoordinates,
      destinationLocation: rideInfo?.destinationLocation,
      orginLocation: rideInfo?.originLocation,
      paymentMethod: paymentMethod?.name,
      ride_category: selectedVehicle?.name,
      vehicle_category_id: selectedVehicle?.id,
      amount: selectedVehicle?.price,
      distances: rideInfo?.distance,
      book_fees: selectedVehicle?.book_fees,
      base_fare: selectedVehicle?.base_fare,
      per_kilometer: selectedVehicle?.per_kilometer,
    });
  };

  const renderVehicleItem = ({ item }) => (
    <Pressable
      style={[
        styles.vehicleItem,
        selectedVehicle?.id === item.id && styles.selectedVehicle
      ]}
      onPress={() => {
        setSelectedVehicle(item);
        const hasDrivers = drivers.some(d => d.vehicle_category_id === item.id);
        if (!hasDrivers) {
          Alert.alert('No Drivers', 'No available drivers for this vehicle type');
        }
      }}
    >
      <Image 
        source={{ uri: item.vehicle_image }} 
        style={styles.vehicleImage} 
      />
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName}>{item.name}</Text>
        <View style={styles.vehicleMeta}>
          <UserIcon width={12} />
          <Text style={styles.vehicleSeats}>{item.person_seat}</Text>
          <Text style={styles.vehicleTime}>
            {formatTime(arrivalTime)} - {Math.floor(Math.random() * 5) + 1} min
          </Text>
        </View>
      </View>
      <Text style={styles.vehiclePrice}>
        {item.price.toFixed(0)} FCFA
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: originCoordinates.latitude,
          longitude: originCoordinates.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={originCoordinates}>
          <Image 
            source={require('../../assets/images/originLocation.png')} 
            style={styles.markerImage}
          />
        </Marker>
        
        <Marker coordinate={destinationCoordinates}>
          <Image 
            source={require('../../assets/images/destinationMarker.png')} 
            style={styles.markerImage}
          />
        </Marker>

        {drivers.map(driver => (
          <Marker
            key={driver.id}
            coordinate={{
              latitude: parseFloat(driver.latitude),
              longitude: parseFloat(driver.longitude)
            }}
          >
            <Image
              source={
                driver.vehicle_category_id === 1 ? require('../../assets/images/TopCar.png') :
                driver.vehicle_category_id === 2 ? require('../../assets/images/TopBike.png') :
                driver.vehicle_category_id === 3 ? require('../../assets/images/TopAuto.png') :
                require('../../assets/images/TopLite.png')
              }
              style={styles.driverMarker}
            />
          </Marker>
        ))}

        {originCoordinates && destinationCoordinates && (
          <MapViewDirections
            origin={originCoordinates}
            destination={destinationCoordinates}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor={Colors.primaryColor}
            onReady={(result) => setDuration(result.duration + ' mins')}
          />
        )}
      </MapView>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Back />
      </Pressable>

      <View style={styles.vehicleListContainer}>
        <Text style={styles.sectionTitle}>Choose Your Ride</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color={Colors.whiteColor} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TriphButton 
              text="Retry" 
              onPress={fetchVehicles}
              style={styles.retryButton}
            />
          </View>
        ) : (
          <FlatList
            data={vehicles}
            renderItem={renderVehicleItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.vehicleList}
          />
        )}
      </View>

      <View style={styles.paymentContainer}>
        <Pressable 
          style={styles.paymentMethod} 
          onPress={() => setPaymentModalVisible(true)}
        >
          <Image 
            source={paymentMethod.image} 
            style={styles.paymentIcon} 
          />
          <Text style={styles.paymentText}>{paymentMethod.label}</Text>
          <Icon name="keyboard-arrow-right" size={24} color="#fff" />
        </Pressable>

        <TriphButton
          text={`Confirm ${selectedVehicle?.name || 'Ride'}`}
          onPress={handleConfirmRide}
          disabled={!selectedVehicle}
        />
      </View>

      <PaymentModal
        visible={paymentModalVisible}
        setVisible={setPaymentModalVisible}
        paymentMethods={paymentMode}
        selectedMethod={paymentMethod}
        onSelect={setPaymentMethod}
      />

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.whiteColor} />
          <Text style={styles.loaderText}>Finding available rides...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  map: {
    width: '100%',
    height: '50%',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  markerImage: {
    width: 40,
    height: 40,
  },
  driverMarker: {
    width: 50,
    height: 50,
  },
  vehicleListContainer: {
    backgroundColor: Colors.blackColor,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  sectionTitle: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  vehicleList: {
    paddingBottom: 120,
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: Colors.grey12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedVehicle: {
    borderColor: Colors.yellow,
  },
  vehicleImage: {
    width: 60,
    height: 40,
    marginRight: 15,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    ...Fonts.Medium,
    color: Colors.whiteColor,
    fontSize: 16,
  },
  vehicleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  vehicleSeats: {
    ...Fonts.Regular,
    color: Colors.grey,
    fontSize: 12,
    marginLeft: 5,
    marginRight: 15,
  },
  vehicleTime: {
    ...Fonts.Regular,
    color: Colors.grey,
    fontSize: 12,
  },
  vehiclePrice: {
    ...Fonts.Medium,
    color: Colors.whiteColor,
    fontSize: 16,
  },
  paymentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.grey12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.grey,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  paymentIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  paymentText: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    fontSize: 16,
    flex: 1,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    marginTop: 15,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    ...Fonts.Regular,
    color: Colors.whiteColor,
    marginBottom: 15,
  },
  retryButton: {
    width: 120,
  },
});

export default RideSelection;
