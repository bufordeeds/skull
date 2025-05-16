# Skull — Design Document

This document outlines the design principles, UI/UX considerations, and visual elements for the Skull Digital game.

## Design Philosophy

Skull Digital aims to capture the essence of the physical card game while leveraging the advantages of a digital platform. The design focuses on:

1. **Simplicity**: Clean, intuitive interfaces that don't distract from the core bluffing gameplay
2. **Tension**: Visual and audio cues that heighten the suspense of card reveals
3. **Personality**: Character and charm that reflect the game's dark humor and bluffing nature
4. **Accessibility**: Easy to learn and play on mobile devices with various screen sizes

## Color Palette

### Primary Colors

-   **Deep Purple** (#2D1B40): Background and primary UI elements
-   **Blood Red** (#8B0000): Skull elements and danger indicators
-   **Gold** (#FFD700): Rose elements and victory indicators
-   **Bone White** (#F8F0E3): Text and secondary UI elements

### Secondary Colors

-   **Dark Gray** (#333333): Inactive elements and shadows
-   **Teal** (#008080): Player highlights and interactive elements
-   **Amber** (#FFBF00): Warnings and bid indicators
-   **Charcoal** (#36454F): Card backs and neutral elements

## Typography

-   **Primary Font**: "Cinzel" for headings and game title (serif font with a mystical, slightly gothic feel)
-   **Secondary Font**: "Montserrat" for body text and UI elements (clean sans-serif for readability)
-   **Accent Font**: "Shadows Into Light" for handwritten elements and player notes

## UI Components

### Cards

-   **Size**: Large enough to be easily tapped on mobile screens
-   **Design**:
    -   Rose cards feature intricate rose designs in gold on a dark background
    -   Skull card features a menacing skull design in red on a dark background
    -   Card backs have a unified pattern that doesn't hint at the card's face
-   **Animation**: Smooth flipping animation with a slight 3D effect

### Player Areas

-   Clearly defined spaces for each player
-   Visual indicator of current player
-   Stack of played cards with slight offset to show quantity
-   Player avatar and name displayed prominently
-   Card count and score visible at all times

### Game Board

-   Circular layout to represent players sitting around a table
-   Center area for flipped cards and game announcements
-   Subtle background texture reminiscent of an old tavern table

### Bidding Interface

-   Intuitive slider or number picker for bids
-   Clear visual feedback for current highest bid
-   Prominent buttons for pass/bid actions
-   Animation and sound effects for bid confirmations

## Animations and Effects

### Card Placement

-   Subtle drop shadow and placement sound
-   Brief highlight effect when a card is played

### Card Flipping

-   Smooth 3D flip animation
-   Anticipation pause before revealing
-   Dramatic reveal effect (different for roses vs. skulls)

### Skull Reveal

-   Screen shake or vibration (with haptic feedback on supported devices)
-   Flash of red
-   Dramatic sound effect
-   Particle effects emanating from the skull

### Victory Moment

-   Golden particle burst
-   Trophy or achievement animation
-   Triumphant sound effect
-   Highlight effect on the winning player

## Sound Design

### Background Music

-   Ambient tavern sounds
-   Low, tense music during gameplay
-   Intensity increases during bidding and flipping phases

### Sound Effects

-   Card placement: Soft thud
-   Bidding: Click and confirmation sounds
-   Card flip: Whoosh sound
-   Rose reveal: Soft chime
-   Skull reveal: Dramatic crash or explosion
-   Victory: Triumphant fanfare
-   Defeat: Somber tone

## Haptic Feedback (for supported devices)

-   Subtle feedback when placing cards
-   Medium feedback when bidding
-   Strong feedback when revealing a skull
-   Rhythmic pattern for victory

## Responsive Design Considerations

### Phone (Portrait)

-   Vertical layout with player areas arranged in a circle
-   Compact UI elements
-   Focus on the current player's actions

### Phone (Landscape)

-   Horizontal layout with more visible players
-   Expanded card display
-   Wider bidding interface

### Tablet

-   Similar to phone layouts but with larger elements
-   More detailed card and player visualizations
-   Additional space for game history or statistics

## Accessibility Features

-   High contrast mode for visually impaired players
-   Text size options
-   Alternative color schemes for color-blind players
-   Option to disable animations and screen effects
-   Sound and haptic feedback can be individually adjusted or disabled

## Loading and Transition Screens

-   Minimalist design featuring the Skull logo
-   Brief tips or strategy hints
-   Smooth transitions between game phases
-   Room code display for multiplayer sessions

## Onboarding and Tutorial

-   Interactive tutorial that guides new players through the rules
-   Visual cues highlighting important UI elements
-   Progressive disclosure of game mechanics
-   Optional advanced tips for returning players

## Future Design Considerations

-   Seasonal themes (Halloween, Winter, etc.)
-   Unlockable card back designs
-   Player avatars and customization options
-   Animated backgrounds and environmental effects
-   Achievement badges and visual rewards
