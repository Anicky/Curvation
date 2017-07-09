#!/bin/bash

echo "*******************************"
echo "Booting virtual machine..."
echo "*******************************" 

sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
cd /var/www/curvation
npm install

echo "*********************************"
echo "Success!"
echo "*********************************"
