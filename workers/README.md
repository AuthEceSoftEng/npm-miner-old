http://couchdb.npm-miner.com:5984/npm-packages/_design/analytics/_view/stars?descending=true&limit=1000

docker run -d -p 5984:5984 -v /data/couchdb:/usr/local/var/lib/couchdb --name couchdb apache/couchdb:1.7.1