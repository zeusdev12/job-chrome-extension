import { CALL_API } from '../middlewares/apiMiddleware'
import {  manualApiCall } from '../utils/index'

export const FETCH_MY_JOBS = 'FETCH_MY_JOBS'
export const FETCH_MY_JOBS_SUCCESS = 'FETCH_MY_JOBS_SUCCESS'
export const FETCH_MY_JOBS_FAILURE = 'FETCH_MY_JOBS_FAILURE'

export const fetchMyJobs = () => (
  {
  
    [CALL_API]: {
      types: [FETCH_MY_JOBS, FETCH_MY_JOBS_SUCCESS, FETCH_MY_JOBS_FAILURE],
      // endpoint: `/api/auth/tribes/myJobs/list${searchTerm? '?searchTerm='+searchTerm:``}`,
      endpoint: '/employer_home.json?page=1&show_my_jobs=true',
      options: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    }
  })

export const fetchMyJobsWithKeyword = (searchTerm=null) => (
    {
    
      [CALL_API]: {
        types: [FETCH_MY_JOBS, FETCH_MY_JOBS_SUCCESS, FETCH_MY_JOBS_FAILURE],
        endpoint: '/job_searches/search?page=1&show_my_jobs=true',
        options: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ job_search: { keyword: searchTerm } })
        }
      }
    })

export const FETCH_TRIBE_JOBS = 'FETCH_TRIBE_JOBS'
export const FETCH_TRIBE_JOBS_SUCCESS = 'FETCH_TRIBE_JOBS_SUCCESS'
export const FETCH_TRIBE_JOBS_FAILURE = 'FETCH_TRIBE_JOBS_FAILURE'

  export const fetchTribeJobs = (searchTerm=null) => ({
    [CALL_API]: {
      types: [FETCH_TRIBE_JOBS, FETCH_TRIBE_JOBS_SUCCESS, FETCH_TRIBE_JOBS_FAILURE],
      endpoint: `/api/auth/tribes/jobs/list${searchTerm? '?searchTerm='+searchTerm:``}`,
      options: {
        method: 'GET'
      }
    }
  })

export const DELETE_MY_JOB = 'DELETE_MY_JOB'
export const DELETE_MY_JOB_SUCCESS = 'DELETE_MY_JOB_SUCCESS'
export const DELETE_MY_JOB_FAILURE = 'DELETE_MY_JOB_FAILURE'

  export const deleteJob = (jobId) => (dispatch) => {
    dispatch({ type: DELETE_MY_JOB, payload: jobId })
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
          dispatch({ type: DELETE_MY_JOB_SUCCESS, payload:jobId })
      })
      .catch(err => {
        dispatch({ type: DELETE_JOB_FAILURE })
      })
  }