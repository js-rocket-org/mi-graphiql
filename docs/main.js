/**
 * Custom GraphiQL example
 */

setTimeout(function() {
  const local_url = localStorage ? localStorage.getItem('gql_url') : ''
  const urlElement = document.getElementById('url_input')
  urlElement.value = 'https://swapi-graphql.netlify.com/.netlify/functions/index'
  if (local_url) urlElement.value = local_url

  const newDiv = document.createElement('div')
  newDiv.className = 'jwt-token'
  newDiv.innerHTML = '<input id="jwt-token" placeholder="JWT Token goes here" />'
  document.querySelector('.topBar').appendChild(newDiv)
}, 1500)

function updateUrl() {
  const urlElement = document.getElementById('url_input')

  if (urlElement.value && localStorage && urlElement.value.toUpperCase().indexOf('HTTP') === 0) {
    localStorage.setItem('gql_url', urlElement.value)
    location.reload()
  }
}

function resetUrl() {
  localStorage.removeItem('gql_url')
  location.reload()
}

// edit file renderExample.js to use this new function graphQLFetcher2
function graphQLFetcher2(graphQLParams) {
  // When working locally, the example expects a GraphQL server at the path /graphql.
  // In a PR preview, it connects to the Star Wars API externally.
  // Change this to point wherever you host your GraphQL server.

  const jwtElement = document.getElementById('jwt-token')
  const jwtToken = jwtElement ? jwtElement.value : null

  const isDev = window.location.hostname.match(/localhost$/)
  const local_url = localStorage ? localStorage.getItem('gql_url') : ''
  const api = local_url ? local_url : '/graphql'

  return fetch(api, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: jwtToken ? 'Bearer ' + jwtToken : null,
    },
    body: JSON.stringify(graphQLParams),
    credentials: 'omit',
  })
    .then(function(response) {
      return response.text()
    })
    .then(function(responseBody) {
      try {
        return JSON.parse(responseBody)
      } catch (error) {
        return responseBody
      }
    })
}

// Parse the search string to get url parameters.
var search = window.location.search
var parameters = {}
search
  .substr(1)
  .split('&')
  .forEach(function(entry) {
    var eq = entry.indexOf('=')
    if (eq >= 0) {
      parameters[decodeURIComponent(entry.slice(0, eq))] = decodeURIComponent(entry.slice(eq + 1))
    }
  })

// If variables was provided, try to format it.
if (parameters.variables) {
  try {
    parameters.variables = JSON.stringify(JSON.parse(parameters.variables), null, 2)
  } catch (e) {
    // Do nothing, we want to display the invalid JSON as a string, rather
    // than present an error.
  }
}

// When the query and variables string is edited, update the URL bar so
// that it can be easily shared.
function onEditQuery(newQuery) {
  parameters.query = newQuery
  updateURL()
}

function onEditVariables(newVariables) {
  parameters.variables = newVariables
  updateURL()
}

function onEditOperationName(newOperationName) {
  parameters.operationName = newOperationName
  updateURL()
}

function updateURL() {
  var newSearch =
    '?' +
    Object.keys(parameters)
      .filter(function(key) {
        return Boolean(parameters[key])
      })
      .map(function(key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key])
      })
      .join('&')
  history.replaceState(null, null, newSearch)
}

// Defines a GraphQL fetcher using the fetch API. You're not required to
// use fetch, and could instead implement graphQLFetcher however you like,
// as long as it returns a Promise or Observable.
function graphQLFetcher(graphQLParams) {
  // When working locally, the example expects a GraphQL server at the path /graphql.
  // In a PR preview, it connects to the Star Wars API externally.
  // Change this to point wherever you host your GraphQL server.
  const isDev = window.location.hostname.match(/localhost$/)
  const api = isDev ? '/graphql' : 'https://swapi-graphql.netlify.com/.netlify/functions/index'
  return fetch(api, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(graphQLParams),
    credentials: 'omit',
  })
    .then(function(response) {
      return response.text()
    })
    .then(function(responseBody) {
      try {
        return JSON.parse(responseBody)
      } catch (error) {
        return responseBody
      }
    })
}

// Render <GraphiQL /> into the body.
// See the README in the top level of this module to learn more about
// how you can customize GraphiQL by providing different values or
// additional child elements.
ReactDOM.render(
  React.createElement(GraphiQL, {
    fetcher: graphQLFetcher2,
    query: parameters.query,
    variables: parameters.variables,
    operationName: parameters.operationName,
    onEditQuery: onEditQuery,
    onEditVariables: onEditVariables,
    defaultVariableEditorOpen: true,
    onEditOperationName: onEditOperationName,
    showHeaderInputComponent: true,
  }),
  document.getElementById('graphiql')
)
