const qs = require('qs')
const fetch = require('node-fetch')

function handleResponse (response) {
  const status = response.status
  if (status >= 200 && status < 300) {
    try {
      return response.json()
    } catch (e) {
      throw new Error('Cannot parse JSON...', e)
    }
  }
}

module.exports = class Client {

  constructor ({url, accessToken}) {
    this.url = url
    this.accessToken = accessToken
  }

  async getResource (resourcePath) {
    const options = {'Authorization': `Bearer ${this.accessToken}`}
    const url = `${this.url}${resourcePath}`
    const response = await fetch(url, options)
    return handleResponse(response)
  }

  getPublications (options) {
    const limit = 10
    options = {limit, ...options}
    const q = qs.stringify(options)
    const queryString = q ? `?${q}` : ''
    const resourcePath = `/api/v1/documents/latestPublications${queryString}`
    return this.getResource(resourcePath)
  }

  getPublication ({documentId} = {}) {
    const resourcePath = `/api/v1/documents/${documentId}/latestPublication`
    return this.getResource(resourcePath)
  }

}
