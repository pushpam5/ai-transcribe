#!/bin/bash

ROOT_DIR=$(pwd)
SERVER_DIR="$ROOT_DIR/server"
CLIENT_DIR="$ROOT_DIR/client"

if [ ! -f "$SERVER_DIR/.env" ]; then
  if [ -f "$SERVER_DIR/.env.example" ]; then
    cp "$SERVER_DIR/.env.example" "$SERVER_DIR/.env"
    echo "Please edit server/.env to add your API keys!"
  else
    echo "Error: server/.env.example not found!"
    exit 1
  fi
fi

function cleanup() {
  echo "Shutting down services..."
  kill $SERVER_PID $CLIENT_PID 2>/dev/null
  exit 0
}

trap cleanup SIGINT

cd "$SERVER_DIR" && npm install
cd "$CLIENT_DIR" && npm install

cd "$SERVER_DIR" && npm run dev &
SERVER_PID=$!

sleep 2

cd "$CLIENT_DIR" && npm start &
CLIENT_PID=$!

wait $SERVER_PID $CLIENT_PID