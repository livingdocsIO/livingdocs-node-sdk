const _ = require('lodash')

module.exports = {
  visit
}

function visit (componentTree, filter, visitor) {
  let all = false
  if (!visitor && typeof filter === 'function') {
    visitor = filter
    all = true
  }

  componentTree.all((part) => {
    if (all || _.isMatch(part, filter)) {
      visitor(part)
    }
  })
}
