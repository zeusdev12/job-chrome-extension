
import { CALL_API, CALL_PENCILIT_API } from '../middlewares/apiMiddleware'
import { visitApiProfile, manualApiCall, getToken } from '../utils/index'

export const SET_MESSAGE_VALUE = 'SET_MESSAGE_VALUE'
export const SELECT_PROSPECT = 'SELECT_PROSPECT'
export const UNSELECT_PROSPECT = 'UNSELECT_PROSPECT'

export const ARCHIVE_PROSPECTS = 'ARCHIVE_PROSPECTS'
export const ARCHIVE_PROSPECTS_SUCCESS = 'ARCHIVE_PROSPECTS_SUCCESS'
export const ARCHIVE_PROSPECTS_FAILURE = 'ARCHIVE_PROSPECTS_FAILURE'

export const UNARCHIVE_PROSPECTS = 'UNARCHIVE_PROSPECTS'
export const UNARCHIVE_PROSPECTS_SUCCESS = 'UNARCHIVE_PROSPECTS_SUCCESS'
export const UNARCHIVE_PROSPECTS_FAILURE = 'UNARCHIVE_PROSPECTS_FAILURE'

export const SAVE_PROSPECTS = 'SAVE_PROSPECTS'
export const SAVE_PROSPECTS_SUCCESS = 'SAVE_PROSPECTS_SUCCESS'
export const SAVE_PROSPECTS_FAILURE = 'SAVE_PROSPECTS_FAILURE'

export const UNSAVE_PROSPECTS = 'UNSAVE_PROSPECTS'
export const UNSAVE_PROSPECTS_SUCCESS = 'UNSAVE_PROSPECTS_SUCCESS'
export const UNSAVE_PROSPECTS_FAILURE = 'UNSAVE_PROSPECTS_FAILURE'

export const SETDOWNLOADED_PROSPECTS = 'SETDOWNLOADED_PROSPECTS'
export const SETDOWNLOADED_PROSPECTS_SUCCESS = 'SETDOWNLOADED_PROSPECTS_SUCCESS'
export const SETDOWNLOADED_PROSPECTS_FAILURE = 'SETDOWNLOADED_PROSPECTS_FAILURE'

export const SET_MESSAGE_SETTING = 'SET_MESSAGE_SETTING'
export const SET_MESSAGE_SETTING_SUCCESS = 'SET_MESSAGE_SETTING_SUCCESS'
export const SET_MESSAGE_SETTING_FAILURE = 'SET_MESSAGE_SETTING_FAILURE'

export const GET_MESSAGE_SETTING = 'GET_MESSAGE_SETTING'
export const GET_MESSAGE_SETTING_SUCCESS = 'GET_MESSAGE_SETTING_SUCCESS'
export const GET_MESSAGE_SETTING_FAILURE = 'GET_MESSAGE_SETTING_FAILURE'

export const TOGGLE_MESSAGE_ENABLED = 'SET_MESSAGE_ENABLED'
export const SET_FOLLOWUP_DAYS = 'SET_FOLLOWUP_DAYS'


export const ENHANCE_PROFILE = 'ENHANCE_PROFILE'
export const ENHANCE_PROFILE_SUCCESS = 'ENHANCE_PROFILE_SUCCESS'
export const ENHANCE_PROFILE_FAILURE = 'ENHANCE_PROFILE_FAILURE'

export const LOAD_COMPOSE_MESSAGE = 'LOAD_COMPOSE_MESSAGE'
export const LOAD_COMPOSE_MESSAGE_SUCCESS = 'LOAD_COMPOSE_MESSAGE_SUCCESS'
export const LOAD_COMPOSE_MESSAGE_FAILURE = 'LOAD_COMPOSE_MESSAGE_FAILURE'
export const LOAD_REQUEST_MEETING = 'LOAD_REQUEST_MEETING'
export const LOAD_REQUEST_MEETING_SUCCESS = 'LOAD_REQUEST_MEETING_SUCCESS'
export const LOAD_REQUEST_MEETING_FAILURE = 'LOAD_REQUEST_MEETING_FAILURE'

export const SELECT_ALL_PROSPECTS = 'SELECT_ALL_PROSPECTS'
export const UNSELECT_ALL_PROSPECTS = 'UNSELECT_ALL_PROSPECTS'
export const SELECT_TOP_PROSPECTS = 'SELECT_TOP_PROSPECTS'

