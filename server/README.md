# Skull Game Server

A real-time multiplayer server for the Skull card game, built with Deno and
Socket.io.

## Features

- Real-time WebSocket communication using Socket.io
- Room-based multiplayer with unique room codes
- Complete game logic implementation
- Reconnection handling
- TypeScript support

## Prerequisites

- [Deno](https://deno.land/) v1.32.0 or higher

## Getting Started

1. Clone the repository
2. Navigate to the server directory
3. Run the development server:

```bash
deno task dev
```

This will start the server in development mode with hot reloading.

## Production Deployment

To run the server in production mode:

```bash
deno task start
```

## Deployment Options

### Deno Deploy

The server is designed to be easily deployed to
[Deno Deploy](https://deno.com/deploy):

1. Create a new project on Deno Deploy
2. Link your GitHub repository
3. Set the entry point to `src/main.ts`
4. Deploy

### Other Hosting Options

The server can also be deployed to:

- Fly.io
- Digital Ocean App Platform
- Any platform that supports Deno

## API Documentation

### Socket.io Events

#### Room Management

| Event           | Direction       | Payload                                    | Description                              |
| --------------- | --------------- | ------------------------------------------ | ---------------------------------------- |
| `create_room`   | Client → Server | None                                       | Creates a new game room                  |
| `room_created`  | Server → Client | `{ roomCode: string }`                     | Confirms room creation                   |
| `join_room`     | Client → Server | `{ roomCode: string, playerName: string }` | Joins an existing room                   |
| `room_joined`   | Server → Client | `{ roomCode: string }`                     | Confirms room joining                    |
| `player_joined` | Server → Client | `{ playerId: string, playerName: string }` | Notifies all players when someone joins  |
| `leave_room`    | Client → Server | None                                       | Leaves the current room                  |
| `player_left`   | Server → Client | `{ playerId: string }`                     | Notifies all players when someone leaves |

#### Game Events

| Event           | Direction       | Payload                                                                   | Description                                  |
| --------------- | --------------- | ------------------------------------------------------------------------- | -------------------------------------------- |
| `place_card`    | Client → Server | `{ cardType: 'rose' \| 'skull' }`                                         | Places a card on the player's stack          |
| `card_placed`   | Server → Client | `{ playerId: string, cardType: string }`                                  | Notifies all players when a card is placed   |
| `make_bid`      | Client → Server | `{ bid: number }`                                                         | Makes a bid                                  |
| `bid_made`      | Server → Client | `{ playerId: string, bid: number }`                                       | Notifies all players when a bid is made      |
| `pass`          | Client → Server | None                                                                      | Passes on bidding                            |
| `player_passed` | Server → Client | `{ playerId: string }`                                                    | Notifies all players when someone passes     |
| `flip_card`     | Client → Server | `{ targetPlayerId: string }`                                              | Flips a card                                 |
| `card_flipped`  | Server → Client | `{ playerId: string, targetPlayerId: string, result: 'rose' \| 'skull' }` | Notifies all players when a card is flipped  |
| `next_round`    | Client → Server | None                                                                      | Starts the next round                        |
| `round_started` | Server → Client | `{ round: number }`                                                       | Notifies all players when a new round starts |

#### State Updates

| Event                 | Direction       | Payload                | Description                                   |
| --------------------- | --------------- | ---------------------- | --------------------------------------------- |
| `game_state_update`   | Server → Client | Game state object      | Sends the current game state to all players   |
| `error`               | Server → Client | `{ message: string }`  | Notifies a player of an error                 |
| `player_disconnected` | Server → Client | `{ playerId: string }` | Notifies all players when someone disconnects |

## Project Structure

```
server/
├── src/
│   ├── game/           # Game logic
│   │   └── state.ts    # Game state management
│   ├── room/           # Room management
│   │   └── roomManager.ts
│   ├── socket/         # Socket.io event handlers
│   │   └── handlers.ts
│   ├── utils/          # Utility functions
│   │   └── helpers.ts
│   └── main.ts         # Entry point
├── deno.json           # Deno configuration
└── import_map.json     # Import map
```

## Game Rules

- Each player has 3 roses and 1 skull
- Players take turns placing cards face-down in front of them
- Once at least one card has been placed by each player, bidding can begin
- Players bid on how many cards they think they can flip without revealing a
  skull
- The highest bidder must flip that many cards, starting with their own
- If they succeed, they score a point
- If they reveal a skull, they lose a card
- First player to 2 points wins

## License

MIT
