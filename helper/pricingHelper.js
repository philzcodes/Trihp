import { pricingAPI } from '../api/services';

// Simple in-memory cache for pricing results
const pricingCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Generate cache key for pricing request
 */
function generateCacheKey(params) {
  return `${params.pickupLatitude},${params.pickupLongitude},${params.dropOffLatitude},${params.dropOffLongitude},${params.vehicleType}`;
}

/**
 * Check if cached result is still valid
 */
function isCacheValid(timestamp) {
  return Date.now() - timestamp < CACHE_DURATION;
}

/**
 * Pricing utility helper for ride calculations
 */
export class PricingHelper {
  /**
   * Calculate price for a vehicle type and route
   * @param {Object} params - Pricing parameters
   * @param {number} params.pickupLatitude - Pickup latitude
   * @param {number} params.pickupLongitude - Pickup longitude
   * @param {number} params.dropOffLatitude - Drop-off latitude
   * @param {number} params.dropOffLongitude - Drop-off longitude
   * @param {string} params.vehicleType - Vehicle type (CAR, BIKE, KEKE, etc.)
   * @param {number} [params.estimatedDistance] - Optional estimated distance
   * @param {number} [params.estimatedDuration] - Optional estimated duration
   * @param {string} [params.serviceId] - Optional service ID
   * @param {string} [params.regionId] - Optional region ID
   * @returns {Promise<Object>} Pricing calculation result
   */
  static async calculatePrice(params) {
    try {
      // Check cache first
      const cacheKey = generateCacheKey(params);
      const cached = pricingCache.get(cacheKey);
      
      if (cached && isCacheValid(cached.timestamp)) {
        console.log('Using cached pricing result for', params.vehicleType);
        return cached.data;
      }

      console.log('Calculating fresh pricing for', params.vehicleType);
      const pricingData = {
        pickupLatitude: params.pickupLatitude,
        pickupLongitude: params.pickupLongitude,
        dropOffLatitude: params.dropOffLatitude,
        dropOffLongitude: params.dropOffLongitude,
        vehicleType: params.vehicleType,
        ...(params.estimatedDistance && { estimatedDistance: params.estimatedDistance }),
        ...(params.estimatedDuration && { estimatedDuration: params.estimatedDuration }),
        ...(params.serviceId && { serviceId: params.serviceId }),
        ...(params.regionId && { regionId: params.regionId }),
      };

      // If no serviceId or regionId provided, use default region and get serviceId
      if (!pricingData.serviceId && !pricingData.regionId) {
        const defaultRegionId = this.getDefaultRegionId();
        pricingData.regionId = defaultRegionId;
        pricingData.serviceId = this.getServiceIdForVehicle(params.vehicleType, defaultRegionId);
        console.log(`Using default region ${defaultRegionId} and service ${pricingData.serviceId} for ${params.vehicleType}`);
      }

      const result = await pricingAPI.calculatePrice(pricingData);
      
      // Cache the result
      pricingCache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });
      
