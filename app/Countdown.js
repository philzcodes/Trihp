import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function CountdownScreen() {
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 23,
    minutes: 45,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-11-12T00:00:00');
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Image Placeholder */}
        <View style={styles.imageContainer}>
            
          <Image source={require('../assets/countdown-image.png')} style={{width: '100%', height: '100%'}} />
        </View>

       <View style={{position: 'absolute', top: 30, alignItems: 'center', justifyContent: 'center', width: '100%'}}><Text style={{ fontSize: 32, fontWeight: '600', color: 'black'}}>T R I H P</Text></View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.welcomeText}>
            Trihp is Thrilled to have you onboard
          </Text>
          
          <Text style={styles.descriptionText}>
            You're now part of a network that's all about making transportation safe, reliable, and hassle free.
          </Text>

          <Text style={styles.serviceStartText}>
            Service Starting 12th Nov 2025
          </Text>

          {/* Countdown Timer */}
          <View style={styles.timerContainer}>
            <View style={styles.timeUnit}>
              <Text style={styles.timeLabel}>Days</Text>
              <Text style={styles.timeValue}>{timeLeft.days}</Text>
            </View>
            
            <Text style={styles.timeSeparator}>:</Text>
            
            <View style={styles.timeUnit}>
              <Text style={styles.timeLabel}>Hour</Text>
              <Text style={styles.timeValue}>{String(timeLeft.hours).padStart(2, '0')}</Text>
            </View>
            
            <Text style={styles.timeSeparator}>:</Text>
            
            <View style={styles.timeUnit}>
              <Text style={styles.timeLabel}>Min</Text>
              <Text style={styles.timeValue}>{String(timeLeft.minutes).padStart(2, '0')}</Text>
            </View>
            
            <Text style={styles.timeSeparator}>:</Text>
            
            <View style={styles.timeUnit}>
              <Text style={styles.timeLabel}>Sec</Text>
              <Text style={styles.timeValue}>{String(timeLeft.seconds).padStart(2, '0')}</Text>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton}>
            <Feather name="log-out" size={18} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    height: 350,
    
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imagePlaceholderText: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
  },
  bottomSection: {
    backgroundColor: '#000000',
    paddingHorizontal: 10,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 21,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    // letterSpacing: 0.3,
  },
  descriptionText: {
    fontSize: 15,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  serviceStartText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FFDE59',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  timeUnit: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
    fontWeight: '400',
  },
  timeValue: {
    fontSize: 48,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  timeSeparator: {
    fontSize: 48,
    fontWeight: '300',
    color: '#FFFFFF',
    marginHorizontal: 8,
    marginTop: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    paddingLeft: 10,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
});