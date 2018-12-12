const createService = require('./http-client')

module.exports = class Client {
  constructor (config) {
    const validatedConfig = validateConfig(config)
    this.service = createService(validatedConfig)
  }

  async getPublications (options) {
    const limit = 10
    const optionsWithDefaults = {limit, ...options}
    return this.service.latestPublications(optionsWithDefaults)
  }

  async getPublication (options = {}) {
    if (!options.documentId) throw requiredParamError('documentId')
    return this.service.latestPublication(options)
  }

  async getMenus (options = {}) {
    return this.service.menus(options)
  }

  async getDesignVersions (options = {}) {
    if (!options.name) throw requiredParamError('name')
    return this.service.designVersions(options)
  }

  async getDesign (options = {}) {
    if (!options.name) throw requiredParamError('name')
    if (!options.version) throw requiredParamError('version')
    return this.service.design(options)
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

function requiredParamError (param) {
  return new Error(`required param "${param}" missing`)
}
