const expect = require('chai').expect
const Client = require('../../client')

const API_TOKEN = 'faketoken'

const defaultConfig = {
  url: 'https://server.livingdocs.io',
  accessToken: API_TOKEN
}

const createClient = (config) => new Client(config)

describe('client', function () {
  const client = createClient(defaultConfig)
  it('should be an object', function () {
    expect(client).to.be.an('object')
  })

  it('should always create a new instance', function () {
    const clientClone = createClient(defaultConfig)
    expect(clientClone).to.not.equal(client)
  })

  it('should not accept an undefined or null config', function () {
    expect(function () {
      createClient()
    }).to.throw(Error, 'Config')
  })

  it('should not accept an undefined or null API token', function () {
    expect(function () {
      createClient({})
    }).to.throw(Error, 'API accessToken')
  })

  it('should not accept an undefined or null url', function () {
    expect(function () {
      createClient({accessToken: API_TOKEN})
    }).to.throw(Error, 'Url')
  })

  it('should have a service-property', function () {
    expect(client).to.have.property('service')
  })

  describe('publication', function () {
    it('should exist', function () {
      expect(client.service).to.have.property('latestPublication')
    })

    it.skip('should not find an undefined publication', async function () {
      const publication = await client.service.latestPublication(4963)
      expect(publication.error).to.equal('Not Found')
      expect(publication.status).to.equal(404)
    })
  })

  describe('publications', function () {
    it('should exist', function () {
      expect(client.service).to.have.property('latestPublications')
    })

    it.skip('Should have more than 2 entries', async function () {
      // The account(accessToken) you use, needs to have atleast 3 entries
      const publications = await client.service.latestPublications({
        limit: 3
      })
      expect(publications).to.have.length.above(2)
    })

    it.skip('should contain systemdata', async function () {
      const publications = await client.service.latestPublications({
        limit: 2
      })
      publications.forEach((publication) => {
        expect(publication).to.have.property('systemdata')
      })
    })

    it.skip('should contain metadata', async function () {
      const publications = await client.service.latestPublications({
        limit: 2
      })
      publications.forEach((publication) => {
        expect(publication).to.have.property('metadata')
      })
    })

    it.skip('should contain content', async function () {
      const publications = await client.service.latestPublications({
        limit: 2
      })
      publications.forEach((publication) => {
        expect(publication).to.have.property('content')
      })
    })
  })
})
