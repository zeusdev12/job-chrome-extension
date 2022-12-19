import * as ActionTypes from '../../../actions/popup/searchTerms'

const initialState = {
  isLoading: false,
  isDataAvailable: false,
  data: []
}

const searchTerms = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_SEARCH_TERMS:
      return { ...state, isLoading: false }

    case ActionTypes.FETCH_SEARCH_TERMS_SUCCESS:
    case ActionTypes.DELETE_SEARCH_TERM_SUCCESS:
    case ActionTypes.ADD_NEW_SEARCH_TERM:
      return {
        ...state,
        isLoading: false,
        isDataAvailable: true,
        data: action.payload
      }

    case ActionTypes.FETCH_SEARCH_TERMS_FAILURE:
      return initialState

    case ActionTypes.SET_EDITED_SEARCH_TERMS:
      return {
        ...state,
        data: action.payload
      }

    case ActionTypes.SET_SEARCH_TERM_VALUE:
      return {
        ...state,
        data: state.data.map((item, i) => {
          return i === action.payload.index ? {
            ...item,
            searchTermValue: action.payload.value,
            isInitialized: false,
            isInitializing: false,
            isExhausted: false,
            continueUrl: '',
            isRunning: false
          } : item
        })
      }

    default:
      return state
  }
}

export default searchTerms