# Genomediff

![Travis build status](https://travis-ci.org/biosustain/genomediff-node.svg)

> Parses strings from files in the GenomeDiff format generated by the breseq variant caller for haploid microbial organisms.

### Installation
----------------
```shell
$(node bin)/npm install genomediff
```
**Note**: It has only been tested with Node 5.


### Usage
---------

**GenomeDiff** strings are parsed using `GenomeDiff.parse(<string>)`. The **GenomeDiff** object contains a `metadata` dict with the meta data, as well as `mutations`, `evidence` and `validation` lists, each containing records of that type. Records can be accessed through this list or by id using `GenomeDiff.parse(<string>)[<id>]`. **GenomeDiff** is an iterable and iterating it will return all properties and records.

For accessing all the records you can use `GenomeDiff.parse('<string>').values()` which returns an iterable but only with the `Record` types.

For accessing the parents of a specific mutation you can use the `parents` property available on each record:
```js
let doc = GenomeDiff.parse('<string>'); // a genomediff string
let someMutation = doc[12]; // mutation with id '12'
someMutation.parents // this will lookup all the parents of the record with id `12` and return as an array of Records
```

If you want to get an attribute from a parent record then you can use the `.get(<attribute>)` method available on the record to do so:
```js
let doc = GenomeDiff.parse('<string>'); // a genomediff string
let someMutation = doc[12]; // mutation with id '12'
someMutation.get('coverage') // this will lookup all the parents of the record with id `12` and return the value of the attribute `coverage` if found on any of the parent records
```

If used with node, you can use the following:
```js
var GenomeDiff = require('genomediff').GenomeDiff;
var fs = require('fs');
var file = fs.readFileSync('<path>', "utf8"); // path to your `.gd` file
var doc = GenomeDiff.parse(file);
```

If used in a browser, use:
```js
import {GenomeDiff} from 'genomediff';
var doc = GenomeDiff.parse('<string>'); // a genomediff string
```
**Note**: Keep in mind that this package requires an ES6 environment in order to work.


### Running Tests
-----------------
A full test suite can be run using `npm test`. If you wish to run tests on file change, use `jasmine-node dist/ --autotest --color --verbose`.

### Development
---------------
When developing, use `tsc --watch` to build the `.ts` files on change.

**Note**: If you add new files or remove files, make sure to edit the `"files"` field in `tsconfig.json`:
```js
"files": [
	"./tsd_typings/tsd.d.ts", // never remove this line
	// add more files after this line
	"./src/parser.ts",
	"./src/parser.spec.ts",
	"./src/records.ts",
	"./src/records.spec.ts",
	"./src/gd.ts",
	"./src/gd.spec.ts"
]
```
