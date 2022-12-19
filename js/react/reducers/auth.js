// import * as ActionTypes from '../actions/auth'
import * as ActionTypes from '../actions/auth'

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  user: null
}

const auth = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_USER:
      return { ...state, isLoading: true }

    case ActionTypes.FETCH_USER_SUCCESS: {
      return {
        ...state, isLoading: false, isAuthenticated: true, user: action.payload
      }
    }

    case ActionTypes.FETCH_USER_FAILURE:
      return initialState

    case ActionTypes.LOGOUT: {
      chrome.storage.local.remove(['userDetailsSent', 'emailAddress', 'isRecruiter', 'jobArray', 'name', 'recruiterID', 'tabsMeta'])
      return initialState
    }

    default:
      return state
  }
}

export default auth