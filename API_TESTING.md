# Skull Game API Testing Guide

This guide explains how to test the Skull game server's REST API endpoints using
Postman.

## Prerequisites

- [Postman](https://www.postman.com/downloads/) installed on your computer
- Skull game server running locally on port 8000

## Getting Started

1. Start the Skull game server:

   ```bash
   npm run server
   ```

2. Import the Postman collection:

   - Open Postman
   - Click "Import" in the top left
   - Select the `skull-api.postman_collection.json` file
   - Click "Import"

3. The collection contains the following endpoints:
   - **Health Check**: Verify the server is running
   - **Get Server Stats**: View statistics about active rooms and players
   - **List All Rooms**: Get a list of all active game rooms
   - **Create New Room**: Create a new game room
   - **Get Room Details**: View details about a specific room

## Testing the API

### Basic Flow

1. **Check Server Health**:

   - Send the "Health Check" request
   - You should receive a response with status "ok"

2. **Create a Room**:

   - Send the "Create New Room" request
   - You'll receive a response with a room code (e.g., "ABCD")
   - The room code will be automatically saved to the collection variable

3. **List Rooms**:

   - Send the "List All Rooms" request
   - You should see your newly created room in the list

4. **Get Room Details**:

   - Send the "Get Room Details" request
   - This uses the room code from the previous step
   - You'll see details about the room's state

5. **Check Server Stats**:
   - Send the "Get Server Stats" request
   - You should see updated statistics reflecting your created room

## WebSocket Testing

While the REST API is useful for certain operations, the core game functionality
uses WebSockets via Socket.io. To test WebSocket functionality:

1. Use Postman's WebSocket feature:

   - Create a new WebSocket request
   - Set the URL to `ws://localhost:8000/socket.io/?EIO=4&transport=websocket`
   - After connecting, you can send Socket.io messages in this format:
     ```
     42["event_name",{"param1":"value1"}]
     ```
   - For example:
     ```
     42["create_room",{}]
     ```

2. Or create a simple HTML test client (see example in the project
   documentation)

## Available Endpoints

### GET /api/health

- **Purpose**: Check if the server is running
- **Response**: `{"status":"ok","timestamp":"2025-05-17T02:26:09.195Z"}`

### GET /api/stats

- **Purpose**: Get server statistics
- **Response**:
  `{"activeRooms":1,"totalPlayers":0,"serverTime":"2025-05-17T02:26:42.583Z","version":"1.0.0"}`

### GET /api/rooms

- **Purpose**: List all active rooms
- **Response**: `{"rooms":[{"code":"JBSV","playerCount":0,"inProgress":false}]}`

### POST /api/rooms

- **Purpose**: Create a new room
- **Response**: `{"roomCode":"JBSV","message":"Room created successfully"}`

### GET /api/rooms/:roomCode

- **Purpose**: Get details about a specific room
- **Response**:
  `{"roomCode":"JBSV","playerCount":0,"phase":"waiting","round":1}`
- **Error Response**: `{"error":"Room not found"}` (if room doesn't exist)

## Error Handling

The API includes proper error handling:

- **404 Not Found**: When accessing a non-existent endpoint

  - Response:
    `{"error":"Not found","message":"No endpoint found for GET /api/nonexistent"}`

- **404 Room Not Found**: When accessing a non-existent room

  - Response: `{"error":"Room not found"}`

- **500 Server Error**: When an internal server error occurs
  - Response: `{"error":"Failed to get game state"}`
