#!/bin/bash

echo "*******************************"
echo "Provisioning virtual machine..."
echo "*******************************" 

sudo apt -qq update
sudo apt -qq -y install curl gnupg
sudo curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -
sudo apt -qq -y install nodejs build-essential libssl-dev
sudo npm install -g grunt-cli nodemon browserify
mkdir -p /var/www/curvation
sudo chown -R vagrant:vagrant /var/www/curvation
rm -r /tmp/curvation/src
rm -r /tmp/curvation/logs
mv /tmp/curvation/* /var/www/curvation

echo "*********************************"
echo "Success!"
echo "*********************************"
