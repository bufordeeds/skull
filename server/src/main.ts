import { Server } from "socket.io/mod.ts";
import { RoomManager } from "room/roomManager.ts";
import { setupSocketHandlers } from "socket/handlers.ts";
import { logger } from "utils/logger.ts";
import { handleError } from "utils/errors.ts";
import { handleHttpRequest } from "./http/routes.ts";

// Use environment variable for port or default to 8000
const PORT = parseInt(Deno.env.get("PORT") || "8000");

logger.info(`Starting Skull game server on port ${PORT}...`);

// Create Socket.io server
const io = new Server({
  cors: {
    origin: [
      "http://localhost:3000", // Local development
      "http://localhost:8080", // Alternative local port
      "https://skull-game.example.com", // Production domain (replace with your actual domain)
    ],
    methods: ["GET", "POST"],
  },
});

// Initialize room manager
const roomManager = new RoomManager();

// Set up socket event handlers
setupSocketHandlers(io, roomManager);

// Create a handler that can process both HTTP and WebSocket requests
const handler = (req: Request): Response | Promise<Response> => {
  // Check if it's a WebSocket request (handled by Socket.io)
  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() === "websocket") {
    return io.handler()(req);
  }

  // Otherwise, it's an HTTP request, handle with our routes
  return handleHttpRequest(req, roomManager);
};

// Start the server using Deno.serve() API
await Deno.serve(
  {
    port: PORT,
    onListen: ({ port, hostname }) => {
      logger.info(
        `Skull game server running at: http://${hostname}:${port}`,
      );
      logger.info("Ready for WebSocket and HTTP connections");
    },
  },
  handler,
);

// Add error handling for unhandled rejections
addEventListener("unhandledrejection", (event) => {
  logger.error("Unhandled Promise Rejection:", event.reason);
  logger.error(handleError(event.reason));
});

// Add error handling for uncaught exceptions
addEventListener("error", (event) => {
  logger.error("Uncaught Exception:", event.error);
  logger.error(handleError(event.error));
});
