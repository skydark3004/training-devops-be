#!/bin/bash

cd /home/thangl-vietis/deploy-pm2/current
npm install
npm run build
pm2 deploy ecosystem.config.js
echo "Deployment completed successfully!"