      return result;
    } catch (error) {
      console.error('PricingHelper.calculatePrice error:', error);
      throw error;
    }
  }

  /**
   * Calculate prices for multiple vehicle types with throttling
   * @param {Object} params - Base pricing parameters
   * @param {Array<string>} vehicleTypes - Array of vehicle types to calculate
   * @returns {Promise<Array>} Array of pricing results for each vehicle type
   */
  static async calculatePricesForVehicles(params, vehicleTypes) {
    try {
      // Process vehicles in batches to avoid overwhelming the API
      const batchSize = 2; // Process 2 vehicles at a time
      const results = [];
      
      for (let i = 0; i < vehicleTypes.length; i += batchSize) {
        const batch = vehicleTypes.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (vehicleType) => {
          try {
            // Add delay between requests to avoid rate limiting
            if (i > 0) {
              await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
            }
            
            const result = await this.calculatePrice({
              ...params,
              vehicleType,
            });
            return {
              vehicleType,
              ...result,
            };
          } catch (error) {
            console.error(`Error calculating price for ${vehicleType}:`, error);
            // Return fallback pricing for this vehicle type
            return {
              vehicleType,
              totalFare: this.getFallbackPrice(vehicleType, params.estimatedDistance || 5),
              error: error.message,
            };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // Add delay between batches
        if (i + batchSize < vehicleTypes.length) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between batches
        }
      }

      return results;
    } catch (error) {
      console.error('PricingHelper.calculatePricesForVehicles error:', error);
      throw error;
    }
  }

  /**
   * Get fallback pricing when API fails
   * @param {string} vehicleType - Vehicle type
   * @param {number} distance - Distance in km
   * @returns {number} Fallback price
   */
  static getFallbackPrice(vehicleType, distance = 5) {
    const fallbackPricing = {
      CAR: { base: 50, perKm: 25 },
      BIKE: { base: 25, perKm: 12 },
      KEKE: { base: 30, perKm: 15 },
      LITE: { base: 40, perKm: 20 },
      LUXE: { base: 80, perKm: 40 },
      SUV: { base: 70, perKm: 35 },
    };

    const pricing = fallbackPricing[vehicleType] || fallbackPricing.CAR;
    return Math.round(pricing.base + (distance * pricing.perKm));
  }

  /**
   * Format pricing result for display
   * @param {Object} pricingResult - Result from calculatePrice
   * @returns {Object} Formatted pricing data
   */
  static formatPricingResult(pricingResult) {
    return {
      totalFare: Math.round(pricingResult.totalFare || 0),
      baseFare: Math.round(pricingResult.baseFare || 0),
      distanceCharge: Math.round(pricingResult.distanceCharge || 0),
      timeCharge: Math.round(pricingResult.timeCharge || 0),
      surgeMultiplier: pricingResult.surgeMultiplier || 1.0,
      surgeCharge: Math.round(pricingResult.surgeCharge || 0),
      tax: Math.round(pricingResult.tax || 0),
      bookingFee: Math.round(pricingResult.bookingFee || 0),
      estimatedDistance: pricingResult.estimatedDistance || 0,
      estimatedDuration: pricingResult.estimatedDuration || 0,
      vehicleType: pricingResult.vehicleType,
      serviceId: pricingResult.serviceId,
      serviceName: pricingResult.serviceName,
      pricingBreakdown: pricingResult.pricingBreakdown || {},
    };
  }

  /**
   * Get available services for a region
   * @param {string} [regionId] - Optional region ID
   * @returns {Promise<Array>} Available services
   */
  static async getAvailableServices(regionId = null) {
    try {
      return await pricingAPI.getAvailableServices(regionId);
    } catch (error) {
      console.error('PricingHelper.getAvailableServices error:', error);
      throw error;
    }
  }

  /**
   * Get available regions
   * @returns {Promise<Array>} Available regions
   */
  static async getAvailableRegions() {
    try {
      return await pricingAPI.getAvailableRegions();
    } catch (error) {
      console.error('PricingHelper.getAvailableRegions error:', error);
      throw error;
    }
  }

  /**
   * Get default region ID (for fallback)
   * @returns {string} Default region ID
   */
  static getDefaultRegionId() {
    return 'default-region';
  }

  /**
   * Get service ID for a specific vehicle type and region
   * @param {string} vehicleType - Vehicle type
   * @param {string} regionId - Region ID
   * @returns {string} Service ID
   */
  static getServiceIdForVehicle(vehicleType, regionId = 'default-region') {
    const serviceMap = {
      'default-region': {
        'CAR': 'default-car-service',
        'BIKE': 'default-bike-service',
        'KEKE': 'default-keke-service',
        'LITE': 'default-lite-service',
        'LUXE': 'default-luxe-service',
        'SUV': 'default-suv-service',
      },
      'lagos-region': {
        'CAR': 'lagos-car-service',
        'BIKE': 'lagos-bike-service',
        'KEKE': 'lagos-keke-service',
        'LITE': 'lagos-lite-service',
        'LUXE': 'lagos-luxe-service',
        'SUV': 'lagos-suv-service',
      },
      'abuja-region': {
        'CAR': 'abuja-car-service',
        'BIKE': 'abuja-bike-service',
        'KEKE': 'abuja-keke-service',
        'LITE': 'abuja-lite-service',
        'LUXE': 'abuja-luxe-service',
        'SUV': 'abuja-suv-service',
      },
    };

    const regionServices = serviceMap[regionId] || serviceMap['default-region'];
    return regionServices[vehicleType] || regionServices['CAR'];
  }

  /**
   * Clear pricing cache
   */
  static clearCache() {
    pricingCache.clear();
    console.log('Pricing cache cleared');
  }

  /**
   * Get cache statistics
   */
  static getCacheStats() {
    return {
      size: pricingCache.size,
      keys: Array.from(pricingCache.keys()),
    };
  }

  /**
   * Check if we should use fallback pricing based on error type
   */
  static shouldUseFallback(error) {
    const errorMessage = error.message || error.toString();
    return errorMessage.includes('Too many requests') || 
           errorMessage.includes('rate limit') ||
           errorMessage.includes('timeout') ||
           errorMessage.includes('network') ||
           errorMessage.includes('Service is busy') ||
           error.isRateLimit === true;
  }
}

export default PricingHelper;
