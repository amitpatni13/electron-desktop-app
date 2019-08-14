# DigibillDesktop

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.6.

## Installation

Run the below steps in order to run the application on your local machine (Electron with Sqlite3):
1) npm install -g electron
2) npm install -g node-gyp
3) npm install
4) npm install electron-rebuild --save-dev
5) npm install electron sqlite3 --save
6) npm install --global --production windows-build-tools (installs python 2.7 and VS2015 library)
7) npm run rebuild
8) If there is error \m switch then open VS Code Installer (C:/users/<user_name>/.windows-build-tools) and on VS Build Tools click Modify and install VS Build Tools v14.0 package and run step 7.
9) If still does not work, then delete the 'uws' folder from node_modules and run step 7. It gets created every time we perform 'npm install'.
10) npm run electron

## Development server

Once the Installation is successful use the below command to run the application on your local machine:
Run `npm run electron` for a dev server.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the Angular part of project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
