module.exports = {
  'projectId': 319,
  'name': 'user:378',
  'defaultChannelId': 334,
  'channels': [{
    'channelId': 334,
    'name': 'web',
    'label': 'Web',
    'projectId': 319,
    'designName': 'timeline',
    'currentVersion': '1.1.0',
    'mode': 'default',
    'config': [{
      'documentType': 'articles',
      'metadata': [{
        'name': 'title',
        'plugin': 'li-text'
      }, {
        'name': 'description',
        'plugin': 'li-text'
      }, {
        'name': 'author',
        'plugin': 'li-text'
      }, {
        'name': 'teaserImage',
        'plugin': 'li-image'
      }, {
        'name': 'tasks',
        'plugin': 'li-tasks'
      }, {
        'name': 'dependencies',
        'plugin': 'li-dependencies'
      }, {
        'name': 'listIds',
        'plugin': 'li-numeric-list'
      }, {
        'name': 'designName',
        'plugin': 'li-text'
      }, {
        'name': 'designVersion',
        'plugin': 'li-text'
      }]
    }, {
      'documentType': 'pages',
      'metadata': [{
        'name': 'title',
        'plugin': 'li-text'
      }, {
        'name': 'dependencies',
        'plugin': 'li-dependencies'
      }]
    }],
    'documentTypes': ['articles', 'pages']
  }]
}
