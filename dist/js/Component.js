Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get2 = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _STemplateWebComponent = require('coffeekraken-sugar/js/core/STemplateWebComponent');

var _STemplateWebComponent2 = _interopRequireDefault(_STemplateWebComponent);

var _STemplate = require('coffeekraken-sugar/js/core/STemplate');

var _STemplate2 = _interopRequireDefault(_STemplate);

var _template = require('coffeekraken-sugar/js/dom/template');

var _template2 = _interopRequireDefault(_template);

var _uniqid = require('coffeekraken-sugar/js/utils/uniqid');

var _uniqid2 = _interopRequireDefault(_uniqid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STemplateComponent = function (_STemplateWebComponen) {
	_inherits(STemplateComponent, _STemplateWebComponen);

	function STemplateComponent() {
		_classCallCheck(this, STemplateComponent);

		return _possibleConstructorReturn(this, (STemplateComponent.__proto__ || Object.getPrototypeOf(STemplateComponent)).apply(this, arguments));
	}

	_createClass(STemplateComponent, [{
		key: 'componentWillMount',


		/**
   * Component will mount
  	 * @definition 		SWebComponent.componentWillMount
   * @protected
   */
		value: function componentWillMount() {
			_get2(STemplateComponent.prototype.__proto__ || Object.getPrototypeOf(STemplateComponent.prototype), 'componentWillMount', this).call(this);

			// create a component id
			this._templateComponentId = this.getAttribute('s-template-component') || (0, _uniqid2.default)();

			// check if no template specified
			if (!this.template) {
				throw "You have to specify a template either by setting up the props.template variable, by initiating this component on a 'script' tag or on any html element like a 'div' or something...";
			}

			// prepare element
			this._prepareElement();

			// create the templateData stack from the default template data
			this.templateData = Object.assign({}, this.defaultTemplateData);

			// new binder
			this._binder = new SBinder();

			// set some element to ignore on this element
			sTemplateIntegrator.ignore(this, {
				"s-template-component": true,
				"s-template-component-dirty": true
			});

			// set the s-template-component id
			this.setAttribute('s-template-component', this._templateComponentId);

			// process the data to allow some features
			// like the mapping of instance property with @,
			// etc...
			for (var key in this.templateData) {
				// map the data to an instance variable
				if (typeof this.templateData[key] === 'string') {
					// handle the @... notation in datas
					if (this.templateData[key].substr(0, 1) === '@') {
						var watchKey = this.templateData[key].substr(1);
						// set the initial value
						this.templateData[key] = _get(this, watchKey);
						// bind the value to the data value
						this._binder.bindObjectPath2ObjectPath(this, watchKey, this, 'templateData.' + key);
					}
				}
				// bind the component instance to the setting if it is
				// a function
				if (typeof this.templateData[key] === 'function') {
					this.templateData[key] = this.templateData[key].bind(this);
				}
			}
		}

		/**
   * Mount component
   * @definition 		SWebComponent.componentMount
   * @protected
   */

	}, {
		key: 'componentMount',
		value: function componentMount() {
			_get2(STemplateComponent.prototype.__proto__ || Object.getPrototypeOf(STemplateComponent.prototype), 'componentMount', this).call(this);

			// try to get the parent template instance
			this._parentSTemplate = _STemplate2.default.getParentTemplate(this);

			// which compile method to use
			var compile = this.props.compile;
			if (this.templateCompile) {
				compile = this.templateCompile.bind(this);
			}

			// prepare templateString
			this._templateString = this._prepareTemplateString(this.template);

			// instanciate a new STemplate
			this._sTemplate = new _STemplate2.default(this._templateString, this.templateData, {
				id: this._templateComponentId,
				compile: compile,
				beforeCompile: this.templateWillCompile.bind(this),
				afterCompile: this.templateDidCompile.bind(this),
				beforeRender: this.templateWillRender.bind(this),
				afterRender: this.templateDidRender.bind(this),
				onDataUpdate: this._onTemplateDataUpdate.bind(this),
				shouldTemplateUpdate: this.shouldTemplateUpdate.bind(this)
			}, this._parentSTemplate);

			// render the template
			this._sTemplate.render(this);

			// set the component as dirty
			this.setAttribute('s-template-component-dirty', true);
		}

		/**
   * Component unmount
   * @definition 		SWebComponent.componentUnmount
   * @protected
   */

	}, {
		key: 'componentUnmount',
		value: function componentUnmount() {
			_get2(STemplateComponent.prototype.__proto__ || Object.getPrototypeOf(STemplateComponent.prototype), 'componentUnmount', this).call(this);
			// destroy the template
			if (this._sTemplate && this._sTemplate.destroy) {
				this._sTemplate.destroy();
			}
		}

		/**
   * Component will receive prop
   * @definition 		SWebComponent.componentWillReceiveProp
   * @protected
   */

	}, {
		key: 'componentWillReceiveProp',
		value: function componentWillReceiveProp(name, newVal, oldVal) {
			switch (name) {}
		}
	}, {
		key: '_prepareTemplateString',
		value: function _prepareTemplateString(templateString) {
			var _this2 = this;

			// yields
			var hasYields = false;
			templateString = templateString.replace(/<yield\s?(id="([a-zA-Z0-0-_]+)")?\s?\/?>(<\/yield>)?/g, function (item, idAttr, id) {
				hasYields = true;
				// try to get the yield id in the template
				var yieldElm = void 0;
				if (id) {
					yieldElm = _this2.querySelector('yield[id="' + id + '"]');
				} else {
					yieldElm = _this2.querySelector('yield');
				}
				if (!yieldElm) return item;
				// if we have a yield, replace it
				var yieldContent = yieldElm.innerHTML;
				// remove the yield from html
				yieldElm.parentNode.removeChild(yieldElm);
				// return
				return yieldElm.innerHTML;
			});

			// wrap the templateString inside the root node if
			// the root node is not already him
			var tag = this.outerHTML.split(/\s|>/)[0];
			var templateTag = templateString.split(/\s|>/)[0];
			if (tag !== templateTag) {
				// we need to wrap the templateString with the base
				var outer = this.outerHTML;
				var matches = outer.match(/<([a-zA-Z-]+)[^>]*>/);
				if (matches[0] && matches[1]) {
					templateString = '' + matches[0] + templateString + '</' + matches[1] + '>';
				}
			}

			// escape < and > inside attributes
			templateString = templateString.replace(/[[\S]+=[\"\']([^"^']*)[\"\']/g, function (attribute) {
				return attribute.replace('<', '&lt;').replace('>', '&gt;');
			});

			// set a template id to the root node
			templateString = templateString.replace('>', ' s-template-id="' + this._templateComponentId + '">');

			// set a template-node attribute on each of the nodes that are not a template-id
			templateString = templateString.replace(/<[a-zA-Z0-9-]+(?!.*s-template-id)(\s|>)/g, function (itm, s) {
				if (s === '>') {
					return itm.trim().replace('>', '') + ' s-template-node="' + _this2._templateComponentId + '">';
				} else {
					return itm.trim() + ' s-template-node="' + _this2._templateComponentId + '" ';
				}
			});

			// remove all the the nested templates
			var df = new window.DOMParser().parseFromString(templateString, 'text/html');
			[].forEach.call(df.querySelectorAll(Object.keys(window.sugar._templateWebComponents).join(',')), function (elm) {
				if (elm.parentNode.tagName.toLowerCase() !== 'body') {
					elm.innerHTML = '';
				}
			});
			templateString = df.body.innerHTML;

			// return the template String
			return templateString.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
		}
	}, {
		key: '_prepareElement',
		value: function _prepareElement() {
			var _this3 = this;

			[].forEach.call(this.querySelectorAll('*:not([s-template-node])'), function (node) {
				node.setAttribute('s-template-node', _this3._templateComponentId);
			});
		}

		/**
   * Run each time a data is updated in the template
   * @param 		{String} 		name 			The data name
   * @param 		{Mixed} 		newVal 			The new value
   * @param 		{Mixed} 		oldVal 			The old value
   */

	}, {
		key: '_onTemplateDataUpdate',
		value: function _onTemplateDataUpdate(name, newVal, oldVal) {
			var _this4 = this;

			// do nothing if is the same data
			if (newVal === oldVal) return;
			// call the function
			this.templateWillReceiveData && this.templateWillReceiveData(name, newVal, oldVal);
			// stop here if we don't have any templateWillReceiveDatas method
			if (!this.templateWillReceiveDatas) return;
			// ensure that we have a stack to work with
			if (!this._templateWillReceiveDataStack) this._templateWillReceiveDataStack = {};
			// // add the data into the stack
			this._templateWillReceiveDataStack[name] = newVal;
			// // batch the datas
			clearTimeout(this._templateWillReceiveDataTimeout);
			this._templateWillReceiveDataTimeout = setTimeout(function () {
				// 	// call the templateWillReceiveData function
				_this4.templateWillReceiveDatas(Object.assign({}, _this4._templateWillReceiveDataStack));
				// clean the stack
				_this4._templateWillReceiveDataStack = {};
			});
		}

		/**
   * Run before the template will be compiled so that you can have a change to process it if needed
   * before it will be passed to the compile step
   * @param 		{String} 				template 				The template before compilation
   * @return 		{String} 										The processed template to pass to compilation step
   */

	}, {
		key: 'templateWillCompile',
		value: function templateWillCompile(template) {
			return template;
		}

		/**
   * Compile the template has you want
   * @optional
   * @name 		templateCompile
   * @param 		{String} 				template 				The template to compile
   * @param 		{Object} 				data 					The data to compile the template with
   * @return 		{String} 										The compiled template
   */
		// templateCompile(template, data) {
		// 	return template;
		// }

		/**
   * Run after the template has been compiled so that you can have a chance to process it if needed
   * before that the dom will be updated
   * @param 		{String} 			 	compiledTemplate 		The compiled template
   * @return 		{String|HTMLElement} 							The processed template
   */

	}, {
		key: 'templateDidCompile',
		value: function templateDidCompile(template) {
			return template;
		}

		/**
   * Run before the template will be rendered in the viewport
   * @param 		{String} 				template 				The template to render to the screen
   * @return 		{String} 										The processed template to render
   */

	}, {
		key: 'templateWillRender',
		value: function templateWillRender(template) {
			return template;
		}

		/**
   * Run after the template has been rendered in the viewport
   * @param 		{HTMLElement} 			inDomTemplate 			The in dom representation of the template
   */

	}, {
		key: 'templateDidRender',
		value: function templateDidRender(inDomTemplate) {}
		// do something here if needed


		/**
   * Run before compile the template to test if we need to render it again or not
   * @param 		{Object} 				nextData 				The new data that the template should reflect
   * @return 		{Boolean} 										false if want to prevent the template to be rendered, true otherwise
   */

	}, {
		key: 'shouldTemplateUpdate',
		value: function shouldTemplateUpdate(nextData) {
			return true;
		}

		/**
   * Render the component
   * Here goes the code that reflect the this.props state on the actual html element
   * @definition 		SWebComponent.render
   * @protected
   */

	}, {
		key: 'render',
		value: function render() {
			_get2(STemplateComponent.prototype.__proto__ || Object.getPrototypeOf(STemplateComponent.prototype), 'render', this).call(this);
		}
	}, {
		key: 'defaultTemplateData',


		/**
   * Get the default template data for this particular instance
   * @type 		{Object}
   */
		get: function get() {
			var data = window.sugar._webComponentsStack[this._componentName].defaultTemplateData;
			var comp = window.sugar._webComponentsStack[this._componentName];
			while (comp) {
				if (comp.defaultTemplateData) {
					data = _extends({}, comp.defaultTemplateData, data);
				}
				comp = Object.getPrototypeOf(comp);
			}
			return data;
		}

		/**
   * Get the template
   * @type 	{String}
   */

	}, {
		key: 'template',
		get: function get() {
			// cache
			if (this._templateCached) return this._templateCached;
			// get the template
			var tpl = (0, _template2.default)(this.props.template || this, 'string');
			// save into cache
			this._templateCached = tpl;
			// return the template
			return tpl;
		}

		/**
   * Css
   * @protected
   */

	}], [{
		key: 'css',
		value: function css(componentName, componentNameDash) {
			return '\n\t\t\t' + componentNameDash + ' {\n\t\t\t\tdisplay : block;\n\t\t\t}\n\t\t';
		}
	}, {
		key: 'defaultProps',


		/**
   * Default props
   * @definition 		SWebComponent.defaultProps
   * @protected
   */
		get: function get() {
			return {
				/**
     * The compile function to use
     * @prop
     * @type 	{Function}
     */
				compile: null,

				/**
     * The template to use. If not specified, will be the element itself used as template
     * @prop
     * @type 	{String}
     */
				template: null
			};
		}

		/**
   * Physical props
   * @definition 		SWebComponent.physicalProps
   * @protected
   */

	}, {
		key: 'physicalProps',
		get: function get() {
			return [];
		}

		/**
   * Return an object that represent the default data used by the template
   * to render itself
   * @protected
   * @type 		{Object}
   */

	}, {
		key: 'defaultTemplateData',
		get: function get() {
			return {};
		}
	}]);

	return STemplateComponent;
}(_STemplateWebComponent2.default);

exports.default = STemplateComponent;