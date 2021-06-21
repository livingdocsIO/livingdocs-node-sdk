const dedent = require('dedent')

const {document} = require('../../index')
const designConfig = require('./design/test_design')

describe('document:', function () {

  it('creates and renders a basic document', function () {
    const content = [{
      component: 'title',
      content: {title: 'Moby Dick'}
    }, {
      component: 'image',
      content: {
        image: {
          originalUrl: 'https://test.livingdocs.io/image.jpg',
          url: 'https://test.livingdocs.io/image.jpg',
          width: 1280,
          height: 720,
          mimeType: 'image/jpeg',
          imageService: 'imgix',
          mediaId: 'eud8373',
          crop: {
            x: 160,
            y: 0,
            width: 960,
            height: 720
          }
        }
      }
    }]

    const doc = document.create({design: designConfig, content})

    const html = doc.render()
    expect(html).to.have.same.html(dedent`
      <h1>Moby Dick</h1>
      <img
        src="https://livingdocs-images.imgix.net/image.jpg?rect=160%2C0%2C960%2C720&w=1024&auto=format"
        srcset="https://livingdocs-images.imgix.net/image.jpg?rect=160%2C0%2C960%2C720&w=2048&auto=format 2048w,https://livingdocs-images.imgix.net/image.jpg?rect=160%2C0%2C960%2C720&w=1024&auto=format 1024w,https://livingdocs-images.imgix.net/image.jpg?rect=160%2C0%2C960%2C720&w=620&auto=format 620w,https://livingdocs-images.imgix.net/image.jpg?rect=160%2C0%2C960%2C720&w=320&auto=format 320w"
        sizes="100vw">
    `)
  })

  it('allows to pass a custom render image method', function () {
    const content = [{
      component: 'image',
      content: {
        image: {
          originalUrl: 'https://test.livingdocs.io/image.jpg',
          url: 'https://test.livingdocs.io/image.jpg',
          width: 1280,
          height: 720,
          mimeType: 'image/jpeg',
          imageService: 'imgix',
          mediaId: 'eud8373',
          crop: {
            x: 160,
            y: 0,
            width: 960,
            height: 720
          }
        }
      }
    }]

    const doc = document.create({design: designConfig, content})

    let lastParams
    const html = doc.render({
      renderImageDirective: ({domElem, directive, renderStrategy}) => {
        lastParams = {domElem, directive, renderStrategy}

        const originalUrl = directive.getOriginalUrl()
        const imageService = directive.getImageService()
        const url = imageService.getUrl(originalUrl, {width: 400})

        return {
          html: `<picture src="${url}">Changed!</picture>`
        }
      }
    })

    expect(html).to.have.same.html(dedent`
      <picture
        src="https://livingdocs-images.imgix.net/image.jpg?w=400&auto=format">
        Changed!
      </picture>
    `)

    expect(lastParams.renderStrategy).to.equal('srcSet')
  })
})
