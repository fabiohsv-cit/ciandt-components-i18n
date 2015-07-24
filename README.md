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

* Requirements:

   - This component uses angular-dynamic-locale to correctly load the $locale after bootstrap.

======

### How To Use

1. **Configuring the default language, supported languages and angular locale path**
   ```javascript
   app.config(['ciandt.components.i18n.LocalizeConfig', function(LocalizeConfig){
     LocalizeConfig.defaultLanguage = 'en'; // default is en
     LocalizeConfig.supportedLanguage = ['en', 'pt']; // detault is en and pt
     LocalizeConfig.localePath = 'assets/libs/angular-i18n/angular-locale_{{locale}}.js'; // this is the default value
   }]);
   ```

2. **Add resources bundle**
   ```javascript
   app.run(['ciandt.components.i18n.Localize', function(Localize){
     Localize.addResource('app/common/i18n/resources_{lang}.json'); // the lang will be replaced with the chosen language
   }]);
   ```
   - the resources file should be in the format below:
   ```json
	{
		"resources": {
			"back": "Voltar",
			"enter": "Entrar",
			"name": "Nome",
			"save": "Salvar",
			"password": "Senha",
			"user": "Usuário",
			"press to save": "Pressione para salvar",
			"press button below to save": "Pressione o botão abaixo para salvar"
		},
		"regexResources": {
			"Would you like to add the product (\w+) to your cart?": "Gostaria de adicionar o produto $1 em seu carrinho de compras?"
		}
	}
   ```
   - the keys in resources should be in lower case
   - the regexResources should be used to store dynamic keys and the resources to store static keys

3. **Get and change language**
   ```javascript
   app.controller(['ciandt.components.i18n.Localize', function(Localize){
     ...
     var lang = Localize.getLanguage();
     ...
     Localize.setLanguage('pt');
     ...
   }]);
   ```
   - if moment.js component is used the method setLanguage will change its locale
   - if you use angular filters, like date and currency, the $locale will be changed and the format will work

3. **Translate**
	```javascript
   app.controller(['ciandt.components.i18n.Localize', function(Localize){
     ...
	 Localize.setLanguage('pt');
	 ...
     alert(Localize.get('Would you like to add the product iPad in your cart?')); // it will be displayed "Gostaria de adicionar o produto iPad em seu carrinho de compras?"
     ...
   }]);
   ```
   ```html
   Like a tag:
   
   <span><i18n>press button below to save</i18n></span>
   
   Or like a attribute:
   
   <button title="Press to save" i18n>Save</button>
   
   if language equal 'pt' will be displayed:
   <button title="Pressione para salvar">Salvar</button>
   
   Or like a filter:
   
   <td>{{value | i18n}}</td>
   ```
   - this component replace attributes alt, title, placeholder and text body