const qs = require('qs')
const fetch = require('node-fetch')
const HttpsProxyAgent = require('https-proxy-agent')

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
      const path = `menus/web${queryString}`
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
  const options = {
    headers: {
      'Authorization': `Bearer ${config.accessToken}`
    }
  }
  if (config.proxy) {
    options.agent = new HttpsProxyAgent(config.proxy)
  }
  return options
}
