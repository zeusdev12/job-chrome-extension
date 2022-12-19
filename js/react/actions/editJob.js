// import { CALL_API } from '../middlewares/apiMiddleware'
import { manualApiCall } from '../utils'
import { MESSAGE_TYPES } from '../../config/constants'
import { CALL_API } from '../middlewares/apiMiddleware'

export const FETCH_JOB = 'FETCH_JOB'
export const FETCH_JOB_SUCCESS = 'FETCH_JOB_SUCCESS'
export const FETCH_JOB_FAILURE = 'FETCH_JOB_FAILURE'

export const REQUEST_UPDATE_JOB = 'REQUEST_UPDATE_JOB'
export const REQUEST_UPDATE_JOB_SUCCESS = 'REQUEST_UPDATE_JOB_SUCCESS'
export const REQUEST_UPDATE_JOB_FAILURE = 'REQUEST_UPDATE_JOB_FAILURE'

export const FETCH_UPDATE_PROGRESS = 'FETCH_UPDATE_PROGRESS'
export const FETCH_UPDATE_PROGRESS_SUCCESS = 'FETCH_UPDATE_PROGRESS_SUCCESS'
export const FETCH_UPDATE_PROGRESS_FAILURE = 'FETCH_UPDATE_PROGRESS_FAILURE'

export const updateJob = (payload) => async (dispatch) => {

  try {

    dispatch({ type: REQUEST_UPDATE_JOB })
    const resp = await manualApiCall(`/api/auth/job/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    dispatch({
      type: REQUEST_UPDATE_JOB_SUCCESS,
      payload: resp
    })
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.DELETE_JOB_META,
      payload: parseInt(payload.jobID, 10)
    })

  } catch (e) {
    console.log('AN ERROR OCCURED: ', e.message)
    dispatch({ type: REQUEST_UPDATE_JOB_FAILURE })
  }
}

export const fetchJob = (jobId) => dispatch => {
  console.log('JOB ID TO FETCH: ', jobId)
  console.log('action types: ', { FETCH_JOB, FETCH_JOB_SUCCESS, FETCH_JOB_FAILURE })
  dispatch({ type: FETCH_JOB })
  chrome.storage.local.get('jobArray', ({ jobArray }) => {
    const job = jobArray.filter(item => item.jobID == jobId)
    if (_.isEmpty(job)) {
      dispatch({
        type: FETCH_JOB_FAILURE,
        payload: { message: 'Job Not Found' }
      })
    } else {
      dispatch({
        type: FETCH_JOB_SUCCESS,
        payload: job[0]
      })
    }
  })
}


export const fetchEditProgress = (jobId) => ({
  [CALL_API]: {
    types: [FETCH_UPDATE_PROGRESS, FETCH_UPDATE_PROGRESS_SUCCESS, FETCH_UPDATE_PROGRESS_FAILURE],
    endpoint: `/api/auth/job/updateProgress?jobId=${jobId}`,
    options: {
      method: 'GET'
    }
  }
})