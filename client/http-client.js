const qs = require('qs')
const fetch = require('node-fetch')

module.exports = (config) => {
  return {
    async latestPublications (options) {
      const queryString = getQueryString(options)
      const path = `documents/latestPublications${queryString}`
      return request(path, config)
    },

    async latestPublication (options) {
      const path = `documents/${options.documentId}/latestPublication`
      return request(path, config)
    },

    async menus (options) {
      const queryString = getQueryString(options)
      const path = `menus${queryString}`
      return request(path, config)
    }
  }
}

async function request (path, config) {
  const route = getRoute(path, config)
  const options = getOptions(config)
  const response = await fetch(route, options)
  return response.json()
}

function getRoute (path, config) {
  return `${config.url}/api/v1/${path}`
}

function getQueryString (options) {
  const q = qs.stringify(options)
  return q ? `?${q}` : ''
}

function getOptions (config) {
  return {
    headers: {
      'Authorization': `Bearer ${config.accessToken}`
    }
  }
}
