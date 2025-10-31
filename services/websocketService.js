/**
 * WebSocket Service for Real-time Ride Updates using Socket.IO
 * 
 * This service provides real-time updates for ride status, driver location, ETA, etc.
 * Uses Socket.IO for WebSocket communication with the backend.
 * 
 * Usage:
 *   import { useRideWebSocket } from '../services/websocketService';
 *   
 *   const { rideData, driverData, status, error } = useRideWebSocket(rideId);
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

class WebSocketManager {
  constructor() {
    this.connections = new Map(); // Map<rideId, WebSocket>
    this.subscribers = new Map(); // Map<rideId, Set<callbacks>>
    this.reconnectAttempts = new Map(); // Map<rideId, number>
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000; // 3 seconds
  }

  /**
   * Get WebSocket URL for a ride
   */
  getWebSocketUrl(rideId) {
    // Import Constant dynamically to avoid circular dependencies
    const Constant = require('../api/constants').default || require('../api/constants');
    
    if (!Constant || !Constant.baseUrl) {
      console.warn('WebSocket: API base URL not configured');
      return null;
    }
    
    // Extract base server URL from the API endpoint
    // Example: http://10.216.76.57:3000/api/trihp/v1 -> http://10.216.76.57:3000
    let baseUrl = Constant.baseUrl;
    
    // Remove API path segments
    baseUrl = baseUrl.replace(/\/api\/trihp\/v1\/?$/, '');
    
    // If no protocol, add http:// (shouldn't happen but safety check)
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = `http://${baseUrl}`;
    }
    
    // Return base server URL (Socket.IO client will append namespace)
    // Socket.IO will connect to: baseUrl + /ride-updates
    return baseUrl;
  }

  /**
   * Connect to Socket.IO for a ride
   */
  connect(rideId, callbacks) {
    const wsUrl = this.getWebSocketUrl(rideId);
    
    if (!wsUrl) {
      console.warn('WebSocket not available - backend not configured');
      return null;
    }

    // If already connected, just add subscriber
    if (this.connections.has(rideId)) {
      const subscribers = this.subscribers.get(rideId) || new Set();
      subscribers.add(callbacks);
      this.subscribers.set(rideId, subscribers);
      return this.connections.get(rideId);
    }

    try {
      // Get auth token from AsyncStorage if available
      const getToken = async () => {
        try {
          const AsyncStorage = require('@react-native-async-storage/async-storage').default;
          const token = await AsyncStorage.getItem('token');
          return token;
        } catch (error) {
          return null;
        }
      };

      // Create Socket.IO connection with token in query params
      // We'll get the token asynchronously and include it in query
      let socket;
      
      // Get token first, then create connection
      getToken().then(token => {
        const connectionOptions = {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: this.reconnectDelay,
          // Socket.IO automatically uses /socket.io as default path
          // We don't need to specify path unless server uses custom path
        };
        
        // Add token to query params if available
        if (token) {
          connectionOptions.query = { token };
          connectionOptions.auth = { token };
        }
        
        // Connect to the namespace: Socket.IO format is baseUrl + namespace
        // Example: io('http://10.216.76.57:3000/ride-updates')
        const namespaceUrl = `${wsUrl}/ride-updates`;
        console.log('Connecting to Socket.IO namespace:', namespaceUrl);
        socket = io(namespaceUrl, connectionOptions);
        
        // Set up event handlers
        setupSocketHandlers(socket, rideId, callbacks);
      }).catch(err => {
        console.error('Error getting token for WebSocket:', err);
        // Create connection without token (will fail auth but connection will be established)
        const namespaceUrl = `${wsUrl}/ride-updates`;
        console.log('Connecting to Socket.IO namespace (no token):', namespaceUrl);
        socket = io(namespaceUrl, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: this.reconnectDelay,
        });
        setupSocketHandlers(socket, rideId, callbacks);
      });

      // Setup socket event handlers
      const setupSocketHandlers = (socketInstance, rideId, callbacks) => {
        socketInstance.on('connect', () => {
          console.log(`Socket.IO connected for ride: ${rideId}`);
          this.reconnectAttempts.set(rideId, 0);
          
          // Subscribe to ride updates
          socketInstance.emit('ride:subscribe', { rideId });
          
          callbacks.onConnect?.();
        });

        socketInstance.on('ride:subscribed', (data) => {
          console.log(`Subscribed to ride updates: ${data.rideId}`);
        });

        // Handle ride updates
        socketInstance.on('ride:update', (data) => {
          console.log('Ride update received:', data);
          const subscribers = this.subscribers.get(rideId);
          if (subscribers) {
            subscribers.forEach(cb => {
              cb.onMessage?.(data);
              cb.onRideUpdate?.(data.ride);
            });
          }
        });

        // Handle status changes
        socketInstance.on('ride:status', (data) => {
          console.log('Ride status changed:', data);
          const subscribers = this.subscribers.get(rideId);
          if (subscribers) {
            subscribers.forEach(cb => {
              cb.onMessage?.(data);
              cb.onStatusChange?.(data.status);
              cb.onRideUpdate?.(data.ride);
            });
          }
        });

        // Handle driver updates
        socketInstance.on('driver:update', (data) => {
          console.log('Driver update received:', data);
          const subscribers = this.subscribers.get(rideId);
          if (subscribers) {
            subscribers.forEach(cb => {
              cb.onMessage?.(data);
              cb.onDriverUpdate?.(data.driver);
            });
          }
        });

        // Handle ETA updates
        socketInstance.on('eta:update', (data) => {
          console.log('ETA update received:', data);
          const subscribers = this.subscribers.get(rideId);
          if (subscribers) {
            subscribers.forEach(cb => {
              cb.onMessage?.(data);
              cb.onEtaUpdate?.(data.eta);
            });
          }
        });

        socketInstance.on('error', (error) => {
          console.error('Socket.IO error:', error);
          callbacks.onError?.(error);
        });

        socketInstance.on('disconnect', (reason) => {
          console.log(`Socket.IO disconnected for ride: ${rideId}`, reason);
          callbacks.onDisconnect?.(reason);
          
          // Attempt reconnection if not intentional disconnect
          if (reason !== 'io client disconnect') {
            this.reconnect(rideId, callbacks);
          }
        });

        socketInstance.on('connect_error', (error) => {
          console.error('Socket.IO connection error:', error);
          callbacks.onError?.(error);
        });

        this.connections.set(rideId, socketInstance);
        
        const subscribers = this.subscribers.get(rideId) || new Set();
        subscribers.add(callbacks);
        this.subscribers.set(rideId, subscribers);
      };
      
      // Return a placeholder socket object immediately
      // The actual connection will be established asynchronously
      const placeholderSocket = {
        connected: false,
        emit: () => {},
        on: () => {},
        disconnect: () => {},
      };
      
      this.connections.set(rideId, placeholderSocket);
      
      return placeholderSocket;
    } catch (error) {
      console.error('Error creating Socket.IO connection:', error);
      callbacks.onError?.(error);
      return null;
    }
  }

  /**
   * Reconnect with exponential backoff
   */
  reconnect(rideId, callbacks) {
    const attempts = this.reconnectAttempts.get(rideId) || 0;
    
    if (attempts >= this.maxReconnectAttempts) {
      console.error(`Max reconnection attempts reached for ride: ${rideId}`);
      callbacks.onError?.(new Error('Max reconnection attempts reached'));
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, attempts);
    this.reconnectAttempts.set(rideId, attempts + 1);
    
    console.log(`Reconnecting WebSocket for ride ${rideId} in ${delay}ms (attempt ${attempts + 1})`);
    
    setTimeout(() => {
      this.connect(rideId, callbacks);
    }, delay);
  }

  /**
   * Disconnect WebSocket for a ride
   */
  disconnect(rideId, callbacks = null) {
    const subscribers = this.subscribers.get(rideId);
    
    if (callbacks && subscribers) {
      subscribers.delete(callbacks);
      if (subscribers.size === 0) {
        // No more subscribers, close connection
        const socket = this.connections.get(rideId);
        if (socket) {
          socket.emit('ride:unsubscribe', { rideId });
          socket.disconnect();
          this.connections.delete(rideId);
          this.subscribers.delete(rideId);
          this.reconnectAttempts.delete(rideId);
        }
      } else {
        this.subscribers.set(rideId, subscribers);
      }
    } else {
      // Disconnect all
      const socket = this.connections.get(rideId);
      if (socket) {
        socket.emit('ride:unsubscribe', { rideId });
        socket.disconnect();
      }
      this.connections.delete(rideId);
      this.subscribers.delete(rideId);
      this.reconnectAttempts.delete(rideId);
    }
  }

  /**
   * Send message through Socket.IO
   */
  send(rideId, message) {
    const socket = this.connections.get(rideId);
    if (socket && socket.connected) {
      socket.emit('message', message);
      return true;
    }
    console.warn(`Cannot send message - Socket.IO not connected for ride: ${rideId}`);
    return false;
  }

  /**
   * Check if Socket.IO is connected
   */
  isConnected(rideId) {
    const socket = this.connections.get(rideId);
    return socket && socket.connected;
  }
}

