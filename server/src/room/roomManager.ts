import { GameState } from "game/state.ts";

/**
 * Manages game rooms for the Skull game
 */
export class RoomManager {
  private rooms: Map<string, GameState> = new Map();

  /**
   * Creates a new game room with a unique code
   * @returns The room code for the new room
   */
  createRoom(): string {
    const roomCode = this.generateRoomCode();
    this.rooms.set(roomCode, new GameState());
    return roomCode;
  }

  /**
   * Gets a game room by its code
   * @param roomCode The room code
   * @returns The game state for the room, or undefined if not found
   */
  getRoom(roomCode: string): GameState | undefined {
    return this.rooms.get(roomCode);
  }

  /**
   * Checks if a room exists
   * @param roomCode The room code to check
   * @returns True if the room exists, false otherwise
   */
  roomExists(roomCode: string): boolean {
    return this.rooms.has(roomCode);
  }

  /**
   * Removes a room
   * @param roomCode The room code to remove
   */
  removeRoom(roomCode: string): void {
    this.rooms.delete(roomCode);
  }

  /**
   * Gets all active room codes
   * @returns Array of room codes
   */
  getRoomCodes(): string[] {
    return Array.from(this.rooms.keys());
  }

  /**
   * Generates a unique room code
   * @returns A 4-character room code
   */
  private generateRoomCode(): string {
    // Characters that are unlikely to be confused with each other
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code: string;

    // Keep generating codes until we find one that's not in use
    do {
      code = "";
      for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (this.roomExists(code));

    return code;
  }
}
