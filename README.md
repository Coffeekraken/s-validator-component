# Coffeekraken s-validator-component <img src=".resources/coffeekraken-logo.jpg" height="25px" />

<p>
	<a href="https://travis-ci.org/Coffeekraken/s-validator-component">
		<img src="https://img.shields.io/travis/Coffeekraken/s-validator-component.svg?style=flat-square" />
	</a>
	<a href="https://www.npmjs.com/package/coffeekraken-s-validator-component">
		<img src="https://img.shields.io/npm/v/coffeekraken-s-validator-component.svg?style=flat-square" />
	</a>
	<a href="https://github.com/coffeekraken/s-validator-component/blob/master/LICENSE.txt">
		<img src="https://img.shields.io/npm/l/coffeekraken-s-validator-component.svg?style=flat-square" />
	</a>
	<!-- <a href="https://github.com/coffeekraken/s-validator-component">
		<img src="https://img.shields.io/npm/dt/coffeekraken-s-validator-component.svg?style=flat-square" />
	</a>
	<a href="https://github.com/coffeekraken/s-validator-component">
		<img src="https://img.shields.io/github/forks/coffeekraken/s-validator-component.svg?style=social&label=Fork&style=flat-square" />
	</a>
	<a href="https://github.com/coffeekraken/s-validator-component">
		<img src="https://img.shields.io/github/stars/coffeekraken/s-validator-component.svg?style=social&label=Star&style=flat-square" />
	</a> -->
	<a href="https://twitter.com/coffeekrakenio">
		<img src="https://img.shields.io/twitter/url/http/coffeekrakenio.svg?style=social&style=flat-square" />
	</a>
	<a href="http://coffeekraken.io">
		<img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=flat-square&label=coffeekraken.io&colorB=f2bc2b&style=flat-square" />
	</a>
</p>

Provide a nice and easy way to attach some validation rules to any particular form elements and decide how the reply messages will be displayed.

## Features

- A bunch of pre-made validators like (required, min, max, range, maxlength, pattern, number, integer, color, email and url)
- Easy to register new validators
- Easy to translate the validators messages
- Handle checkboxes and radios validations
- Easy to customize how errors are displayed (even by validators types)
- Hook the form ```checkValidity``` method to reflect the validations
- And more...

## Table of content

