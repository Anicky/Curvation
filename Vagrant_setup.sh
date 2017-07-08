#!/bin/bash

echo "*******************************"
echo "Provisioning virtual machine..."
echo "*******************************" 

sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
sudo sed -i -e '$i \iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000\n' /etc/rc.local
sudo apt -qq update
sudo apt -y -qq install nodejs build-essential npm libssl-dev ruby git
sudo ln -s /usr/bin/nodejs /usr/bin/node
sudo npm install -g bower grunt-cli nodemon
sudo gem install sass
mkdir -p /var/www/curvation
sudo chown -R vagrant:vagrant /var/www/curvation
rm -r /tmp/curvation/src
rm -r /tmp/curvation/logs
mv /tmp/curvation/* /var/www/curvation
cd /var/www/curvation
npm install

echo "*********************************"
echo "Success!"
echo "*********************************"
