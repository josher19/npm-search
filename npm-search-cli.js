npmsearch = require('./index.js')
var shortcut = {'d': 'details', 'a':'author', 'kw':'keywords', 'au':'author', 'k':'keywords'}
function kword(a) { return shortcut[a] || a }
var search = npmsearch[kword(process.argv[3])] || npmsearch
console.info(process.argv.join(" ") + "\n")
var res=search(process.argv[2])
console.info(npmsearch.num().join("\n") || res)
// console.info(res)
