'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _SWebComponent2 = require('coffeekraken-sugar/js/core/SWebComponent');

var _SWebComponent3 = _interopRequireDefault(_SWebComponent2);

var _extend2 = require('lodash/extend');

var _extend3 = _interopRequireDefault(_extend2);

var _closest = require('coffeekraken-sugar/js/dom/closest');

var _closest2 = _interopRequireDefault(_closest);

var _color = require('coffeekraken-sugar/js/utils/is/color');

var _color2 = _interopRequireDefault(_color);

var _email = require('coffeekraken-sugar/js/utils/is/email');

var _email2 = _interopRequireDefault(_email);

var _yyyymmddDate = require('coffeekraken-sugar/js/utils/is/yyyymmddDate');

var _yyyymmddDate2 = _interopRequireDefault(_yyyymmddDate);

var _ddmmyyyyDate = require('coffeekraken-sugar/js/utils/is/ddmmyyyyDate');

var _ddmmyyyyDate2 = _interopRequireDefault(_ddmmyyyyDate);

var _mmddyyyyDate = require('coffeekraken-sugar/js/utils/is/mmddyyyyDate');

var _mmddyyyyDate2 = _interopRequireDefault(_mmddyyyyDate);

var _url = require('coffeekraken-sugar/js/utils/is/url');

var _url2 = _interopRequireDefault(_url);

var _number = require('coffeekraken-sugar/js/utils/is/number');

var _number2 = _interopRequireDefault(_number);

var _integer = require('coffeekraken-sugar/js/utils/is/integer');

var _integer2 = _interopRequireDefault(_integer);

var _autoCast = require('coffeekraken-sugar/js/utils/string/autoCast');

var _autoCast2 = _interopRequireDefault(_autoCast);

var _uniqid = require('coffeekraken-sugar/js/utils/uniqid');

var _uniqid2 = _interopRequireDefault(_uniqid);

var _dispatchEvent = require('coffeekraken-sugar/js/dom/dispatchEvent');

var _dispatchEvent2 = _interopRequireDefault(_dispatchEvent);

var _printf = require('coffeekraken-sugar/js/utils/string/printf');

