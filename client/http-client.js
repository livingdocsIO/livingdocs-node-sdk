const qs = require('qs')
const fetch = require('node-fetch')
const axios = require('axios')

module.exports = (clientConfig) => {
  // setup proxy agent in case a proxy is configured
  let agent = null
  if (clientConfig.agent) {
    agent = clientConfig.agent
  } else if (clientConfig.proxy) {
    const HttpsProxyAgent = require('https-proxy-agent')
    agent = new HttpsProxyAgent(clientConfig.proxy)
  } else if (![null, false].includes(clientConfig.agent)) {
    if (/^https/i.test(clientConfig.url)) {
      const https = require('https')
      agent = new https.Agent({keepAlive: true})
    } else {
      const http = require('http')
      agent = new http.Agent({keepAlive: true})
    }
  }

  const config = {
    ...clientConfig,
    agent,
    userAgent: `livingdocs-node-sdk/${require('../package.json').version} Node.js/${process.version.slice(1)}`, // eslint-disable-line max-len
    proxy: undefined
  }

  const timeout = clientConfig.requestTimeout || 10000
  const axiosClient = axios.create({
    baseURL: clientConfig.url,
    headers: clientConfig.accessToken ? {Authorization: `Bearer ${clientConfig.accessToken}`} : {},
    timeout,
    proxy: clientConfig.proxy
  })

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
      const path = `menus${queryString}`
      return publicApiRequest(path, config)
    },

    designVersions (options) {
      const path = `designs/${options.name}`
      return regularRequest(path, config)
    },

    design (options) {
      const path = `designs/${options.name}/${options.version}`
      return regularRequest(path, config)
    },

    projectDesign (options) {
      const version = options && `/${options.version}` ? options.version : ''
      const path = `design${version}`
      return publicApiRequest(path, config)
    },

    search (options) {
      const queryString = getQueryString(options)
      const path = `publications/search${queryString}`
      return publicApiRequest(path, config)
    },

    mediaLibrary (options) {
      let path
      if (options && options.id) {
        path = `mediaLibrary/${options.id}`
      } else {
        const queryString = getQueryString(options)
        path = `mediaLibrary${queryString}`
      }
      return publicApiRequest(path, config)
    },

    async routing (options) {
      let {path} = options
      if (!path || path === '') throw new Error('Can not resolve undefined or empty path.')
      if (path === '/') path = encodeURIComponent(path)
      try {
        const response = await axiosClient.get(`/api/v1/routing/resolve?path=${path}`, {})
        return response.data
      } catch (e) {
        // in future the LI REST API itself should have this logic
        if (e.response.status === 404) return []
        else return e.response
      }
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
  return {
    agent: config.agent,
    headers: {
      'User-Agent': config.userAgent,
      'Authorization': `Bearer ${config.accessToken}`
    }
  }
}
