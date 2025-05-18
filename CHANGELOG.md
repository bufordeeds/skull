# Changelog

All notable changes to the Skull Game project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- REST API endpoints for server interaction:
  - `GET /api/health` - Health check endpoint
  - `GET /api/stats` - Server statistics
  - `GET /api/rooms` - List all active rooms
  - `POST /api/rooms` - Create a new room
  - `GET /api/rooms/:roomCode` - Get details of a specific room
- HTTP request handler in main server to support both WebSocket and HTTP
  requests
- Postman collection (`skull-api.postman_collection.json`) for API testing
- API testing guide (`API_TESTING.md`) with detailed instructions

### Fixed

- Server startup issue by creating a minimal package.json in the client
  directory
- Error handling for non-existent rooms and endpoints

## [1.0.0] - 2025-05-16

### Added

- Initial project setup
- WebSocket server using Socket.io for Deno
- Game state management
- Room management
- Player management
- Basic game mechanics (placement, bidding, flipping)
