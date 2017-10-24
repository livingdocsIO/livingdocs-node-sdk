const createService = require('./http-client')

module.exports = class Client {
  constructor (config) {
    const validatedConfig = validateConfig(config)
    this.service = createService(validatedConfig)
  }

  async getPublications (options) {
    const limit = 10
    const optionsWithDefaults = {limit, ...options}

    return await this.service.latestPublications(optionsWithDefaults)
  }

  async getPublication (options = {}) {
    if (!options.documentId) throw new Error('required param "documentId" missing')
    return await this.service.latestPublication(options)
  }

  async getDocumentLists (options) {
    return await this.service.documentLists(options)
  }

  async getDocumentList (options = {}) {
    if (!options.listId) throw new Error('required param "listId" missing')
    return await this.service.documentList(options)
  }
}

function validateConfig (config) {
  if (!config) {
    throw new Error('Config missing')
  }

  if (!config.accessToken) {
    throw new Error('API token missing')
  }

  if (!config.url) {
    throw new Error('Host missing')
  }

  return config
}
