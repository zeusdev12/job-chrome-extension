import * as ActionTypes from '../../actions/score'

const initialState = {
  isDownloading: false,
  isDownloaded: false
}

const downloaded = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SETDOWNLOADED_PROSPECTS:
      return { ...state, isDownloading: true }

    case ActionTypes.SETDOWNLOADED_PROSPECTS_SUCCESS:
      return { ...state, isDownloading: false, isDownloaded: true }

    case ActionTypes.SETDOWNLOADED_PROSPECTS_FAILURE:
      return initialState

    default:
      return state
  }
}

export default downloaded