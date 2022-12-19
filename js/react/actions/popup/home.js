// import { sendMessageToActiveTab } from '../../utils/index'
import { DEFAULT_DAILY_PROFILES_LIMIT } from '../../../config/constants.js'
import { manualApiCall } from '../../utils/index.js'
import { deleteJobMeta } from '../../../background/db/index.js'

export const FETCH_JOBS = 'FETCH_JOBS'
export const FETCH_JOBS_SUCCESS = 'FETCH_JOBS_SUCCESS'
export const FETCH_JOBS_FAILURE = 'FETCH_JOBS_FAILURE'

export const SET_CURRENT_JOB = 'SET_CURRENT_JOB'
export const SET_CURRENT_JOB_SUCCESS = 'SET_CURRENT_JOB_SUCCESS'
export const SET_CURRENT_JOB_FAILURE = 'SET_CURRENT_JOB_FAILURE'

export const GET_CURRENT_JOB = 'GET_CURRENT_JOB'
export const GET_CURRENT_JOB_SUCCESS = 'GET_CURRENT_JOB_SUCCESS'
export const GET_CURRENT_JOB_FAILURE = 'GET_CURRENT_JOB_FAILURE'

export const DELETE_JOB = 'DELETE_JOB'
export const DELETE_JOB_SUCCESS = 'DELETE_JOB_SUCCESS'
export const DELETE_JOB_FAILURE = 'DELETE_JOB_FAILURE'

export const CHECK_DAILY_LIMIT = 'CHECK_DAILY_LIMIT'

export const deleteJob = (jobId) => (dispatch) => {
  dispatch({ type: DELETE_JOB, payload: jobId })
  manualApiCall(`/api/auth/job/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jobID: jobId
    })
  })
    .then(() => {
      deleteJobMeta(jobId)
      chrome.storage.local.get('jobArray', function (response) {
        const jobArray = response['jobArray'].filter(item => item.jobID != jobId)
        chrome.storage.local.set({ 'jobArray': jobArray })

        dispatch({ type: DELETE_JOB_SUCCESS, payload: jobId })

        // dispatch(fetchJobs())
      })
    })
    .catch(err => {
      dispatch({ type: DELETE_JOB_FAILURE })
    })
}

export const checkDailyLimit = () => (dispatch) => {
  const d = new Date();
  const dateKey = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear() + "-profiles";

  chrome.storage.local.get([dateKey, 'DailyLimitSelected'], function (response) {
    const dailyLimit = response['DailyLimitSelected'] || DEFAULT_DAILY_PROFILES_LIMIT
    const consumed = response[dateKey] || 0

    dispatch({
      type: CHECK_DAILY_LIMIT,
      payload: {
        consumed: consumed,
        dailyLimit: dailyLimit,
        isReached: parseInt(consumed, 10) >= parseInt(dailyLimit, 10)
      }
    })

  })
  // dispatch({ type: CHEC })

}

export const setCurrentJob = (job) => (dispatch) => {

  dispatch({ type: SET_CURRENT_JOB, job: job })

  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const tab = tabs[0] || null
    chrome.storage.local.get('tabsMeta', function (result) {
      if (result.tabsMeta) {
        if (result.tabsMeta[tab.id]) {
          chrome.storage.local.set({
            'tabsMeta': {
              ...result.tabsMeta,
              [tab.id]: {
                ...result.tabsMeta[tab.id],
                currentJob: job
              }
            }
          }, function () {
            dispatch({ type: SET_CURRENT_JOB_SUCCESS, payload: job })
          })
        } else {
          chrome.storage.local.set({
            'tabsMeta': {
              ...result.tabsMeta,
              [tab.id]: {
                currentJob: job
              }
            }
          }, function () {
            dispatch({ type: SET_CURRENT_JOB_SUCCESS, payload: job })
          })
        }
      } else {
        chrome.storage.local.set({ 'tabsMeta': { [tab.id]: { currentJob: job } } }, function () {
          dispatch({
            type: SET_CURRENT_JOB_SUCCESS,
            payload: job
          })
        })
      }
    })
  })

}

export const getCurrentJob = () => (dispatch) => {
  dispatch({ type: GET_CURRENT_JOB })
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const tab = tabs[0] || null
    chrome.storage.local.get('tabsMeta', function (result) {
      if (result.tabsMeta[tab.id].currentJob) {
        dispatch({
          type: GET_CURRENT_JOB_SUCCESS,
          payload: result.tabsMeta[tab.id].currentJob
        })
      } else {
        dispatch({
          type: GET_CURRENT_JOB_FAILURE,
          payload: new Error('current job not found')
        })
      }
    })
  })
}

export const fetchJobs = () => async (dispatch) => {
  dispatch({ type: FETCH_JOBS })

  const jobs = await manualApiCall(`/api/auth/job/list`, {
    method: 'POST'
  })

  chrome.storage.local.set({
    jobArray: jobs.job
  }, function () {
    chrome.storage.local.get('jobArray', function (result) {
      if (result.jobArray) {
        dispatch({
          type: FETCH_JOBS_SUCCESS,
          payload: result.jobArray
        })
      } else {
        dispatch({ type: FETCH_JOBS_FAILURE })
      }
    })
  })
}