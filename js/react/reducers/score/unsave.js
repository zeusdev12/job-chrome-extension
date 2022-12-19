import * as ActionTypes from '../../actions/score'

const initialState = {
  isUnsaving: false,
  isUnsaved: false
}

const unsave = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UNSAVE_PROSPECTS:
      return { ...state, isUnsaving: true }

    case ActionTypes.UNSAVE_PROSPECTS_SUCCESS:
      return { ...state, isUnsaving: false, isUnsaved: true }

    case ActionTypes.UNSAVE_PROSPECTS_FAILURE:
      return initialState

    default:
      return state
  }
}

export default unsave