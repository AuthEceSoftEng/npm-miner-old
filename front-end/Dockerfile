FROM node:alpine

# Set the working directory to /app
WORKDIR /app/

# Copy the current directory contents into the container at /app
#ADD . /app

# Install any needed packages specified in package.json
RUN npm install

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable
ENV REACT_APP_GRAPHQL_SERVER_ADDRESS 'http://localhost:3000/graphql'

# Run npm start when the container launches
CMD ["npm", "start"]