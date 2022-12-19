import * as ActionTypes from '../../actions'

const initialState = {
  isLoading: false,
  isDataAvailable: false,
  isAddingJob: false,
  isFetchingJobs: false,
  data: null,
  industrySuggestions: [],
  jobData: {
    jobTitle: '',
    additionalTitles: [],
    education: [],
    technicalSkills: [],
    additionalSkills: [],
    experience: [],
    industries: []
  }
}

export const revise = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_NER:
      return { ...state, isLoading: true }

    case ActionTypes.FETCH_NER_SUCCESS: {
      const transformed = action.payload.reduce((obj, item) => {
        return { ...obj, [item.tag]: item }
      }, {})

      const degree = !_.isEmpty(transformed.DEGREE.data) ? transformed.DEGREE.data[0] : null
      const majors = transformed.DEGREE_MAJOR.data

      const education = majors.map(item => ({
        name: degree ? `${degree} of ${item}` : `${item}`,
        score: 1
      }))

      const technicalSkills = transformed.TECHNICAL_SKILLS.data.map((item) => ({
        score: 1,
        name: item.name
      }))

      const additionalSkills = transformed.OTHER_SKILLS.data.map(item => ({
        score: 0,
        name: item
      }))

      const experience = transformed.TECHNOLOGY_WORK_EXPERIENCE.data.map(item => ({
        score: 1,
        name: item.name
      }))

      return {
        ...state,
        isLoading: false,
        isDataAvailable: true,
        data: action.payload,
        jobData: {
          ...state.jobData,
          jobTitle: !_.isEmpty(transformed.JOB_POSITION.data) ? transformed.JOB_POSITION.data[0] : '',
          additionalTitles: transformed.SUGGESTED_JOB_TITLES.data.map(item => ({ name: item, isSelected: false })),
          education,
          technicalSkills,
          additionalSkills,
          experience
        }

      }
    }

    case ActionTypes.FETCH_NER_FAILURE:
      return initialState


    case ActionTypes.FETCH_JOB_SUCCESS: {
      console.log('FETCH JOB SUCCESS REDUCER', action.payload)

      const transformed = action.payload.jobArray.reduce((obj, item) => {
        return { ...obj, [item.tag]: item }
      }, {})

      // const degree = !_.isEmpty(transformed.DEGREE.data) ? transformed.DEGREE.data[0] : null
      // const majors = transformed.DEGREE_MAJOR.data

      // const education = majors.map(item => ({
      //   name: degree ? `${degree} of ${item}` : `${item}`,
      //   score: item.score
      // }))

      const education = transformed.DEGREE_FULL.data.map(item => ({
        score: item.score,
        name: item.name
      }))

      const technicalSkills = transformed.TECHNICAL_SKILLS.data.map((item) => ({
        score: item.score,
        name: item.name
      }))

      const additionalSkills = transformed.OTHER_SKILLS.data.map(item => ({
        score: item.score,
        name: item
      }))

      const experience = transformed.TECHNOLOGY_WORK_EXPERIENCE.data.map(item => ({
        score: item.score,
        name: item.name
      }))

      const industries = transformed.COMPANY_INDUSTRY_SPECIALTIES.data.map(item => ({
        name: item.name,
        score: item.score
      }))

      // industries: state.jobData.industries.map((item, i) => i === index ? { ...item, score } : item)

      return {
        ...state,
        isLoading: false,
        isDataAvailable: true,
        data: action.payload.jobArray,
        jobData: {
          ...state.jobData,
          jobTitle: action.payload.jobTitle, //!_.isEmpty(transformed.JOB_POSITION.data) ? transformed.JOB_POSITION.data[0] : '',
          additionalTitles: transformed.SUGGESTED_JOB_TITLES.data.map(item => ({ name: item, isSelected: true })),
          education,
          technicalSkills,
          additionalSkills,
          experience,
          industries
        }

      }
    }


    case ActionTypes.SET_JOB_TITLE: {
      return { ...state, jobData: { ...state.jobData, jobTitle: action.payload } }
    }

    case ActionTypes.ADD_ADDITIONAL_TITLE:
      return {
        ...state,
        jobData: {
          ...state.jobData,
          additionalTitles: [...state.jobData.additionalTitles, action.payload]
        }
      }


    case ActionTypes.SELECT_ADDITIONAL_TITLE: {
      return {
        ...state,
        jobData: {
          ...state.jobData,
          additionalTitles: state.jobData.additionalTitles
            .map(item => item.name === action.payload ? { ...item, isSelected: !item.isSelected } : item)
        }
      }
    }


    case ActionTypes.FETCH_INDUSTRIES_SUCCESS: {
      return {
        ...state,
        industrySuggestions: action.payload.elements.map(item => ({
          name: item.text.text,
          id: item.targetUrn.split(':').pop()
        }))
      }
    }




    case ActionTypes.SET_EDUCATION_SCORE: {
      const { index, score } = action.payload
      return {
        ...state,
        jobData: {
          ...state.jobData,
          education: state.jobData.education.map((item, i) => i === index ? { ...item, score } : item)
        }
      }
    }

    case ActionTypes.SET_TECHNICAL_SKILL_SCORE: {
      const { index, score } = action.payload
      return {
        ...state,
        jobData: {
          ...state.jobData,
          technicalSkills: state.jobData.technicalSkills.map((item, i) => i === index ? { ...item, score } : item)
        }
      }
    }

    case ActionTypes.SET_ADDITIONAL_SKILL_SCORE: {
      const { index, score } = action.payload
      return {
        ...state,
        jobData: {
          ...state.jobData,
          additionalSkills: state.jobData.additionalSkills.map((item, i) => i === index ? { ...item, score } : item)
        }
      }
    }


    case ActionTypes.SET_EXPERIENCE_SCORE: {
      const { index, score } = action.payload
      return {
        ...state,
        jobData: {
          ...state.jobData,
          experience: state.jobData.experience.map((item, i) => i === index ? { ...item, score } : item)
        }
      }
    }


    case ActionTypes.SET_INDUSTRY_SCORE: {
      const { index, score } = action.payload
      return {
        ...state,
        jobData: {
          ...state.jobData,
          industries: state.jobData.industries.map((item, i) => i === index ? { ...item, score } : item)
        }
      }
    }


    case ActionTypes.ADD_EDUCATION: {
      return {
        ...state,
        jobData: {
          ...state.jobData,
          education: [...state.jobData.education, { name: '', score: 1 }]
        }
      }
    }

    case ActionTypes.ADD_TECHNICAL_SKILL: {
      return {
        ...state,
        jobData: {
          ...state.jobData,
          technicalSkills: [...state.jobData.technicalSkills, { name: '', score: 1 }]
        }
      }
    }

    case ActionTypes.ADD_ADDITIONAL_SKILL: {
      return {
        ...state,
        jobData: {
          ...state.jobData,
          additionalSkills: [...state.jobData.additionalSkills, { name: '', score: 1 }]
        }
      }
    }

    case ActionTypes.ADD_EXPERIENCE: {
      return {
        ...state,
        jobData: {
          ...state.jobData,
          experience: [...state.jobData.experience, { name: '', score: 1 }]
        }
      }
    }

    case ActionTypes.ADD_INDUSTRY: {
      return {
        ...state,
        jobData: {
          ...state.jobData,
          industries: [...state.jobData.industries, { name: '', score: 1 }]
        }
      }
    }



    case ActionTypes.DELETE_EDUCATION_ITEM: {
      return {
        ...state,
        jobData: {
          ...state.jobData,
          education: state.jobData.education.filter((item, i) => i !== action.payload)
        }
      }
    }


    case ActionTypes.DELETE_TECHNICAL_SKILL: {
      return {
        ...state,
        jobData: {
          ...state.jobData,
          technicalSkills: state.jobData.technicalSkills.filter((item, i) => i !== action.payload)
        }
      }
    }

    case ActionTypes.DELETE_ADDITIONAL_SKILL: {
      return {
        ...state,
        jobData: {
          ...state.jobData,
          additionalSkills: state.jobData.additionalSkills.filter((item, i) => i !== action.payload)
        }
      }
    }

    case ActionTypes.DELETE_EXPERIENCE: {
      return {
        ...state,
        jobData: {
          ...state.jobData,
          experience: state.jobData.experience.filter((item, i) => i !== action.payload)
        }
      }
    }


    case ActionTypes.DELETE_INDUSTRY: {
      return {
        ...state,
        jobData: {
          ...state.jobData,
          industries: state.jobData.industries.filter((item, i) => i !== action.payload)
        }
      }
    }

    case ActionTypes.SET_EDUCATION_ITEM_VALUE: {
      const { index, value } = action.payload

      return {
        ...state,
        jobData: {
          ...state.jobData,
          education: state.jobData.education.map((item, i) => i === index ? { ...item, name: value } : item)
        }
      }
    }

    case ActionTypes.SET_TECHNICAL_SKILL_VALUE: {
      const { index, value } = action.payload
      return {
        ...state,
        jobData: {
          ...state.jobData,
          technicalSkills: state.jobData.technicalSkills.map((item, i) => i === index ? { ...item, name: value } : item)
        }
      }
    }

    case ActionTypes.SET_ADDITIONAL_SKILL_VALUE: {
      const { index, value } = action.payload
      return {
        ...state,
        jobData: {
          ...state.jobData,
          additionalSkills: state.jobData.additionalSkills.map((item, i) => i === index ? { ...item, name: value } : item)
        }
      }
    }

    case ActionTypes.SET_EXPERIENCE_VALUE: {
      const { index, value } = action.payload
      return {
        ...state,
        jobData: {
          ...state.jobData,
          experience: state.jobData.experience.map((item, i) => i === index ? { ...item, name: value } : item)
        }
      }
    }

    case ActionTypes.SET_INDUSTRY_VALUE: {
      const { index, value, id } = action.payload
      return {
        ...state,
        jobData: {
          ...state.jobData,
          industries: state.jobData.industries.map((item, i) => i === index ? { ...item, name: value, id } : item)
        }
      }
    }

    case ActionTypes.REQUEST_ADD_JOB:
      return { ...state, isAddingJob: true }

    case ActionTypes.REQUEST_ADD_JOB_SUCCESS:
    case ActionTypes.REQUEST_ADD_JOB_FAILURE:
      return { ...state, isAddingJob: false }


    case ActionTypes.FETCH_JOBS_JD:
      return { ...state, isFetchingJobs: true }

    case ActionTypes.FETCH_JOBS_JD_SUCCESS: {
      chrome.storage.local.set({ 'jobArray': action.payload.job })
      return { ...state, isFetchingJobs: false }
    }
    case ActionTypes.FETCH_JOBS_JD_FAILURE:
      return { ...state, isFetchingJobs: false }

    case ActionTypes.CLEAR_REVISE_JD:
      return {
        isLoading: false,
        isDataAvailable: false,
        isAddingJob: false,
        isFetchingJobs: false,
        data: null,
        industrySuggestions: [],
        jobData: {
          jobTitle: '',
          additionalTitles: [],
          education: [],
          technicalSkills: [],
          additionalSkills: [],
          experience: [],
          industries: []
        }
      }
    default:
      return state
  }
}