var _printf2 = _interopRequireDefault(_printf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('coffeekraken-sugar/js/features/inputAdditionalAttributes');

/**
 * @name 		SValidatorComponent
 * @extends 	SWebComponent
 * Provide a nice and easy way to attach some validation rules to any particular form elements and decide how the reply messages will be displayed.
 *
 * @example 		html
 * <input type="text" name="email" placeholder="Email address" />
 * <s-validator for="email" email></s-validator>
 *
 * <input type="text" name="min-max" placeholder="Number between 10 and 20" />
 * <s-validator for="min-max" min="10" max="20"></s-validator>
 *
 * @author 		Olivier Bossel <olivier.bossel@gmail.com>
 */

// store all the overidded checkValidity function on the forms
var formsCheckValidityFn = {};
// store the default messages
var __messages = {
	checkboxMin: 'You need to select at least %s option(s)',
	checkboxMax: 'You need to select a maximum of %s option(s)'
};

// store the apply functions
var __applyFns = {
	default: function _default(targets, message, type) {
		var elm = this.querySelector('[type="' + type + '"]') || document.createElement('div');
		elm.setAttribute('type', type);
		elm.innerHTML = message;
		if (!elm.parentNode) {
			this.appendChild(elm);
		}
		return function () {
			if (elm.parentNode) {
				elm.parentNode.removeChild(elm);
			}
		};
	}
};

var SValidatorComponent = function (_SWebComponent) {
	_inherits(SValidatorComponent, _SWebComponent);

	function SValidatorComponent() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, SValidatorComponent);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SValidatorComponent.__proto__ || Object.getPrototypeOf(SValidatorComponent)).call.apply(_ref, [this].concat(args))), _this), _this._isValid = true, _this._isDirty = false, _temp), _possibleConstructorReturn(_this, _ret);
	}

	/**
  * Registered validators
  * @type 	{Object}
  */


	/**
  * Store if the field is valid or not
  * @type 	{Boolean}
  */


	/**
  * Store if the field is dirty or not
  * @type 	{Boolean}
  */


	_createClass(SValidatorComponent, [{
		key: 'shouldComponentAcceptProp',


		/**
   * Should accept component prop
   * @definition 		SWebComponent.shouldComponentAcceptProp
   * @protected
   */
		value: function shouldComponentAcceptProp(prop) {
			return true;
		}

		/**
   * Component will mount
   * @protected
   */

	}, {
		key: 'componentWillMount',
		value: function componentWillMount() {
			_get(SValidatorComponent.prototype.__proto__ || Object.getPrototypeOf(SValidatorComponent.prototype), 'componentWillMount', this).call(this);

			// is already validated
			this._firstTimeValidationDone = false;

			// init properties
			this._isValid = null;
		}

		/**
   * Mount the component
   * @protected
   */

	}, {
		key: 'componentMount',
		value: function componentMount() {
			var _this2 = this;

			_get(SValidatorComponent.prototype.__proto__ || Object.getPrototypeOf(SValidatorComponent.prototype), 'componentMount', this).call(this);

			// protect
			if (!this.props.for) {
				throw 'The SValidatorComponent need a "for" property that target a form input to handle validation for...';
			}

			var form = this._getForm();
			if (form) {
				form.addEventListener('reset', function (e) {
					// reset the isValid cache to trigger a new validation next time
					_this2._isValid = null;
				});
			}

			// get the scope to find for fields
			var scope = this._getForm();
			if (!scope) scope = document;

			// get the input
			if (this.props.for instanceof HTMLElement) {
				this._targets = [this.props.for];
			} else if (typeof this.props.for === 'string') {
				this._targets = scope.querySelectorAll('[name="' + this.props.for + '"], #' + this.props.for);
			}

			// check the target
			if (!this._targets) {
				throw 'The form field named "' + this.props.for + '" has not been found in the current document';
			}

			// make that select, checkbox and radio to validate on change
			if (this._isSelect(this._targets[0]) || this._isCheckbox(this._targets[0]) || this._isRadio(this._targets[0])) {
				this.props.on = 'change';
			}

			// ensure the form has a name or an id
			this._ensureFormHasNameOrId();

			// hook the "checkValidity" standard function of each targets
			// to use the validate method of this component insteadn
			[].forEach.call(this._targets, function (target) {
				// override the checkValidity function on each targets
				target.checkValidity = _this2.validate.bind(_this2);
			});

			// extend validators with the static ones
			this._validators = (0, _extend3.default)(SValidatorComponent._validators, this.props.validators);

			// apply standard validators
			this._applyStandardValidators();

			// listen when to trigger the validation
			if (this.props.on) {
				[].forEach.call(this._targets, function (target) {
					target._originalValue = _this2._getElementValue(target);

					// listen new values
					target.addEventListener('paste', _this2._onNewFieldValue.bind(_this2));
					target.addEventListener(_this2.props.on, _this2._onNewFieldValue.bind(_this2));

					// first validation will be done on field blur on non checkbox and radio elements
					target.addEventListener('blur', function (e) {
						if (_this2._isCheckbox(e.target) || _this2._isRadio(e.target)) return;
						if (!_this2._firstTimeValidationDone) _this2.validate();
					});
				});
			}

			// init the parent form element
			this._initParentFormIfNeeded();
		}

		/**
   * Proxy to get the value of an element. If is a checkbox, will return the value or false if not checked
   * @param 	{HTMLElement} 	elm 		The element to process
   * @return 	{Mixed} 					The value of the element
   */

	}, {
		key: '_getElementValue',
		value: function _getElementValue(elm) {
			if (this._isCheckbox(elm) || this._isRadio(elm)) {
				if (!elm.checked) return false;
			}
			return elm.value;
		}

		/**
   * Return if the passed element is a select or not
   * @param {HTMLElement} elm 	The html element to check
   * @return 	{Boolean} 			true if is a select, false if not
   */

	}, {
		key: '_isSelect',
		value: function _isSelect(elm) {
			return elm.tagName && elm.tagName.toLowerCase() === 'select';
		}

		/**
   * Return if the passed element is a input radio or not
   * @param {HTMLElement} elm 	The html element to check
   * @return 	{Boolean} 			true if is radio, false if not
   */

	}, {
		key: '_isRadio',
		value: function _isRadio(elm) {
			return elm.type && elm.type.toLowerCase() === 'radio';
		}

		/**
   * Return if the passed element is a input checkbox or not
   * @param {HTMLElement} elm 	The html element to check
   * @return 	{Boolean} 			true if is checkbox, false if not
   */

	}, {
		key: '_isCheckbox',
		value: function _isCheckbox(elm) {
			return elm.type && elm.type.toLowerCase() === 'checkbox';
		}

		/**
   * When the field get a new value, launch the validation
   * @param 		{Event} 		e 		The event that trigget the value update
   */

	}, {
		key: '_onNewFieldValue',
		value: function _onNewFieldValue(e) {
			var _this3 = this;

			// set the field as dirty
			if (this._getElementValue(e.target) !== e.target._originalValue) {
				e.target._isDirty = true;
			}

			// first validation has to be done on field blur
			if (!this._firstTimeValidationDone && !this._isCheckbox(e.target) && !this._isRadio(e.target)) return;

			// bust the cache when the field is updated
			// to trigger a new validation next time
			this._isValid = null;

			// validate directly if no timeout
			if (!this.props.timeout) this.validate();else {
				// wait before validating
				clearTimeout(this._timeout);
				this._timeout = setTimeout(function () {
					_this3.validate();
				}, this.props.timeout);
			}
		}

		/**
   * Ensure form has a name or an id
   */

	}, {
		key: '_ensureFormHasNameOrId',
		value: function _ensureFormHasNameOrId() {
			var form = this._getForm();
			if (form) {
				if (!form.name && !form.id) {
					var formId = 's-validator-form-' + (0, _uniqid2.default)();
					form.setAttribute('id', formId);
					return 'form#' + formId;
				}
			}
		}

		/**
   * Get form selector
   * @return 		{String} 			The form selector that target the form that handle the validated field
   */

	}, {
		key: '_getFormSelector',
		value: function _getFormSelector() {
			var form = this._getForm();
			if (form.name) {
				return 'form[name="' + form.name + '"]';
			} else if (form.id) {
				return 'form#' + form.id;
			} else {
				var formId = 'form-' + (0, _uniqid2.default)();
				form.setAttribute('id', formId);
				return 'form#' + formId;
			}
		}

		/**
   * Get form that handle the validated field
   * @return 		{String} 			The form element that handle the validated field
   */

	}, {
		key: '_getForm',
		value: function _getForm() {
			if (this._formElm) return this._formElm;
			if (this._targets && this._targets[0]) {
				this._formElm = (0, _closest2.default)(this._targets[0], 'form');
			} else {
				this._formElm = (0, _closest2.default)(this, 'form');
			}
			return this._formElm;
		}

		/**
   * Init the parent form if not already inited by another validator
   */

	}, {
		key: '_initParentFormIfNeeded',
		value: function _initParentFormIfNeeded() {
			// try to find the closest form to listen when it is submitted
			var formElm = this._getForm();
			if (formElm) {
				// override the checkValidity function
				// on the form (only once)
				if (!formsCheckValidityFn[formElm.name || formElm.id]) {
					formsCheckValidityFn[formElm.name || formElm.id] = function () {
						// store result
						var res = true;
						// loop on each fields of the form to validate
						formElm._sValidators.forEach(function (validator) {
							if (!validator.validate(true)) res = false;
						});
						// return the result
						return res;
					};
					formElm.checkValidity = formsCheckValidityFn[formElm.name || formElm.id];

					// do not validate the form with
					// html5 built in validation
					formElm.setAttribute('novalidate', true);

					// check validity on submit
					formElm.addEventListener('submit', function (e) {
						if (!formElm.checkValidity()) {
							// e.stopPropagation();
							e.preventDefault();
						}
					});
				}

				// register validator on the form element
				// to be able to check the validity after
				if (!formElm._sValidators) formElm._sValidators = [];
				formElm._sValidators.push(this);
			}
		}

		/**
   * Apply the validation
   * @param 		{Boolean} 		[fromSubmit=false] 			If the validation comes from a submit
   * @return 		{Boolean} 									True if valid, false if not
   */

	}, {
		key: 'validate',
		value: function validate() {
			var fromSubmit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


			// set that we have already done the validation once
			this._firstTimeValidationDone = true;

			// use the cache if possible
			if (this._isValid !== null) return this._isValid;

			var invalidType = null;
			var applyFn = null;
			var message = null;

			// set that is dirty
			if (fromSubmit) {
				this._isDirty = true;
			} else {
				if (this._targets.length === 1) {
					this._isDirty = this._targets[0]._isDirty || false;
				} else {
					this._isDirty = true;
				}
			}

			// if not dirty, stop here
			if (!this._isDirty) return;

			// create the validators array to loop through
			var validatorsList = [];
			for (var name in this.props) {
				// if the prop is not a validator
				// continue to the next prop cause the required validator is ALWAYS the first one
				if (!this._validators[name] || name === 'required') continue;
				// add the validator in the list
				validatorsList.push(name);
			}
			if (this.props.required) validatorsList.unshift('required');

			// loop on each validators and launch them
			for (var i = 0; i < validatorsList.length; i++) {
				var _name = validatorsList[i];

				// get the validator parameters
				var validatorArguments = this.props[_name];
				if (typeof validatorArguments === 'string') {
					validatorArguments = validatorArguments.split(':').map(function (val) {
						return (0, _autoCast2.default)(val);
					});
				} else {
					validatorArguments = [validatorArguments];
				}

				// prepare array of arguments for validate and message functions
				var validateArguments = [].concat(validatorArguments),
				    messageArguments = [].concat(validatorArguments);

				// add the targets as a first `validate` function arguments
				validateArguments.unshift(this._targets);

				// get the message string
				var messageString = this.messages[_name];
				switch (_name) {
					case 'min':
						if (this._isCheckbox(this._targets[0])) {
							messageString = this.messages['checkboxMin'];
						}
						break;
					case 'max':
						if (this._isCheckbox(this._targets[0])) {
							messageString = this.messages['checkboxMax'];
						}
						break;
				}
				messageArguments.unshift(messageString);

				// process to validation
				if (!this._validators[_name].validate.apply(this, validateArguments)) {

					// set the invalid type
					invalidType = _name;

					// set the invalid class on the element itself
					this._isValid = false;

					// get the message
					message = this.messages[_name];

					// if a processMessage is present on the validator object, apply it
					if (this._validators[_name].processMessage && typeof this._validators[_name].processMessage === 'function') {
						message = this._validators[_name].processMessage.apply(this, messageArguments);
					}

					// apply the error message
					applyFn = this.applyFns[_name] || this.applyFns.default;

					// stop the loop
					break;
				}
			}

			// if it's the same invalid type
			// do nothing
			if (this._invalidType && this._invalidType === invalidType) {
				this._isValid = false;
				return false;
			} else if (invalidType) {
				// save the invalid type
				this._invalidType = invalidType;
			} else {
				this._invalidType = null;
			}

			// unapply
			if (this._unApply) {
				this._unApply();
				this._unApply = null;
			}

			// apply
			if (applyFn) {
				applyFn = applyFn.bind(this);
				this._unApply = applyFn(this._targets, message, this._invalidType);
			}

			// update the isValid flag
			if (!invalidType) {
				this._isValid = true;
			} else {
				this._isValid = false;
			}

			// set the active property
			// if the field is dirty
			if (this._isDirty) {
				if (this._isValid) {
					this.setProp('active', false);
				} else {
					this.setProp('active', true);
				}
			}

			// render
			this.render();

			// the input is valid
			return this._isValid;
		}

		/**
   * Apply standard validators
   * This check the element attributes like the type, required, etc...
   * to apply the standard validators
   */

	}, {
		key: '_applyStandardValidators',
		value: function _applyStandardValidators() {

			// if their's more than 1 target,
			// mean that it's a radio or a checkbox group
			// and we do not get the standard validators
			if (this._targets.length > 1) return;

			// get the type
			var type = this._targets[0].getAttribute('type');

			// switch on type
			switch (type) {
				case 'email':
				case 'integer':
				case 'url':
				case 'number':
				case 'color':
				case 'date':
					this.setAttribute(type, true);
					break;
			}

			// set the type if exist
			if (type) {
				this.setAttribute('type', type);
			}

			// required
			if (this._targets[0].hasAttribute('required')) {
				this.setAttribute('required', true);
			}

			// range
			if (this._targets[0].getAttribute('min') && this._targets[0].getAttribute('max')) {
				this.setAttribute('range', this._targets[0].getAttribute('min') + ':' + this._targets[0].getAttribute('max'));
			} else {
				// max
				if (this._targets[0].getAttribute('max')) {
					this.setAttribute('max', this._targets[0].getAttribute('max'));
				}
				// min
				if (this._targets[0].getAttribute('min')) {
					this.setAttribute('min', this._targets[0].getAttribute('min'));
				}
			}
			// maxlength
			if (this._targets[0].getAttribute('maxlength')) {
				this.setAttribute('maxlength', this._targets[0].getAttribute('maxlength'));
			}
			// pattern
			if (this._targets[0].getAttribute('pattern')) {
				this.setAttribute('pattern', this._targets[0].getAttribute('pattern'));
			}
		}

		/**
   * Unmount the component
   * @protected
   */

	}, {
		key: 'componentUnmount',
		value: function componentUnmount() {
			_get(SValidatorComponent.prototype.__proto__ || Object.getPrototypeOf(SValidatorComponent.prototype), 'componentUnmount', this).call(this);
		}

		/**
   * Check if is valid
   * @return 		{Boolean} 			true if the validator is valid, false it not
   * @protected
   */

	}, {
		key: 'checkValidity',
		value: function checkValidity() {
			return this.validate(true);
		}

		/**
   * Render
   * @protected
   */

	}, {
		key: 'render',
		value: function render() {
			_get(SValidatorComponent.prototype.__proto__ || Object.getPrototypeOf(SValidatorComponent.prototype), 'render', this).call(this);
			// if is dirty
			if (this._isDirty) {
				if (this._isValid) {
					[].forEach.call(this._targets, function (target) {
						target.removeAttribute('invalid');
						if (!target.hasAttribute('valid')) {
							target.setAttribute('valid', true);
						}
					});
				} else {
					[].forEach.call(this._targets, function (target) {
						target.removeAttribute('valid');
						if (!target.hasAttribute('invalid')) {
							target.setAttribute('invalid', true);
						}
					});
				}
			}
		}
	}, {
		key: 'messages',


		/**
   * The final messages for this instance
   * @type 			{Object}
   */
		get: function get() {
			return _extends({}, __messages, this.props.messages);
		}

		/**
   * Set the applyFns
   * @example
   * SValidatorComponent.setApplyFns({
   * 	required: function(targetFormElms, message) {
   * 		this.innerHTML = message;
   * 		// return the `unapply` function
   * 		return () => {
   * 			// undo here...
   * 			this.innerHTML = '';
   * 		}
   * 	}
   * });
   *
   * @param 		{Object} 		applyFns 		An object of apply functions by validator name
   */

	}, {
		key: 'applyFns',


		/**
   * The final applyFns for this instance
   * @type 			{Object}
   */
		get: function get() {
			return _extends({}, __applyFns, this.props.applyFns);
		}

		/**
   * Register a validator
   * @param 	{String} 	name 		The name of the validator
   * @param 	{Object} 	validator 	The validator settings
   */

	}], [{
		key: 'setMessages',


		/**
   * Set the messages
   * @param 		{Object} 		messages 		An object of messages to override
   */
		value: function setMessages() {
			var messages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			__messages = _extends({}, __messages, messages);
		}
	}, {
		key: 'setApplyFns',
		value: function setApplyFns() {
			var applyFns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			__applyFns = _extends({}, __applyFns, applyFns);
		}
	}, {
		key: 'registerValidator',
		value: function registerValidator(name) {
			var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			// check settings
			if (!settings.validate || typeof settings.validate !== 'function') {
				throw 'The validator ' + name + ' need to have a setting property called "validate" that represent the function that return true or false to validate or invalidate the validator';
			} else if (!settings.message || typeof settings.message !== 'string') {
				throw 'The validator ' + name + '\xA0need to have a setting property called "message" that represent the string message to display when the validation does not pass';
			}
			// set the message inside the messages stack
			__messages[name] = settings.message;
			// save the apply function
			if (settings.apply) {
				__applyFns[name] = settings.apply;
			}
			// set the new validator
			SValidatorComponent._validators[name] = settings;
		}

		/**
   * Default props
   * @definition 		SWebComponent.getDefaultProps
   * @protected
   */

	}, {
		key: 'defaultProps',
		get: function get() {
			return {

				/**
     * Specify the target of the validator
     * @prop
     * @type 	{String}
     */
				for: null,

				/**
     * Specify when the validation has to be triggered
     * @prop
     * @type 	{String}
     */
				on: 'change',

				/**
     * Tell if the validator is active, meaning that their's a message to display
     * @physicalProp
     * @prop
     * @type 		{Boolean}
     */
				active: false,

				/**
     * Specify a timeout before validating the field
     * @prop
     * @type 	{Integer}
     */
				timeout: 200,

				/**
     * Store the specific validators for this particular instance
     * @prop
     * @type 	{Object}
     */
				validators: {},

				/**
     * Specify the validators order
     * @prop
     * @type 	{Array}
     */
				validateOrder: null,

				/**
     * Store the specific messages wanted for this particular instance.y
     * This has to be an object structured like so:
     * ```js
     * {
     * 	${validatorName} : 'My cool validator message',
     * 	required : 'This field is required'
     * }
     * ```
     * @prop
     * @type 	{Object}
     */
				messages: {},

				/**
     * The function to use to apply the error message
     * This function has to return a function that unapply the error message.
     * If the apply function set the innerHTML to the message, the returned unapply function should revert that like so:
     * ```js
     * {
     * 	required : function(targetFormElms, message, type) {
     * 		this.innerHTML = message;
     * 		return () => {
     * 			this.innerHTML = '';
     * 		}
     * 	}
     * }
     * ```
     * You can go really fancy with that.
     * @prop
     * @type 	{Object}
     */
				applyFns: {}

				/**
     * @name 	Validators
     * Each validators take place as a property that has his argument bound to it like {validator}="{argument}"
     * @prop
     * @type 	{Mixed}
     */
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
			return ['active'];
		}
	}]);

	return SValidatorComponent;
}(_SWebComponent3.default);

