module.exports = {
	// server port
	port : 3000,

	// title
	title : 's-validator-component',

	// layout
	layout : 'right',

	// compile server
	compileServer : {

		// compile server port
		port : 4000

	},

	// editors
	editors : {
		html : {
			language : 'html',
			data : `
				<div class="container">
					<h1 class="h1 m-b-small">
						Coffeekraken s-validator-component
					</h1>
					<p class="p m-b">
						Provide a nice and easy way to attach some validation rules to any particular form elements and decide how the reply messages will be displayed.
					</p>
					<form onsubmit="if (this.checkValidity()) { alert('submited'); return false; }">
						<input type="email" placeholder="Email address" class="form-input" name="email" required />
						<s-validator on="keyup" for="email"></s-validator>
						<input type="url" placeholder="Website url" class="form-input" name="url" required />
						<s-validator on="keyup" for="url"></s-validator>
						<input type="text" placeholder="Color" class="form-input" name="color" required />
						<s-validator on="keyup" for="color" color></s-validator>
						<input type="text" placeholder="A number between 10 and 20" class="form-input" name="range" min="10" max="20" required />
						<s-validator on="keyup" for="range"></s-validator>
						<input type="text" placeholder="Must be an integer" class="form-input" name="integer" required />
						<s-validator on="keyup" for="integer" integer></s-validator>
						<select class="form-select" name="select" required>
							<option value="">Select a value</option>
							<option value="item1">Option #1</option>
							<option value="item2">Option #2</option>
							<option value="item3">Option #3</option>
						</select>
						<s-validator for="select"></s-validator>
						<h2 class="h6 m-b-small">Required checkbox</h2>
						<div class="form-group">
							<label>
								<input type="checkbox" name="required-checkbox" value="Hello"> Hello
							</label>
							<label>
								<input type="checkbox" name="required-checkbox" value="World"> World
							</label>
						</div>
						<s-validator for="required-checkbox" required></s-validator>
						<h2 class="h6 m-b-small">Select at least 2 options</h2>
						<div class="form-group">
							<label>
								<input type="checkbox" name="min-checkbox" value="Checkbox value #1"> Checkbox value #1
							</label>
							<label>
								<input type="checkbox" name="min-checkbox" value="Checkbox value #2"> Checkbox value #2
							</label>
						</div>
						<s-validator for="min-checkbox" required min="2"></s-validator>
						<input type="submit" class="btn" value="Send" />
					</form>
				</div>
			`
		},
		css : {
			language : 'sass',
			data : `
				@import 'node_modules/coffeekraken-sugar/index';
				@include s-init();
				@include s-classes();
				@include s-typography-classes();
				@include s-button-classes();
				@include s-form-classes();
				body {
					background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
				}
				.container {
					@include s-position(absolute, middle, center);
					min-width:80vw;
				}
				s-validator {
					color: s-color(error);
					display:block;
					padding:0;
					overflow:hidden;
					max-height:0;
					@include s-transition();
					margin-bottom:s-space(default);

					&[active] {
						padding: s-lnf(padding-horizontal) 0 0 0;
						max-height:100px;

					}
				}
				[dirty][valid] {
					border:1px solid s-color(success) !important;
				}
				[dirty][invalid] {
					border:1px solid s-color(error) !important;
				}
			`
		},
		js : {
			language : 'js',
			data : `
				import 'webcomponents.js/webcomponents-lite'
				import SValidatorComponent from './dist/index'
			`
		}
	}
}
