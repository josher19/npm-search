/** npm-search-line is a simple npm-search shell, using the node readline library. */

var readline = require('readline'),
    nsearch = require('./index.js'), 
    sys = require('util'),
    modules = nsearch.keyz(),
    cmds=Object.keys(nsearch) // .filter(function(it) { return typeof nsearch[it] === "function" })

/** Replace left character (default: '[') in msg with color of type 'red', 'green', or 'bold' */
function colorify(msg, type, left, right) {
  if (typeof msg != "string") msg = JSON.stringify(msg);
  if (process.platform !== "win32" && !process.env.NODE_DISABLE_COLORS) {
    c = {
        bold  : '\x1B[0;1m',
        red   : '\x1B[0;31m',
        green : '\x1B[0;32m',
        reset : '\x1B[0m'
    }
    msg = msg.replace(left || /\[/g,  c[type] || c.green).replace(right || /\]/g, c.reset);
  }
  return msg;
}
nsearch.colorify = colorify

/** Return COMMAND MODULE_NAME for auto-completion. */
function completer(line) {
  var completions = cmds, cmd = line
  var args = line.split(/\s+/);
  if (args.length > 1 && args[0] != "help") { completions = modules; cmd = args[1]; }
  var hits = completions.filter(function(c) {
    if (c.indexOf(cmd) == 0) {
      // console.log('bang! ' + c);
      return c;
    }
  });
  return [hits && hits.length ? hits : completions, cmd];
}

/** Peform search and print results */
function run(line) {
  var command, args, results;
  if (line) {
    var args = line.split(/\s+/);
    command = args.shift();
    sys.puts(['nsearch:', command, args].join(" "), '==========');
    results = nsearch[command]
    if (null == results && args && !args.length) { 
		results = nsearch; 
		args = command;
	}
    if ("function" === typeof results) { results = results.call(nsearch, args); nsearch.limit(); }
    if (results && "function" === typeof results.join) results = colorify(results.join("\n"))
    if ("function" !== typeof results) console.info(results);
  }
}

sys.puts('Search for npm packages. Tab to autocomplete.')
rl = readline.createInterface(process.stdin, process.stdout, completer)

rl.on('line', function(cmd) {
  run(cmd.trim());
}).on('close', function() {
  // only gets triggered by ^C or ^D
  sys.puts('goodbye!');
  process.exit(0);
});

// var unjson = function (k,e) { if(typeof e=="string"&&e[0]=="/") return toRegExp(e);  return e; }
// var toRegExp = function (e) { var a=e.split("/"); return new RegExp(a[1],a[2]); }
// RegExp.prototype.toJSON = RegExp.prototype.toString
// require("assert").deepEqual( JSON.parse(JSON.stringify({ author: /Stein/i, description: /^[^H]/ }),unjson),  { author: /Stein/i, description: /^[^H]/ }, "oops")

