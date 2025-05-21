# Skull Game - Deno Backend To-Do List

## Setup and Configuration

-   [x] Initialize Deno project structure
-   [x] Create deno.json configuration file
-   [x] Set up import_map.json for dependency management
-   [x] Configure TypeScript settings
-   [x] Create main.ts entry point
-   [x] Set up WebSocket server (using Socket.io for Deno)
-   [x] Implement basic HTTP server for serving static files
-   [x] Create development scripts

## Core Infrastructure

-   [x] Implement Room Manager

    -   [x] Room creation with unique codes
    -   [x] Room joining functionality
    -   [x] Player tracking within rooms
    -   [x] Room cleanup for inactive/empty rooms

-   [x] Implement Player Manager

    -   [x] Player registration
    -   [x] Player state tracking
    -   [x] Reconnection handling
    -   [x] Player timeout detection

-   [x] Implement Game State Manager
    -   [x] Game phase tracking (placement, bidding, flipping, result)
    -   [x] Turn management
    -   [x] State serialization for client updates

## Game Mechanics

-   [x] Card Management

    -   [x] Initial card distribution
    -   [x] Card placement logic
    -   [x] Stack management

-   [x] Bidding System

    -   [x] Bid validation
    -   [x] Bid progression
    -   [x] Pass handling
    -   [x] Highest bidder determination

-   [x] Flipping System

    -   [x] Card flipping logic
    -   [x] Skull detection
    -   [x] Success/failure determination
    -   [x] Card removal on failure

-   [x] Scoring System
    -   [x] Point tracking
    -   [x] Win condition detection
    -   [x] Round management

## WebSocket Events

-   [x] Connection Events

    -   [x] Handle new connections
    -   [x] Handle disconnections
    -   [x] Reconnection logic

-   [x] Room Events

    -   [x] create_room
    -   [x] join_room
    -   [x] leave_room

-   [x] Game Events

    -   [x] game_start
    -   [x] place_card
    -   [x] start_bidding
    -   [x] make_bid
    -   [x] pass
    -   [x] start_flipping
    -   [x] flip_card
    -   [x] round_end
    -   [x] game_end

-   [x] State Update Events
    -   [x] game_state_update
    -   [x] player_update
    -   [x] error_notification

## Testing

-   [x] Unit Tests

    -   [x] Game logic tests
    -   [ ] Room management tests
    -   [ ] Player management tests

-   [ ] Integration Tests

    -   [ ] WebSocket communication tests
    -   [ ] Full game flow tests

-   [ ] Load Testing
    -   [ ] Multiple concurrent games
    -   [ ] Connection stability

## Deployment

-   [x] Prepare for Deno Deploy

    -   [x] Optimize for serverless environment
    -   [ ] Configure environment variables

-   [x] Documentation
    -   [x] API documentation
    -   [x] Deployment instructions
    -   [x] Environment setup guide

## Future Enhancements

-   [ ] Spectator mode
-   [ ] Game history tracking
-   [ ] AI players for practice
-   [ ] Custom game settings
-   [ ] Persistence for game state (for reconnections)
