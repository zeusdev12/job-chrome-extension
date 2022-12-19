
import * as ActionTypes from '../../actions/score'

const initialState = {
  isArchiving: false,
  isArchived: false
}

const archive = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ARCHIVE_PROSPECTS:
      return { ...state, isArchiving: true }

    case ActionTypes.ARCHIVE_PROSPECTS_SUCCESS:
      return { ...state, isArchiving: false, isArchived: true }

    case ActionTypes.ARCHIVE_PROSPECTS_FAILURE:
      return initialState

    default:
      return state
  }
}

export default archive