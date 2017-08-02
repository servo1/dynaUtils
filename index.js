module.exports = function () {
	return new utils();
}

function utils() {};

global.wf = function (fary, cb) {
	if (!(Array.isArray(fary) && fary.length > 0 && typeof fary[0])) return false;
	var i = 0,
		len = fary.length,
		fn, last = false;
	fary[0](fall);

	function fall(err, a1, a2, a3, a4, a5, a6, a7) {
		i++;
		if (i == len || err) {
			fn = cb;
			last = true;
		} else {
			fn = fary[i]
		}
		if (typeof fn !== "function") {
			ge("not a function iteration " + i + " len " + len, Error().stack);
			return false;
		}
		var alen = arguments.length;

		switch (alen) {
			case 0:
				if (last) fn();
				else fn(fall);
				break;
			case 1:
				if (last) fn(err);
				else fn(fall);
				break;
			case 2:
				if (last) fn(err, a1);
				else fn(a1, fall);
				break;
			case 3:
				if (last) fn(err, a1, a2);
				else fn(a1, a2, fall);
				break;
			case 4:
				if (last) fn(err, a1, a2, a3);
				else fn(a1, a2, a3, fall);
				break;
			case 5:
				if (last) fn(err, a1, a2, a3, a4);
				else fn(a1, a2, a3, a4, fall);
				break;
			case 6:
				if (last) fn(err, a1, a2, a3, a4, a5);
				else fn(a1, a2, a3, a4, a5, fall);
				break;
			case 7:
				if (last) fn(err, a1, a2, a3, a4, a5, a6);
				else fn(a1, a2, a3, a4, a5, a6, fall);
				break;
			default:
				console.log(__file, __line, "place handler for this?");
				break
		}
	}
}

/*
  pass array or object, second is your callback and thirdly your done function
  on error, it executes done function
*/

global.forEach = function (coll, iter, cb) {
	var i = 0,
		len, isAry = Array.isArray(coll),
		props, last = false;

	if (typeof coll !== "object") return false;

	props = Object.keys(coll);
	len = props.length;


	if (len === 0 && typeof cb == "function") {
		cb(null);
		return;
	}

	iter(coll[props[i]], props[i], each);

	function each(err, a1, a2, a3, a4, a5, a6, a7) {
		i++;
		if (i >= len || err) {
			fn = cb;
			last = true;
		} else fn = iter;
		if (typeof fn !== "function") {
			//console.log("not a function", Error().stack);
			return;
		}
		var alen = arguments.length;
		switch (alen) {
			case 0:
				if (last) fn();
				else fn(coll[props[i]], props[i], each);
				break;
			case 1:
				if (last) fn(err);
				else fn(coll[props[i]], props[i], each);
				break;
			case 2:
				if (last) fn(err, a1);
				else fn(coll[props[i]], props[i], each);
				break;
			case 3:
				if (last) fn(err, a1, a2);
				else fn(coll[props[i]], props[i], each);
				break;
			case 4:
				if (last) fn(err, a1, a2, a3);
				else fn(coll[props[i]], props[i], each);
				break;
			case 5:
				if (last) fn(err, a1, a2, a3, a4);
				else fn(coll[props[i]], props[i], each);
				break;
			case 6:
				if (last) fn(err, a1, a2, a3, a4, a5);
				else fn(coll[props[i]], props[i], each);
				break;
			case 7:
				if (last) fn(err, a1, a2, a3, a4, a5, a6);
				else fn(coll[props[i]], props[i], each);
				break;
			default:
				console.log(__file, __line, "place handler for this?");
				break
		}
	}

}

global.forEach2 = function (coll, iteratee, callback) {

	callback = once(callback || noop);
	var index = 0,
		completed = 0,
		length, isAry = Array.isArray(coll),
		prop;

	if (isAry) length = coll.length;
	else if (typeof coll == "object") length = Object.keys(coll).length;
	else {
		callback(null);
		return false;
	}
	if (length === 0) {
		callback(null);
	}

	function iteratorCallback(err, value) {
		if (err) {
			callback(err);
		} else if ((++completed === length) || typeof value === "undefined") {
			callback(null);
		}
	}
	if (isAry) {
		for (; index < length; index++) {
			iteratee(coll[index], index, onlyOnce(iteratorCallback));
		}
	} else {
		for (prop in coll) {
			iteratee(coll[prop], prop, onlyOnce(iteratorCallback));
		}
	}
}

function once(fn) {
	return function () {
		if (fn === null) return;
		var callFn = fn;
		fn = null;
		callFn.apply(this, arguments);
	};
}

