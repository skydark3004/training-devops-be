# Base image
FROM node:18-alpine as builder

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

FROM node:18-alpine
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist /usr/src/app/dist
COPY --from=builder /usr/src/app/package.json /usr/src/app/package.json
COPY --from=builder /usr/src/app/node_modules /usr/src/app/node_modules


# Start the server using the production build
CMD [ "node", "dist/main.js" ]
