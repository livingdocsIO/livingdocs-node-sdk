# livingdocs-sdk

The official Node.js client for Livingdocs.
This is a low-level library. If you're looking for a full-fledged use case, consider taking a look at our [magazine example](https://github.com/livingdocsIO/magazine-example)

## Getting started

We assume, you already have an account on https://edit.livingdocs.io
If not, create one now.

You can also check the full example in runkit, but make sure to replace the API token with your own: https://runkit.com/gabrielhase/livingdocs-minimal-example

1. Install the SDK

`npm install @livingdocs/node-sdk`

2. Get your access token from `edit.livingdocs.io` by navigating to `Access Management` -> `Api Tokens`

![Api Tokens in Livingdocs](http://livingdocs-assets.s3.amazonaws.com/sdk/api_tokens.png)

3. Get a document

```js
const liSDK = require('@livingdocs/node-sdk')
const liClient = new liSDK.Client({
  url: 'https://server.livingdocs.io',
  accessToken: 'my-awesome-token'
})

const publication = await liClient.getPublication({documentId: 1})
```

We assume that you used the standard signup flow. This would give you a document with id 1. Of course you can change this id to any document in your project.

4. Get a design

```js
const design = await liClient.getDesign({name: 'living-times', version: '0.0.14'})
```

This loads our magazine example design from the Livingdocs server. You can of course also use your own local design.

5. Create a living document

```js
const liSDK = require('@livingdocs/node-sdk')
const livingdoc = liSDK.document.create({content: publication.content, design})
```

6. Render a living document to HTML

```js
const liSDK = require('@livingdocs/node-sdk')
const html = liSDK.document.render(livingdoc)
```

7. ...or render single components

```js
const liSDK = require('@livingdocs/node-sdk')
const html = liSDK.document.renderComponent(livingdoc.componentTree.first())
```

### Rendering a Document

To sum up, we wrapped the whole procedure in a snippet below:

```js
const liSDK = require('@livingdocs/node-sdk')
const liClient = new liSDK.Client({
  url: 'https://server.livingdocs.io',
  accessToken: 'my-awesome-token'
})

// fetch document from server
const publication = await liClient.getPublication({documentId: 1})

// fetch design
const design = await liClient.getDesign({name: 'living-times', version: '0.0.14'})

// create document and render it
const livingdoc = liSDK.document.create({content: publication.content, design})
const html = livingdoc.render() // you can also use liSDK.document.render(livingdoc)

// now, do something great with your html... :)
```

Note: This snippet loads the latest magazine example design from the Livingdocs server and uses our default image service.

## Where to go from here

### I don't want to use document ids

Livingdocs provides you with a homepage for each project and configurable menus.
You can set a homepage and create a menu in the Livingdocs editor (edit.livingdocs.io).

Check out the Client API reference documentation below for the respective methods to fetch the homepage or a menu from Livingdocs.

### I need my own design

Currently, you can not use your own design in the Livingdocs editor.
But you can have a local copy of our magazine design and adjust the HTML / CSS for the rendering. This means that you will write in the Livingdocs editor in our prebuilt design but render to your own custom design using the SDK.

Check out the Livingdocs [magazine example frontend](https://github.com/livingdocsIO/magazine-example) on how to achieve this.

Supporting custom designs in the Livingdocs editor is on our roadmap.

### I want to change the output before rendering

The Livingdocs API provides you with our Livingdocs JSON format. The SDK allows you to build a native livingdoc instance out of the JSON response. The livingdoc instance gives you many options to change the output of your rendering, e.g. skipping certain components, set global styling options or change the way images are rendered.

Check out the livingdoc reference documentation for an intro to the livingdoc API.

## API Reference Documentation
```js
const liSDK = require('@livingdocs/node-sdk')
```

### Document API
```js
/**
 * @function document.create Creates a Livingdoc instance.
 * @param options.design: serialised design (required)
 * @param options.content: content of a serialised livingdoc (required)
 * @param options.config: livingdoc configuration (optional)
 * @return Livingdoc
 */
const document = liSDK.document.create({design, content, config})

// Configure an image service (If you define nothing, the default settings below will be used)
// This configures Livindocs' image service (the same that is used on edit.livingdocs.io).
// You can of course also specify your own here or change the parameters for image rendering.

const config = {
  imageServices: {
    imgix: {
      host: 'https://livingdocs-images.imgix.net',
      preferWebp: true,
      backgroundImage: {
        maxWidth: 2048
      },
      srcSet: {
        defaultWidth: 1024,
        widths: [
          2048,
          1024,
          620,
          320
        ],
        sizes: ['100vw']
      }
    }
  }
}

/**
 * @function document.visit Visits components in a ComponentTree.
 * @param document: Livingdoc
 * @param filter: Object | Function
 * @param visitor: (component: Component) => void
 * @return Livingdoc
 */
const visitedDocument = liSDK.document.visit(document, filter, visitor)

/**
 * @function document.getIncludes Aggregates and groups includes by service name and returns a Map of includes.
 * @param document: Livingdoc
 * @return { [service: string]: IncludeDirective[] }
 */
const includes = liSDK.document.getIncludes(document)

/**
 * @function document.renderComponent Renders a specific component to html.
 * @param component: Component
 * @return string
 */
const html = liSDK.document.renderComponent(component)

/**
 * @function document.render Renders a document to html.
 * @param document: Livingdoc
 * @return string
 */
const html = liSDK.document.render(document)
```

### Client API
```js
// get an instance of the api client
const liClient = new liSDK.Client({
  url: 'http://localhost:3001', // required
  accessToken: 'my-awesome-token', // required
  proxy: 'http://path.to.proxy', // optional, uses HttpsProxyAgent (https-proxy-agent)
  agent: new CustomHttpsAgent() // optional, bring your own (node-fetch compatible) agent, this overrides and ignores the `proxy` config
})

/**
 * @function getMenus Fetches menus with optional filters.
 * @param filters?: { handle?: string } handle - The given menu handle.
 * @return Menu[]
 */
const [menu] = await liClient.getMenus({handle: 'main'})

/**
 * @function getDesignVersions Fetches available design versions by name.
 * @param options: { name: string } name - The given design name.
 * @return {versions: string[]}
 */
const {versions} = await liClient.getDesignVersions({name: 'living-times'})

/**
 * @function getDesign Fetches a design by name and version.
 * @param options: { name: string, version: string } - The full design descriptor.
 * @return Design
 */
const design = await liClient.getDesign({name: 'living-times', version: '0.0.14'})

/**
 * @function getPublications Fetches latest publications with optional filters.
 * @param filters?: { homepage?: boolean, limit?: number = 10 }
 * @return Publication[]
 */
const [homepagePublication] = await liClient.getPublications({homepage: true, limit: 1})

/**
 * @function getPublication Fetches a publication by id.
 * @param options: { documentId: number }
 * @return Publication
 */
const publication = await liClient.getPublication({documentId})
```

### Livingdoc API

#### Component Tree

You can reach the component tree from the root livingdoc instance: `livingdoc.componentTree`.
A component tree is a tree of components. Just like the DOM is a tree of DOM nodes.

Schematic example of a `componentTree`:

```js
// - ComponentContainer (root)
//  - Component 'Hero'
//  - Component '2 Columns'
//    - ComponentContainer 'main'
//      - Component 'Title'
//    - ComponentContainer 'sidebar'
//      - Component 'Info-Box'
```

Create components:

```js
// Create a component
const title = componentTree.createComponent('title')
```

Insert components:

```js
// Insert a component at the beginning.
componentTree.prepend(title)

// Insert component at the end.
componentTree.append(title)
```

Traverse and find components:

```js
// Traverse through each component
componentTree.each((component) => {
    // your code
})

// Traverse through each container
componentTree.eachContainer((container) => {
    // your code
})

// Traverse through each component and container
componentTree.all((componentOrContainer) => {
    // your code
})

// Find all components of a type
const subtitles = componentTree.find('subtitle')
if (subtitles.length) {
    const subtitleComponent = subtitles[0]
}

// Get the first component in a document
const firstComponent = componentTree.first()
```


Serialize:

```js
componentTree.toJson()
```

This method is called by `livingdoc.toJson()` internally.


Development Helpers:

```js
// Get a readable string of the whole componentTree
componentTree.print()
```


Change Events:

A `componentTree` issues events whenever a change happens. You can subscribe to those events to get notified of changes. Internally views listen to the `componentTree` for changes to update the DOM.


- **componentAdded**  
  Get notified when a component was added
- **componentRemoved**  
  Get notified when a component was deleted
- **componentMoved**  
  Get notified when a component has changed its position
- **componentContentChanged**  
  Get notified when the content of a component changed. (E.g. the user has edited a text)
- **componentHtmlChanged**  
  Get notified when component settings changed. For example a css class.
- **changed**  
  Get notified of all changes in a document. Fires when any of the above events for any component fires.


#### ComponentModel

A component model is the model of a component. You edit a `livingdoc` by creating, updating and removing `componentModels` in a componentTree.

Properties:

`id`

Every `component` has a unique id that allows Livingdocs to always identify a `component` no matter if it was moved to a different place somewhere else in a document.

`componentName`

The name of your component. E.g. a title component could have the name 'title'. Normally you use the name when creating a new component of the same type querying for component of a certain type.

`directives`

The content of a component is managed through directives. For different
content types like text and images there exists different directive types.

Quick examples:
```js
const textDirective = paragraph.directives.get('text')
textDirective.setContent('Lorem Ipsum dolorem...')
const content = textDirective.getContent()

// Test if a directive contains content
textDirective.isEmpty() // false

// Set the content of a directive directly from the componentModel
paragraph.setContent({text: 'Lorem Ipsum dolorem...'})
```

`componentProperties`

Component properties let you define css classes or styles that can be set on
the root element of a component.


Component Properties definition in the design:
```js
componentProperties: {
  'css-background-color': {
    type: 'style',
    label: 'Background Color',
    cssProperty: 'background-color'
  }
  'css-class': {
    type: 'option'
    value: 'capitalize'
  }
  'css-class-selection': {
    type: 'select'
    options: [
      caption: 'Default'
    ,
      caption: 'Red'
      value: 'color--red'
    ]
  }
}
```

`Component definition`

```html
<script type="ld-conf">
{
  name: 'header',
  properties: ['css-background-color', 'css-class', 'css-class-selection']
}
</script>
<header>...</header>
```

Setting the style on the `componentModel`:
```js
header.setStyle('css-background-color', '#29b96f')
header.setStyle('css-class', 'capitalize')
header.setStyle('css-class-selection', 'color--red')
```

`template`

The Template from which your component was created.

`componentTree`

A reference to the componentTree a component is part of. If empty a component is not yet part of a document just like a detached DOM node.

##### ComponentTree operations

```js
const title = componentTree.createComponent('title')

// Insert the title component before this one
component.before(title)

// Insert a component after this one
component.after(title)

// Append a component to a container of this component
component.append(containerName, title)

// Prepend a component to a container of this component
component.prepend(containerName, title)

// Move this component up
component.up()

// Move this component down
component.down()

// Remove this component from its componentTree
component.remove()
```


##### Traverse the componentTree relative to a component

```js
// Get the parent component if the component is nested
component.getParent()

// Iterate through all parents
component.parents((component) => {
    // your code
})

// Iterate through all direct children
component.children((component) => {
    // your code
})

// Iterate through oneself and all direct children
component.childrenAndSelf((component) => {
    // your code
})

// Iterate through all descendants (children and their children and so on...)
component.descendants((component) => {
    // your code
})

// Iterate through oneself, and all descendants
component.descendantsAndSelf((component) => {
    // your code
})
```

#### Directives

##### Accessing Directives

Directives are always part of a `ComponentModel`. On a component you can access the
directives through the `directives` property which is a `DirectiveColletion`.

```js
// get hold of a specific directive
const textDirective = componentModel.directives.get('title')

// loop through all directives on a component in the order
// they are defined.
for (const directive in componentModel.directives) {
  directive.getContent()
}

// loop through each image directive on a component
componentModel.directives.eachImage((imageDirective) => {
  imageDirective.getUrl()
})


// Get the number of directives of a certain type
// on a component.
// Possible types: 'editable', 'image', 'html', 'link', 'include'
const count = componentModel.directives.count('include')
```


##### Directive Types

###### Text

type: 'editable'
component template attribute: `doc-editable`

```js
textDirective.setContent('Lorem Ipsum dolorem...')
const content = textDirective.getContent()
```


###### Image

type: 'image'
component template attribute: `doc-image`

Minimal Example:
```js
imageDirective.setContent({url: 'http://images.com/1'})
```

Most of the time you will want to have optimized delivery with an image service.
For this `width`, `height`, `mimeType` as well as the `imageService` itself have
to be specified when setting an url.

Real World Example with image service:
```js
imageDirective.setContent({
  url: 'http://images.com/1',
  width: 400,
  height: 300,
  mimeType: 'image/jpeg',
  imageService: 'resrc.it',
  crop: {x: 100, y: 50, width: 200, height: 200},
  origins: [{name: 'uez463x8ie39', identifier: 'hugo'}]
})

// Update the crop
imageDirective.setCrop({x: 0, y: 0, width: 250, height: 250})
```


###### Html

type: 'html'
component template attribute: `doc-html`

```js
htmlDirective.setContent('<div>Moby Dick</div>')
```


###### Link

type: 'link'
component template attribute: `doc-link`

```js
linkDirective.setContent('http://www.test.com/')
```


###### Include

type: 'include'
component template attribute: `doc-include`

```js
includeDirective.setContent({
  service: 'list',
  params: {foo: 'bar'}
})

// Retrieve the params set on a directive (this includes defaultParams
// specified in the component configuration if they have not been overwritten).
includeDirective.getParams()


// setParams overwrites all parameters of this include.
includeDirective.setParams({foo: 'bar'})

// addParams merges the specified params with the existing ones
// (including any default params that may have been set in the component
// configuration).
includeDirective.addParams({foo: 'bar'})
```


##### Events

###### componentContentChanged

Whenever a directive is changed a `componentContentChanged` event is fired on the `componentTree` the `componentModel` is attached to. If the `componentModel` the directive belongs to is not attached to a `componentTree` no event is fired.
