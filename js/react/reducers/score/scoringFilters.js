import * as ActionTypes from '../../actions/score'

const initialState = {
  
    titleScore: {
        active: false,
        value: 70
    },
    skillScore: {
        active: false,
        value: 70
    },
    experienceScore: {
        active: false,
        value: 70
    },
    educationScore: {
        active: false,
        value: 70
    },
    industryScore: {
        active: false,
        value: 70
    }
}

const scoringFilters = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.SET_TITLE_SCORE_FILTER:
      return {
        ...state,
        titleScore: {
            ...state.titleScore,
            value: action.payload
          }
      }
    case ActionTypes.TOGGLE_TITLE_SCORE_FILTER:
      return {
        ...state,
        titleScore: {
            ...state.titleScore,
            active: !state.titleScore.active
        }
      }


    case ActionTypes.SET_SKILL_SCORE_FILTER:
      return {
        ...state,
        skillScore: {
            ...state.skillScore,
            value: action.payload
          }
      }
    case ActionTypes.TOGGLE_SKILL_SCORE_FILTER:
      return {
        ...state,
        skillScore: {
            ...state.skillScore,
            active: !state.skillScore.active
        }
      }


    case ActionTypes.SET_EXPERIENCE_SCORE_FILTER:
      return {
        ...state,
        experienceScore: {
            ...state.experienceScore,
            value: action.payload
          }
      }
    case ActionTypes.TOGGLE_EXPERIENCE_SCORE_FILTER:
      return {
        ...state,
        experienceScore: {
            ...state.experienceScore,
            active: !state.experienceScore.active
        }
      }


    case ActionTypes.SET_EDUCATION_SCORE_FILTER:
      return {
        ...state,
        educationScore: {
            ...state.educationScore,
            value: action.payload
          }
      }
    case ActionTypes.TOGGLE_EDUCATION_SCORE_FILTER:
      return {
        ...state,
        educationScore: {
            ...state.educationScore,
            active: !state.educationScore.active
        }
      }

    case ActionTypes.SET_INDUSTRY_SCORE_FILTER:
      return {
        ...state,
        industryScore: {
            ...state.industryScore,
            value: action.payload
          }
      }
    case ActionTypes.TOGGLE_INDUSTRY_SCORE_FILTER:
      return {
        ...state,
        industryScore: {
            ...state.industryScore,
            active: !state.industryScore.active
        }
      }


    case ActionTypes.CLEAR_SCORING_FILTERS: {
      return {
        ...state,
        titleScore: {
            ...state.titleScore,
            active: false
        },
        skillScore:{
            ...state.skillScore,
            active: false
        },
        experienceScore: {
            ...state.experienceScore,
            active: false
        },
        educationScore: {
            ...state.educationScore,
            active: false
        },
        industryScore: {
            ...state.industryScore,
            active: false
        }
      }
    }

    default:
      return state
  }
}

export default scoringFilters