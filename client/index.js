const createService = require('./http-client')

module.exports = class Client {
  constructor (config) {
    const validatedConfig = validateConfig(config)
    this.service = createService(validatedConfig)
  }

  async getPublication (options) {
    return await this.service.latestPublication(options)
  }

  async getPublications (options) {
    const limit = 10
    const optionsWithDefaults = {limit, ...options}

    return await this.service.latestPublications(optionsWithDefaults)
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
