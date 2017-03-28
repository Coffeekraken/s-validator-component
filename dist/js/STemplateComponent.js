Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get2 = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _SWebComponent2 = require('coffeekraken-sugar/js/core/SWebComponent');

var _SWebComponent3 = _interopRequireDefault(_SWebComponent2);

var _STemplate = require('coffeekraken-sugar/js/core/STemplate');

var _STemplate2 = _interopRequireDefault(_STemplate);

var _SBinder = require('coffeekraken-sugar/js/classes/SBinder');

var _SBinder2 = _interopRequireDefault(_SBinder);

var _template = require('coffeekraken-sugar/js/dom/template');

var _template2 = _interopRequireDefault(_template);

var _uniqid = require('coffeekraken-sugar/js/utils/uniqid');

var _uniqid2 = _interopRequireDefault(_uniqid);

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _get3 = require('lodash/get');

var _get4 = _interopRequireDefault(_get3);

var _upperFirst = require('coffeekraken-sugar/js/utils/string/upperFirst');

var _upperFirst2 = _interopRequireDefault(_upperFirst);

var _camelize = require('coffeekraken-sugar/js/utils/string/camelize');

var _camelize2 = _interopRequireDefault(_camelize);

var _closest = require('coffeekraken-sugar/js/dom/closest');

var _closest2 = _interopRequireDefault(_closest);

var _whenAttribute = require('coffeekraken-sugar/js/dom/whenAttribute');

var _whenAttribute2 = _interopRequireDefault(_whenAttribute);

var _propertyProxy = require('coffeekraken-sugar/js/utils/objects/propertyProxy');

var _propertyProxy2 = _interopRequireDefault(_propertyProxy);

var _dispatchEvent = require('coffeekraken-sugar/js/dom/dispatchEvent');

