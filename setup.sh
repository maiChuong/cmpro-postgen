#!/bin/bash

# Create project directory
# Create necessary files
touch index.html
touch README.md
touch setup.sh

# Add basic content to README.md
echo "# cmpro-postgen" > README.md
echo "This project is for legally using LinkedIn credentials to fetch posts and comments." >> README.md

# Make setup.sh executable
chmod +x setup.sh

echo "Project structure created successfully."