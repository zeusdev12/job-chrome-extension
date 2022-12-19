import * as ActionTypes from '../../actions/editJob'

const initialState = {
  isUpdatingProfile: true,
  total: "0",
  toUpdate: "0",
  updated: "0",
  progress: 0
}

const editProgress = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_UPDATE_PROGRESS_SUCCESS:
      return action.payload
    default:
      return state
  }
}

export default editProgress