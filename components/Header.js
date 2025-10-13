import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '../constants';

const Header = ({ user }) => {
  const router = useRouter();
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  const options = [
    {
      id: 1,
      icon: 'home',
      title: 'Home',
      screen: '/',
    },
    {
      id: 2,
      icon: 'person',
      title: 'Account',
      screen: '/account',
    },
    {
      id: 3,
      icon: 'build',
      title: 'Services',
      screen: '/services',
    },
    {
      id: 4,
      icon: 'card',
      title: 'Payment',
      screen: '/payment',
    },
    {
      id: 5,
      icon: 'time',
      title: 'My Ride History',
      screen: '/ride-history',
    },
    {
      id: 6,
      icon: 'help',
      title: 'Help Center',
      screen: '/help',
    },
    {
      id: 7,
      icon: 'people',
      title: 'Refer a Friend',
      screen: '/refer',
    },
  ];

  const handleNavigation = (screen) => {
    closeDropdown();
    router.push(screen);
  };

  return (
    <View style={{ marginTop: Platform.OS === 'ios' ? 0 : 20 }}>
      <View style={[styles.container, { paddingBottom: 15 }]}>
        <View style={styles.container}>
          <Pressable onPress={() => router.push('/account')}>
            {user?.image ? (
              <View style={styles.image}>
                {/* <Image source={{ uri: user?.image }} resizeMode="contain" style={styles.image} /> */}
              </View>
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                  {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </View>
            )}
          </Pressable>
          <Text style={styles.title}>Hello, {user?.first_name || 'User'}</Text>
        </View>
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
            <Text style={styles.menuText}>Menu</Text>
            <Ionicons name="chevron-down" size={10} color="#fff" />
          </TouchableOpacity>
          
          {isDropdownVisible && (
            <View style={styles.dropdownMenu}>
              <FlatList
                data={options}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                  const isLastItem = index === options.length - 1;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.menuItem,
                        !isLastItem && styles.menuItemWithBorder,
                      ]}
                      onPress={() => handleNavigation(item?.screen)}
                    >
                      <View style={styles.menuItemContent}>
                        <Ionicons name={item.icon} size={20} color={Colors.whiteColor} />
                        <Text style={styles.menuItemText}>
                          {item.title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
  },
  image: {
    height: 45,
    width: 45,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#fff',
  },
  placeholder: {
    height: 45,
    width: 45,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightBlack,
  },
  placeholderText: {
    ...Fonts.GrandLight,
    fontSize: 20,
    color: Colors.whiteColor,
  },
  title: {
    ...Fonts.GrandLight,
    fontSize: 16,
    marginLeft: 15,
    color: Colors.whiteColor,
  },
  dropdownWrapper: {
    position: 'relative',
  },
  dropdownButton: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.whiteColor,
    backgroundColor: Colors.lightBlack,
  },
  menuText: {
    ...Fonts.GrandLight,
    paddingTop: 3,
    marginRight: 10,
    color: Colors.whiteColor,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: Colors.lightBlack,
    borderRadius: 12,
    paddingVertical: 8,
    width: 200,
    maxHeight: 400,
    borderWidth: 0.3,
    borderColor: Colors.grey13,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemWithBorder: {
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.grey13,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    ...Fonts.Medium,
    fontSize: 14,
    color: Colors.whiteColor,
    marginLeft: 12,
  },
});
