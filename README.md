Awesome JS:

Awesome JS is an exercise in Javascript framework building. 

The object of this exercise is to create a small and extensible framework that excells at sandboxing and allows
applications to have a minimal footprint on the global namespace of the Javascript container (e.g. a web 
browser's window object, for example) - this can be as small as a single function.

None the less, users should be able to build complex applications using a simple but rich syntax with strong OO 
semantics - specifically using encapsulation data hiding and inheritance.

Awesome JS has two main actions that can be utilized:
* Extending the library with a module
* Using the library with all current modules

To extend the framework's library, call the 'add' function using the following syntax:

	awsm().add('package.name.of.module',function($){
		return // module content, for example a bunch of static utilities:
			{ 
				sayHello: function(name) {
					alert('Hello ' + (!!name ? name : 'world'));
				}
			};
	});

To use the existing set of capabilities, just call 'use', passing it the closure that should be executed. In
both cases ('add' and 'use') Awesome JS will pass a reference to the library as the first argument of the closure,
allowing full access to the existing functionality:

	awsm().use(function($) {
		var BaseClass = $.oop.createClass({
			init: function() {
				alert('BaseClass created');
			}
		});
		
		var ChildClass = $.oop.createClass(BaseClass, {
			init: function($super) {
				$super();
				alert('ChildClass created');
			}
		});
		
		var ref = new ChildClass();
	});

Hint: if you don't care about contaminating the global namespace, you can use Awesome JS like any other OOP helper:

	var MyClass = awsm().use(function($){ return $.oop.createClass({
		init: function() {
		},
		doSomething: function() {
		}
	}) });

The syntax may be a bit verbose though :-)
