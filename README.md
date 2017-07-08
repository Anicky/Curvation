# Curvation

## Introduction

Curvation is a game created by :
* Julien DE CONTI
* Jérémie JALOUZET
* Claire-Hélène STENTZ
* Guillaume THIRARD

This project is open-source, you can make forks and purpose pull request if you want to add features.

## Installation

### Using Vagrant

Download and install :
* VirtualBox (https://www.virtualbox.org/)
* Vagrant (https://www.vagrantup.com/)

Run the virtual machine using this command :

```
vagrant up
```

To launch the app :

```
vagrant ssh
cd /var/www/curvation
npm start
```

### Using Docker

Download and install :
* Docker (https://www.docker.com/)

Create the container using this command :
```
docker build -t curvation .
```

To launch the app :
```
docker run --name curvation -p 80:3000 curvation
```

To launch the app in background :
```
docker run --name curvation -d -p 80:3000 curvation
```

#### Development mode

* To share the "src" folder and not launching the app by default :
```
docker run --name curvation -d -t -p 80:3000 -v /c/Users/USERNAME/Curvation/app/src:/var/www/curvation/src curvation
```

* To access the container :
```
docker exec -it curvation bash
```

* To launch the app (when inside the container) :
```
npm start
```

* To get the IP of the container :
```
docker inspect curvation | grep IPAddress | cut -d '"' -f 4
```

* If you have docker-machine on Windows, you have to get the IP of the Docker machine :
```
docker-machine ip
```

* To stop the container :
```
docker stop curvation
```

* To remove the container :
```
docker rm curvation
```

### Using Nodejs

We use a number of node.js tools to initialize Curvation. You must have node.js and
its package manager (npm) installed.  You can get them from [http://nodejs.org/](http://nodejs.org/).

To run the SASS compilation, you have to install ruby from [https://www.ruby-lang.org/fr/](https://www.ruby-lang.org/fr/) or [http://rubyinstaller.org/](http://rubyinstaller.org/) if you are on Windows.
Then, just run the following line to install SASS:
 
```
gem install sass
```
We have some dependencies in this project: `bower`, `grunt` and angular framework code (soon...).
Grunt.js help us manage application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].

We need to install the dependencies `bower` and `grunt-cli` :
```
npm install -g bower
```
```
npm install -g grunt-cli
```

We have preconfigured `npm` to automatically run `grunt` to init the project, so you can simply do:
```
npm install
```

Behind the scenes this will also call `grunt init`.  You should find that you have two new
folders in your project :

* `node_modules/` - contains the npm packages for the tools we need
* `public/` - ...

To run the server :

Add this line in your hosts file (on Windows, this is located in C:\Windows\System32\drivers\etc\hosts):

127.0.0.1	dev.curvation.fr

Do:

```
npm start
```

Then, you can play in your browser with the URL : http://dev.curvation.fr:8080/

## Run the Game in local mode

Simply use the index.html in the main folder.

## Using Grunt.js

You can manually use Grunt.js to generate all the needed files into the `public/` folder by running :
```
grunt init
```

If you are a developper, you can use the dev mode wich doesn't minify the sources by running :
```
grunt dev
```
`grunt dev` will run the dev tasks then `watch` automatic task. This task will rebuild all the public files whenever sources files (within the `src/` folder) changes.

## Updating the dependencies

You can update the tool dependencies by running:

```
npm update
```

This will find the latest versions that match the version ranges specified in the `package.json` file.