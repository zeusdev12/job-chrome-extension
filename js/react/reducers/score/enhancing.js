import * as ActionTypes from '../../actions/score'

const initialState = {
  data: [],
  error: null,
  isEnhancing: false
}

const enhancing = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ENHANCE_PROFILE:
      return {
        ...state,
        data: [...state.data, action.payload],
        isEnhancing: true
      }

    case ActionTypes.ENHANCE_PROFILE_SUCCESS:
      return {
        ...state,
        data: state.data.filter(item => item !== action.payload),
        isEnhancing: false
      }

    case ActionTypes.ENHANCE_PROFILE_FAILURE:
      return {
        ...state,
        data: state.data.filter(item => item !== action.payload),
        isEnhancing: false,
        error: action.error
      }

    default:
      return state
  }
}

export default enhancing