const utils = require('./utils')
const fetch = require('node-fetch')

const defaultConfig = {
  imageServices: {
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

async function getDefaultDesign () {
  const response = await fetch('https://api.livingdocs.io/designs/living-times/0.0.14')
  return await response.json()
}

const document = {
  async create ({design, content, config}) {
    if (!design) {
      design = await getDefaultDesign()
    }
    if (!config) {
      config = defaultConfig
    }
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

module.exports = document
