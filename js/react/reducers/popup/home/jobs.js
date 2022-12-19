// import * as ActionTypes from '../../actions/home'
import * as ActionTypes from '../../../actions/popup/home'

const initialState = {
  isLoading: false,
  isDataAvailable: false,
  data: []
}

const jobs = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_JOBS:
      return { ...state, isLoading: true }

    case ActionTypes.FETCH_JOBS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isDataAvailable: action.payload.length > 0,
        data: action.payload.reverse()
      }

    case ActionTypes.FETCH_JOBS_FAILURE:
      return initialState

    case ActionTypes.DELETE_JOB:
      return { ...state, isLoading: true }

    case ActionTypes.DELETE_JOB_SUCCESS:
      return { ...state, isLoading: false, data: action.payload.reverse() }
    case ActionTypes.DELETE_JOB_FAILURE:
      return { ...state, isLoading: false }

    default:
      return state
  }
}

export default jobs