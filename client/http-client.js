const qs = require('qs')
const fetch = require('node-fetch')
const HttpsProxyAgent = require('https-proxy-agent')

module.exports = (config) => {
  // setup proxy agent in case a proxy is configured
  if (!config.agent && config.proxy) {
    config.agent = new HttpsProxyAgent(config.proxy)
  }

  return {
    latestPublications (options) {
      const queryString = getQueryString(options)
      const path = `documents/latestPublications${queryString}`
      return publicApiRequest(path, config)
    },

    latestPublication (options) {
      const path = `documents/${options.documentId}/latestPublication`
      return publicApiRequest(path, config)
    },

    menus (options) {
      const queryString = getQueryString(options)
      const path = `menus/web${queryString}`
      return publicApiRequest(path, config)
    },

    designVersions (options) {
      const path = `designs/${options.name}`
      return regularRequest(path, config)
    },

    design (options) {
      const path = `designs/${options.name}/${options.version}`
      return regularRequest(path, config)
    }
  }
}

function publicApiRequest (path, config) {
  const route = `${config.url}/api/v1/${path}`
  return request(route, config)
}

function regularRequest (path, config) {
  const route = `${config.url}/${path}`
  return request(route, config)
}

async function request (route, config) {
  const options = getOptions(config)
  const response = await fetch(route, options)
  return response.json()
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
  if (config.agent) {
    options.agent = config.agent
  }
  return options
}
