# Curvation

## Introduction

Curvation is a game created by :
* Julien DE CONTI
* Jérémie JALOUZET
* Alexis MAZAUDIER
* Claire-Hélène STENTZ
* Guillaume THIRARD

This project is open-source, you can make forks and purpose pull request if you want to add features.

## Getting Started

To get you started you can simply clone the Curvation repository and install the dependencies:

### Prerequisites

You need git to clone the Curvation repository. You can get git from
[http://git-scm.com/](http://git-scm.com/).

We also use a number of node.js tools to initialize Curvation. You must have node.js and
its package manager (npm) installed.  You can get them from [http://nodejs.org/](http://nodejs.org/).

### Clone Curvation

Clone the Curvation repository using [git][git]:

```
git clone https://github.com/Anicky/Curvation.git
cd Curvation
```

If you just want to start a new project without the Curvation commit history then you can do:

```bash
git clone --depth=1 https://github.com/Anicky/Curvation.git <your-project-name>
```

### Install Dependencies

We have some dependencies in this project: `grunt` and angular framework code (soon...).
Grunt.js help us manage application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].

We have preconfigured `npm` to automatically run `grunt` to init the project, so you can simply do:

```
npm install -g grunt-cli
```
to install the `grunt-cli` dependencie,
then do:
```
npm install
```

Behind the scenes this will also call `grunt init`.  You should find that you have two new
folders in your project :

* `node_modules/` - contains the npm packages for the tools we need
* `public/` - ...

## Run the Game

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

## Contact

For more information on Curvation please check out ...

[git]: http://git-scm.com/
[npm]: https://www.npmjs.org/
[node]: http://nodejs.org
