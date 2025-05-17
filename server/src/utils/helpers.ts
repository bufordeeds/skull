/**
 * Utility functions for the Skull game server
 */

/**
 * Generates a random integer between min and max (inclusive)
 * @param min The minimum value
 * @param max The maximum value
 * @returns A random integer
 */
export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffles an array in place
 * @param array The array to shuffle
 * @returns The shuffled array
 */
export function shuffle<T>(array: T[]): T[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = randomInt(0, i);
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

/**
 * Delays execution for a specified number of milliseconds
 * @param ms The number of milliseconds to delay
 * @returns A promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Validates a room code format
 * @param code The room code to validate
 * @returns True if the code is valid, false otherwise
 */
export function isValidRoomCode(code: string): boolean {
	return /^[A-Z0-9]{4}$/.test(code);
}

/**
 * Creates a deep copy of an object
 * @param obj The object to copy
 * @returns A deep copy of the object
 */
export function deepCopy<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}
