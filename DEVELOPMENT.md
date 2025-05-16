# Skull — Development Guide

This document provides information for developers working on the Skull Digital project.

## Development Environment Setup

### Prerequisites

-   Node.js (v16+)
-   npm or yarn
-   Expo CLI (`npm install -g expo-cli`)
-   A mobile device or emulator for testing

### Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/bufordeeds/skull.git
    cd skull
    ```

2. Install dependencies:

    ```bash
    # Install root dependencies
    npm install

    # Install client dependencies
    cd client
    npm install
    cd ..

    # Install server dependencies
    cd server
    npm install
    cd ..
    ```

3. Set up environment variables:

    - Create a `.env` file in the server directory based on `.env.example`
    - Create a `.env` file in the client directory based on `.env.example`

4. Start the development servers:

    ```bash
    # Start the backend server
    cd server
    npm run dev

    # In a new terminal, start the Expo client
    cd client
    npm start
    ```

5. Connect to the app:
    - Use the Expo Go app on your physical device to scan the QR code
    - Or press 'a' to open in an Android emulator
    - Or press 'i' to open in an iOS simulator

## Project Structure

```
skull/
├── client/                 # React Native (Expo) frontend
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Reusable UI components
│   ├── screens/            # Screen components
│   ├── navigation/         # Navigation configuration
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── services/           # API services
│   └── App.js              # Entry point
│
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── socket/         # Socket.io handlers
│   │   └── utils/          # Utility functions
│   ├── index.js            # Entry point
│   └── package.json
│
├── shared/                 # Shared code between client and server
│   ├── constants/          # Shared constants
│   ├── types/              # TypeScript types/interfaces
│   └── utils/              # Shared utility functions
│
└── package.json            # Root package.json for workspaces
```

## Development Workflow

### Branch Naming Convention

-   Feature: `feature/feature-name`
-   Bug fix: `fix/bug-description`
-   Refactor: `refactor/description`
-   Documentation: `docs/description`

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Example: `feat(game-logic): implement bidding system`

### Pull Request Process

1. Create a branch from `main` using the naming convention above
2. Make your changes and commit them
3. Push your branch and create a pull request
4. Request a review from at least one team member
5. Once approved, merge the pull request

## Testing

### Running Tests

```bash
# Run client tests
cd client
npm test

# Run server tests
cd server
npm test

# Run all tests from root
npm test
```

### Test Coverage

Aim for at least 80% test coverage for critical game logic components.

## Deployment

### Client (Expo)

-   Development builds: Expo Go app
-   Testing builds: Expo EAS Update
-   Production: Expo EAS Build + App Store/Google Play

### Server

-   Development: Local Node.js server
-   Staging/Production: (To be determined)

## Troubleshooting

### Common Issues

#### Expo Connection Problems

-   Ensure your mobile device is on the same network as your development machine
-   Try using the tunnel connection option: `npm start -- --tunnel`

#### Socket.io Connection Issues

-   Check that the server is running
-   Verify the socket connection URL in the client config
-   Ensure firewalls aren't blocking WebSocket connections

## Resources

-   [React Native Documentation](https://reactnative.dev/docs/getting-started)
-   [Expo Documentation](https://docs.expo.dev/)
-   [Socket.io Documentation](https://socket.io/docs/v4/)
-   [Node.js Documentation](https://nodejs.org/en/docs/)
