#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "Using Node version: $(node -v)"
echo "Using NPM version: $(npm -v)"
echo "Using PM2 version: $(pm2 -v)"

#Now we are at directory: /home/thangl-vietis/deploy-pm2/current

#get the first parameter
env=$1

npm install
npm run build

cp /home/thangl-vietis/deploy-pm2/.env-${env} /home/thangl-vietis/deploy-pm2/current/.env

SET NODE_ENV=${env} && pm2 startOrRestart ecosystem.config.js --env ${env}
#pm2 startOrRestart ecosystem.config.js --env-file /home/thangl-vietis/deploy-pm2/.env-${env}
