#!/bin/bash

echo "*******************************"
echo "Provisioning virtual machine..."
echo "*******************************" 

cd curvation
sudo apt-get -qq update
sudo apt-get -y -qq install nodejs build-essential npm ruby git
sudo ln -s "$(which nodejs)" /usr/sbin/node
sudo npm install -g bower grunt-cli nodemon
sudo gem install sass
sudo npm install
bower install
grunt init

echo "*********************************"
echo "Success!"
echo "*********************************"
