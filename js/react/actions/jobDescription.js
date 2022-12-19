import {
  CALL_API,
  CALL_LINKEDIN_API
} from '../middlewares/apiMiddleware'

import { visitApiProfile } from "../utils";

import { NER_HOST } from '../../config/index.js'
import { ACTIVITY_TYPES, MESSAGE_TYPES } from '../../config/constants'

export const SET_SELECTED_JD = 'SET_SELECTED_JD'
export const SET_JD_TEXT = 'SET_JD_TEXT'

export const FETCH_NER = 'FETCH_NER'
export const FETCH_NER_SUCCESS = 'FETCH_NER_SUCCESS'
export const FETCH_NER_FAILURE = 'FETCH_NER_FAILURE'

export const FETCH_LOCATIONS = 'FETCH_LOCATIONS'
export const FETCH_LOCATIONS_SUCCESS = 'FETCH_LOCATIONS_SUCCESS'
export const FETCH_LOCATIONS_FAILURE = 'FETCH_LOCATIONS_FAILURE'

export const FETCH_INDUSTRIES = 'FETCH_INDUSTRIES'
export const FETCH_INDUSTRIES_SUCCESS = 'FETCH_INDUSTRIES_SUCCESS'
export const FETCH_INDUSTRIES_FAILURE = 'FETCH_INDUSTRIES_FAILURE'

export const FETCH_SIMILAR = 'FETCH_SIMILAR'
export const FETCH_SIMILAR_SUCCESS = 'FETCH_SIMILAR_SUCCESS'
export const FETCH_SIMILAR_FAILURE = 'FETCH_SIMILAR_FAILURE'

export const FETCH_IDEAL = 'FETCH_IDEAL'
export const FETCH_IDEAL_SUCCESS = 'FETCH_IDEAL_SUCCESS'
export const FETCH_IDEAL_FAILURE = 'FETCH_IDEAL_FAILURE'

export const CLEAR_SIMILAR = 'CLEAR_SIMILAR'

export const CLEAR_IDEAL = 'CLEAR_IDEAL'

export const CLEAR_BENCHMARK = 'CLEAR_BENCHMARK'

export const CLEAR_INDUSTRY_SUGGESTIONS = 'CLEAR_INDUSTRY_SUGGESTIONS'

export const SET_STEP = 'SET_STEP'

export const SET_LOCATION_VALUE = 'SET_LOCATION_VALUE'

export const SET_LOCATION_STATE = 'SET_LOCATION_STATE'

export const CLEAR_LOCATION_SUGGESTIONS = 'CLEAR_LOCATION_SUGGESTIONS'

export const SET_JOB_TITLE = 'SET_JOB_TITLE'
export const SELECT_ADDITIONAL_TITLE = 'SELECT_ADDITIONAL_TITLE'

export const ADD_ADDITIONAL_TITLE = 'ADD_ADDITIONAL_TITLE'

export const SET_EDUCATION_SCORE = 'SET_EDUCATION_SCORE'
export const ADD_EDUCATION = 'ADD_EDUCATION'
export const DELETE_EDUCATION_ITEM = 'DELETE_EDUCATION_ITEM'
export const SET_EDUCATION_ITEM_VALUE = 'SET_EDUCATION_ITEM_VALUE'


export const SET_TECHNICAL_SKILL_SCORE = 'SET_TECHNICAL_SKILL_SCORE'
export const ADD_TECHNICAL_SKILL = 'ADD_TECHNICAL_SKILL'
export const DELETE_TECHNICAL_SKILL = 'DELETE_TECHNICAL_SKILL'
export const SET_TECHNICAL_SKILL_VALUE = 'SET_TECHNICAL_SKILL_VALUE'

export const SET_ADDITIONAL_SKILL_SCORE = 'SET_ADDITIONAL_SKILL_SCORE'
export const ADD_ADDITIONAL_SKILL = 'ADD_ADDITIONAL_SKILL'
export const DELETE_ADDITIONAL_SKILL = 'DELETE_ADDITIONAL_SKILL'
export const SET_ADDITIONAL_SKILL_VALUE = 'SET_ADDITIONAL_SKILL_VALUE'


