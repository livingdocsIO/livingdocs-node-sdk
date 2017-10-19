const expect = require('chai').expect

const API_TOKEN = process.env.API_TOKEN

const config = {
  host: 'https://service-server-production.livingdocs.io',
  apiToken: API_TOKEN,
  basePath: '/api/v1'
}

function createClient () {
  return require('../../client')(config)
}

describe('client', function () {
  it('should be an object', function () {
    const client = createClient()
    expect(client).to.be.an('object')
  })

  it('should always create a new instance', function () {
    const client = createClient()
    const clientClone = createClient()
    expect(clientClone).to.not.equal(client)
  })

  it('should not accept an undefined or null config', function () {
    expect(() => {
      require('../../client')()
    }).to.throw(Error, 'Config')
  })

  it('should not accept an undefined or null API token', function () {
    expect(() => {
      require('../../client')({})
    }).to.throw(Error, 'API token')
  })

  it('should not accept an undefined or null host', function () {
    expect(() => {
      require('../../client')({apiToken: API_TOKEN})
    }).to.throw(Error, 'Host')
  })

  it('should not accept an undefined or null base path', function () {
    expect(() => {
      require('../../client')({apiToken: API_TOKEN, host: 'https://service-server-production.livingdocs.io'})
    }).to.throw(Error, 'Base path')
  })

  describe('#channels', function () {
    it('should be available', function () {
      const client = createClient()
      expect(client).to.have.property('channels')
    })

    it('should have a list function', function () {
      const client = createClient()
      expect(client.channels.list).to.be.a('function')
    })

    it('should return a list of channels', async function () {
      const client = createClient()
      const channels = await client.channels.list()
      expect(channels).to.deep.equal(require('./response-data/project').channels)
    })
  })

  describe('#publications', function () {
    it('should be a property', function () {
      const client = createClient()
      expect(client).to.have.property('publications')
    })

    it('should have a list function', function () {
      const client = createClient()
      expect(client.publications.list).to.be.a('function')
    })

    it('should return a list of publications', async function () {
      const client = createClient()
      const publications = await client.publications.list('web')
      expect(publications.length).to.equal(29)
    })
  })
})
