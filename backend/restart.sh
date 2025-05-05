#!/bin/bash

# Find and kill any process running on port 5001
echo "Checking for processes on port 5001..."
PORT_PID=$(lsof -i :5001 -t)

if [ ! -z "$PORT_PID" ]; then
  echo "Killing process $PORT_PID on port 5001..."
  kill -9 $PORT_PID
  echo "Process killed."
else
  echo "No process running on port 5001."
fi

# Start the server
echo "Starting the server..."
npm run dev