// required validator


SValidatorComponent._validators = {};
exports.default = SValidatorComponent;
SValidatorComponent.registerValidator('required', {
	validate: function validate(targets) {
		var res = false;
		[].forEach.call(targets, function (target) {
			if (target.type && target.type.toLowerCase() === 'checkbox') {
				if (target.checked) res = true;
			} else if (target.value && target.value !== '') {
				res = true;
			}
		});
		return res;
	},
	message: 'This field is required'
});

// min validator
SValidatorComponent.registerValidator('min', {
	validate: function validate(targets, min) {
		if (!min) throw 'The "min" validator need the "props.min" property to be specified...';
		if (targets.length === 1) {
			// get the value
			return parseFloat(targets[0].value) >= min;
		} else if (targets.length > 1) {
			// assume that it's some checkboxes
			var checkedCount = 0;
			[].forEach.call(targets, function (target) {
				if (target.checked) checkedCount++;
			});
			// check result
			return checkedCount >= min;
		}
	},
	message: 'This field value must greater or equal than %s',
	processMessage: function processMessage(message, min) {
		return (0, _printf2.default)(message, min.toString());
	}
});

// max validator
SValidatorComponent.registerValidator('max', {
	validate: function validate(targets, max) {
		if (!max) throw 'The "max" validator need the "props.max" property to be specified...';
		if (targets.length === 1) {
			// get the value
			return parseFloat(targets[0].value) <= max;
		} else if (targets.length > 1) {
			// assume that it's some checkboxes
			var checkedCount = 0;
			[].forEach.call(targets, function (target) {
				if (target.checked) checkedCount++;
			});
			// check result
			return checkedCount <= max;
		}
	},
	message: 'This field value must lower or equal than %s',
	processMessage: function processMessage(message, max) {
		return (0, _printf2.default)(message, max.toString());
	}
});

