# npm-miner

[![Cyclopt rating](https://qaas.cyclopt.com/api/projects/5ae9878bf0114a000448c17c/badge)](https://qaas.cyclopt.com)

Static code analysis of npm registry. Available at: http://npm-miner.com

## deployment

### web

Development:

    docker-compose up

Production

    docker-compose up -d -f docker-compose-prod.yml

### rabbit

     docker run -d --hostname rabbit --name rabbit-mgt -p 8090:15672 -p 5672:5672 -e RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS="-rabbit heartbeat 0" rabbitmq:3-management

and then

     docker start

### workers

Start analyzers with:

     GITHUB_TOKEN=<TOKEN> forever start -c "node --stack-size=16384 --max-old-space-size=16384" analyzer.js <WORKER_ID>

Start crawler with:

     forever start crawler.js

### couchdb

http://couchdb.npm-miner.com:5984/npm-packages/_design/analytics/_view/stars?descending=true&limit=1000

docker run -d -p 5984:5984 -v /data/couchdb:/usr/local/var/lib/couchdb --name couchdb apache/couchdb:1.7.1