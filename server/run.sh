#!/bin/bash
# Simple script to run the Skull game server

echo "Starting Skull game server with Deno v2..."
deno run --allow-net --allow-read --allow-env --watch src/main.ts
