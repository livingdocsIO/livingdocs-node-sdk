'use strict'

global.__testsRunInNode = true

// Chai
global.chai = require('chai')
global.expect = global.chai.expect

// Load chai extensions
require('./chai_helpers')
