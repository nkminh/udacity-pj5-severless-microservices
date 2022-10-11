## Build
FROM node:12
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./
COPY . ./
RUN npm install
RUN npm run build-qa
# Bundle app source
# COPY . .
# COPY server ./server/

ENTRYPOINT ["node","./server/app.js"]
