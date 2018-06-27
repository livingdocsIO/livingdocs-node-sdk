const utils = require('./utils')

const document = {
  create ({design, content, config}) {
    const framework = require('../framework/livingdocs-framework')
    framework.design.resetCache()
    framework.design.load(design)
    framework.config(config)

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

  renderComponent (component) {
    const framework = require('../framework/livingdocs-framework')
    const componentRenderer = framework.Livingdoc.api.ComponentRenderer
    return componentRenderer.renderComponent(component)
  },

  render (doc) {
    return doc.render()
  }
}

module.exports = document