// Singleton instance
const wsManager = new WebSocketManager();

/**
 * React Hook for WebSocket ride updates
 * 
 * @param {string} rideId - The ride ID to subscribe to
 * @param {Object} options - Configuration options
 * @returns {Object} - { rideData, driverData, status, eta, error, isConnected }
 */
export const useRideWebSocket = (rideId, options = {}) => {
  const [rideData, setRideData] = useState(null);
  const [driverData, setDriverData] = useState(null);
  const [status, setStatus] = useState(null);
  const [eta, setEta] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const callbacksRef = useRef(null);

  useEffect(() => {
    if (!rideId) return;

    callbacksRef.current = {
      onConnect: () => {
        setIsConnected(true);
        setError(null);
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onError: (err) => {
        setError(err);
        setIsConnected(false);
      },
      onRideUpdate: (ride) => {
        setRideData(ride);
      },
      onDriverUpdate: (driver) => {
        setDriverData(driver);
      },
      onStatusChange: (newStatus) => {
        setStatus(newStatus);
        options.onStatusChange?.(newStatus);
      },
      onEtaUpdate: (newEta) => {
        setEta(newEta);
      },
      onMessage: (data) => {
        options.onMessage?.(data);
      },
    };

    // Connect to WebSocket
    wsManager.connect(rideId, callbacksRef.current);

    return () => {
      // Cleanup on unmount
      if (callbacksRef.current) {
        wsManager.disconnect(rideId, callbacksRef.current);
      }
    };
  }, [rideId]);

  return {
    rideData,
    driverData,
    status,
    eta,
    error,
    isConnected,
    sendMessage: useCallback((message) => wsManager.send(rideId, message), [rideId]),
  };
};

/**
 * WebSocket Manager instance for direct use
 */
export default wsManager;

