import * as ActionTypes from '../../actions/score'

const initialState = {
  isLoading: false,
  data: [],
  isSuccess: false,
  isAccountIntegrated:false,
  isZoomIntegrated:false,
  isCalendarIntegrated:false,
  isNewAccount:true
}
const integratePencilitAccount = (state=initialState, action) => {
  switch(action.type){
    case ActionTypes.CREATE_PENCILIT_PROFILE:
      return { 
        ...state, isLoading: true }
      case ActionTypes.CREATE_PENCILIT_PROFILE_SUCCESS:
        return {
          ...state, 
          isLoading: false, 
          data: action.payload,
          isSuccess: true,
          isAccountIntegrated:action.payload.data?(action.payload.data.pencilit_email?true:false):false,
          isZoomIntegrated:action.payload.errors?(action.payload.errors.zoom_not_connected?false:true):false,
          isCalendarIntegrated:action.payload.errors?(action.payload.errors.calendar_not_connected?false:true):false,
          isNewAccount:action.payload.errors?(action.payload.errors.email?true:false):true,
        }

      case ActionTypes.CREATE_PENCILIT_PROFILE_FAILURE:
        return initialState
    default:
      return state
  }
}

export default integratePencilitAccount
