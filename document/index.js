require('coffee-script/register')
const utils = require('./utils')

const document = {
  create ({design, content}) {
    const framework = require('@livingdocs/framework')
    framework.design.load(design)

    const doc = framework.create({content, design})
    return doc
  },

  visit (doc, filter, visitor) {
    utils.visit(doc.componentTree, filter, visitor)
    return doc
  },

  getIncludes (doc) {
    const accumulator = {}
    doc.componentTree.each((component) => {
      component.directives.eachInclude((includeDirective) => {
        const includeContent = includeDirective.getContent()
        const serviceName = includeContent.service
        accumulator[serviceName] = [...(accumulator[serviceName] || []), includeDirective]
      })
    })
    return accumulator
  },

  render (doc) {
    return doc.render()
  }
}

module.exports = document
