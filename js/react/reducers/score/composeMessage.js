
import * as ActionTypes from '../../actions/score'

const initialState = {
  isLoading: false,
  isLoaded: false
}

const composeMessage = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LOAD_COMPOSE_MESSAGE:
      return { ...state, isLoading: true }

    case ActionTypes.LOAD_COMPOSE_MESSAGE_SUCCESS:
      return {isLoading: false, isLoaded: true }

    case ActionTypes.LOAD_COMPOSE_MESSAGE_FAILURE:
      return initialState

    default:
      return state
  }
}

export default composeMessage