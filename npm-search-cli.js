npmsearch = require('./index.js')
if (process.argv.length < 3) {
    var program = process.env['_'] || process.argv[1] ;
    process.stdout.write("Usage: " + program + " searchTerm [command] \nWhere command is search (default), keywords, readme, details, or author\n");
    process.stdout.write("Examples:\n  npmsearch npm\n  npmsearch Josh author\n  npmsearch api kw\n  npmsearch shell # interactive\n")
    process.exit(-1);
}
var shortcut = {'d': 'details', 'a':'author', 'kw':'keywords', 'au':'author', 'k':'keywords'}
function kword(a) { return shortcut[a] || a }
var search = npmsearch[kword(process.argv[3])] || npmsearch
console.info(process.argv.join(" ") + "\n")
var res=search(process.argv[2])
console.info(npmsearch.num().join("\n") || res)
// console.info(res)
