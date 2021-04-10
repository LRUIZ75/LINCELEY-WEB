# Linceley

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.3.

## Development server ggg

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Web Page

https://linceley.herokuapp.com/

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Special Code Scaffolding

### Module schematic

Generate a lazy loaded module.

```bash
$ ng g ng-matero:module <module-name>
```
The new module will be created in `routes` folder, it will be added in `routes.module` and its route declaration will be added in `routes-routing.module` automaticly.

### Page schematic

Generate a page component in the module.

```bash
$ ng g ng-matero:page <page-name> -m=<module-name>
```

### Generate a entry component in the page component.

**DON'T DO THIS!**

An entry component is loaded by the class, not by selector
If you don't want this behavior, and instead of that, what you want is a sub-component, then add an angular normal component

```bash
$ ng g ng-matero:page <page-name>/<entry-component-name> -m=<module-name> -e=true
```

### Example

Just two steps after initializing the project, you can get a route page.

```bash
$ ng g ng-matero:module abc
$ ng g ng-matero:page def -m=abc
```

Take a look at `http://localhost:4200/#/abc/def`, enjoy it!

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
