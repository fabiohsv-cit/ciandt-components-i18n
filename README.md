# ciandt-components-i18n
i18n component written in angularjs

### Install

* Install the dependency:

   ```shell
   bower install ciandt-components-i18n --save
   ```
* Add i18n.js to your code:

   ```html
   <script src='assets/libs/ciandt-components-i18n/i18n.js'></script>
   ```
   - note that the base directory used was assets/libs, you should change bower_components to assets/libs or move from bower_components to assets/libs with grunt.
* Include module dependency:

   ```javascript
   angular.module('yourApp', ['ciandt.components.i18n']);
   ```