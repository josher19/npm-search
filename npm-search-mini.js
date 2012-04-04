#!/usr/bin/env node

var home=process.env['HOME']

var ncache = require(home + '/.npm/-/all/.cache.json'); typeof ncache;

var keyz=Object.keys(ncache);

// var keys=[]; for(var k in that) keys[keys.length]=k; keys.length;

var descr=keyz.map(function (it,k) { var d=ncache[it].description; return it + " : " + d; }); 

function grep(re) { return descr.filter(function(it){ return it.match(re)}) }

grep.keyz = keyz;
grep.ncache = ncache;

module.exports = grep
