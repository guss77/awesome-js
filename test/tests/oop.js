/*
 * OOP testing for awesome-js
 */
describe('Awesome JS OO',function() {
	it('create classes', function() {
		var MyClass = awsm().use(function($){
			return $.oop.createClass({
				someMethod: function() { return true; }
			});
		});
		expect(MyClass instanceof Object).toBeTruthy();
		expect(MyClass.prototype.someMethod instanceof Function).toBeTruthy();
		expect((new MyClass()).someMethod instanceof Function).toBeTruthy();
		expect((new MyClass()).someMethod()).toBeTruthy();
	});
	
	it('Extends classes', function() {
		var MyClass = awsm().use(function($) {
			return $.oop.createClass({
				name: null,
				init: function(name) {
					this.name = name;
				},
				greet: function() {
					return 'Hello ' + this.name;
				},
				congratulate: function() {
					return 'Congratulations ' + this.name;
				}
			});
		});
		
		var MyChildClass = awsm().use(function($) {
			return $.oop.createClass(MyClass, {
				greet: function() {
					return 'Ahoy ' + this.name;
				}
			});
		});
		
		expect((new MyClass('spec')).greet()).toEqual('Hello spec');
		expect((new MyChildClass('spec')).greet()).toEqual('Ahoy spec');	
		
		var MyGrandChildClass = awsm().use(function($) {
			return $.oop.createClass(MyChildClass, {
				congratulate: function($super) {
					return 'Lots of ' + $super();
				}
			});
		});
		
		expect((new MyGrandChildClass('spec')).congratulate()).toEqual('Lots of Congratulations spec');
		
	});
	
	it('Support super calls in constructors', function(){
		var MyClass = awsm().use(function($){
			return $.oop.createClass({
				name: null,
				init: function(name) {
					this.name = name;
				},
				greet: function() {
					return 'Hello ' + this.name;
				}
			});
		});
		
		var MyChildClass = awsm().use(function($){
			return $.oop.createClass(MyClass,{
				honorific: null,
				init: function($super,honorific,name) {
					$super(name);
					this.honorific = honorific;
				},
				greet: function($super) {
					return $super().replace(this.name, this.honorific + ' ' + this.name);
				}

			});
		});
		
		expect((new MyChildClass('Mr.','spec')).greet()).toEqual('Hello Mr. spec');
	});
});
