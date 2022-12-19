
import * as ActionTypes from '../../actions/score'

const initialState = {
  isLoading: false,
  isLoaded: false
}

const requestMeeting = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LOAD_REQUEST_MEETING:
      return { ...state, isLoading: true }

    case ActionTypes.LOAD_REQUEST_MEETING_SUCCESS:
      return { isLoading: false, isLoaded: true }

    case ActionTypes.LOAD_REQUEST_MEETING_FAILURE:
      return initialState

    default:
      return state
  }
}

export default requestMeeting