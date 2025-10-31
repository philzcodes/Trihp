import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.yellow,
        tabBarInactiveTintColor: '#ffffff',
        tabBarStyle: {
          backgroundColor: 'transparent',
          // borderTopWidth: 1,
          // borderTopColor: Colors.whiteColor,
          height: 80,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#292929', '#8F8F8F']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 5,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/images/homeicon.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/images/menuicon.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Payment"
        options={{
          title: 'Payment',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/images/wallet.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/images/usericon.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
