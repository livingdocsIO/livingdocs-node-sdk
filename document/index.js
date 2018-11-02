const utils = require('./utils')

const document = {

  // @param design {Object}
  //   Serialized Livingdocs Design.
  // @param content {Object}
  //   Serialized Livingdocs Document.
  // @param config {Object}
  create ({design, content, config}) {
    const framework = require('../framework/livingdocs-framework')

    // todo: prevent global cache reset (LP)
    framework.design.resetCache()
    framework.design.load(design)

    // todo: whitelist config properties that can be used here (LP)
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

  // Render a Livingdoc Document.
  // @param {Object}
  //   Livingdocs Document. E.g. built with the `create()` method.
  //
  // @returns {String}
  render (doc) {
    return doc.render()
  },

  // @return {Array of String}
  //   Returns the urls of all stylesheets that should be loaded when
  //   `doc` is displayed in a browser.
  getStylesheets ({doc}) {
    // -> merge with dependencies of `doc`?
    return doc.desgin.dependencies.css
  },

  getScripts ({doc}) {
    // -> merge with dependencies of `doc`?
    return doc.desgin.dependencies.js
  },

  // todo: Add a method to render a complete HTML document
  // (with <head> and <body>) (LP)
  // This document should include the required stylesheets and scripts.
  renderHtmlDocument ({doc}) {
    const cssStr = doc.design.dependencies.printCss()
    const jsStr = doc.design.dependencies.printJs()

    doc.render({
      head: {
        'og:image': '/foo.jpg'
      },
      appendToHead: [cssStr, jsStr],
      includeDesignAssets: true
    })
  }
}

module.exports = document
