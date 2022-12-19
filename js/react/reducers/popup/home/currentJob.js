import * as ActionTypes from '../../../actions/popup/home'

const initialState = {
  isLoading: false,
  isDataAvailable: false,
  job: null,
  meta: null
}

const currentJob = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_JOB:
    case ActionTypes.GET_CURRENT_JOB:
      return { ...state, isLoading: true }

    case ActionTypes.SET_CURRENT_JOB_SUCCESS:
    case ActionTypes.GET_CURRENT_JOB_SUCCESS:
      return { ...state, isLoading: false, isDataAvailable: true, job: action.payload }

    case ActionTypes.SET_CURRENT_JOB_FAILURE:
    case ActionTypes.GET_CURRENT_JOB_FAILURE:
      return initialState

    default:
      return state
  }
}

export default currentJob