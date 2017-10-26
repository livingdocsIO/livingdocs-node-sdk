# livingdocs-sdk
The official JavaScript client for Livingdocs.

## Linking the Framework
The current implementation assumes that you have `npm link`ed https://github.com/upfrontIO/livingdocs-framework/pull/161 as `@livingdocs/framework`

## SDK API
```js
const liSDK = require('@livingdocs/sdk')
```

### Document API
```js
/**
 * @function document.create Creates a Livingdoc instance.
 * @param options.design: serialised Design
 * @param options.content: content of a serialised livingdoc
 * @return Livingdoc
 */
const document = liSDK.document.create({design, content})

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
  url: 'http://localhost:3001',
  accessToken: 'my-awesome-token'
})

/**
 * @function getPublications Fetches latest publications with optional filters.
 * @param filters?: { homepage?: boolean, limit?: number = 10 }
 * @return Publication[]
 */
const homepagePublication = await liClient.getPublications({homepage: true})

/**
 * @function getPublication Fetches a publication by id.
 * @param options: { documentId: number }
 * @return Publication
 */
const publication = await liClient.getPublication({documentId})

/**
 * @function getDocumentLists Fetches document lists with optional filters.
 * @param filters?: { id?: number[],  sort?: 'id' | 'name' | 'created_at' | 'updated_at' }
 * @return DocumentList[]
 */
const documentLists = await liClient.getDocumentLists({id: [1, 2, 3], sort: 'updated_at'})

/**
 * @function getDocumentList Fetches a document list by id.
 * @param options: { listId: number, limit?: number } limit - The max count of included entries in the list.
 * @return DocumentList
 */
const documentList = await liClient.getDocumentList({listId: 1, limit: 4})

/**
 * @function getMenus Fetches menus with optional filters.
 * @param filters?: { handle?: string } handle - The given menu handle.
 * @return Menu[]
 */
const [menu] = await liClient.getMenus({handle: 'main'})
```