export const INCREMENT_CONNECT_SENT = 'INCREMENT_CONNECT_SENT'
export const SET_CONNECT_LIMIT = 'SET_CONNECT_LIMIT'
export const INITIALIZE_CONNECT_SENT = 'INITIALIZE_CONNECT_SENT'

export const ADD_NOTE = 'ADD_NOTE'
export const ADD_NOTE_SUCCESS = 'ADD_NOTE_SUCCESS'
export const ADD_NOTE_FAILURE = 'ADD_NOTE_FAILURE'
export const SET_ACTIVE_TAB = "SET_ACTIVE_TAB"
export const SET_RECENT_NOTE = 'SET_RECENT_NOTE'
export const DECREMENT_NOTE_COUNT = 'DECREMENT_NOTE_COUNT'

export const decrementNoteCount = (jobProfileId) => ({
  type: DECREMENT_NOTE_COUNT,
  payload: jobProfileId
})

export const setRecentNote = ({ jobProfileId, note }) => ({
  type: SET_RECENT_NOTE,
  payload: { jobProfileId, note }
})

export const addNote = ({ jId, note, jobProfileId }) => async (dispatch) => {
  try {
    dispatch({ type: ADD_NOTE, payload: { jId, note, jobProfileId } })
    const data = await manualApiCall('/api/auth/job/profile/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: jId, note, jobProfileId })
    })

    dispatch({ type: ADD_NOTE_SUCCESS, payload: data.note })
  } catch (e) {
    dispatch({ type: ADD_NOTE_FAILURE, payload: { jId, note, jobProfileId } })
  }
}



export const incrementConnectSent = () => ({
  type: INCREMENT_CONNECT_SENT
})

export const setConnectLimit = (limit) => ({
  type: SET_CONNECT_LIMIT,
  payload: limit
})

export const initializeConnectSent = (payload) => ({
  type: INITIALIZE_CONNECT_SENT,
  payload: payload
})

export const unselectAllProspects = () => ({
  type: UNSELECT_ALL_PROSPECTS
})

export const selectAllProspects = (pIds) => (dispatch, getState) => {
  const allProspectIds = pIds ? pIds : getState().score.list.data.prospectsArray.map(item => item.id)

  dispatch({
    type: SELECT_ALL_PROSPECTS,
    payload: allProspectIds
  })
}

export const selectTopProspects = (topProspects) =>
  (dispatch, getState) => {
    const topProspectIds = getState().score.list.data.prospectsArray
      .filter((item, i) => i < topProspects)
      .map(item => item.id)
    console.log(topProspectIds)
    dispatch({
      type: SELECT_TOP_PROSPECTS,
      payload: topProspectIds
    })
  }


export const enhanceProfile = ({ publicIdentifier, id, jobId, token, profileUrl }) => (dispatch) => {
  dispatch({ type: ENHANCE_PROFILE, payload: id })

  visitApiProfile(publicIdentifier)
    .then(data => {
      return manualApiCall('/api/auth/post-applicants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobID: jobId,
          profileArray: [{ ...data, profileUrl: profileUrl }],
          token
        })
      })
    })
    .then(() => {
      dispatch({
        type: ENHANCE_PROFILE_SUCCESS,
        payload: id
      })
    })
    .catch(err => {
      dispatch({
        type: ENHANCE_PROFILE_FAILURE,
        payload: id,
        error: err
      })
      console.log('error occured: ', err.message)
    })

}


export const toggleMessageEnabled = (connectionType, type) => {
  return {
    type: TOGGLE_MESSAGE_ENABLED,
    payload: {
      connectionType,
      type
    }
  }
}

export const setFollowUpDays = (connectionType, type, value) => (
  {
    type: SET_FOLLOWUP_DAYS,
    payload: { connectionType, type, value }
  })

export const getMessageSetting = (jobId) => {
  console.log('JOB ID FOR GET MESSAGE SETTINGS: ', jobId)
  return {
    [CALL_API]: {
      types: [GET_MESSAGE_SETTING, GET_MESSAGE_SETTING_SUCCESS, GET_MESSAGE_SETTING_FAILURE],
      endpoint: `/api/auth/job/meeting/setting/get`,
      options: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobID: jobId })
      },
    }
  }
}

export const setMessageSetting = (payload) => ({
  [CALL_API]: {
    types: [SET_MESSAGE_SETTING, SET_MESSAGE_SETTING_SUCCESS, SET_MESSAGE_SETTING_FAILURE],
    endpoint: '/api/auth/job/meeting/setting/set',
    options: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
  }
})


