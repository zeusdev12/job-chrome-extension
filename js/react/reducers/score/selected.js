import * as ActionTypes from '../../actions/score'

const selected = (state = [], action) => {
  switch (action.type) {

    case ActionTypes.SELECT_PROSPECT:
      return [...state, action.payload]

    case ActionTypes.UNSELECT_PROSPECT:
      return state.filter(item => item !== action.payload)

    case ActionTypes.ARCHIVE_PROSPECTS_SUCCESS:
    case ActionTypes.UNARCHIVE_PROSPECTS_SUCCESS:
    case ActionTypes.UNSELECT_ALL_PROSPECTS:
      return []

    case ActionTypes.SELECT_ALL_PROSPECTS:
      return action.payload

    case ActionTypes.SELECT_TOP_PROSPECTS:
      return action.payload

    default:
      return state
  }
}

export default selected