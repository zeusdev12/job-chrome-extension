import * as ActionTypes from '../actions/tabs'

const initialState = {
  tabNumber: '2'
}

const tabs= (state = initialState, action) => {

  switch (action.type) {

    case ActionTypes.SET_TAB:
      return { tabNumber:action.payload }

    
    default:
      return state
  }
}

export default tabs