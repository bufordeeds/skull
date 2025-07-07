/**
 * Context index file for easier importing
 */

export * from './GameContext';

// Default export for convenience
import GameContext, { GameProvider, useGame } from './GameContext';

export default {
	GameContext,
	GameProvider,
	useGame
};