function noop() {};

function onlyOnce(fn) {
	return function () {
		if (fn === null) throw new Error('Callback was already called.');
		fn.apply(this, arguments);
		fn = null;
	};
}

global.ge = function (a1, a2, a3, a4, a5) {
	var args = [];
	if (!Array.isArray(arguments)) {
		for (var i in arguments) {
			args.push(arguments[i]);
		}
	} else args = arguments;
	var temsg = (args[0] ? args[0] : this.emsg);
	if (!temsg) {
		this.emsg = "no error msg set";
	}
	var pstack = false;
	if (typeof args[args.length - 1] == "boolean") {
		pstack = args[args.length - 1];
	}

	var orig = Error.prepareStackTrace;
	Error.prepareStackTrace = function (_, stack) {
		return stack;
	};
	var err = new Error;
	Error.captureStackTrace(err, arguments.callee);
	var stack = err.stack;
	Error.prepareStackTrace = orig;
	var ll = 0;

	var ln = stack[ll].getLineNumber();
	var dirs = stack[ll].getFileName().split('/'),
		cdir = dirs[dirs.length - 2] + '/';
	var fname = cdir + stack[ll].getFileName().split('/').slice(-1)[0];

	this.emsg = null;
	var msgobj = {
		emsg: temsg + ' ' + (pstack ? stack : ""),
		ln: ln,
		file: fname == "undefined/null" ? arguments.callee.caller.toString().split('\n')[0] : fname
	};
	var re = new RegExp(appRoot, "g");
	switch (arguments.length) {
		case (0):
			console.log('\x1b[36m%s\x1b[0m', msgobj.file + ':' + msgobj.ln);
			break;
		case (1):
			console.log('\x1b[36m%s\x1b[0m', msgobj.file + ':' + msgobj.ln, a1);
			break;
		case (2):
			console.log('\x1b[36m%s\x1b[0m', msgobj.file + ':' + msgobj.ln, a1, a2);
			break;
		case (3):
			console.log('\x1b[36m%s\x1b[0m', msgobj.file + ':' + msgobj.ln, a1, a2, a3);
			break;
		case (4):
			console.log('\x1b[36m%s\x1b[0m', msgobj.file + ':' + msgobj.ln, a1, a2, a3, a4);
			break;
		case (5):
			console.log('\x1b[36m%s\x1b[0m', msgobj.file + ':' + msgobj.ln, a1, a2, a3, a4, a5);
			break;
		default:
			console.log('\x1b[36m%s\x1b[0m', msgobj.file + ':' + msgobj.ln, arguments);
			break;
	}
	//, a3, a4, msgobj.emsg.replace(/,/g, '\n').replace(re, '') )
	return msgobj;
}

global.assign = function (obj, keyPath, value, cb) {
	lastKeyIndex = keyPath.length - 1;
	for (var i = 0; i < lastKeyIndex; ++i) {
		key = keyPath[i];
		try {
			if (!(key in obj))
				obj[key] = {}
			obj = obj[key];
		} catch (e) {
			ge(e, key, obj);
		}
	}
	obj[keyPath[lastKeyIndex]] = value;
}


global.recurseDeps = function (deps, root) {
	var nodes = {};
	var nodeCount = 0;
	var ready = [];
	var output = [];

	// build the graph
	function add(element) {
		nodeCount++;
		nodes[element] = {
			needs: [],
			neededBy: [],
			name: element
		};
		if (deps[element]) {
			deps[element].forEach(function (dependency) {
				if (!nodes[dependency]) add(dependency);
				nodes[element].needs.push(nodes[dependency]);
				nodes[dependency].neededBy.push(nodes[element]);
			});
		}
		if (!nodes[element].needs.length) ready.push(nodes[element]);
	}

	if (root) {
		add(root)
	} else {
		for (element in deps) {
			if (!nodes[element]) add(element);
		}
	}


	//sort the graph
	while (ready.length) {
		var dependency = ready.pop();
		output.push(dependency.name);
		dependency.neededBy.forEach(function (element) {
			element.needs = element.needs.filter(function (x) {
				return x != dependency
			})
			if (!element.needs.length) ready.push(element)
		})
	}


	//error-check
	if (output.length != nodeCount) {
		throw "circular dependency detected"
	}
	return output;
}

