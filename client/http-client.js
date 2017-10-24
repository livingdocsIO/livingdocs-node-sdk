const qs = require('qs')
const fetch = require('node-fetch')

module.exports = (config) => {
  return {
    latestPublications: async (options) => {
      const queryString = getQueryString(options)
      const path = `documents/latestPublications${queryString}`
      return await request(path, config)
    },

    latestPublication: async (id) => {
      const path = `documents/${id}/latestPublication`
      return await request(path, config)
    },

    documentLists: async (options) => {
      const queryString = getQueryString(options)
      const path = `document-lists${queryString}`
      return await request(path, config)
    },

    documentList: async (id) => {
      const path = `document-lists/${id}`
      return await request(path, config)
    }
  }
}

async function request (path, config) {
  const route = getRoute(path, config)
  const options = getOptions(config)
  const response = await fetch(route, options)
  return await response.json()
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
