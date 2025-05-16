# Partner Collaboration Strategy for Skull Digital

## Recommended Division of Work

1. **Frontend and UI Development**

    - React Native components and screens
    - Game visualization and animations
    - UI/UX design implementation

2. **Backend and Game Logic**
    - Socket.io server setup
    - Game state management
    - Turn handling and validation
    - Room code system

This division allows each person to own a complete vertical slice of the application while maintaining clear boundaries.

## Communication Framework

1. **Define Interface Contracts First**

    - Agree on the data structures and events that will pass between frontend and backend
    - Document the expected payloads for each socket event
    - Create shared types/interfaces if using TypeScript

2. **Regular Sync Meetings**

    - Brief 15-30 minute calls 2-3 times per week
    - Share progress, challenges, and upcoming work
    - Adjust interfaces as needed

3. **Asynchronous Communication Tools**
    - Use GitHub issues for task tracking
    - Set up a project board (GitHub Projects or Trello)
    - Daily status updates via Slack/Discord

## Project Setup for Async Work

1. **Repository Structure**

    - Create a monorepo with separate packages for client and server
    - Set up shared types/utilities in a common package
    - Use clear README files for each package

2. **Development Environment**

    - Containerize the development environment for consistency
    - Set up continuous integration to catch integration issues early
    - Create scripts for easy local testing of the full stack

3. **Branching Strategy**
    - Use feature branches with descriptive names
    - Implement pull request templates with checklists
    - Set up automated tests to run on PRs

## Initial Tasks Breakdown

**Partner A (Frontend Focus):**

-   Set up React Native project with Expo
-   Create basic UI components (cards, player hands, game board)
-   Implement the visual aspects of card placement and flipping
-   Build room joining interface

**Partner B (Backend Focus):**

-   Set up Node.js server with Socket.io
-   Implement room creation and management
-   Build game state management
-   Create turn handling and validation logic

## Shared Responsibilities

-   Project documentation
-   Testing strategy
-   Deployment planning
