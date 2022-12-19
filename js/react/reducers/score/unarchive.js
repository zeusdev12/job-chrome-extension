
import * as ActionTypes from '../../actions/score'

const initialState = {
  isUnarchiving: false,
  isUnarchived: false
}

const unarchive = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UNARCHIVE_PROSPECTS:
      return { ...state, isUnarchiving: true }

    case ActionTypes.UNARCHIVE_PROSPECTS_SUCCESS:
      return { ...state, isUnarchiving: false, isUnarchived: true }

    case ActionTypes.UNARCHIVE_PROSPECTS_FAILURE:
      return initialState

    default:
      return state
  }
}
export default unarchive
