import * as ActionTypes from '../../actions/score'

const initialState = {
  skills: [],
  skillsStrict: false,
  school: [],
  education: [],
  educationStrict: false,
  currentTitle: [],
  currentTitleStrict: false,
  pastTitle: [],
  pastTitleStrict: false,
  currentCompany: [],
  pastCompany: [],
  currentIndustry: [],
  pastIndustry: [],
  location: [],
  visa: [{
    name: 'H1b',
    value: 0
  }, {
    name: 'Green Card',
    value: 0
  }, {
    name: 'Citizen',
    value: 0
  }, {
    name: 'OPT',
    value: 0
  }],
  totalExperience: {
    active: false,
    value: {
      min: 1,
      max: 5
    }
  },
  relevantExperience: {
    active: false,
    value: {
      min: 1,
      max: 5
    }
  },
  companySize:[
    {
      value: 0,
      name: "1-10"
    }, {
      value: 0,
      name: "11-50"
    }, {
      value: 0,
      name: "51-200"
    }, {
      value: 0,
      name: "201-500"
    }, {
      value: 0,
      name: "501-1000"
    }, {
      value: 0,
      name: "1001-5000"
    }, {
      value: 0,
      name: "5001-10000"
    }, {
      value: 0,
      name: "10001+"
    }
  ] 
  // companySize:{
  //   active: false,
  //   value: {
  //     min: 501,
  //     max: 1000
  //   }
  // }
}

const advancedFilters = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.SET_SKILLS_FILTERS:
      return {
        ...state,
        skills: action.payload
      }
    case ActionTypes.TOGGLE_STRICT_SKILLS:
      return {
        ...state,
        skillsStrict: !state.skillsStrict
      }
    case ActionTypes.SET_STRICT_SKILLS:
      return {
        ...state,
        skillsStrict: action.payload
      }
    case ActionTypes.SET_SCHOOL_FILTERS:
      return {
        ...state,
        school: action.payload
      }
    case ActionTypes.SET_EDUCATION_FILTERS:
      return {
        ...state,
        education: action.payload
      }
    case ActionTypes.TOGGLE_STRICT_EDUCATION:
      return {
        ...state,
        educationStrict: !state.educationStrict
      }
    case ActionTypes.SET_CURRENT_TITLE_FILTERS:
      return {
        ...state,
        currentTitle: action.payload
      }
    case ActionTypes.TOGGLE_STRICT_CURRENT_TITLE:
      return {
        ...state,
        currentTitleStrict: !state.currentTitleStrict
      }
    case ActionTypes.SET_PAST_TITLE_FILTERS:
      return {
        ...state,
        pastTitle: action.payload
      }
    case ActionTypes.TOGGLE_STRICT_PAST_TITLE:
      return {
        ...state,
        pastTitleStrict: !state.pastTitleStrict
      }
    case ActionTypes.SET_CURRENT_COMPANY_FILTERS:
      return {
        ...state,
        currentCompany: action.payload
      }
    case ActionTypes.SET_PAST_COMPANY_FILTERS:
      return {
        ...state,
        pastCompany: action.payload
      }
    case ActionTypes.SET_CURRENT_INDUSTRY_FILTERS:
      return {
        ...state,
        currentIndustry: action.payload
      }
    case ActionTypes.SET_PAST_INDUSTRY_FILTERS:
      return {
        ...state,
        pastIndustry: action.payload
      }
    case ActionTypes.SET_LOCATION_FILTERS:
      return {
        ...state,
        location: action.payload
      }
    case ActionTypes.SET_VISA_FILTERS:
      return {
        ...state,
        visa: action.payload
      }
    case ActionTypes.SET_TOTAL_EXPERIENCE_FILTER:
      return {
        ...state,
        totalExperience: {
          ...state.totalExperience,
          value: {
            min: action.payload.min,
            max: action.payload.max
          }
      }
    }
    case ActionTypes.SET_RELEVANT_EXPERIENCE_FILTER:
      return {
        ...state,
        relevantExperience: {
          ...state.relevantExperience,
          value: {
            min: action.payload.min,
            max: action.payload.max
          }
      }
    }
    case ActionTypes.TOGGLE_TOTAL_EXPERIENCE_FILTER:
      return {
        ...state,
        totalExperience: {
          ...state.totalExperience,
          active: !state.totalExperience.active
        }
      }
    case ActionTypes.TOGGLE_RELEVANT_EXPERIENCE_FILTER:
      return {
        ...state,
        relevantExperience: {
          ...state.relevantExperience,
          active: !state.relevantExperience.active
        }
      }

    case ActionTypes.SET_COMPANY_SIZE_FILTER:
      return {
        ...state,
        companySize: action.payload
      }

    case ActionTypes.TOGGLE_COMPANY_SIZE_FILTER:
      return {
        ...state,
        companySize: {
          ...state.companySize,
          active: !state.companySize.active
        }
      }
      

    case ActionTypes.CLEAR_ADVANCED_FILTERS: {
      return {
        ...state,
        skills: state.skills.map(item => ({ ...item, value: 0 })),
        skillsStrict: false,
        school: state.school.map(item => ({ ...item, value: 0 })),
        education: state.education.map(item => ({ ...item, value: 0 })),
        educationStrict: false,
        currentTitle: state.currentTitle.map(item => ({ ...item, value: 0 })),
        currentTitleStrict: false,
        pastTitle: state.pastTitle.map(item => ({ ...item, value: 0 })),
        pastTitleStrict: false,
        currentCompany: state.currentCompany.map(item => ({ ...item, value: 0 })),
        pastCompany: state.pastCompany.map(item => ({ ...item, value: 0 })),
        currentIndustry: state.currentIndustry.map(item => ({ ...item, value: 0 })),
        pastIndustry: state.pastIndustry.map(item => ({ ...item, value: 0 })),
        location: state.location.map(item => ({ ...item, value: 0 })),
        visa: state.visa.map(item => ({ ...item, value: 0 })),
        totalExperience: {
          ...state.totalExperience,
          active: false
        },
        relevantExperience: {
          ...state.relevantExperience,
          active: false
        },
        companySize: state.companySize.map(item => ({ ...item, value: 0 }))
      }
    }

    default:
      return state
  }
}

export default advancedFilters
