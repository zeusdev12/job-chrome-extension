import * as ActionTypes from '../../actions'

const initialState = {
  isLoading: false,
  isDataAvailable: false,
  isUpdating: false,
  isUpated: false,
  step: 4,
  updateMeta: {}
}

const editJob = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_JOB:
      return { ...state, isLoading: true }

    case ActionTypes.FETCH_JOB_SUCCESS:
      return { ...state, isLoading: false, isDataAvailable: true }

    case ActionTypes.FETCH_JOB_FAILURE:
      return { ...initialState }


    case ActionTypes.REQUEST_UPDATE_JOB:
      return { ...state, isUpdating: true }

    case ActionTypes.REQUEST_UPDATE_JOB_SUCCESS:
      return { ...state, isUpdating: false, isUpdated: true, updateMeta: action.payload }

    case ActionTypes.REQUEST_UPDATE_JOB_FAILURE:
      return { ...state, isUpdating: false, isUpdated: false }

    case ActionTypes.SET_STEP:
      return { ...state, step: action.payload }


    default:
      return state
  }
}

export default editJob