#!/bin/bash
# git_post_gen.sh - Manage the Jekyll frontend for GitHub Pages with just-the-docs remote theme

set -e

JEKYLL_DIR="postgen_web"
CONFIG_FILE="_config.yml"
REQUIRED_THEME="just-the-docs"

if [ ! -d "$JEKYLL_DIR" ]; then
  echo "Error: Jekyll directory $JEKYLL_DIR does not exist."
  exit 1
fi

cd "$JEKYLL_DIR"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "Warning: $CONFIG_FILE not found. Please create it and set remote_theme: $REQUIRED_THEME"
else
  grep -q "remote_theme: $REQUIRED_THEME" "$CONFIG_FILE" || {
    echo "Warning: $CONFIG_FILE does not specify remote_theme: $REQUIRED_THEME"
    echo "Add the following line to your _config.yml:"
    echo "remote_theme: $REQUIRED_THEME"
  }
fi

case "$1" in
  serve)
    # Serve locally for development
    bundle install
    bundle exec jekyll serve
    ;;
  build)
    # Build the static site
    bundle install
    bundle exec jekyll build
    ;;
  deploy)
    echo "To deploy: commit and push the contents of $JEKYLL_DIR to your GitHub Pages branch."
    echo "Or use GitHub Actions for automated deployment."
    ;;
  *)
    echo "Usage: $0 {serve|build|deploy}"
    exit 1
    ;;
esac