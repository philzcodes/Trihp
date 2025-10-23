# Mobile App Pricing Integration

This document describes the implementation of dynamic pricing integration in the Trihp mobile app, replacing hardcoded pricing with API-based calculations.

## Overview

The mobile app now uses the backend pricing API to calculate ride fares dynamically based on:
- Pickup and dropoff locations
- Vehicle type
- Distance and duration
- Surge pricing
- Regional pricing variations

## Files Modified

### 1. API Constants (`api/constants.js`)
Added new pricing endpoints:
```javascript
// Pricing endpoints
calculatePrice: 'ride-request/calculate-price',
getAvailableServices: 'ride-request/pricing/services',
getAvailableRegions: 'ride-request/pricing/regions',
```

### 2. API Services (`api/services.js`)
Added `pricingAPI` with methods:
- `calculatePrice(pricingData)` - Calculate fare for a ride
- `getAvailableServices(regionId)` - Get available services
- `getAvailableRegions()` - Get available regions

### 3. Pricing Helper (`helper/pricingHelper.js`)
Created utility class with methods:
- `calculatePrice(params)` - Calculate price for single vehicle
- `calculatePricesForVehicles(params, vehicleTypes)` - Calculate prices for multiple vehicles
- `getFallbackPrice(vehicleType, distance)` - Get fallback pricing when API fails
- `formatPricingResult(result)` - Format API response for display
- `getAvailableServices(regionId)` - Get available services
- `getAvailableRegions()` - Get available regions

### 4. Ride Selection Component (`app/booking/RideSelection.js`)
Major updates:
- Removed hardcoded vehicle pricing
- Added API-based pricing calculation
- Added loading states for pricing
- Added error handling with fallback pricing
- Updated vehicle selection to use API pricing

### 5. Ride Request API (`api/rideRequestAPI.js`)
Added pricing endpoints for consistency.

## Key Features

### 1. Dynamic Pricing Calculation
```javascript
// Calculate pricing for all vehicles
const pricingResults = await PricingHelper.calculatePricesForVehicles(
  {
    pickupLatitude: origin.latitude,
    pickupLongitude: origin.longitude,
    dropOffLatitude: destination.latitude,
    dropOffLongitude: destination.longitude,
    estimatedDistance: distance,
    estimatedDuration: duration,
  },
  ['CAR', 'BIKE', 'KEKE', 'LITE', 'LUXE', 'SUV']
);
```

### 2. Fallback Pricing
When API calls fail, the app falls back to hardcoded pricing:
```javascript
const fallbackPrice = PricingHelper.getFallbackPrice('CAR', 5); // Returns fallback price
```

### 3. Loading States
The UI shows loading indicators while calculating prices:
```javascript
{isLoading ? (
  <ActivityIndicator size="small" color="#FFD700" />
) : (
  <Text style={styles.vehiclePrice}>${price}</Text>
)}
```

### 4. Error Handling
Graceful error handling with user feedback:
```javascript
{pricing?.error && (
  <Text style={styles.pricingError}>Using estimated pricing</Text>
)}
```

## API Integration Flow

1. **User selects pickup/dropoff locations**
2. **App calls pricing API** with coordinates and vehicle types
3. **Backend calculates pricing** using service configurations
4. **App displays dynamic prices** for each vehicle type
5. **User selects vehicle** with accurate pricing
6. **App updates ride request** with pricing details

## Pricing Data Structure

### API Request
```javascript
{
  pickupLatitude: 4.8666,
  pickupLongitude: 6.9745,
  dropOffLatitude: 4.8766,
  dropOffLongitude: 6.9845,
  vehicleType: 'CAR',
  estimatedDistance: 5.0,
  estimatedDuration: 15,
  serviceId: 'optional-service-id',
  regionId: 'optional-region-id'
}
```

### API Response
```javascript
{
  baseFare: 2.0,
  perKMCharge: 1.5,
  perMinuteCharge: 0.3,
  estimatedDistance: 5.0,
  estimatedDuration: 15,
  distanceCharge: 7.5,
  timeCharge: 4.5,
  subtotal: 14.0,
  surgeMultiplier: 1.0,
  surgeCharge: 0,
  tax: 1.4,
  bookingFee: 1.0,
  totalFare: 16.4,
  serviceId: 'service-id',
  serviceName: 'Car Service',
  vehicleType: 'CAR',
  pricingBreakdown: {
    baseFare: 2.0,
    distanceCharge: 7.5,
    timeCharge: 4.5,
    surgeCharge: 0,
    tax: 1.4,
    bookingFee: 1.0,
    total: 16.4
  }
}
```

## Benefits

1. **Real-time Pricing**: Prices reflect current market conditions
2. **Regional Variations**: Different pricing for different regions
3. **Surge Pricing**: Dynamic pricing based on demand
4. **Service Flexibility**: Easy to add new vehicle types and pricing models
5. **Transparency**: Detailed pricing breakdown for users
6. **Fallback Support**: App continues to work even if API is unavailable

## Testing

Use the test file `helper/pricingIntegrationTest.js` to verify integration:

```javascript
import { testPricingIntegration, testAPIEndpoints } from '../helper/pricingIntegrationTest';

// Test pricing helper functions
await testPricingIntegration();

// Test API endpoints directly
await testAPIEndpoints();
```

## Future Enhancements

1. **Caching**: Cache pricing results to reduce API calls
2. **Real-time Updates**: Update prices when user changes route
3. **Promotional Pricing**: Support for discounts and promotions
4. **Multi-stop Rides**: Support for multiple pickup/dropoff points
5. **Scheduled Rides**: Different pricing for scheduled vs immediate rides
6. **Weather-based Pricing**: Factor in weather conditions
7. **Traffic-based Pricing**: Adjust pricing based on traffic conditions

## Migration Notes

- **Backward Compatibility**: App falls back to hardcoded pricing if API fails
- **Gradual Rollout**: Can be enabled/disabled via feature flags
- **Performance**: Pricing calculation happens asynchronously
- **User Experience**: Loading states prevent confusion during API calls

## Troubleshooting

### Common Issues

1. **API Timeout**: App uses fallback pricing
2. **Network Issues**: Graceful degradation to hardcoded pricing
3. **Invalid Coordinates**: Validation prevents API calls with invalid data
4. **Service Unavailable**: Fallback pricing ensures app functionality

### Debug Information

Enable console logging to debug pricing issues:
```javascript
console.log('Pricing calculation:', pricingData);
console.log('API response:', result);
console.log('Fallback pricing:', fallbackPrice);
```
