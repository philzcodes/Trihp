// Test file for pricing integration
// This file demonstrates how to use the new pricing API integration

import { rideRequestAPI } from '../api/rideRequestAPI';
import PricingHelper from '../helper/pricingHelper';

// Test pricing calculation
export const testPricingIntegration = async () => {
  console.log('Testing pricing integration...');

  try {
    // Test data
    const testParams = {
      pickupLatitude: 4.8666,
      pickupLongitude: 6.9745,
      dropOffLatitude: 4.8766,
      dropOffLongitude: 6.9845,
      vehicleType: 'CAR',
      estimatedDistance: 5.0,
      estimatedDuration: 15,
    };

    // Test 1: Calculate price for single vehicle
    console.log('Test 1: Single vehicle pricing');
    const singleResult = await PricingHelper.calculatePrice(testParams);
    console.log('Single vehicle result:', singleResult);

    // Test 2: Calculate prices for multiple vehicles
    console.log('Test 2: Multiple vehicle pricing');
    const vehicleTypes = ['CAR', 'BIKE', 'KEKE'];
    const multipleResults = await PricingHelper.calculatePricesForVehicles(testParams, vehicleTypes);
    console.log('Multiple vehicle results:', multipleResults);

    // Test 3: Test fallback pricing
    console.log('Test 3: Fallback pricing');
    const fallbackPrice = PricingHelper.getFallbackPrice('CAR', 5);
    console.log('Fallback price for CAR:', fallbackPrice);

    // Test 4: Format pricing result
    console.log('Test 4: Format pricing result');
    const formatted = PricingHelper.formatPricingResult(singleResult);
    console.log('Formatted result:', formatted);

    console.log('All tests completed successfully!');
    return true;
  } catch (error) {
    console.error('Pricing integration test failed:', error);
    return false;
  }
};

// Test API endpoints directly
export const testAPIEndpoints = async () => {
  console.log('Testing API endpoints...');

  try {
    // Test calculate price endpoint
    const pricingData = {
      pickupLatitude: 4.8666,
      pickupLongitude: 6.9745,
      dropOffLatitude: 4.8766,
      dropOffLongitude: 6.9845,
      vehicleType: 'CAR',
    };

    const result = await rideRequestAPI.calculatePrice(pricingData);
    console.log('API calculate price result:', result);

    // Test get available services
    const services = await rideRequestAPI.getAvailableServices();
    console.log('Available services:', services);

    // Test get available regions
    const regions = await rideRequestAPI.getAvailableRegions();
    console.log('Available regions:', regions);

    console.log('API endpoint tests completed successfully!');
    return true;
  } catch (error) {
    console.error('API endpoint test failed:', error);
    return false;
  }
};

// Usage example for RideSelection component
export const exampleUsage = () => {
  console.log('Example usage for RideSelection component:');
  
  const exampleCode = `
  // In RideSelection component:
  
  // 1. Calculate pricing for all vehicles
  const calculateVehiclePricing = async () => {
    const allVehicles = [...vehicles, ...moreVehicles];
    const vehicleTypes = allVehicles.map(v => v.type);
    
    const pricingParams = {
      pickupLatitude: origin.latitude,
      pickupLongitude: origin.longitude,
      dropOffLatitude: destination.latitude,
      dropOffLongitude: destination.longitude,
      estimatedDistance: distance,
      estimatedDuration: duration,
    };
    
    const pricingResults = await PricingHelper.calculatePricesForVehicles(
      pricingParams,
      vehicleTypes
    );
    
    const pricingMap = {};
    pricingResults.forEach(result => {
      pricingMap[result.vehicleType] = PricingHelper.formatPricingResult(result);
    });
    
    setVehiclePricing(pricingMap);
  };
  
  // 2. Get price for a specific vehicle
  const getVehiclePrice = (vehicle) => {
    const pricing = vehiclePricing[vehicle.type];
    if (pricing && !pricing.error) {
      return pricing.totalFare;
    }
    return PricingHelper.getFallbackPrice(vehicle.type, distance);
  };
  `;
  
  console.log(exampleCode);
};

export default {
  testPricingIntegration,
  testAPIEndpoints,
  exampleUsage,
};
