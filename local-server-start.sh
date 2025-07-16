#!/bin/bash

# Exit on error
set -e

# === CONFIGURATION ===
# Do NOT hardcode your authtoken. Use an environment variable for security.
if [[ -z "$NGROK_AUTHTOKEN" ]]; then
  echo "ERROR: Please run this script with your Ngrok authtoken:"
  echo "  NGROK_AUTHTOKEN=your_token_here bash local-server-start.sh"
  exit 1
fi

# Activate Python virtual environment
cd local_server
source env/bin/activate

# Start FastAPI server in the background
echo "Starting FastAPI server on http://127.0.0.1:8000 ..."
uvicorn main:app --reload &
UVICORN_PID=$!

# Wait a moment to ensure server starts
sleep 3

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null
then
    echo "Ngrok not found. Installing Ngrok..."
    # For Mac (Homebrew)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install ngrok/ngrok/ngrok
    else
        # For Linux (manual download)
        wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip
        unzip ngrok-stable-linux-amd64.zip
        sudo mv ngrok /usr/local/bin
        rm ngrok-stable-linux-amd64.zip
    fi
fi

# Set Ngrok authtoken securely (command line method, idempotent)
ngrok config add-authtoken "$NGROK_AUTHTOKEN"

echo "Starting Ngrok tunnel on port 8000 ..."
ngrok http 8000

# When ngrok is stopped, kill the FastAPI server
kill $UVICORN_PID