global.objToStrings = function (obj, pre, sep, sary, ignores) {
	if (!sep) sep = ":";
	if (!pre) pre = "";
	if (!ignores) ignores = [];
	if (!Array.isArray(sary)) sary = [];
	if (typeof obj == "object" && !Array.isArray(obj)) {
		for (var prop in obj) {
			if (!ignores.includes(prop)) {
				if (typeof obj[prop] == "object" && !Array.isArray(obj[prop])) objToStrings(obj[prop], (pre.length > 0 ? pre + ":" + prop : prop), sep, sary, ignores);
				else sary.push([(pre.length > 0 ? pre + ":" + prop : prop), obj[prop]]);
			}
		}
	} else {
		sary.push([pre, obj]);
	}

	return sary;
}

global.byString = function (o, s) {
	s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
	s = s.replace(/^\./, ''); // strip a leading dot
	var a = "";
	if (s.indexOf('/') !== -1) a = s.split('/');
	else if (s.indexOf(':') !== -1) a = s.split(':');
	else if (s.indexOf('.') !== -1) a = s.split('.');
	for (var i = 0, n = a.length; i < n; ++i) {
		var k = a[i];
		if (k in o) {
			o = o[k];
		} else {
			return;
		}
	}
	return o;
}


global.subt = function (str, repl) {
	if (typeof str == "string") {
		var matches = str.match(/{(.*?)}/g);
		return str.replace(/{{(.*?)}}/g, function (match, capture) {
			//console.log(__file, __line, match, capture, repl);
			return repl;
		}); // "gold ring|string"
	} else {
		//console.log(__file, __line, str, repl);
		return str;
	}
}

String.prototype.replaceAll = function (search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};


global.m = {};
global.mem = function () {
	m = process.memoryUsage();
	m = {
		rss: formatBytes(m.rss),
		heapTotal: formatBytes(m.heapTotal),
		heapUsed: formatBytes(m.heapUsed),
	};
	console.log(__file, __line, m);
	setTimeout(function () {
		mem();
	}, 10000)
}


global.isEmpty = function (obj) {
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop))
			return false;
	}
	return JSON.stringify(obj) === JSON.stringify({});
}



if (typeof Object.create === 'function') {
	// implementation from standard node.js 'util' module
	global.inherits = function inherits(ctor, superCtor) {
		ctor.super_ = superCtor;
		ctor.prototype = Object.create(superCtor.prototype, {
			constructor: {
				value: ctor,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
	};
} else {
	// old school shim for old browsers
	global.inherits = function inherits(ctor, superCtor) {
		ctor.super_ = superCtor;
		var TempCtor = function () {};
		TempCtor.prototype = superCtor.prototype;
		ctor.prototype = new TempCtor();
		ctor.prototype.constructor = ctor;
	};
}


global.formatBytes = function (a, b) {
	if (0 == a) return "0 Bytes";
	var c = 1e3,
		d = b || 2,
		e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
		f = Math.floor(Math.log(a) / Math.log(c));
	return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}


global.roleToNum = function (role) {
	var roles = [];
	roles['guest'] = 0;
	roles['customer'] = 1;
	roles['user'] = 2;
	roles['vendor'] = 3;
	roles['admin'] = 4;
	return roles[role];
};

global.getFieldVal = function (name, fields, ary) {
	var ind = getFieldInd(name, fields);
	if (ary[ind]) {
		return ary[ind];
	} else {
		return false;
	}
}

global.getFieldInd = function (field, fields) {
	var count = 0;
	for (var f in fields) {
		//console.log(fields[f]);
		if (f == field) {
			return count;
		}
		count++;
	}
};
if (typeof __stack == "undefined") {
	Object.defineProperty(global, '__stack', {
		get: function () {
			var orig = Error.prepareStackTrace;
			Error.prepareStackTrace = function (_, stack) {
				return stack;
			};
			var err = new Error;
			Error.captureStackTrace(err, arguments.callee);
			var stack = err.stack;
			Error.prepareStackTrace = orig;
			return stack;
		}
	});

	Object.defineProperty(global, '__line', {
		get: function () {
			return __stack[1].getLineNumber();
		}
	});

	Object.defineProperty(global, '__file', {
		get: function () {
			var dirs = __stack[1].getFileName().split('/'),
				cdir = dirs[dirs.length - 2] + '/';
			return cdir + __stack[1].getFileName().split('/').slice(-1)[0];
		}
	});
	global.log = function () {
		console.log([__stack[1].getLineNumber(), __stack[2].getLineNumber()], [__stack[1].getFileName().split('/').slice(-1)[0], __stack[2].getFileName().split('/').slice(-1)[0]], arguments);
	}
}
String.prototype.replaceAll = function (search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};
