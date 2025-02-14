#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "Using Node version: $(node -v)"
echo "Using NPM version: $(npm -v)"
echo "Using PM2 version: $(pm2 -v)"

cd /home/thangl-vietis/deploy-pm2/current

npm install
npm run build
pm2 restart ecosystem.config.js --env development
