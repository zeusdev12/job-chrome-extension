import * as ActionTypes from '../../actions/score'

const initialState = {
  isSaving: false,
  isSaved: false
}

const save = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SAVE_PROSPECTS:
      return { ...state, isSaving: true }

    case ActionTypes.SAVE_PROSPECTS_SUCCESS:
      return { ...state, isSaving: false, isSaved: true }

    case ActionTypes.SAVE_PROSPECTS_FAILURE:
      return initialState

    default:
      return state
  }
}

export default save