export const SET_EXPERIENCE_SCORE = 'SET_EXPERIENCE_SCORE'
export const ADD_EXPERIENCE = 'ADD_EXPERIENCE'
export const DELETE_EXPERIENCE = 'DELETE_EXPERIENCE'
export const SET_EXPERIENCE_VALUE = 'SET_EXPERIENCE_VALUE'


export const SET_INDUSTRY_SCORE = 'SET_INDUSTRY_SCORE'
export const ADD_INDUSTRY = 'ADD_INDUSTRY'
export const DELETE_INDUSTRY = 'DELETE_INDUSTRY'
export const SET_INDUSTRY_VALUE = 'SET_INDUSTRY_VALUE'

export const REQUEST_ADD_JOB = 'REQUEST_ADD_JOB'
export const REQUEST_ADD_JOB_SUCCESS = 'REQUEST_ADD_JOB_SUCCESS'
export const REQUEST_ADD_JOB_FAILURE = 'REQUEST_ADD_JOB_FAILURE'

export const FETCH_JOBS_JD = 'FETCH_JOBS_JD'
export const FETCH_JOBS_JD_SUCCESS = 'FETCH_JOBS_JD_SUCCESS'
export const FETCH_JOBS_JD_FAILURE = 'FETCH_JOBS_JD_FAILURE'

export const fetchJobs = () => {
  return {
    [CALL_API]: {
      types: [FETCH_JOBS_JD, FETCH_JOBS_JD_SUCCESS, FETCH_JOBS_JD_FAILURE],
      endpoint: `/api/auth/job/list`,
      options: {
        method: 'POST'
      }
    }
  }
}

export const addJob = (payload) => {
  chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.LOG_ACTIVITY,
    payload: ACTIVITY_TYPES.CREATE_JOB
  })
  return {
    [CALL_API]: {
      types: [REQUEST_ADD_JOB, REQUEST_ADD_JOB_SUCCESS, REQUEST_ADD_JOB_FAILURE],
      endpoint: '/api/auth/tribes/store',
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    }
  }
}



export const setTechnicalSkillScore = (payload) => ({
  type: SET_TECHNICAL_SKILL_SCORE,
  payload
})
export const addTechnicalSkill = () => ({ type: ADD_TECHNICAL_SKILL })
export const deleteTechnicalSkill = (index) => ({ type: DELETE_TECHNICAL_SKILL, payload: index })
export const setTechnicalSkillValue = (payload) => ({
  type: SET_TECHNICAL_SKILL_VALUE,
  payload
})



export const setAdditionalSkillScore = (payload) => ({
  type: SET_ADDITIONAL_SKILL_SCORE,
  payload
})
export const addAdditionalSkill = () => ({ type: ADD_ADDITIONAL_SKILL })
export const deleteAdditionalSkill = (index) => ({ type: DELETE_ADDITIONAL_SKILL, payload: index })
export const setAdditionalSkillValue = (payload) => ({
  type: SET_ADDITIONAL_SKILL_VALUE,
  payload
})


export const setExperienceScore = (payload) => ({
  type: SET_EXPERIENCE_SCORE,
  payload
})
export const addExperience = () => ({ type: ADD_EXPERIENCE })
export const deleteExperience = (index) => ({ type: DELETE_EXPERIENCE, payload: index })
export const setExperienceValue = (payload) => ({
  type: SET_EXPERIENCE_VALUE,
  payload
})


export const setIndustryScore = (payload) => ({
  type: SET_INDUSTRY_SCORE,
  payload
})
export const addIndustry = () => ({ type: ADD_INDUSTRY })
export const deleteIndustry = (index) => ({ type: DELETE_INDUSTRY, payload: index })
export const setIndustryValue = (payload) => ({
  type: SET_INDUSTRY_VALUE,
  payload
})



export const setEducationItemValue = (payload) => ({
  type: SET_EDUCATION_ITEM_VALUE,
  payload
})

export const deleteEducationItem = (index) => ({
  type: DELETE_EDUCATION_ITEM,
  payload: index
})

export const addEducation = () => ({
  type: ADD_EDUCATION
})

export const setEducationScore = (payload) => ({
  type: SET_EDUCATION_SCORE,
  payload
})

export const addAdditionalTitle = (payload) => ({
  type: ADD_ADDITIONAL_TITLE,
  payload
})

export const setJobTitle = (value) => ({
  type: SET_JOB_TITLE,
  payload: value
})