1. **[Demo](http://components.coffeekraken.io/app/s-validator-component)**
2. [Install](#readme-install)
3. [Get Started](#readme-get-started)
4. [Register a new validator](#readme-register-validator)
5. [The `apply` functions](#readme-applyFns)
6. [Javascript API](doc/js)
7. [Sugar Web Components Documentation](https://github.com/Coffeekraken/sugar/blob/master/doc/js/webcomponents.md)
8. [Browsers support](#readme-browsers-support)
9. [Contribute](#readme-contribute)
10. [Who are Coffeekraken?](#readme-who-are-coffeekraken)
11. [Licence](#readme-license)

<a name="readme-install"></a>
## Install

```
npm install coffeekraken-s-validator-component --save
```

<a name="readme-get-started"></a>
## Get Started

First, import the component into your javascript file like so:

```js
import SValidatorComponent from 'coffeekraken-s-validator-component'
```

Then simply use it inside your html like so:

```html
<input type="text" name="url" />
<s-validator for="url" url required></s-validator>

<input type="text" name="range" />
<s-validator for="range" min="10" max="20" required></s-validator>

<!-- grab standard HTML validators from the target -->
<input type="color" name="color" required />
<s-validator for="color"></s-validator>
```

> THe `s-validator` component will grab the standards HTML validators from the target like `min`, `max`, `type="email"`, `type="number"`, `type="integer"`, `type="url"`, `type="color"`, `required`, `maxlength` and `pattern`

<a id="readme-register-validator"></a>
## Register a new validator

To register a custom validator, you just need to use the `registerValidator` method.

```js
// import the component
import SValidatorComponent from 'coffeekraken-s-validator-component'
// register a new validator
SValidatorComponent.registerValidator('my-cool-validator', {
	validate: (targetFormElms, arg1, arg2) => {
		// validate the form elms passed
		// this function has to return either true if valid and false if not
		return true
	},
	message:  (message, arg1, arg2) => {
		// return the actual message to put in the validation component
		// for example, replace a token like : The field need to be lower than %s
		// by using a replace like :
		return message.replace('%s', arg1);
	}
})
```

The `validate` and `message` function takes each at least 1 argument. The `targetFormElms` for the `validate` one, and the corresponding raw validator `message` for the `message` one.
The other arguments are optional but are passed by following this pattern:

### Explaination

In case of a validator that need two parameters like a `range` type of one, it will be used like so:

```html
<s-validator my-range="4:10" for="..."></s-validator>
```

The `range` parameter will be splited by the `:` separator and two additional parameters will be passed to the `validate` and `message` function like so:

```js
SValidatorComponent.registerValidator('my-range', {
	validate: function(targetFormElms, min, max) {
		// this = the component instance
		// min will correspond to 4
		// max will correspond to 10
		// we know that we have only 1 element in the targetFormElms stack
		const value = parseFloat(targetFormElms[0].value);
		return value >= min && value <= max;
	},
	message: 'The value has to be between %min and %max',
	processMessage: function(message, min, max) {
		// this = the component instance
		return message.replace('%min', min).replace('%max',max);
	}
})
```

By doing this principle, your custom validators can have `n` parameters. It totally up to you.

<a id="readme-applyFns"></a>
## The `apply` functions

In order to display the error messages when needed, the component use the concept of `apply` functions.

An `apply` function is just a plain javascript function that apply the error message in the html and return an `unapply` function that revert the `apply` function actions.

The default `apply` function that is used by the component set the error message inside the component itself, and his `unapply` function just clear it with an `innerHTML = '';` statement.

If this behavior suits your need, you can stop here, but you can totally set custom `apply` and `unapply` function to each validators. Here's how to do it:

```js
SValidatorComponent.registerValidator('my-cool-validator', {
	// validate: function...,
	// message: 'My cool message',
	// processMessage: function...,
	apply: function(targetFormElms, message) {
		// for demo purpose, we just inject the message inside the component
		// but you can do fancy stuffs here if you want...
		this.innerHTML = message;
		// return the `unapply` function
		return () => {
			this.innerHTML = '';
		}
	}
});
```

### Override the **default** `apply` function

You can as well override the default `apply` function like so:

```js
SValidatorComponent.setApplyFns({
	default: function(targetFormElms, message, type) {
		// type = the validator type like "required", "min", "max", "range", "my-cool-validator", etc...
		// apply the error message here...
		return () => {
			// undo here...
		}
	}
})
```

<a id="readme-browsers-support"></a>
## Browsers support

| <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" /></br>IE / Edge | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" /></br>Firefox | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" /></br>Chrome | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" /></br>Safari |
| --------- | --------- | --------- | --------- |
| IE11+ | last 2 versions| last 2 versions| last 2 versions

> As browsers are automatically updated, we will keep as reference the last two versions of each but this component can work on older ones as well.

> The webcomponent API (custom elements, shadowDOM, etc...) is not supported in some older browsers like IE10, etc... In order to make them work, you will need to integrate the [corresponding polyfill](https://www.webcomponents.org/polyfills).

<a id="readme-contribute"></a>
## Contribute

This is an open source project and will ever be! You are more that welcomed to contribute to his development and make it more awesome every day.
To do so, you have several possibilities:

1. [Share the love ❤️](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-share-the-love)
2. [Declare issues](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-declare-issues)
3. [Fix issues](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-fix-issues)
4. [Add features](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-add-features)
5. [Build web component](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-build-web-component)

<a id="readme-who-are-coffeekraken"></a>
## Who are Coffeekraken

We try to be **some cool guys** that build **some cool tools** to make our (and yours hopefully) **every day life better**.  

#### [More on who we are](https://github.com/Coffeekraken/coffeekraken/blob/master/who-are-we.md)

<a id="readme-license"></a>
## License

The code is available under the [MIT license](LICENSE.txt). This mean that you can use, modify, or do whatever you want with it. This mean also that it is shipped to you for free, so don't be a hater and if you find some issues, etc... feel free to [contribute](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md) instead of sharing your frustrations on social networks like an asshole...