// range validator
SValidatorComponent.registerValidator('range', {
	validate: function validate(targets) {
		var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
		var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

		// check the min and max
		if (!SValidatorComponent._validators.min.validate(targets, min)) return false;
		if (!SValidatorComponent._validators.max.validate(targets, max)) return false;
		return true;
	},
	message: 'This field must stand between %s and %s',
	processMessage: function processMessage(message) {
		var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
		var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

		return (0, _printf2.default)(message, min.toString(), max.toString());
	}
});

// maxlength validator
SValidatorComponent.registerValidator('maxlength', {
	validate: function validate(targets, maxlength) {
		if (targets.length > 1) throw 'The "maxlength" validator does not work on multiple targets fields...';
		return targets[0].value.toString().length <= maxlength;
	},
	message: 'This field must be shorter than %s',
	processMessage: function processMessage(message, maxlength) {
		return (0, _printf2.default)(message, maxlength.toString());
	}
});

// pattern validator
SValidatorComponent.registerValidator('pattern', {
	validate: function validate(targets, pattern) {
		if (targets.length > 1) throw 'The "pattern" validator does not work on multiple targets fields...';
		var reg = new RegExp(pattern);
		return targets[0].value.toString().match(reg);
	},
	message: 'This field must respect this pattern "%s"',
	processMessage: function processMessage(message, pattern) {
		return (0, _printf2.default)(message, pattern.toString());
	}
});

