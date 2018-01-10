import SWebComponent from 'coffeekraken-sugar/js/core/SWebComponent'
import _extend from 'lodash/extend'
import __closest from 'coffeekraken-sugar/js/dom/closest'
import __isColor from 'coffeekraken-sugar/js/utils/is/color'
import __isEmail from 'coffeekraken-sugar/js/utils/is/email'
import __isUrl from 'coffeekraken-sugar/js/utils/is/url'
import __isNumber from 'coffeekraken-sugar/js/utils/is/number'
import __isInteger from 'coffeekraken-sugar/js/utils/is/integer'
import __autoCast from 'coffeekraken-sugar/js/utils/string/autoCast'
import __uniqid from 'coffeekraken-sugar/js/utils/uniqid'
import __dispatchEvent from 'coffeekraken-sugar/js/dom/dispatchEvent'
import __printf from 'coffeekraken-sugar/js/utils/string/printf'

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
const formsCheckValidityFn = {};
// store the default messages
let __messages = {
	checkboxMin : 'You need to select at least %s option(s)',
	checkboxMax : 'You need to select a maximum of %s option(s)'
};

// store the apply functions
let __applyFns = {
	default : function(targets, message, type) {
		const elm = this.querySelector(`[type="${type}"]`) || document.createElement('div');
		elm.setAttribute('type', type);
		elm.innerHTML = message;
		if ( ! elm.parentNode) {
			this.appendChild(elm);
		}
		return () => {
			if (elm.parentNode) {
				elm.parentNode.removeChild(elm);
			}
		}
	}
}

export default class SValidatorComponent extends SWebComponent {

	/**
	 * Registered validators
	 * @type 	{Object}
	 */
	static _validators = {};

	/**
	 * Store if the field is valid or not
	 * @type 	{Boolean}
	 */
	_isValid = true;

	/**
	 * Store if the field is dirty or not
	 * @type 	{Boolean}
	 */
	_isDirty = false;

	/**
	 * Set the messages
	 * @param 		{Object} 		messages 		An object of messages to override
	 */
	static setMessages(messages = {}) {
		__messages = {
			...__messages,
			...messages
		};
	}

