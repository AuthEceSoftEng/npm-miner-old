# CouchDB

This folder contains everything about the CouchDB server living in an Okeanos
VM through docker.

The CouchDB replicates the npm-registry in one database and has one more
database that has filtered and analyzed npm packages.

## Installing CouchDB on Okeanos VM using Docker

1. Test mounts: `mount`
2. Check the attached storage: `sudo fdisk -l`
3. Partition the attached disk: `sudo cfdisk /dev/vdb`
4. Format the disk: `sudo mkfs.ext4 /dev/vdb1`
5. Create the mounting point: `sudo mkdir /data`
6. Get the uuid: `sudo blkid`
7. Setup the fstab: `sudo nano /etc/fstab`, for example
  - UUID=045618f5-0a1b-4356-822c-973a8a31f71b	/data	ext4	defaults	0	2
8. Mount everything (not needed if rebooted): `sudo mount -a`
9. `sudo mkdir /data/couch-db`
10. `sudo chown user:user -R /data/couch-db`
11. UFW
  1. sudo ufw app list
  2. sudo ufw allow OpenSSH
  3. sudo ufw enable
  4. Allow the CouchDB port: `sudo ufw allow 5984`
12. Docker (from: https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/)

  sudo apt-get install \
      apt-transport-https \
      ca-certificates \
      curl \
      software-properties-common

  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

  sudo apt-key fingerprint 0EBFCD88
  sudo add-apt-repository \
     "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
     $(lsb_release -cs) \
     stable"

  sudo apt-get update

  sudo apt-get install docker-ce

  sudo groupadd docker

  sudo usermod -aG docker $USER

13. Log out and login and to test it: `docker run hello-world`
14. Start at startup: `sudo systemctl enable docker` or `sudo systemctl disable docker`
15. CouchDB:
  1. `docker pull couchdb:latest`
  2. `docker run -d -p 5984:5984 -v /data/couch-db:/usr/local/var/lib/couchdb --name couchdb couchdb`
16. Created an admin user

## Scripts

`replicate.js`: Starts the continuous replication of the npm registry if it does not exist
`init.js`: The initial databases and views

`docker run -d --name couchdb -p 5984:5984 -v $(pwd):/opt/couchdb/data authecesofteng/couchdb`

`docker run -d --name couchdb-ssl -p 6984:6984 -e COUCHDB_USER=<username> -e COUCHDB_PASSWORD=<password> -v /data/couchdb:/usr/local/var/lib/couchdb klaemo/couchdb-ssl`