require('coffee-script/register')
const utils = require('./utils')

const document = {
  create ({design, content, referenceResolver, includeResolver}) {
    const framework = require('@livingdocs/framework')
    framework.design.load(design)

    const doc = framework.create({content, design})
    return doc
  },

  render (doc) {
    return doc.toHtml()
  },

  visit (doc, filter, visitor) {
    utils.visit(doc.componentTree, filter, visitor)
    return doc
  }
}

module.exports = document