export const selectAdditionalTitle = (title) => ({
  type: SELECT_ADDITIONAL_TITLE,
  payload: title
})

export const clearLocationSuggestions = () => ({
  type: CLEAR_LOCATION_SUGGESTIONS
})

export const fetchNer = (jdText) => {
  const body = new FormData()
  body.append('text', jdText)
  return {
    [CALL_API]: {
      types: [FETCH_NER, FETCH_NER_SUCCESS, FETCH_NER_FAILURE],
      apiSource: NER_HOST,
      endpoint: '/extract',
      options: {
        method: 'POST',
        body
      }
    }
  }
}

export const setJdText = (text) => ({
  type: SET_JD_TEXT,
  payload: text
})

export const setSelectedJd = (selectedJd) => ({
  type: SET_SELECTED_JD,
  payload: selectedJd
})

export const setStep = (step) => ({
  type: SET_STEP,
  payload: step
})

export const setLocationValue = (value) => ({
  type: SET_LOCATION_VALUE,
  payload: value
})

export const setLocationState = (locationState) => ({
  type: SET_LOCATION_STATE,
  payload: locationState
})

export const fetchLocations = (value) => {
  return {
    [CALL_LINKEDIN_API]: {
      types: [FETCH_LOCATIONS, FETCH_LOCATIONS_SUCCESS, FETCH_LOCATIONS_FAILURE],
      endpoint: `/voyager/api/typeahead/hitsV2?keywords=${value}&origin=OTHER&q=type&queryContext=List(geoVersion-%3E3,bingGeoSubTypeFilters-%3EMARKET_AREA%7CCOUNTRY_REGION%7CADMIN_DIVISION_1%7CCITY)&type=GEO&useCase=GEO_ABBREVIATED`,
      options: {
        method: 'GET',
        headers: {
          'x-li-lang': 'en_US',
          'x-restli-protocol-version': '2.0.0'
        }
      }
    }
  }
}

export const fetchIndustries = (value) => {
  return {
    [CALL_LINKEDIN_API]: {
      types: [FETCH_INDUSTRIES, FETCH_INDUSTRIES_SUCCESS, FETCH_INDUSTRIES_FAILURE],
      endpoint: `/voyager/api/typeahead/hitsV2?keywords=${value}&origin=OTHER&q=type&type=INDUSTRY`,
      options: {
        method: 'GET',
        headers: {
          'x-li-lang': 'en_US',
          'x-restli-protocol-version': '2.0.0'
        }
      }
    }
  }
}

export const fetchSimilar = (value) => async (dispatch, getState) => {
  
  try{

      dispatch({
        type: FETCH_SIMILAR
      })

      const res = await visitApiProfile(value)

      console.log(res)

      dispatch({
        type: FETCH_SIMILAR_SUCCESS,
        payload: res
      })
    
  }
  catch (e){
    dispatch({
      type: FETCH_SIMILAR_FAILURE
    })

  }
}

export const fetchIdeal = (value) => async (dispatch, getState) => {
  
  try{

    dispatch({
      type: FETCH_IDEAL
    })

    const res = await visitApiProfile(value)

    console.log(res)

    dispatch({
      type: FETCH_IDEAL_SUCCESS,
      payload: res
    })
  
  }
  catch (e){
    dispatch({
      type: FETCH_IDEAL_FAILURE
    })

  }
}

export const clearSimilar = () => ({
  type: CLEAR_SIMILAR
})

export const clearIdeal = (id) => ({
  type: CLEAR_IDEAL,
  payload: { id }
})

export const clearBenchmark = () => ({
  type: CLEAR_BENCHMARK
})

export const clearIndustrySuggestions = () => ({
  type: CLEAR_INDUSTRY_SUGGESTIONS
})
export const CLEAR_JOB_DESCRIPTION = 'CLEAR_JOB_DESCRIPTION'
export const clearJobDescription = () => {
  return {
    type: CLEAR_JOB_DESCRIPTION
  }
}

export const CLEAR_REVISE_JD = 'CLEAR_REVISE_JD'
export const clearReviseJd = () => {
  return {
    type: CLEAR_REVISE_JD
  }
}

export const CLEAR_JOB_LOCATION = 'CLEAR_JOB_LOCATION'
export const clearJobLocation = () => {
  return {
    type: CLEAR_JOB_LOCATION
  }
}