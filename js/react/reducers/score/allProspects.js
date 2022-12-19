import * as ActionTypes from '../../actions/score'

const initialState = {
  isLoading: false,
  isDataAvailable: false,
  data: [],


}







const allProspects = (state=initialState, action) => {
  switch(action.type){

    case ActionTypes.FETCH_ALL_PROSPECTS:{
      return {
          ...state, 
          isLoading:true,
      }
    }
    case ActionTypes.FETCH_ALL_PROSPECTS_FAILURE: {
      return initialState
    }
    case ActionTypes.FETCH_ALL_PROSPECTS_SUCCESS: {
      return {
          ...state, 
          isLoading:false, 
          isDataAvailable: action.payload.prospectsArray.length > 0, 
          data: action.payload.prospectsArray
        }
    }
    default:{
      return state
    }
  }

}

export default allProspects