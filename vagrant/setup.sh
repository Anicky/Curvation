#!/bin/bash

echo "*******************************"
echo "Provisioning virtual machine..."
echo "*******************************" 

echo iptables-persistent iptables-persistent/autosave_v4 boolean true | sudo debconf-set-selections
echo iptables-persistent iptables-persistent/autosave_v6 boolean true | sudo debconf-set-selections
sudo apt-get -qq update
sudo apt-get -qq -y install curl gnupg iptables-persistent
sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
sudo bash -c "iptables-save > /etc/iptables/rules.v4"
sudo curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -
sudo apt-get -qq -y install nodejs
sudo npm install -g grunt-cli nodemon browserify
mkdir -p /var/www/curvation
sudo chown -R vagrant:vagrant /var/www/curvation
mv /tmp/curvation/* /var/www/curvation
cd /var/www/curvation
npm install

echo "*********************************"
echo "Success!"
echo "*********************************"
