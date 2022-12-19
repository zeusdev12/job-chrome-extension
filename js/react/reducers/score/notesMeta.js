import * as ActionTypes from '../../actions/score'

const initialState = {
  isAddingNote: []
}

const notesMeta = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ADD_NOTE:
      return { ...state, isAddingNote: [...state.isAddingNote, action.payload.jobProfileId] }

    case ActionTypes.ADD_NOTE_SUCCESS:
    case ActionTypes.ADD_NOTE_FAILURE:
      return { ...state, isAddingNote: state.isAddingNote.filter(item => item !== action.payload.jobProfileId) }


    default:
      return state
  }
}

export { notesMeta }