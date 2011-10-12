/**
 * core.js : Class infrastructure for awesome-js
 *
 * This modules provides the window.awsm global entry point and the basic infrastructure
 * for all modules to use.
 *
 * Modules using awesome-js should be created like this:
 * awsm().add('utils.stuff',function($) {
 *  return {
 *	  methodA: function() {
 *	  },
 *	  methodB: function() {
 *	  }
 *  };
 * });
 *
 * Classes based on awesome-js, and having private access to its modules, may be created using something like this:
 * var MyClass = awsm().use(function($){
 *  return $.oop.createClass({
 *	  init: function(somedata) {
 *		  $.ui.createDialog('MyClass constructed!');
 *	  }
 *  });
 * });
 * var myvar = new MyClass('somedata');
 */
(function(){
	// Local bootstrap utilities methods to allow us to bootstrap using OOP

	/**
	 * Standard pre-binding utility with support for "detauld target"
	 * @param {Object} obj Object to pre-bind to or 'undefined' to just pre-bind arguments
	 * @param {function} method Method that will be pre-bound to obj
	 * @param args variable argument list to pre-bind in method call
	 */
	var bindCall = function(obj, method /*, args */) {
		// retain pre-bind args
		var args = Array.prototype.slice.call(arguments,2);
		var treatArgs = args.length > 0 ? 
			function(a) { Array.prototype.unshift.apply(a,args); return a; } : 
			function(a) { return a; };
		return function() {
			if (typeof obj == 'undefined') // binder may not want to replace call target
				obj = this;
			return method.apply(obj, treatArgs(arguments));
		};
	};

	/**
	 * Basic class generation method
	 * @param {Function} $super class constructor to "extends" in a class-oriented way
	 * @param {Object} members property list containing all members (methods and fields)
	 *  for the new class
	 */
	var createClass = function($super,members) {
		if (!$super.prototype) { // If we are not extending an existing class
			members = $super; // because caller used the 1-param shortcut
			$super = null; // so fake it like they used it properly
		}

		// utility to check if a method has $super as its first argument
		var hasSuperArg = function(method){
			var argnames = method.toString().replace(new RegExp('/\\*.*?\\*/'),'').match(/^[^({]+\(\s*([^){},\s]+)/);
			return (argnames && argnames[1] == '$super');
		};

		// utility to pass the super method as the first argument to a method call
		var callWrapper = function(name, method /*[, arg1 [..]]*/){
			if (typeof method != 'function') // sanity test
				return undefined; // this actually happens for classes with default constructors, so just ignore it
			var args = Array.prototype.slice.call(arguments,2);
			args.unshift($super && $super.prototype && $super.prototype[name] instanceof Function ?
				bindCall(this, $super.prototype[name]) : function() {});
			return method.apply(this, args);
		};
		
		// create constructor (the "class") for the new class
		var ctor = function() {
			var args = Array.prototype.slice.call(arguments);
			if (this.init) {
				if (hasSuperArg(this.init)) {
					args.unshift('init',this.init);
					callWrapper.apply(this,args);
				} else {
					this.init.apply(this,args);
				}
			}
			return this;
		};

		// implement prototypical inheritence
		if ($super && $super.prototype) {
			ctor.prototype = new $super();
			ctor.prototype.constructor = ctor;
		}
		
		for (var p in members) {
			if (typeof members[p] == 'function') {
				ctor.prototype[p] = hasSuperArg(members[p]) ? bindCall(undefined,callWrapper,p,members[p]) : members[p];
				ctor.prototype[p].bind = bindCall; // provide bind functionality to my methods
			} else
				ctor.prototype[0] = members[p];
		}

		return ctor;
	};

	var modules = {},
		PublicAPI = createClass({
			add: function(name, module) {
				var moduleContent = module(new PrivateAPI());
				var names = name.toString().split('.');
				while (names.length > 1) {
					name = names.pop();
					moduleContent = { name: moduleContent };
				}
				return (modules[names[0]] = moduleContent);
			},
			use: function(module) {
				return module(new PrivateAPI());
			}
		}),
		PrivateAPI = createClass({
			init: function() {
				for (var module in modules)
					if (!this[module]) this[module] = modules[module];
			}
		});

	// register to the public namespace
	window.awsm = function() {
		return new PublicAPI();
	};

	window.awsm().add('oop',function($){
		return {
			createClass: createClass,
			bind: bindCall
		};
	});

}());