export const setActiveTab = (tab) => ({
  type: SET_ACTIVE_TAB,
  payload: tab
})

export const composeMessageLoading = () => ({
  type: LOAD_COMPOSE_MESSAGE
})
export const composeMessageLoaded = () => ({
  type: LOAD_COMPOSE_MESSAGE_SUCCESS
})
export const composeMessageFaliure = () => ({
  type: LOAD_COMPOSE_MESSAGE_FAILURE
})

export const requestMeetingLoading = () => ({
  type: LOAD_REQUEST_MEETING
})
export const requestMeetingLoaded = () => ({
  type: LOAD_REQUEST_MEETING_SUCCESS
})
export const requestMeetingFaliure = () => ({
  type: LOAD_REQUEST_MEETING_FAILURE
})


export const archiveProspects = ({
  jobId,
  prospects,
  newJob
}) => async (dispatch, getState) => {

  const requestArray = getState().score.list.data.prospectsArray
  try {
    const response = await manualApiCall(`/api/auth/job/profile/archived`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobId: jobId,
        profileId: prospects,
        newJob: newJob,
        action: 'DELETE'
      })
    })
    console.log(response)
    dispatch({
      type: ARCHIVE_PROSPECTS_SUCCESS,
      payload: { ids: prospects, counts: response.data.counts, activeTab: "Home" },
      shouldFetchAgain: prospects.length === requestArray.length
    })
  } catch (e) {
    dispatch({
      type: ARCHIVE_PROSPECTS_FAILURE,
      payload: e.message
    })
  }
}


export const unarchiveProspects = ({
  jobId,
  prospects,
  newJob }) => async (dispatch, getState) => {
    const requestArray = getState().score.list.data.prospectsArray
    try {
      const response = await manualApiCall(`/api/auth/job/profile/archived`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobId: jobId,
          profileId: prospects,
          newJob: newJob,
          action: "ROLLBACK"
        })
      })

      dispatch({
        type: UNARCHIVE_PROSPECTS_SUCCESS,
        payload: { ids: prospects, counts: response.data.counts, activeTab: "Home" },
        shouldFetchAgain: requestArray.length === prospects.length
      })

    } catch (e) {
      dispatch({
        type: UNARCHIVE_PROSPECTS_FAILURE,
        payload: e.message
      })
    }
  }


export const setDownloaded = (jobId, profiles, newJob, activeTab) => async (dispatch, getState) => {
  // const requestArray = getState().score.list.data.prospectsArray
  const user = getState()?.auth?.user?.name
  try {
    const response = await manualApiCall(`/api/auth/job/profile/downloaded`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobId: jobId,
        profiles: profiles,
        newJob: newJob
      })
    })

    dispatch({
      type: SETDOWNLOADED_PROSPECTS_SUCCESS,
      payload: {
        ids: profiles,
        counts: response.data.counts,
        activeTab,
        userName: user
      }
    })

  } catch (e) {
    dispatch({
      type: SETDOWNLOADED_PROSPECTS_FAILURE,
      payload: e.message
    })
  }
}



// export const unarchiveProspects = ({ jobId, prospects }) => ({
//   [CALL_API]: {
//     types: [UNARCHIVE_PROSPECTS, UNARCHIVE_PROSPECTS_SUCCESS, UNARCHIVE_PROSPECTS_FAILURE],
//     endpoint: `/api/auth/job/profile/archived`,
//     options: {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         jobId: jobId,
//         profileId: prospects,
//         action: "ROLLBACK"
//       })
//     }
//   }
// })

export const saveProspects = ({ jobId, prospects, saveFilterFlag }) => (dispatch, getState) => {
  try {
    dispatch({
      type: SAVE_PROSPECTS
    })


    const user = getState()?.auth?.user?.name

    manualApiCall(`/api/auth/job/profile/saved`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobId: jobId,
        profiles: prospects,
        action: "SAVE"
      })
    })

    dispatch({
      type: SAVE_PROSPECTS_SUCCESS,
      payload: {
        ids: prospects,
        action: true,
        saveFilterFlag,
        userName: user
      }
    })

  } catch (e) {
    dispatch({
      type: SAVE_PROSPECTS_FAILURE,
      payload: e.message
    })
  }

  // [CALL_API]: {
  //   types: [SAVE_PROSPECTS, SAVE_PROSPECTS_SUCCESS, SAVE_PROSPECTS_FAILURE],
  //   endpoint: `/api/auth/job/profile/saved`,
  //   options: {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       jobId: jobId,
  //       profiles: prospects,
  //       action: "SAVE"
  //     })
  //   }
  // }
}

