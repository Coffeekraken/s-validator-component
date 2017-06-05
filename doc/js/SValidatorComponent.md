# SValidatorComponent

Extends **SWebComponent**

Provide a nice and easy way to attach some validation rules to any particular form elements and decide how the reply messages will be displayed.


### Example
```html
	<input type="text" name="email" placeholder="Email address" />
<s-validator for="email" email></s-validator>

<input type="text" name="min-max" placeholder="Number between 10 and 20" />
<s-validator for="min-max" min="10" max="20"></s-validator>
```
Author : Olivier Bossel <olivier.bossel@gmail.com>




## Attributes

Here's the list of available attribute to set on the element.

### for

Specify the target of the validator

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **null**


### on

Specify when the validation has to be triggered

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **change**


### active

Tell if the validator is active, meaning that their's a message to display

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **false**


### timeout

Specify a timeout before validating the field

Type : **{ Integer }**

Default : **200**


### validators

Store the specific validators for this particular instance

Type : **{ [Object](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object) }**

Default : **{}**


### validateOrder

Specify the validators order

Type : **{ [Array](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array) }**

Default : **null**


### messages

Store the specific messages wanted for this particular instance

Type : **{ [Object](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object) }**

Default : **{}**


### apply

The function to use to apply the error message

Type : **{ [Object](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object) }**

Default : **{}**


### Validators

Each validators take place as a property that has his argument bound to it like {validator}="{argument}"

Type : **{ Mixed }**



## Properties


### messages

The final messages for this instance

Type : **{ [Object](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object) }**


## Methods


### setMessages

Set the messages


Name  |  Type  |  Description  |  Status  |  Default
------------  |  ------------  |  ------------  |  ------------  |  ------------
messages  |  **{ [Object](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object) }**  |  An object of messages to override  |  required  |

**Static**


### registerValidator

Register a validator


Name  |  Type  |  Description  |  Status  |  Default
------------  |  ------------  |  ------------  |  ------------  |  ------------
name  |  **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**  |  The name of the validator  |  required  |
validator  |  **{ [Object](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object) }**  |  The validator settings  |  required  |

**Static**


### validate

Apply the validation


Name  |  Type  |  Description  |  Status  |  Default
------------  |  ------------  |  ------------  |  ------------  |  ------------
fromSubmit  |  **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**  |  If the validation comes from a submit  |  optional  |  false

Return **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }** True if valid, false if not