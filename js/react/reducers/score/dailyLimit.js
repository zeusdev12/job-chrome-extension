import * as ActionTypes from '../../actions/score'

const initialState = {
  sent: 0,
  limit: 100
}

const dailyLimit = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.INCREMENT_CONNECT_SENT:
      return { ...state, sent: state.sent + 1 }

    case ActionTypes.SET_CONNECT_LIMIT:
      return { ...state, limit: action.payload }

    case ActionTypes.INITIALIZE_CONNECT_SENT:
      return { ...state, sent: action.payload }

    default:
      return state
  }
}

export default dailyLimit