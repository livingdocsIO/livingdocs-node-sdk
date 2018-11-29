const expect = require('chai').expect
const Client = require('../../client')

const API_TOKEN = process.env.API_TOKEN

const defaultConfig = {
  url: 'https://server.livingdocs.io',
  accessToken: API_TOKEN
}

const createClient = config => new Client(config)

describe('client', () => {
  const client = createClient(defaultConfig)
  it('should be an object', () => {
    expect(client).to.be.an('object')
  })

  it('should always create a new instance', () => {
    const clientClone = createClient(defaultConfig)
    expect(clientClone).to.not.equal(client)
  })

  it('should not accept an undefined or null config', () => {
    expect(() => {
      createClient()
    }).to.throw(Error, 'Config')
  })

  it('should not accept an undefined or null API token', () => {
    expect(() => {
      createClient({})
    }).to.throw(Error, 'API accessToken')
  })

  it('should not accept an undefined or null url', () => {
    expect(() => {
      createClient({accessToken: API_TOKEN})
    }).to.throw(Error, 'Url')
  })

  it('should have a service-property', () => {
    expect(client).to.have.property('service')
  })

  describe('publication', () => {
    it('should exist', () => {
      expect(client.service).to.have.property('latestPublication')
    })
    it('should not find an undefined publication', async () => {
      const publication = await client.service.latestPublication(4963)
      expect(publication.error).to.equal('Not Found')
      expect(publication.status).to.equal(404)
    })
  })
  describe('publications', () => {
    it('should exist', () => {
      expect(client.service).to.have.property('latestPublications')
    })
    it('Should have more than 2 entries', async () => {
      // The account(accessToken) you use, needs to have atleast 3 entries
      const publications = await client.service.latestPublications({
        limit: 3
      })
      expect(publications).to.have.length.above(2)
    })
    it('should contain systemdata', async () => {
      const publications = await client.service.latestPublications({
        limit: 2
      })
      publications.forEach(publication => {
        expect(publication).to.have.property('systemdata')
      })
    })
    it('should contain metadata', async () => {
      const publications = await client.service.latestPublications({
        limit: 2
      })
      publications.forEach(publication => {
        expect(publication).to.have.property('metadata')
      })
    })
    it('should contain content', async () => {
      const publications = await client.service.latestPublications({
        limit: 2
      })
      publications.forEach(publication => {
        expect(publication).to.have.property('content')
      })
    })
  })
})