export const unsaveProspects = ({ jobId, prospects, saveFilterFlag }) => (dispatch, getState) => {
  try {
    dispatch({
      type: UNSAVE_PROSPECTS
    })

    const user = getState()?.auth?.user?.name

    manualApiCall(`/api/auth/job/profile/saved`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobId: jobId,
        profiles: prospects,
        action: "ROLLBACK"
      })
    })

    dispatch({
      type: UNSAVE_PROSPECTS_SUCCESS,
      payload: {
        ids: prospects,
        action: false,
        saveFilterFlag,
        userName: user
      }
    })

  } catch (e) {
    dispatch({
      type: UNSAVE_PROSPECTS_FAILURE,
      payload: e.message
    })
  }
}
//   [CALL_API]: {
//     types: [UNSAVE_PROSPECTS, UNSAVE_PROSPECTS_SUCCESS, UNSAVE_PROSPECTS_FAILURE],
//     endpoint: `/api/auth/job/profile/saved`,
//     options: {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         jobId: jobId,
//         profiles: prospects,
//         action: "ROLLBACK"
//       })
//     }
//   }
// })


export const unselectProspect = (id) => ({
  type: UNSELECT_PROSPECT,
  payload: id
})
export const selectProspect = (id) => {
  return {
    type: SELECT_PROSPECT,
    payload: id
  }
}

export const setMessageValue = ({
  connectionType,
  type,
  value,

}) => {
  return {
    type: SET_MESSAGE_VALUE,
    payload: { connectionType, type, value }
  }
}

export const SET_REQUEST_MEETING = 'SET_REQUEST_MEETING'
export const setRequestMeeting = message => {
  return {
    type: SET_REQUEST_MEETING,
    payload: message
  }
}

export const SET_SKILLS_FILTERS = 'SET_SKILLS_FILTERS'
export const setSkillsFilters = skillsFilters => {
  return {
    type: SET_SKILLS_FILTERS,
    payload: skillsFilters
  }
}

export const TOGGLE_STRICT_SKILLS = 'TOGGLE_STRICT_SKILLS'
export const toggleStrictSkills = () => {
  return {
    type: TOGGLE_STRICT_SKILLS
  }
}

export const SET_STRICT_SKILLS = 'SET_STRICT_SKILLS'
export const setStrictSkills = flag => {
  return {
    type: SET_STRICT_SKILLS,
    payload: flag
  }
}

export const SET_SCHOOL_FILTERS = 'SET_SCHOOL_FILTERS'
export const setSchoolFilters = schoolFilters => {
  return {
    type: SET_SCHOOL_FILTERS,
    payload: schoolFilters
  }
}

export const SET_EDUCATION_FILTERS = 'SET_EDUCATION_FILTERS'
export const setEducationFilters = filters => {
  return {
    type: SET_EDUCATION_FILTERS,
    payload: filters
  }
}

export const TOGGLE_STRICT_EDUCATION = 'TOGGLE_STRICT_EDUCATION'
export const toggleStrictEducation = () => {
  return {
    type: TOGGLE_STRICT_EDUCATION
  }
}

export const SET_CURRENT_TITLE_FILTERS = 'SET_CURRENT_TITLE_FILTERS'
export const setCurrentTitleFilters = currentTitleFilters => {
  return {
    type: SET_CURRENT_TITLE_FILTERS,
    payload: currentTitleFilters
  }
}
export const TOGGLE_STRICT_CURRENT_TITLE = 'TOGGLE_STRICT_CURRENT_TITLE'
export const toggleStrictCurrentTitle = () => {
  return {
    type: TOGGLE_STRICT_CURRENT_TITLE
  }
}

export const SET_PAST_TITLE_FILTERS = 'SET_PAST_TITLE_FILTERS'
export const setPastTitleFilters = pastTitleFilters => {
  return {
    type: SET_PAST_TITLE_FILTERS,
    payload: pastTitleFilters
  }
}
export const TOGGLE_STRICT_PAST_TITLE = 'TOGGLE_STRICT_PAST_TITLE'
export const toggleStrictPastTitle = () => {
  return {
    type: TOGGLE_STRICT_PAST_TITLE
  }
}

export const SET_CURRENT_COMPANY_FILTERS = 'SET_CURRENT_COMPANY_FILTERS'
export const setCurrentCompanyFilters = currentCompanyFilters => {
  return {
    type: SET_CURRENT_COMPANY_FILTERS,
    payload: currentCompanyFilters
  }
}

