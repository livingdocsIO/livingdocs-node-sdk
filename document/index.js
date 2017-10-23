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

  async resolveIncludes (doc, includeResolver) {
    const accumulator = []
    doc.componentTree.each((component) => {
      component.directives.eachInclude((includeDirective) => {
        accumulator.push(includeDirective)
      })
    })
    for (const include of accumulator) {
      const includeContent = include.getContent()
      const includeHtml = await includeResolver(includeContent)
      include.resolve(includeHtml)
    }
    return doc
  },

  render (doc) {
    return doc.render()
  }
}

module.exports = document
