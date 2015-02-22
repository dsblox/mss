(function() {

	// top level ng app is the entry point to everything here - link via html page
	var app = angular.module('gss_client', []);
	
	// top level controller - not sure we'll need this in the end, but I created it
	// in following tutorials
	app.controller('GssController', function() {
		this.products = gems;
		this.message = email;
	});
	
	// this controller is around a message - note we are really not done - just using
	// this to play and start to hook things up.  For now, what it does...
	// . we've created a form on the html page with a message display area on top
	//   and a message input form on the bottom.  Both are linked (2-way bound) to each
	//   other for fun using this controller.
	// . on initialization (again for fun) I called the server for status and drop the
	//   result into the body of the message (displayed in form and message display).
	// . closer to what we'll for for real: when the form is submitted the encryptMessage()
	//   method is invoked and we encrpyt the message and display the "hint" which for now
	//   is the success/error code as the subject in our form.
	// . the idea here was to collect all the building blocks in Angular.js for us to
	//   build a UI that will encrypt and decrypt messages - and to turn those building
	//   blocks into a real UI sometime soon.
	app.controller('MessageController', ['$http', function($http) {
		this.message = {};
		var msg = this; // needed to make "this" available within success functions.
		$http.get("https://localhost:4000/api/securemessage/status").success(function(data) {
			msg.message.body = data;
		});
		
		this.encryptMessage = function() {
			// encrypt the message
			var jsonMsg = {
				Encoded: false,
				Hint: 'test',
				Passphrase: 'rusty',
				Body: this.message.body,
			}
			$http.post("https://localhost:4000/api/securemessage/messages", jsonMsg).success(function(data) {
				jsonResult = data;
				msg.message.subject = jsonResult.Hint;
				msg.message.body = jsonResult.Body;
			});
			this.message = {}; // clear the form
		};
	}]);
	
	// example of a directive - not sure which controller is really being used
	// in this case - so I don't think I'm doing this quite right yet.
	app.directive('messageDisplay', function() {
		return {
			restrict: 'E',
			templateUrl: 'message_display.html',
			controller: function() {
				this.message = {};
			},
			controllerAs: 'message'
		};
	});
	
	// not really using anymore - may need later
	var email = {
		subject: 'Here is that private information.',
		to: 'dsblox@gmail.com',
		from: 'dblock@datto.com',
		body: 'My social security number is 456-1234-789',
	};
	
	// leftover form tutorial - don't really need but kept as a way to see ng-repeat
	var gems = [
		{
			name: 'Ruby',
			price: 49.99,
			description: 'hey good lookin',
			canPurchase: true,
			soldOut: true,
		},
		{
			name: 'Emerald',
			price: 149.99,
			description: 'green is good',
			canPurchase: true,
			soldOut: false,
		}
	];
})();