	/**
	 * The final messages for this instance
	 * @type 			{Object}
	 */
	get messages() {
		return {
			...__messages,
			...this.props.messages
		};
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
	static setApplyFns(applyFns = {}) {
		__applyFns = {
			...__applyFns,
			...applyFns
		};
	}

	/**
	 * The final applyFns for this instance
	 * @type 			{Object}
	 */
	get applyFns() {
		return {
			...__applyFns,
			...this.props.applyFns
		};
	}

	/**
	 * Register a validator
	 * @param 	{String} 	name 		The name of the validator
	 * @param 	{Object} 	validator 	The validator settings
	 */
	static registerValidator(name, settings = {}) {
		// check settings
		if ( ! settings.validate || typeof(settings.validate) !== 'function') {
			throw `The validator ${name} need to have a setting property called "validate" that represent the function that return true or false to validate or invalidate the validator`;
		} else if ( ! settings.message || typeof(settings.message) !== 'string') {
			throw `The validator ${name} need to have a setting property called "message" that represent the string message to display when the validation does not pass`;
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
	static get defaultProps() {
		return {

			/**
			 * Specify the target of the validator
			 * @prop
			 * @type 	{String}
			 */
			for : null,

			/**
			 * Specify when the validation has to be triggered
			 * @prop
			 * @type 	{String}
			 */
			on : 'change',

			/**
			 * Tell if the validator is active, meaning that their's a message to display
			 * @physicalProp
			 * @prop
			 * @type 		{Boolean}
			 */
			active : false,

			/**
			 * Specify a timeout before validating the field
			 * @prop
			 * @type 	{Integer}
			 */
			timeout : 200,

			/**
			 * Store the specific validators for this particular instance
			 * @prop
			 * @type 	{Object}
			 */
			validators : {},

			/**
			 * Specify the validators order
			 * @prop
			 * @type 	{Array}
			 */
			validateOrder : null,

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
			messages : {},

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
			applyFns : {},

			/**
			 * @name 	Validators
			 * Each validators take place as a property that has his argument bound to it like {validator}="{argument}"
			 * @prop
			 * @type 	{Mixed}
			 */
		}
	}

	/**
	 * Physical props
	 * @definition 		SWebComponent.physicalProps
	 * @protected
	 */
	static get physicalProps() {
		return ['active'];
	}

	/**
	 * Should accept component prop
	 * @definition 		SWebComponent.shouldComponentAcceptProp
	 * @protected
	 */
	shouldComponentAcceptProp(prop) {
		return true;
	}

	/**
	 * Component will mount
	 * @protected
	 */
	componentWillMount() {
		super.componentWillMount();

		// is already validated
		this._firstTimeValidationDone = false;

		// init properties
		this._isValid = null;
	}

	/**
	 * Mount the component
	 * @protected
	 */
	componentMount() {
		super.componentMount();

		// protect
		if ( ! this.props.for) {
			throw `The SValidatorComponent need a "for" property that target a form input to handle validation for...`;
		}

		const form = this._getForm();
		if (form) {
			form.addEventListener('reset', (e) => {
				// reset the isValid cache to trigger a new validation next time
				this._isValid = null;
			});
		}

		// get the scope to find for fields
		let scope = this._getForm();
		if ( ! scope) scope = document;

		// get the input
		this._targets = scope.querySelectorAll(`[name="${this.props.for}"], #${this.props.for}`);

		// check the target
		if ( ! this._targets) {
			throw `The form field named "${this.props.for}" has not been found in the current document`;
		}

		// make that select, checkbox and radio to validate on change
		if (this._isSelect(this._targets[0])
			|| this._isCheckbox(this._targets[0])
			|| this._isRadio(this._targets[0])
		) {
			this.props.on = 'change';
		}

		// ensure the form has a name or an id
		this._ensureFormHasNameOrId();

		// hook the "checkValidity" standard function of each targets
		// to use the validate method of this component insteadn
		[].forEach.call(this._targets, (target) => {
			// override the checkValidity function on each targets
			target.checkValidity = this.validate.bind(this);
		});

		// extend validators with the static ones
		this._validators = _extend(
			SValidatorComponent._validators,
			this.props.validators
		);

		// apply standard validators
		this._applyStandardValidators();

		// listen when to trigger the validation
		if (this.props.on) {
			[].forEach.call(this._targets, (target) => {
				target._originalValue = this._getElementValue(target);

				// listen new values
				target.addEventListener('paste', this._onNewFieldValue.bind(this));
				target.addEventListener(this.props.on, this._onNewFieldValue.bind(this));

				// first validation will be done on field blur on non checkbox and radio elements
				target.addEventListener('blur', (e) => {
					if (this._isCheckbox(e.target) || this._isRadio(e.target)) return;
					if ( ! this._firstTimeValidationDone) this.validate();
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
	_getElementValue(elm) {
		if (this._isCheckbox(elm)
			|| this._isRadio(elm)) {
			if ( ! elm.checked) return false;
		}
		return elm.value;
	}

	/**
	 * Return if the passed element is a select or not
	 * @param {HTMLElement} elm 	The html element to check
	 * @return 	{Boolean} 			true if is a select, false if not
	 */
	_isSelect(elm) {
		return (elm.tagName && elm.tagName.toLowerCase() === 'select');
	}

	/**
	 * Return if the passed element is a input radio or not
	 * @param {HTMLElement} elm 	The html element to check
	 * @return 	{Boolean} 			true if is radio, false if not
	 */
	_isRadio(elm) {
		return (elm.type && elm.type.toLowerCase() === 'radio');
	}

	/**
	 * Return if the passed element is a input checkbox or not
	 * @param {HTMLElement} elm 	The html element to check
	 * @return 	{Boolean} 			true if is checkbox, false if not
	 */
	_isCheckbox(elm) {
		return (elm.type && elm.type.toLowerCase() === 'checkbox');
	}

	/**
	 * When the field get a new value, launch the validation
	 * @param 		{Event} 		e 		The event that trigget the value update
	 */
	_onNewFieldValue(e) {
		// set the field as dirty
		if (this._getElementValue(e.target) !== e.target._originalValue) {
			e.target._isDirty = true;
		}

		// first validation has to be done on field blur
		if ( ! this._firstTimeValidationDone
			&& ! this._isCheckbox(e.target)
			&& ! this._isRadio(e.target)
		) return;

		// bust the cache when the field is updated
		// to trigger a new validation next time
		this._isValid = null;

		// validate directly if no timeout
		if ( ! this.props.timeout) this.validate();
		else {
			// wait before validating
			clearTimeout(this._timeout);
			this._timeout = setTimeout(() => {
				this.validate();
			}, this.props.timeout);
		}
	}

	/**
	 * Ensure form has a name or an id
	 */
	_ensureFormHasNameOrId() {
		const form = this._getForm();
		if (form) {
			if ( ! form.name && ! form.id) {
				const formId = `s-validator-form-${__uniqid()}`;
				form.setAttribute('id', formId);
				return `form#${formId}`;
			}
		}
	}

	/**
	 * Get form selector
	 * @return 		{String} 			The form selector that target the form that handle the validated field
	 */
	_getFormSelector() {
		const form = this._getForm();
		if (form.name) {
			return `form[name="${form.name}"]`;
		} else if (form.id) {
			return `form#${form.id}`;
		} else {
			const formId = `form-${__uniqid()}`;
			form.setAttribute('id', formId);
			return `form#${formId}`;
		}
	}

	/**
	 * Get form that handle the validated field
	 * @return 		{String} 			The form element that handle the validated field
	 */
	_getForm() {
		if ( this._formElm) return this._formElm;
		if (this._targets && this._targets[0]) {
			this._formElm = __closest(this._targets[0], 'form');
		} else {
			this._formElm = __closest(this, 'form');
		}
		return this._formElm;
	}

	/**
	 * Init the parent form if not already inited by another validator
	 */
	_initParentFormIfNeeded() {
		// try to find the closest form to listen when it is submitted
		const formElm = this._getForm();
		if (formElm) {
			// override the checkValidity function
			// on the form (only once)
			if ( ! formsCheckValidityFn[formElm.name || formElm.id] ) {
				formsCheckValidityFn[formElm.name || formElm.id] = function() {
					// store result
					let res = true;
					// loop on each fields of the form to validate
					formElm._sValidators.forEach((validator) => {
						if ( ! validator.validate(true)) res = false;
					});
					// return the result
					return res;
				}
				formElm.checkValidity = formsCheckValidityFn[formElm.name || formElm.id];

				// do not validate the form with
				// html5 built in validation
				formElm.setAttribute('novalidate', true);

				// check validity on submit
				formElm.addEventListener('submit', (e) => {
					if ( ! formElm.checkValidity()) {
						// e.stopPropagation();
						e.preventDefault();
					}
				});
			}

			// register validator on the form element
			// to be able to check the validity after
			if ( ! formElm._sValidators) formElm._sValidators = [];
			formElm._sValidators.push(this);
		}
	}

	/**
	 * Apply the validation
	 * @param 		{Boolean} 		[fromSubmit=false] 			If the validation comes from a submit
	 * @return 		{Boolean} 									True if valid, false if not
	 */
	validate(fromSubmit = false) {

		// set that we have already done the validation once
		this._firstTimeValidationDone = true;

		// use the cache if possible
		if ( this._isValid !== null) return this._isValid;

		let invalidType = null;
		let applyFn = null;
		let message = null;

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
		if ( ! this._isDirty) return;

		// create the validators array to loop through
		const validatorsList = [];
		for (let name in this.props) {
			// if the prop is not a validator
			// continue to the next prop cause the required validator is ALWAYS the first one
			if ( ! this._validators[name] || name === 'required') continue;
			// add the validator in the list
			validatorsList.push(name);
		}
		if (this.props.required) validatorsList.unshift('required');

		// loop on each validators and launch them
		for (let i=0; i<validatorsList.length; i++) {
			const name = validatorsList[i];

			// get the validator parameters
			let validatorArguments = this.props[name];
			if (typeof(validatorArguments) === 'string') {
				validatorArguments = validatorArguments.split(':').map(val => __autoCast(val) );
			} else {
				validatorArguments = [validatorArguments];
			}

			// prepare array of arguments for validate and message functions
			const validateArguments = [].concat(validatorArguments),
				   messageArguments = [].concat(validatorArguments);

			// add the targets as a first `validate` function arguments
			validateArguments.unshift(this._targets);

			// get the message string
			let messageString = this.messages[name];
			switch(name) {
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
			if ( ! this._validators[name].validate.apply(this, validateArguments)) {

				// set the invalid type
				invalidType = name;

				// set the invalid class on the element itself
				this._isValid = false;

				// get the message
				message = this.messages[name];

				// if a processMessage is present on the validator object, apply it
				if (this._validators[name].processMessage && typeof(this._validators[name].processMessage) === 'function') {
					message = this._validators[name].processMessage.apply(this, messageArguments);
				}

				// apply the error message
				applyFn = this.applyFns[name] || this.applyFns.default;

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
		if ( this._unApply) {
			this._unApply();
			this._unApply = null;
		}

		// apply
		if (applyFn) {
			applyFn = applyFn.bind(this);
			this._unApply = applyFn(this._targets, message, this._invalidType);
		}

		// update the isValid flag
		if ( ! invalidType) {
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
	_applyStandardValidators() {

		// if their's more than 1 target,
		// mean that it's a radio or a checkbox group
		// and we do not get the standard validators
		if (this._targets.length > 1) return;

		// get the type
		const type = this._targets[0].getAttribute('type');

		// switch on type
		switch(type) {
			case 'email':
			case 'integer':
			case 'url':
			case 'number':
			case 'color':
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
			this.setAttribute('range', `${this._targets[0].getAttribute('min')}:${this._targets[0].getAttribute('max')}`);
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
	componentUnmount() {
		super.componentUnmount();
	}

	/**
	 * Check if is valid
	 * @return 		{Boolean} 			true if the validator is valid, false it not
	 * @protected
	 */
	checkValidity() {
		return this.validate(true);
	}

	/**
	 * Render
	 * @protected
	 */
	render() {
		super.render();
		// if is dirty
		if (this._isDirty) {
			if (this._isValid) {
				[].forEach.call(this._targets, (target) => {
					target.removeAttribute('invalid');
					if ( ! target.hasAttribute('valid')) {
						target.setAttribute('valid', true);
					}
				});
			} else {
				[].forEach.call(this._targets, (target) => {
					target.removeAttribute('valid');
					if ( ! target.hasAttribute('invalid')) {
						target.setAttribute('invalid', true);
					}
				});
			}
		}
	}
}

// required validator
SValidatorComponent.registerValidator('required', {
	validate: function(targets) {
		let res = false;
		[].forEach.call(targets, (target) => {
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
	validate : function(targets, min) {
		if ( ! min) throw `The "min" validator need the "props.min" property to be specified...`;
		if (targets.length === 1) {
			// get the value
			return (parseFloat(targets[0].value) >= min);
		} else if (targets.length > 1) {
			// assume that it's some checkboxes
			let checkedCount = 0;
			[].forEach.call(targets, (target) => {
				if (target.checked) checkedCount++;
			});
			// check result
			return (checkedCount >= min);
		}
	},
	message : 'This field value must greater or equal than %s',
	processMessage : function(message, min) {
		return __printf(message, min.toString());
	}
});

// max validator
SValidatorComponent.registerValidator('max', {
	validate : function(targets, max) {
		if ( ! max) throw `The "max" validator need the "props.max" property to be specified...`;
		if (targets.length === 1) {
			// get the value
			return (parseFloat(targets[0].value) <= max);
		} else if (targets.length > 1) {
			// assume that it's some checkboxes
			let checkedCount = 0;
			[].forEach.call(targets, (target) => {
				if (target.checked) checkedCount++;
			});
			// check result
			return (checkedCount <= max);
		}
	},
	message : 'This field value must lower or equal than %s',
	processMessage : function(message, max) {
		return __printf(message, max.toString());
	}
});

// range validator
SValidatorComponent.registerValidator('range', {
	validate : function(targets, min = null, max = null) {
		// check the min and max
		if ( ! SValidatorComponent._validators.min.validate(targets, min)) return false;
		if ( ! SValidatorComponent._validators.max.validate(targets, max)) return false;
		return true;
	},
	message : 'This field must stand between %s and %s',
	processMessage : function(message, min = null, max = null) {
		return __printf(message, min.toString(), max.toString());
	}
});

// maxlength validator
SValidatorComponent.registerValidator('maxlength', {
	validate : function(targets, maxlength) {
		if (targets.length > 1) throw 'The "maxlength" validator does not work on multiple targets fields...';
		return (targets[0].value.toString().length <= maxlength);
	},
	message : 'This field must be shorter than %s',
	processMessage : function(message, maxlength) {
		return __printf(message, maxlength.toString());
	}
});

// pattern validator
SValidatorComponent.registerValidator('pattern', {
	validate : function(targets, pattern) {
		if (targets.length > 1) throw 'The "pattern" validator does not work on multiple targets fields...';
		const reg = new RegExp(pattern);
		return (targets[0].value.toString().match(reg));
	},
	message : 'This field must respect this pattern "%s"',
	processMessage : function(message, pattern) {
		return __printf(message, pattern.toString());
	}
});

// number validator
SValidatorComponent.registerValidator('number', {
	validate : function(targets) {
		if (targets.length > 1) throw 'The "number" validator does not work on multiple targets fields...';
		return __isNumber(targets[0].value);
	},
	message : 'This field must be a number'
});

// integer validator
SValidatorComponent.registerValidator('integer', {
	validate : function(targets) {
		if (targets.length > 1) throw 'The "integer" validator does not work on multiple targets fields...';
		return __isInteger(targets[0].value);
	},
	message : 'This field must be an integer'
});

// color validator
SValidatorComponent.registerValidator('color', {
	validate : function(targets) {
		if (targets.length > 1) throw 'The "color" validator does not work on multiple targets fields...';
		return __isColor(targets[0].value);
	},
	message : 'This field must be a valid color'
});

// email validator
SValidatorComponent.registerValidator('email', {
	validate : function(targets) {
		if (targets.length > 1) throw 'The "email" validator does not work on multiple targets fields...';
		return __isEmail(targets[0].value);
	},
	message : 'This field must be a valid email address'
});

// url validator
SValidatorComponent.registerValidator('url', {
	validate : function(targets) {
		if (targets.length > 1) throw 'The "url" validator does not work on multiple targets fields...';
		return __isUrl(targets[0].value);
	},
	message : 'This field must be a valid url'
});
