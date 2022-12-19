import * as ActionTypes from '../../../actions/popup/step'

const initialState = {
  isLoading: false,
  isDataAvailable: true,
  data: 1,
  error: null
}

const step = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_STEP:
    case ActionTypes.SET_POPUP_STEP:
      return { ...state, isLoading: true }

    case ActionTypes.GET_STEP_SUCCESS:
    case ActionTypes.SET_POPUP_STEP_SUCCESS:
      return { ...state, isLoading: false, isDataAvailable: true, data: action.payload }

    case ActionTypes.GET_STEP_FAILURE:
    case ActionTypes.SET_POPUP_STEP_FAILURE:
      return { ...state, isLoading: false, isDataAvailable: false, error: action.payload }

    default:
      return state
  }
}

export default step