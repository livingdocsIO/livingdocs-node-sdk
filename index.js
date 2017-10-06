require('coffee-script/register')
const framework = require('@livingdocs/framework')

module.exports = {
  loadDesign,
  loadDocument
}

function loadDesign (design) {
  this.design = design
  framework.design.load(design)
}

function loadDocument (content, design = this.design) {
  return framework.createLivingdoc({content, design})
}
