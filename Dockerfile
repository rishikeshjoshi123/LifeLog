# Use an official Node.js runtime as the base image
FROM node:16.15.0-alpine

# Set the working directory for subsequent commands
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
#(from package.lock.json file, insetad of package.json)
RUN npm ci

# Copy the rest of the application code to the container
COPY . .

# Expose the port that the application will listen on
EXPOSE 3000

# Set the command to start the application
#This command is for DEVELOPMENT only 
CMD ["npm", "run", "startDev"]