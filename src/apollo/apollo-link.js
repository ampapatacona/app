import { HttpLink } from 'apollo-link-http'
// New Imports
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import firebase from 'firebase/app'
import 'firebase/auth'
import { ApolloLink, concat, split, Observable } from 'apollo-link'

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: process.env.GRAPH_HTTP_ENDPOINT
})

// Create the subscription websocket link
const wsLink = new WebSocketLink({
  uri: process.env.GRAPH_WS_ENDPOINT,
  options: {
    reconnect: true
  }
})

const authMiddleware = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          user.getIdToken(true)
            .then(token => {
              operation.setContext({
                headers: {
                  authorization: token ? `Bearer ${token}` : ''
                }
              })
            })
            .then(() => {
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer)
              }
              forward(operation).subscribe(subscriber)
            })
            .catch(err => {
              observer.error(err)
            })
        }
      })
    })
)

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
  },
  wsLink,
  concat(authMiddleware, httpLink)
)

export { link }
