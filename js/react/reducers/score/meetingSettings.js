import * as ActionTypes from '../../actions/score'

const initialState = {
  isLoading: false,
  isDataAvailable: true,
  data: {
    requestMeeting: '',
  }
}

const meetingSettings = (state=initialState, action) => {
  const message = action.payload
  switch(action.type){
    case ActionTypes.SET_REQUEST_MEETING: {
      return {...state, data: {...state.data, requestMeeting: message}}
    }
    default:
      return state
  }
}

export default meetingSettings