export const SET_PAST_COMPANY_FILTERS = 'SET_PAST_COMPANY_FILTERS'
export const setPastCompanyFilters = pastCompanyFilters => {
  return {
    type: SET_PAST_COMPANY_FILTERS,
    payload: pastCompanyFilters
  }
}

export const SET_CURRENT_INDUSTRY_FILTERS = 'SET_CURRENT_INDUSTRY_FILTERS'
export const setCurrentIndustryFilters = currentIndustryFilters => {
  return {
    type: SET_CURRENT_INDUSTRY_FILTERS,
    payload: currentIndustryFilters
  }
}

export const SET_PAST_INDUSTRY_FILTERS = 'SET_PAST_INDUSTRY_FILTERS'
export const setPastIndustryFilters = pastIndustryFilters => {
  return {
    type: SET_PAST_INDUSTRY_FILTERS,
    payload: pastIndustryFilters
  }
}

export const SET_LOCATION_FILTERS = 'SET_LOCATION_FILTERS'
export const setLocationFilters = locationFilters => {
  return {
    type: SET_LOCATION_FILTERS,
    payload: locationFilters
  }
}

export const SET_VISA_FILTERS = 'SET_VISA_FILTERS'
export const setVisaFilters = visaFilters => {
  return {
    type: SET_VISA_FILTERS,
    payload: visaFilters
  }
}

export const SET_TOTAL_EXPERIENCE_FILTER = 'SET_TOTAL_EXPERIENCE_FILTER'
export const setTotalExperienceFilter = filter => {
  return {
    type: SET_TOTAL_EXPERIENCE_FILTER,
    payload: filter
  }
}

export const SET_RELEVANT_EXPERIENCE_FILTER = 'SET_RELEVANT_EXPERIENCE_FILTER'
export const setRelevantExperienceFilter = filter => {
  return {
    type: SET_RELEVANT_EXPERIENCE_FILTER,
    payload: filter
  }
}

export const TOGGLE_TOTAL_EXPERIENCE_FILTER = 'TOGGLE_TOTAL_EXPERIENCE_FILTER'
export const toggleTotalExperienceFilter = () => {
  return {
    type: TOGGLE_TOTAL_EXPERIENCE_FILTER
  }
}


export const TOGGLE_RELEVANT_EXPERIENCE_FILTER = 'TOGGLE_RELEVANT_EXPERIENCE_FILTER'
export const toggleRelevantExperienceFilter = () => {
  return {
    type: TOGGLE_RELEVANT_EXPERIENCE_FILTER
  }
}


export const SET_COMPANY_SIZE_FILTER = 'SET_COMPANY_SIZE_FILTER'
export const setCompanySizeFilter = filter => {
  return {
    type: SET_COMPANY_SIZE_FILTER,
    payload: filter
  }
}

export const TOGGLE_COMPANY_SIZE_FILTER = 'TOGGLE_COMPANY_SIZE_FILTER'
export const toggleCompanySizeFilter = () => {
  return {
    type: TOGGLE_COMPANY_SIZE_FILTER
  }
}

export const SET_TITLE_SCORE_FILTER = 'SET_TITLE_SCORE_FILTER'
export const setTitleScoringFilter = (filter) => {
  return {
    type: SET_TITLE_SCORE_FILTER,
    payload: filter
  }
}

export const TOGGLE_TITLE_SCORE_FILTER = 'TOGGLE_TITLE_SCORE_FILTER'
export const toggleTitleScoringFilter = () => {
  return {
    type: TOGGLE_TITLE_SCORE_FILTER
  }
}


export const SET_SKILL_SCORE_FILTER = 'SET_SKILL_SCORE_FILTER'
export const setSkillScoringFilter = (filter) => {
  return {
    type: SET_SKILL_SCORE_FILTER,
    payload: filter
  }
}

export const TOGGLE_SKILL_SCORE_FILTER = 'TOGGLE_SKILL_SCORE_FILTER'
export const toggleSkillScoringFilter = () => {
  return {
    type: TOGGLE_SKILL_SCORE_FILTER
  }
}


export const SET_EXPERIENCE_SCORE_FILTER = 'SET_EXPERIENCE_SCORE_FILTER'
export const setExperienceScoringFilter = (filter) => {
  return {
    type: SET_EXPERIENCE_SCORE_FILTER,
    payload: filter
  }
}

