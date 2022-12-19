import { API_HOST, PENCILIT_API_KEY, API_HOST_PENCILIT } from '../../config/index.js'
import { getToken, getCsrfToken, getCardinalCsrfToken } from '../utils'
import qs from 'query-string'

export const CALL_API = Symbol('CALL_API')
export const CALL_LINKEDIN_API = Symbol('CALL_LINKEDIN_API')
export const CALL_PENCILIT_API = Symbol('CALL_PENCILIT_API')


const apiSourceDefault = API_HOST
const apiSourceLinkedin = 'https://www.linkedin.com'
const pencilitApikey = PENCILIT_API_KEY
const apiSourcePencilit = API_HOST_PENCILIT

export const apiMiddleware = store => next => action => {
  if (action[CALL_API]) {
    const {
      endpoint,
      types,
      apiSource = null,
      options,
      meta = null,
      adminToken=null
    } = action[CALL_API]
    const source = apiSource || apiSourceDefault

    const url = `${source}${endpoint}`

    const [FETCH, SUCCESS, FAILURE] = types

    /**
     * todo:
     * add auth headers if api source is default
     */

    // store.dispatch({ type: FETCH, meta })
    // getToken()
    //   .then(token => {
    //     return fetch(url, { ...options, headers: { ..._.get(options, 'headers', {}), 'Authorization': adminToken? adminToken :token } })
    //       .then(res => res.json())
    //       .then(json => {
    //         store.dispatch({ type: SUCCESS, payload: json })
    //       })
    //       .catch(err => {
    //         store.dispatch({ type: FAILURE, error: err })
    //       })
    //   })

    //TODO-TEMP
    getCardinalCsrfToken()
      .then(token => {
        return fetch(url, { ...options, headers: { ..._.get(options, 'headers', {}), 'X-CSRF-Token': token } })
          .then(res => res.json())
          .then(json => {
            store.dispatch({ type: SUCCESS, payload: json })
          })
          .catch(err => {
            store.dispatch({ type: FAILURE, error: err })
          })
      })
    

  } else if (action[CALL_LINKEDIN_API]) {
    const {
      endpoint,
      types,
      options
    } = action[CALL_LINKEDIN_API]

    const [FETCH, SUCCESS, FAILURE] = types

    const url = `${apiSourceLinkedin}${endpoint}`

    store.dispatch({ type: FETCH })

    getCsrfToken()
      .then(csrf => {
        const opts = { ...options, headers: { ...options.headers, 'csrf-token': csrf } }
        return fetch(url, opts)
      })
      .then(r => r.json())
      .then(json => {
        store.dispatch({ type: SUCCESS, payload: json })
      })
      .catch(err => {
        store.dispatch({ type: FAILURE, error: err })
      })

  }
  else if (action[CALL_PENCILIT_API]) {
    const {
      endpoint,
      types,
      apiSource = null,
      options = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      meta = null
    } = action[CALL_PENCILIT_API]
    const source = apiSourcePencilit

    const url = `${source}${endpoint}`

    const [FETCH, SUCCESS, FAILURE] = types

    /**
     * todo:
     * add auth headers if api source is default
     */

    store.dispatch({ type: FETCH, meta })
    return fetch(url, { ...options, headers: { ..._.get(options, 'headers', {}), 'x-api-key': pencilitApikey } })
      .then(res => res.json())
      .then(json => {
        store.dispatch({ type: SUCCESS, payload: json })
      })
      .catch(err => {
        store.dispatch({ type: FAILURE, error: err })
      })
  }
  else {
    next(action)
  }

}