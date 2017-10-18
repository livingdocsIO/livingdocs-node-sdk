require('coffee-script/register')
const Client = require('./client')

module.exports = {
  Client,
  loadDocument,
  filterComponents,
  render
}

function loadDocument ({content, design, resolveReferences}) {
  const framework = require('@livingdocs/framework')
  framework.design.load(design)
  const document = framework.createLivingdoc({content, design})
  // TODO: resolve references (DI)
  return document
}

function filterComponents (document, filter) {
  if (typeof filter !== 'function') return document
  document.componentTree.each((component) => {
    if (!filter(component)) component.remove()
  })
  return document
}

function render ({document}) {
  return document.toHtml()
}