export const TOGGLE_EXPERIENCE_SCORE_FILTER = 'TOGGLE_EXPERIENCE_SCORE_FILTER'
export const toggleExperienceScoringFilter = () => {
  return {
    type: TOGGLE_EXPERIENCE_SCORE_FILTER
  }
}


export const SET_EDUCATION_SCORE_FILTER = 'SET_EDUCATION_SCORE_FILTER'
export const setEducationScoringFilter = (filter) => {
  return {
    type: SET_EDUCATION_SCORE_FILTER,
    payload: filter
  }
}

export const TOGGLE_EDUCATION_SCORE_FILTER = 'TOGGLE_EDUCATION_SCORE_FILTER'
export const toggleEducationScoringFilter = () => {
  return {
    type: TOGGLE_EDUCATION_SCORE_FILTER
  }
}


export const SET_INDUSTRY_SCORE_FILTER = 'SET_INDUSTRY_SCORE_FILTER'
export const setIndustryScoringFilter = (filter) => {
  return {
    type: SET_INDUSTRY_SCORE_FILTER,
    payload: filter
  }
}

export const TOGGLE_INDUSTRY_SCORE_FILTER = 'TOGGLE_INDUSTRY_SCORE_FILTER'
export const toggleIndustryScoringFilter = () => {
  return {
    type: TOGGLE_INDUSTRY_SCORE_FILTER
  }
}


export const CLEAR_SCORING_FILTERS = 'CLEAR_SCORING_FILTERS'
export const clearScoringFilter = () => {
  return {
    type: CLEAR_SCORING_FILTERS
  }
}


export const FETCH_PROSPECTS = 'FETCH_PROSPECTS'
export const FETCH_PROSPECTS_SUCCESS = 'FETCH_PROSPECTS_SUCCESS'
export const FETCH_PROSPECTS_FAILURE = 'FETCH_PROSPECTS_FAILURE'

export const fetchProspects = (parameters, pageNo = 1) => {

  // let params = {}
  // for(let param in parameters){
  //   params[param] = encodeURIComponent(parameters[param])
  // }

  const params = Object.keys(parameters).reduce((obj, item) => {
    return { ...obj, [item]: encodeURIComponent(parameters[item]) }
  }, {})


  console.log('PARAMS ARE: ', params)
  console.log("page No is: ", pageNo)

  // const str = qs.stringify(params)
  return {
    [CALL_API]: {
      types: [FETCH_PROSPECTS, FETCH_PROSPECTS_SUCCESS, FETCH_PROSPECTS_FAILURE],
      endpoint: `/api/auth/job/profile/list/advancedFilter?jId=${params.jId}${pageNo ? `&pNo=${pageNo}` : ''}${params.fS ? `&fS=${params.fS}&fSO=${params.fSO}` : ''}${params.secS ? `&secS=${params.secS}&secSO=${params.secSO}` : ''}${params.sTF ? `&sTF=${params.sTF}` : ''}${params.sF ? `&sF=${params.sF}` : ''}${params.tF ? `&tF=${params.tF}` : ''}${params.cTF ? `&cTF=${params.cTF}` : ''}${params.sS ? `&sS=${params.sS}` : ""}${params.eS ? `&eS=${params.eS}` : ""}${params.hS ? `&hS=${params.hS}` : ""}${params.eSS ? `&eSS=${params.eSS}` : ""}${params.hSS ? `&hSS=${params.hSS}` : ""}${params.eE ? `&eE=${params.eE}` : ""}${params.hE ? `&hE=${params.hE}` : ""}${params.eCT ? `&eCT=${params.eCT}` : ""}${params.hCT ? `&hCT=${params.hCT}` : ""}${params.ePT ? `&ePT=${params.ePT}` : ""}${params.hPT ? `&hPT=${params.hPT}` : ""}${params.cTS ? `&cTS=${params.cTS}` : ""}${params.pTS ? `&pTS=${params.pTS}` : ""}${params.eCC ? `&eCC=${params.eCC}` : ""}${params.hCC ? `&hCC=${params.hCC}` : ""}${params.ePC ? `&ePC=${params.ePC}` : ""}${params.hPC ? `&hPC=${params.hPC}` : ""}${params.eCSR ? `&eCSR=${params.eCSR}` : ""}${params.hCSR ? `&hCSR=${params.hCSR}` : ""}${params.eCI ? `&eCI=${params.eCI}` : ""}${params.hCI ? `&hCI=${params.hCI}` : ""}${params.ePI ? `&ePI=${params.ePI}` : ""}${params.hPI ? `&hPI=${params.hPI}` : ""}${params.eL ? `&eL=${params.eL}` : ""}${params.hL ? `&hL=${params.hL}` : ""}${params.eV ? `&eV=${params.eV}` : ""}${params.hV ? `&hV=${params.hV}` : ""}${params.tSF ? `&tSF=${params.tSF}` : ""}${params.sSF ? `&sSF=${params.sSF}` : ""}${params.expSF ? `&expSF=${params.expSF}` : ""}${params.edSF ? `&edSF=${params.edSF}` : ""}${params.iSF ? `&iSF=${params.iSF}` : ""}${params.tE ? `&tE=${params.tE}` : ""}${params.rE ? `&rE=${params.rE}` : ""}${params.eDS ? `&eDS=${params.eDS}` : ""}${params.pU ? `&pU=${params.pU}` : ''}`,
      options: {
        method: 'GET'
      },
      meta: {
        pageNo
      }
    }
  }
}


