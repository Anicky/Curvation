# Curvation

## Introduction
Curvation est un jeu développé par Jérémie Jalouzet / Julien De conti / Claire-Hélène Stenz / Guillaume Thirard.

Le code étant open-source, vous pouvez vous amuser à faire vos propres fork et proposer vos pull request dans le but d'ajouter des fonctionnalités.

## Getting Started

To get you started you can simply clone the Curvation repository and install the dependencies:

### Prerequisites

You need git to clone the Curvation repostory. You can get git from
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

We have preconfigured `npm` to automatically run `grunt` to init the project, so we can simply do:

```
npm install -g grunt-cli
```
to install the `grunt-cli`dependencie,
then do:
```
npm install
```

Behind the scenes this will also call `grunt init`.  You should find that you have two new
folders in your project :

* `node_modules/` - contains the npm packages for the tools we need
* `build/` - ...

## Run the Game

Simply use the index.html in the main folder.

## Using Grunt.js

If you are a developper, you can manually use Grunt.js to manage and update the files by running :

```
grunt init
```

This will generate some needed files into the `build/` folder.

```
grunt watch
```

This will run `init` task automatically whenever watched sources files (within the `src/` folder) change.

```
grunt dev
```

This will run the `init` task then the `watch` automatic task.


## Updating the dependencies

You can update the tool dependencies by running:

```
npm update
```

This will find the latest versions that match the version ranges specified in the `package.json` file.

## Directory Layout

```
build/                    --> description...
  css/                    --> ...
    curvation.min.css     --> ...
  js/
    curvation.min.js      --> ...
libs/                     --> ...
  bootstrap/              --> ...
    bootstrap.min.css     --> ...
    bootstrap.min.css     --> ...
  jquery/                 --> ...
    jquery.min.js         --> ...
  mainloop/               --> ...
    mainloop.min.js       --> ...
src/                      --> ...
  css/                    --> ...
    style.css             --> ...
  js/                     --> ...
    main.js               --> ...
    Player.js             --> ...
    Point.js              --> ...
Gruntfile.js              --> ...
index.html                --> ...
package.json              --> ...
README.md                 --> ...
```

## Contact

For more information on Curvation please check out ...

[git]: http://git-scm.com/
[npm]: https://www.npmjs.org/
[node]: http://nodejs.org