var _dispatchEvent2 = _interopRequireDefault(_dispatchEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

if (!window.sugar._sTemplateComponents) window.sugar._sTemplateComponents = {};

var STemplateComponent = function (_SWebComponent) {
	_inherits(STemplateComponent, _SWebComponent);

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
			var _this2 = this;

			_get2(STemplateComponent.prototype.__proto__ || Object.getPrototypeOf(STemplateComponent.prototype), 'componentWillMount', this).call(this);

			// create the templateData stack from the default template data
			this.data = Object.assign({}, this.defaultTemplateData);

			// create a refs
			this.refs = {};

			// new binder
			this._binder = new _SBinder2.default();

			this._nestedComponentsSlots = {};

			// considere the original content has default slot
			this.props.slots['default'] = this.innerHTML.trim();

			// get the slots content
			var slots = this.querySelectorAll('[slot]');
			if (slots.length) {
				[].forEach.call(slots, function (slot) {
					if ((0, _closest2.default)(slot, Object.keys(window.sugar._templateWebComponents).join(',')) !== _this2) return;
					var slotName = slot.getAttribute('slot') || 'default';
					// save the slot
					_this2.props.slots[slotName] = slot.outerHTML.trim();
					slot.parentNode.removeChild(slot);
				});
			}

			// grab the templateString to work with.
			// it can be overrided by passing a string to the render method
			this.templateString = (0, _template2.default)(this.props.template || this, 'string');

			// process the data to allow some features
			// like the mapping of instance property with @,
			// etc...
			for (var key in this.data) {
				// map the data to an instance variable
				if (typeof this.data[key] === 'string') {
					// handle the @... notation in datas
					if (this.data[key].substr(0, 1) === '@') {
						var watchKey = this.data[key].substr(1);
						// set the initial value
						this.data[key] = (0, _get4.default)(this, watchKey);
						// bind the value to the data value
						this._binder.bindObjectPath2ObjectPath(this, watchKey, this, 'data.' + key);
					}
				}

				// bind the component instance to the setting if it is
				// a function
				if (typeof this.data[key] === 'function') {
					this.data[key] = this.data[key].bind(this);
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
			var _this3 = this;

			_get2(STemplateComponent.prototype.__proto__ || Object.getPrototypeOf(STemplateComponent.prototype), 'componentMount', this).call(this);

			// create a component id
			this._templateComponentId = this.getAttribute('s-tplc') || (0, _uniqid2.default)();

			// save it into stack
			if (!window.sugar._sTemplateComponents[this._templateComponentId]) {
				window.sugar._sTemplateComponents[this._templateComponentId] = this;
			}

			// instanciate a new empty STemplate
			this._sTemplate = new _STemplate2.default('', this.data, {
				id: this._templateComponentId,
				autoRenderOnDataUpdate: false, // we would handle this ourself
				beforeRenderFirst: this.templateWillRenderFirst.bind(this),
				afterRenderFirst: function afterRenderFirst(inDomTemplate) {
					_this3._updateRefs();
					_this3.templateDidRenderFirst(inDomTemplate);
				},
				// onBeforeElUpdated : (fromNode, toNode) => {
				// 	if (fromNode.hasAttribute('slot-container')) {
				// 		this._handleSlotNode(fromNode);
				// 	}
				// },
				onBeforeNodeAdded: function onBeforeNodeAdded(node) {
					if (node.hasAttribute('slot-container')) {
						_this3._handleSlotNode(node);
					}
					[].forEach.call(node.querySelectorAll('[slot-container]'), function (slotNode) {
						_this3._handleSlotNode(slotNode);
					});
				},
				afterRender: this.templateDidRender.bind(this),
				onDataUpdate: this.templateWillReceiveData.bind(this),
				shouldTemplateUpdate: this.shouldTemplateUpdate.bind(this)
			});

			// set the dom node
			this._sTemplate.setDomNode(this);
		}
	}, {
		key: '_handleSlotNode',
		value: function _handleSlotNode(slotNode) {
			// check if already been resolved
			if (slotNode.hasAttribute('slot-resolved')) return;
			// get slot name
			var slotName = slotNode.getAttribute('slot-container');
			var slotContent = this._nestedComponentsSlots[slotName];
			// if no slot content, do nothing
			if (!slotContent) return;
			// mark the slode as resolved
			slotNode.setAttribute('slot-resolved', true);
			if (typeof slotContent === 'string') {
				// inject the content
				slotNode.innerHTML = slotContent;
			} else if (slotContent.nodeName) {
				slotNode.appendChild(slotContent);
			}
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

		// shouldComponentUpdate(newProps, oldProps) {
		// 	console.log(newProps, oldProps);
		// 	return false;
		// }

	}, {
		key: '_hash',
		value: function _hash(str) {
			var hash = 0;
			if (str.length == 0) return hash;
			for (i = 0; i < str.length; i++) {
				char = str.charCodeAt(i);
				hash = (hash << 5) - hash + char;
				hash = hash & hash; // Convert to 32bit integer
			}
			return hash;
		}
	}, {
		key: '_prepareTemplateString',
		value: function _prepareTemplateString(templateString) {
			var _this4 = this;

			// wrap the templateString inside the actual tag if needed
			templateString = this._wrapTemplateStringInsideActualTagIfNeeded(templateString);

			// escape < and > inside attributes
			templateString = templateString.replace(/[[\S]+=[\"\']([^"^']*)[\"\']/g, function (attribute) {
				return attribute.replace('<', '&lt;').replace('>', '&gt;');
			});

			// remove all the the nested templates
			var df = new window.DOMParser().parseFromString(templateString, 'text/html');

			// replace default slot
			var slots = df.body.querySelectorAll('slot');
			if (slots.length) {

				// if there's some slots in the template and that
				// it's the first time that we render the template,
				// we empty the component that will be replaced by the
				// sloted template and each slots will be filled by theirs corresponding content
				if (!this._firstTemplateRenderDone) {
					this.innerHTML = '';
				}

				// loop on each founded slots to fill them with their corresponding
				// content
				[].forEach.call(slots, function (slot) {
					var slotName = slot.getAttribute('name') || 'default';
					var slotContent = _this4.props.slots[slotName];
					if (!slotContent) return;
					if (typeof slotContent === 'string') {
						slot.innerHTML = slotContent;
					} else if (slotContent.nodeName) {
						slot.appendChild(slotContent);
					} else {
						return;
					}
					// slot.setAttribute('coco', true);
					slot.setAttribute('slot-resolved', true);
				});
			}

			if (Object.keys(window.sugar._templateWebComponents).length) {
				[].forEach.call(df.querySelectorAll(Object.keys(window.sugar._templateWebComponents).join(',')), function (elm) {
					// console.log(df, df.body.firstChild);
					if (elm !== df.body.firstChild) {

						if (!elm.hasAttribute('slot-container')) {
							var slotId = _this4._hash(elm.innerHTML);
							if (slotId) {
								elm.setAttribute('slot-container', slotId);
								_this4._nestedComponentsSlots[slotId] = elm.innerHTML;
							}
							elm.innerHTML = '';
						}

						// if needed, we mark the element as a template one.
						// the "true" value will be updated by the sTemplate class
						// with the actual templateId later...
						if (!elm.hasAttribute('s-tpl')) {
							elm.setAttribute('s-tpl', true);
						}
					}
				});
			}

			// apply the template id
			df.body.firstChild.setAttribute('s-tpl', this._templateComponentId);

			// apply a s-tpl-node attribute on each items of the template
			// to be able later to identify nodes that belong to the template
			// and others that have maybe been added by another way...
			[].forEach.call(df.body.firstChild.querySelectorAll('*'), function (elm) {
				elm.setAttribute('s-tpl-node', _this4._templateComponentId);
			});

			// get the string back
			templateString = df.body.innerHTML;

			// replace some tokens in the templateString now that we have
			// only the part that actually belong to this component.
			// we will replace the $this, etc... tokens
			templateString = this._replaceTokensInTemplateString(templateString);

			// return the template String
			return templateString.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
		}
	}, {
		key: '_wrapTemplateStringInsideActualTagIfNeeded',
		value: function _wrapTemplateStringInsideActualTagIfNeeded(templateString) {
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
			return templateString;
		}
	}, {
		key: '_replaceTokensInTemplateString',
		value: function _replaceTokensInTemplateString(templateString) {

			// replace all the this. with the proper window.sTemplateDataObjects reference
			// console.log('process', templateString);
			var thisDotReg = new RegExp('\\$this', 'g');
			templateString = templateString.replace(thisDotReg, 'window.sugar._sTemplateComponents.' + this._templateComponentId);

			return templateString;
		}
	}, {
		key: '_updateRefs',
		value: function _updateRefs() {
			var _this5 = this;

			// search for name and id's
			[].forEach.call(this.querySelectorAll('[id],[name]'), function (elm) {
				// get the id or name
				var id = elm.id || elm.getAttribute('name');
				// save the reference
				_this5.refs[id] = elm;
			});
		}

		/**
   * Run each time a data is updated in the template
   * @param 		{Mixed} 		newVal 			The new value
   * @param 		{Mixed} 		oldVal 			The old value
   */

	}, {
		key: 'templateWillReceiveData',
		value: function templateWillReceiveData(newData, previousData) {
			this.render();
		}

		/**
   * Run before the template will first be rendered in the viewport
   * @param 		{String} 				template 				The template to render to the screen
   * @return 		{String} 										The processed template to render
   */

	}, {
		key: 'templateWillRenderFirst',
		value: function templateWillRenderFirst(template) {
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
   * Run after the first render
   * @param 		{HTMLElement} 			inDomTemplate 			The in dom representation of the template
   */

	}, {
		key: 'templateDidRenderFirst',
		value: function templateDidRenderFirst(inDomTemplate) {}
		// do something here if needed


		/**
   * Run before compile the template to test if we need to render it again or not
   * @param 		{Object} 				nextData 				The new data that the template should reflect
   * @return 		{Boolean} 										false if want to prevent the template to be rendered, true otherwise
   */

	}, {
		key: 'shouldTemplateUpdate',
		value: function shouldTemplateUpdate(nextData) {
			// console.log(Object.assign({}, this.data));
			// console.warn(Object.assign({}, nextData));
			// console.error('should', ! _isEqual(this.data, nextData));
			// return ! _isEqual(this.data, nextData);
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
			var templateString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.templateString;

			_get2(STemplateComponent.prototype.__proto__ || Object.getPrototypeOf(STemplateComponent.prototype), 'render', this).call(this);

			// preparing the template
			templateString = this._prepareTemplateString(templateString);

			// console.error('templateString', templateString);
			this._sTemplate.templateString = templateString;

			// render the template
			this._sTemplate.render();

			// flag the fact that the first render has been made
			this._firstTemplateRenderDone = true;

			// set the component as dirty
			if (!this.hasAttribute('s-tplc-dirty')) {
				this.setAttribute('s-tplc-dirty', true);
			}
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
		// get template() {
		// 	// cache
		// 	if ( this._templateCached) return this._templateCached;
		// 	// get the template
		// 	let tpl = __template(this.props.template || this, 'string');
		// 	// save into cache
		// 	this._templateCached = tpl;
		// 	// return the template
		// 	return tpl;
		// }

		// static get mountDependencies() {
		// 	return [function() {
		// 		return new Promise((resolve) => {
		// 			const nestedComponents = this.querySelectorAll(Object.keys(window.sugar._templateWebComponents).join(','));
		// 			console.log(nestedComponents);
		//
		// 			if (nestedComponents) {
		// 				let nestedComponentsReady = nestedComponents.length;
		// 				this.addEventListener('templateComponent:ready', (e) => {
		// 					nestedComponentsReady--;
		// 					if (nestedComponentsReady <= 0) {
		// 						resolve();
		// 					}
		// 				});
		// 			} else {
		// 				// resolve();
		// 			}
		//
		// 			// const closestTemplateComponent = __closest(this, Object.keys(window.sugar._templateWebComponents).join(','));
		// 			// console.log('closest', closestTemplateComponent);
		// 			// if ( ! closestTemplateComponent) {
		// 			// 	resolve();
		// 			// } else {
		// 			// 	resolve(__whenAttribute(closestTemplateComponent, 's-tpl-dirty'));
		// 			// }
		// 		});
		// 	}];
		// }

		/**
   * Css
   * @protected
   */

	}], [{
		key: 'define',
		value: function define(name, component) {
			var ext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			var componentName = (0, _upperFirst2.default)((0, _camelize2.default)(name));
			if (!window.sugar._templateWebComponents[name]) {
				window.sugar._templateWebComponents[name] = component;
			}
			return _SWebComponent3.default.define(name, component, ext);
		}

		/**
   * Default props
   * @definition 		SWebComponent.defaultProps
   * @protected
   */

	}, {
		key: 'css',
		value: function css(componentName, componentNameDash) {
			return '\n\t\t\t' + componentNameDash + ' {\n\t\t\t\tdisplay : block;\n\t\t\t}\n\t\t';
		}
	}, {
		key: 'defaultProps',
		get: function get() {
			return {
				/**
     * The template to use. If not specified, will be the element itself used as template
     * @prop
     * @type 	{String}
     */
				template: null,

				slots: {}
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
}(_SWebComponent3.default);

exports.default = STemplateComponent;