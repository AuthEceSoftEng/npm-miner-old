# Use an official node runtime as a parent image
FROM node:8.7

# Set the working directory to /app
WORKDIR /workers

# Copy the current directory contents into the container at /app
ADD . /workers

RUN npm install

CMD ["node", "npm-github-mapper.js"]