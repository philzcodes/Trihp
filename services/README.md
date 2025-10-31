# WebSocket Service

## Overview
This service provides real-time updates for ride status, driver location, ETA, etc. using WebSockets instead of polling.

## Benefits Over Polling
- **Real-time updates**: Instant notifications when ride status changes
- **No rate limiting**: Single persistent connection vs. multiple HTTP requests
- **Efficient**: Server pushes updates only when changes occur
- **Battery friendly**: No constant polling = less network activity
- **Better UX**: Instant feedback for users

## Current Status
The WebSocket service is ready but requires backend WebSocket endpoint to be implemented.

## Usage Example

```javascript
import { useRideWebSocket } from '../services/websocketService';

function RideScreen({ rideId }) {
  const { 
    rideData, 
    driverData, 
    status, 
    eta, 
    error, 
    isConnected 
  } = useRideWebSocket(rideId, {
    onStatusChange: (newStatus) => {
      // Handle status change
      if (newStatus === 'DRIVER_ASSIGNED') {
        // Navigate to driver found screen
      }
    },
    onMessage: (data) => {
      console.log('WebSocket message:', data);
    }
  });

  if (!isConnected) {
    // Fallback to polling or show disconnected state
  }

  return (
    // Your component
  );
}
```

## Backend Requirements
When implementing backend WebSocket:
1. Create WebSocket endpoint: `ws://your-api/ride-request/{rideId}/updates`
2. Send messages in format:
   ```json
   {
     "type": "RIDE_UPDATE|DRIVER_UPDATE|STATUS_CHANGE|ETA_UPDATE",
     "ride": {...},
     "driver": {...},
     "status": "DRIVER_ASSIGNED",
     "eta": 5
   }
   ```
3. Update `getWebSocketUrl()` in `websocketService.js` with your WebSocket URL

