import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { apiMiddleware } from './middlewares/apiMiddleware'

import rootReducer from './reducers/index'

const logger = createLogger({ collapsed: true })

const store = createStore(
  rootReducer,
  applyMiddleware(
    apiMiddleware,
    thunk,
    logger
  )
)

export { store }