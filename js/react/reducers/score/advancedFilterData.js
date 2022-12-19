import * as ActionTypes from '../../actions/score'

const initialState = {
  isLoading: false,
  isDataAvailable: false,
  data: { 
    skills: [],
    school_names: [],
    company_names: []
  }
}

const advancedFilterData = (state=initialState, action) => {
  switch(action.type){
    case ActionTypes.FETCH_ADVANCED_FILTER:
      return { 
        ...state, isLoading: true }

      case ActionTypes.FETCH_ADVANCED_FILTER_SUCCESS:
        return {
          ...state, 
          isLoading: false, 
          data: action.payload.data,
          isDataAvailable: true
        }

      case ActionTypes.FETCH_ADVANCED_FILTER_FAILURE:
        return initialState
    default:
      return state
  }
}

export default advancedFilterData