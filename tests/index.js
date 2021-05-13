const fs = require('fs')
const assert = require('assert')
const madmiral = require('../lib')
const credentials = JSON.parse(fs.readFileSync('./credentials/credentials.json', 'utf8'))
