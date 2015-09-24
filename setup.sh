#!/bin/bash

echo "*******************************"
echo "Provisioning virtual machine..."
echo "*******************************" 

cd curvation
sudo apt-get -qq update
sudo apt-get -y -qq install build-essential
sudo apt-get -y -qq install nodejs-legacy
sudo apt-get -y -qq install npm
sudo apt-get -y -qq install ruby
sudo apt-get -y -qq install git
sudo ln -s "$(which nodejs)" /usr/sbin/node
sudo npm install -g bower
sudo npm install -g grunt-cli
sudo npm install -g nodemon
sudo gem install sass
sudo npm install --no-bin-links
bower install
grunt init

echo "*********************************"
echo "Success!"
echo "*********************************"