// number validator
SValidatorComponent.registerValidator('number', {
	validate: function validate(targets) {
		if (targets.length > 1) throw 'The "number" validator does not work on multiple targets fields...';
		return (0, _number2.default)(targets[0].value);
	},
	message: 'This field must be a number'
});

// integer validator
SValidatorComponent.registerValidator('integer', {
	validate: function validate(targets) {
		if (targets.length > 1) throw 'The "integer" validator does not work on multiple targets fields...';
		return (0, _integer2.default)(targets[0].value);
	},
	message: 'This field must be an integer'
});

// color validator
SValidatorComponent.registerValidator('color', {
	validate: function validate(targets) {
		if (targets.length > 1) throw 'The "color" validator does not work on multiple targets fields...';
		return (0, _color2.default)(targets[0].value);
	},
	message: 'This field must be a valid color'
});

// email validator
SValidatorComponent.registerValidator('email', {
	validate: function validate(targets) {
		if (targets.length > 1) throw 'The "email" validator does not work on multiple targets fields...';
		return (0, _email2.default)(targets[0].value);
	},
	message: 'This field must be a valid email address'
});

// date validator
SValidatorComponent.registerValidator('date', {
	validate: function validate(targets) {
		if (targets.length > 1) throw 'The "date" validator does not work on multiple targets fields...';
		return (0, _ddmmyyyyDate2.default)(targets[0].value) || (0, _mmddyyyyDate2.default)(targets[0].value) || (0, _yyyymmddDate2.default)(targets[0].value);
	},
	message: 'This field must be a valid date'
});

