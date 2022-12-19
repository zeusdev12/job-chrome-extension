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

const fetchPencilitAccountDetail = (state=initialState, action) => {
  switch(action.type){
    case ActionTypes.FETCH_PENCILIT_ACCOUNT:
      return { 
        ...state, isLoading: true }
      case ActionTypes.FETCH_PENCILIT_ACCOUNT_SUCCESS:
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

      case ActionTypes.FETCH_PENCILIT_ACCOUNT_FAILURE:
        return initialState
        
    default:
      return state
  }
}

export default fetchPencilitAccountDetail
