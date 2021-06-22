const dedent = require('dedent')

module.exports = {
  v: 2,
  name: 'test',
  version: '2.0.0',

  components: [{
    name: 'title',
    label: 'Title',
    properties: ['capitalized', 'color'],
    html: '<h1 doc-editable="title"></h1>'
  }, {
    name: 'subtitle',
    properties: ['color'],
    label: 'Subtitle with a placeholder value',
    html: '<h2 doc-editable="title">Who\'s your Caddy?</h2>'
  }, {
    name: 'text',
    label: 'Paragraph',
    html: '<p doc-editable="text"></p>'
  }, {
    name: 'hero',
    label: 'Hero',
    properties: ['extra-space', 'capitalized', 'color', 'css-background-color'],
    html: dedent`
      <div class="hero">
        <h1 doc-editable="title"></h1>
        <p doc-editable="tagline" doc-optional></p>
      </div>
    `
  }, {
    name: 'image',
    label: 'Image',
    html: '<img doc-image="image" src=""/>'
  }],

  designSettings: {
    componentProperties: [{
      name: 'color',
      type: 'select',
      options: [
        {caption: 'Default'},
        {
          caption: 'Red',
          value: 'color--red'
        },
        {
          caption: 'Blue',
          value: 'color--blue'
        },
        {
          caption: 'Green',
          value: 'color--green'
        }
      ]
    }, {
      name: 'extra-space',
      type: 'option',
      value: 'extra-space'
    }, {
      name: 'capitalized',
      type: 'option',
      value: 'capitalized'
    }, {
      name: 'css-background-color',
      type: 'style',
      cssProperty: 'background-color'
    }]
  }
}
