#!/bin/bash

echo "*******************************"
echo "Provisioning virtual machine..."
echo "*******************************" 

sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
mkdir /home/vagrant/node_modules
mkdir /home/vagrant/bower_components
cd /var/www/curvation
ln -s /home/vagrant/node_modules/ node_modules
ln -s /home/vagrant/bower_components/ bower_components
sudo apt-get -qq update
sudo apt-get -y -qq install nodejs build-essential npm libssl-dev ruby git
sudo ln -s /usr/bin/nodejs /usr/bin/node
sudo npm install -g bower grunt-cli nodemon
sudo gem install sass
sudo npm install
bower install
grunt init

echo "*********************************"
echo "Success!"
echo "*********************************"
