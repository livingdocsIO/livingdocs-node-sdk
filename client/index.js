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

  async getMenus (options = {}) {
    return await this.service.menus(options)
  }
}

function validateConfig (config) {
  if (!config) {
    throw new Error('Config missing')
  }

  if (!config.accessToken) {
    throw new Error('API accessToken missing')
  }

  if (!config.url) {
    throw new Error('Url missing')
  }

  return config
}
