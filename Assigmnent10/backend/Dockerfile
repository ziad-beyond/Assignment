# Use Node.js official image
FROM node:22-alpine

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for npm install
COPY package*.json ./
COPY prisma ./prisma/
# Install dependencies
RUN npm install

# Copy all your source code into the container
COPY . .

# Install TypeScript globally
RUN npm install -g typescript

# Generate Prisma client
RUN npx prisma generate

# Compile TypeScript code
RUN tsc

# Expose the port your app will run on
EXPOSE 3100

# Command to start the app
CMD ["npm", "run", "dev"]