export const FETCH_ALL_PROSPECTS = 'FETCH_ALL_PROSPECTS'
export const FETCH_ALL_PROSPECTS_SUCCESS = 'FETCH_ALL_PROSPECTS_SUCCESS'
export const FETCH_ALL_PROSPECTS_FAILURE = 'FETCH_ALL_PROSPECTS_FAILURE'

export const fetchAllProspects = (parameters) => {

  const params = Object.keys(parameters).reduce((obj, item) => {
    return { ...obj, [item]: encodeURIComponent(parameters[item]) }
  }, {})

  // const str = qs.stringify(params)
  return {
    [CALL_API]: {
      types: [FETCH_ALL_PROSPECTS, FETCH_ALL_PROSPECTS_SUCCESS, FETCH_ALL_PROSPECTS_FAILURE],
      endpoint: `/api/auth/job/profile/list/advancedFilter?jId=${params.jId}${params.fS ? `&fS=${params.fS}&fSO=${params.fSO}` : ''}${params.secS ? `&secS=${params.secS}&secSO=${params.secSO}` : ''}${params.sTF ? `&sTF=${params.sTF}` : ''}${params.sF ? `&sF=${params.sF}` : ''}${params.tF ? `&tF=${params.tF}` : ''}${params.sS ? `&sS=${params.sS}` : ""}${params.eS ? `&eS=${params.eS}` : ""}${params.hS ? `&hS=${params.hS}` : ""}${params.eSS ? `&eSS=${params.eSS}` : ""}${params.hSS ? `&hSS=${params.hSS}` : ""}${params.eE ? `&eE=${params.eE}` : ""}${params.hE ? `&hE=${params.hE}` : ""}${params.eCT ? `&eCT=${params.eCT}` : ""}${params.hCT ? `&hCT=${params.hCT}` : ""}${params.ePT ? `&ePT=${params.ePT}` : ""}${params.hPT ? `&hPT=${params.hPT}` : ""}${params.cTS ? `&cTS=${params.cTS}` : ""}${params.pTS ? `&pTS=${params.pTS}` : ""}${params.eCC ? `&eCC=${params.eCC}` : ""}${params.hCC ? `&hCC=${params.hCC}` : ""}${params.ePC ? `&ePC=${params.ePC}` : ""}${params.hPC ? `&hPC=${params.hPC}` : ""}${params.eCSR ? `&eCSR=${params.eCSR}` : ""}${params.hCSR ? `&hCSR=${params.hCSR}` : ""}${params.eCI ? `&eCI=${params.eCI}` : ""}${params.hCI ? `&hCI=${params.hCI}` : ""}${params.ePI ? `&ePI=${params.ePI}` : ""}${params.hPI ? `&hPI=${params.hPI}` : ""}${params.eL ? `&eL=${params.eL}` : ""}${params.hL ? `&hL=${params.hL}` : ""}${params.eV ? `&eV=${params.eV}` : ""}${params.hV ? `&hV=${params.hV}` : ""}${params.tSF ? `&tSF=${params.tSF}` : ""}${params.sSF ? `&sSF=${params.sSF}` : ""}${params.expSF ? `&expSF=${params.expSF}` : ""}${params.edSF ? `&edSF=${params.edSF}` : ""}${params.iSF ? `&iSF=${params.iSF}` : ""}${params.tE ? `&tE=${params.tE}` : ""}${params.rE ? `&rE=${params.rE}` : ""}${params.eDS ? `&eDS=${params.eDS}` : ""}&pFlag=false`,
      options: {
        method: 'GET'
      }
    }
  }
}

