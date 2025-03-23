# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside Docker image
COPY . .

# Make port 8081 available to the world outside this container
EXPOSE 8081

# Define environment variable
ENV NODE_ENV development

# Run the app when the container launches
CMD ["npx", "react-native", "start"]