// date validator
SValidatorComponent.registerValidator('yyyymmdd', {
	validate: function validate(targets) {
		if (targets.length > 1) throw 'The "yyyymmdd" validator does not work on multiple targets fields...';
		return (0, _yyyymmddDate2.default)(targets[0].value);
	},
	message: 'This field must be a valid yyyy/mm/dd date'
});

// date validator
SValidatorComponent.registerValidator('ddmmyyyy', {
	validate: function validate(targets) {
		if (targets.length > 1) throw 'The "ddmmyyyy" validator does not work on multiple targets fields...';
		return (0, _ddmmyyyyDate2.default)(targets[0].value);
	},
	message: 'This field must be a valid dd/mm/yyyy date'
});

// date validator
SValidatorComponent.registerValidator('mmddyyyy', {
	validate: function validate(targets) {
		if (targets.length > 1) throw 'The "mmddyyyy" validator does not work on multiple targets fields...';
		return (0, _mmddyyyyDate2.default)(targets[0].value);
	},
	message: 'This field must be a valid mm/dd/yyyy date'
});

// url validator
SValidatorComponent.registerValidator('url', {
	validate: function validate(targets) {
		if (targets.length > 1) throw 'The "url" validator does not work on multiple targets fields...';
		return (0, _url2.default)(targets[0].value);
	},
	message: 'This field must be a valid url'
});