export const FETCH_ADVANCED_FILTER = 'FETCH_ADVANCED_FILTER'
export const FETCH_ADVANCED_FILTER_SUCCESS = 'FETCH_ADVANCED_FILTER_SUCCESS'
export const FETCH_ADVANCED_FILTER_FAILURE = 'FETCH_ADVANCED_FILTER_FAILURE'

export const fetchAdvancedFilter = (params) => {
  // const str = qs.stringify(params)

  console.log("=========================0000545")
  return {
    [CALL_API]: {
      types: [FETCH_ADVANCED_FILTER, FETCH_ADVANCED_FILTER_SUCCESS, FETCH_ADVANCED_FILTER_FAILURE],
      endpoint: `/api/auth/job/profile/advanced-filters-data?jobId=${params.jId}`,
      options: {
        method: 'GET'
      }
    }
  }
}

/*******
 *
 * Pencil it  account check
 *
 * ******/

export const FETCH_PENCILIT_ACCOUNT = 'FETCH_PENCILIT_ACCOUNT'
export const FETCH_PENCILIT_ACCOUNT_SUCCESS = 'FETCH_PENCILIT_ACCOUNT_SUCCESS'
export const FETCH_PENCILIT_ACCOUNT_FAILURE = 'FETCH_PENCILIT_ACCOUNT_FAILURE'

export const fetchPencilitAccount = (user) => {
  // const str = qs.stringify(params)
  // alert(JSON.stringify(user))
  return {
    [CALL_PENCILIT_API]: {
      types: [FETCH_PENCILIT_ACCOUNT, FETCH_PENCILIT_ACCOUNT_SUCCESS, FETCH_PENCILIT_ACCOUNT_FAILURE],
      endpoint: `/api/v1/get/status?email=${user.emailAddress}`,
      options: {
        method: 'GET'
      }
    }
  }
}

export const CREATE_PENCILIT_PROFILE = 'CREATE_PENCILIT_PROFILE'
export const CREATE_PENCILIT_PROFILE_SUCCESS = 'CREATE_PENCILIT_PROFILE_SUCCESS'
export const CREATE_PENCILIT_PROFILE_FAILURE = 'CREATE_PENCILIT_PROFILE_FAILURE'

export const pencilitAccountIntegration = (user) => {
  // const str = qs.stringify(params)
  // alert(JSON.stringify(user))


  return {
    [CALL_PENCILIT_API]: {
      types: [CREATE_PENCILIT_PROFILE, CREATE_PENCILIT_PROFILE_SUCCESS, CREATE_PENCILIT_PROFILE_FAILURE],
      endpoint: `/api/v1/profile`,
      options: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
        body: JSON.stringify(user)

      }
    }
  }
}


export const CLEAR_ADVANCED_FILTERS = 'CLEAR_ADVANCED_FILTERS'
export const clearAdvancedFilters = () => ({ type: CLEAR_ADVANCED_FILTERS })


export const SET_JOB_LABEL = 'SET_JOB_LABEL'
export const setJobLabel = (label) => ({
  type: SET_JOB_LABEL,
  payload: label
})

export const FETCH_PROSPECT_ACTIVITIES = 'FETCH_PROSPECT_ACTIVITIES'
export const FETCH_PROSPECT_ACTIVITIES_SUCCESS = 'FETCH_PROSPECT_ACTIVITIES_SUCCESS'
export const FETCH_PROSPECT_ACTIVITIES_FAILURE = 'FETCH_PROSPECT_ACTIVITIES_FAILURE'

// export const fetchProspectActivities = (jobProfileId,offset) => {
//   return {
//     [CALL_API]: {
//       types: [FETCH_PROSPECT_ACTIVITIES, FETCH_PROSPECT_ACTIVITIES_SUCCESS, FETCH_PROSPECT_ACTIVITIES_FAILURE],
//       endpoint: `/api/auth/tribes/prospect/activities?id=${jobProfileId}&offset=${offset}`,
//       options: {
//         method: 'GET'
//       }
//     }
//   }
// }

export const fetchProspectActivities = (jobProfileId, offset) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_PROSPECT_ACTIVITIES })
    const data = await manualApiCall(`/api/auth/tribes/prospect/activities?id=${jobProfileId}&offset=${offset}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    dispatch({ type: FETCH_PROSPECT_ACTIVITIES_SUCCESS, payload: { data, jobProfileId } })
  } catch (e) {
    dispatch({ type: FETCH_PROSPECT_ACTIVITIES_FAILURE })
  }
}

