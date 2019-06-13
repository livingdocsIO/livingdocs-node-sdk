const utils = require('./utils')

const defaultConfig = {
  imageServices: {
    liImageProxy: {
      host: 'https://server.livingdocs.io',
      preferWebp: true,
      backgroundImage: {
        maxWidth: 2048
      },
      srcSet: {
        defaultWidth: 1024,
        widths: [2048, 1024, 620, 320],
        sizes: ['100vw']
      }
    },
    imgix: {
      host: 'https://livingdocs-images.imgix.net',
      preferWebp: true,
      backgroundImage: {
        maxWidth: 2048
      },
      srcSet: {
        defaultWidth: 1024,
        widths: [2048, 1024, 620, 320],
        sizes: ['100vw']
      }
    }
  }
}

module.exports = {
  create ({design, content, config = defaultConfig}) {
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
    doc.componentTree.each(component => {
      component.directives.eachInclude(includeDirective => {
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
