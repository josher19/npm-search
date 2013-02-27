# npm-search

 * Is `npm search` too slow for you? 
 * Want to search npm list while offline?
 * Don't mind slightly out of date information?
 * Want to be able to "drill-down" to get more details?

This little module will allow you to search the contents of your
local npm cache, usually saved in ~/.npm/-/all/.cache.json 
and which has over 8000 entries (as of March 2012).

## Usage:

```sh
bin/npmsearch shell
> h[TAB]
> help
```

or in node:

```javascript
nsearch=require('./npm-grep')

nsearch(/mysql/)
// Array of npm entries with "mysql" in the description

nsearch(/mysql/).map(function (description,n) { return n + " : " + description })
// with line numbering

nsearch.num()
// Print previous results with line numbers

nsearch.details(4)
// details about the 4 entry: dbslayer

nsearch.readme()
// print readme

nsearch.next()
// description of the 5th entry

nsearch.details()
// details of the current (5th) entry

nsearch.author(/Joshua/i)
// All projects with Author with the name Joshua

nsearch.keywords(/api|jQuery/i)
// All entries with Keywords of "api" or "jquery"


```

## About

This started when my connection to the npm servers was very slow.
Created some one-line functions in coffee-script to load and display results
(see npm-search-mini.js) and then started adding new features.

## Dependencies 

None! (`readline` and `util` come with node)
