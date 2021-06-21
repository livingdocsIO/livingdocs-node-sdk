'use strict'
/* global chai, __testsRunInNode */

const _omit = require('lodash/omit')
const _size = require('lodash/size')
const _map = require('lodash/map')
const _pick = require('lodash/pick')
const _mapValues = require('lodash/mapValues')

const {HtmlDiffer} = require('html-differ')
const HtmlDifferLogger = require('html-differ/lib/logger')

chai.use(function (_chai, utils) {
  // Use: expect('<div></div>').to.have.same.html('<div></div>')
  // The above does also work if you pass jquery objects or DOM nodes.
  chai.Assertion.addMethod('html', function (expected) {
    const actual = getHtmlString(this._obj)
    expected = getHtmlString(expected)

    expect(actual).to.be.a('string', 'Invalid value for html() chai helper')
    expect(expected).to.be.a('string', 'Invalid expectation for html() chai helper')

    const htmlDiffer = new HtmlDiffer({
      ignoreWhitespaces: true,
      ignoreComments: false
    })

    const diff = htmlDiffer.diffHtml(actual, expected)
    const isEqual = htmlDiffer.isEqual(actual, expected)
    let explanation = HtmlDifferLogger.getDiffText(diff, {charsAroundDiff: 40})

    if (!canUseColorsInConsole()) {
      const rawDiffOutput = JSON.stringify(diff, null, 2)
      explanation = rawDiffOutput
    }

    const assertion = new chai.Assertion(actual)
    assertion.assert(isEqual,
      `Expected to have the same HTML:${explanation}`,
      `Expected not to have the same HTML:${explanation}`,
      expected)
  })

  chai.Assertion.addMethod('properties', function (expected) {
    const message = 'expected obj to contain these properties'

    const value = this.__flags.object
    const propertiesToCheck = Object.keys(expected)
    const subset = _pick(value, propertiesToCheck)

    return new chai.Assertion(subset).to.deep.equal(expected, message)
  })

  // Use: expect({one: true}).to.be.of.size(1)
  chai.Assertion.addMethod('size', function (expected) {
    const assertion = new chai.Assertion(this._obj)

    // -> the interpolations are done by chai
    assertion.assert(_size(this._obj) === expected,
      'expected #{this} to have the size: #{exp}',
      'expected #{this} not to have the size: #{exp}',
      expected)
  })


  // @param expected {array<object>}
  // Use:
  // expect(componentTree).to.have.componentTreeStructure([
  //   {component: 'title', content: {...}}
  // ])
  //
  // or with ids (note: either all components must have ids or none):
  // expect(componentTree).to.have.componentTreeStructure([
  //   {id: 'a', component: 'title', content: {...}}
  // ])
  chai.Assertion.addMethod('componentTreeStructure', function (expected) {
    const serialized = this._obj.serialize()
    const design = serialized.design.name

    const filterContainers = container =>
      _mapValues(container, components => _map(components, filterComponent))

    const compareIds = expected && expected.length && expected[0].id
    const filterComponent = function (input) {
      const component = compareIds
        ? _omit(input, ['identifier'])
        : _omit(input, ['identifier', 'id'])

      component.component = input.identifier.replace(`${design}.`, '')

      if (input.containers) {
        component.containers = filterContainers(component.containers)
      }

      return component
    }

    const structure = _map(serialized.content, filterComponent)

    return new chai.Assertion(structure).to.eql(expected)
  })


  // Use: expect(livingdoc.history).to.have.orderOfEvents(expected)
  chai.Assertion.addMethod('orderOfEvents', function (expected) {
    const undo = _map(this._obj.state.undo, data => data.event)
    const redo = _map(this._obj.state.redo, data => data.event)
    const actual = {}
    if (undo.length) actual.undo = undo
    if (redo.length) actual.redo = redo
    return new chai.Assertion(actual).to.eql(expected)
  })
})


// Helper Methods
// --------------

const getHtmlString = function (obj) {
  if (obj.jquery) obj = obj[0]
  if (obj.outerHTML) obj = obj.outerHTML
  return obj
}


// It seems colors do not work in the karma environment so we substitute
// the feature check with a check for node.
const canUseColorsInConsole = () =>
  (typeof __testsRunInNode !== 'undefined') && (__testsRunInNode === true)
