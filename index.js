#!/usr/bin/env node

/**
 * # npm-search
 * 
 * * Is `npm search` too slow for you? 
 * * Don't mind slightly out of date information?
 * * Want to be able to "drill-down" to get more details?
 * 
 * This little module will allow you to search the contents of your 
 * local npm cache, usually saved in ~/.npm/-/all/.cache.json 
 * and which has over 8000 entries (as of March 2012).
 */

(function() {

// var sys = require('util'); // only 1 dependency: sys.puts!

// Search your cached npm file: 8355 and counting

var home=process.env['HOME']

var ncache = require(home + '/.npm/-/all/.cache.json'); typeof ncache;

var keyz=Object.keys(ncache);

// var keys=[]; for(var k in that) keys[keys.length]=k; keys.length;

var descr=keyz.map(function (it,k) { var d=ncache[it].description; return it + " : " + d; }); 

/**
 * nsearch(/regex/) will search for all modules in your npm cache containing a description with the word "regex".
 * Can also filter by a function: nsearch(function(d) { return d.length > 240; })
 * will show all entries where the name + description is more than 240 characters long.
 */
function nsearch(re) { 
	var fn = "function" === typeof re ? re : function(it){ return it.match(re)}; 
	return nsearch.last=descr.filter(fn); 
}

nsearch.last = []
nsearch.n = 0

function counter(ra) { var i,cnt={},n; for(i=0; i<ra.length; ++i) { n=ra[i]; cnt[n] = (cnt[n]||0)+1  } return cnt; }
function first(ra) { return ra && (ra[0] || ra) ;}
function pluck(obj, a) { var fn=a; if ("function"!==typeof fn) fn=function(k,v) { return v[a]; }; var k,v, res=[]; for(k in obj) { res.push(fn(k,obj[k])); } return res; }

/** Array of names of all published npm modules */
nsearch.keyz = function() { return keyz; }
/** Object containing all published npm modules */
nsearch.ncache = function() { return ncache; }
/** Details of a module name or number (from last search) */
nsearch.details = function (d) { if (null==d) d=nsearch.n; if (!d.split) d=nsearch.last[nsearch.n=d]||nsearch.last[0]||''; d=d.split(" : ")[0];  return ncache[d] }

/** Show last results with numbers */
nsearch.num = function (q) { if (q) nsearch(q); return nsearch.last.map(function(it,n) { return n + " : " + it; }); }

nsearch.cur = function () { nsearch.n %= nsearch.last.length; return nsearch.last[nsearch.n]; }
/** Next search results */
nsearch.next = function(m) { nsearch.n += (m||1); return nsearch.cur(); }
/** Previous search results */
nsearch.prev = function(m) { if (nsearch.n < 1) nsearch.n += nsearch.last.length; return nsearch.next(-m||-1); }

nsearch.grab = function (line) { return ncache[line] || nsearch.details(line) || nsearch(line); }

/** Get attribute of all modules (could return a very large Array)  */
nsearch.pluck = function (a) { return pluck(ncache, a).filter(function (it) { return it; }); }

/** Author name or name of first maintainers */
function getAuthor(my) { return my.author || first(my.maintainers); }

/** Top NPM authors. */
nsearch.authorCount = function authorCount() {
	var res= keyz.map(function(p) { var a=getAuthor(ncache[p]); return a ? a.name || a : a }); 
	var c=counter(res)
	var p, r=[]; for(p in c) { var cnt = c[p]; r.push([cnt,p]); } 
	var r=r.sort( function(a,b) { return b[0]-a[0] }); 
	return r;
}

/** Show Readme if available */
nsearch.readme = function (d) { var item = nsearch.details(d); process.stdout.write(item.description+'\n'); if (item.readme) process.stdout.write(item.readme + '\n'); return nsearch.next; }

function noop(k,v,i) { return i < 100 && v; }

nsearch.entries = function(fn) { fn=fn || noop; var i=0,k,v,r,res=[]; for(k in ncache) { v = ncache[k]; r = fn(k,v,i++); if (r) res.push(r); } return res; }

/** Search by Keyword. Accepts Regular Expressions such as /jQuery|api/i. */
nsearch.keywords = function(q) { return nsearch.last = nsearch.entries(function(key,entry) { return entry.keywords && String(entry.keywords).match(q) && [key, entry.keywords.toString().replace(q, "[$&]"), entry.description].join(" : ") }) }

/** Search by Author. */
nsearch.author = function(q) { return nsearch.last = nsearch.entries(function(key,entry) { var a=getAuthor(entry); return a && a.name && String(a.name).match(q) && [key, a.name.replace(q, "[$&]"), entry.description].join(" : ") }) }

/** Web address of last result. */
nsearch.web = function(d) { var r=nsearch.details(d).repository; return r && (r.url||r+"").replace(/^git[:@]\/?\/?/, 'http://').replace(".git", "").replace('.com:', ".com/") }

nsearch.search = nsearch

// cli = -> while readline : grab(line)
// while (line = readline()) { sys.puts(nsearch.grab(line)) }
  
module.exports = nsearch
})(this);
