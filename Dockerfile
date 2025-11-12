# Use the Node.js 18 Alpine Linux image as the base image
FROM node:22.21-alpine 

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY .next ./.next

# Run the application in development mode
CMD ["npm", "run", "dev"]
