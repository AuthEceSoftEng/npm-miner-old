# Use an official node runtime as a parent image
FROM node:8.7

# Set the working directory to /app
WORKDIR /workers

# Copy the current directory contents into the container at /app
ADD . /workers

RUN npm install
RUN npm install -g pm2
ENV COUCHDB_URL=http://couchdb.npm-miner.com:5984/
CMD ["pm2-docker", "process.yml"]