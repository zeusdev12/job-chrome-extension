// import * as ActionTypes from '../../actions/home'
import * as ActionTypes from '../actions/jobs'

const initialState = {
  isLoading: false,
  isDataAvailable: false,
  data: []
}

const jobs = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_MY_JOBS:
      return { ...state, isLoading: true }

    case ActionTypes.FETCH_MY_JOBS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isDataAvailable: (action.payload.jobsCount || action.payload.total_count) > 0,
        data: action.payload.jobs
      }

    case ActionTypes.FETCH_MY_JOBS_FAILURE:
      return initialState

      case ActionTypes.FETCH_TRIBE_JOBS:
        return { ...state, isLoading: true }
  
      case ActionTypes.FETCH_TRIBE_JOBS_SUCCESS:
        return {
          ...state,
          isLoading: false,
          isDataAvailable: action.payload.job.length > 0,
          data: action.payload.job
        }
  
      case ActionTypes.FETCH_TRIBE_JOBS_FAILURE:
        return initialState

        case ActionTypes.DELETE_MY_JOB_SUCCESS:
          return {
            ...state,
            isLoading: false,
            data:state.data.filter(item=>item.jobID!==action.payload)
          }
    // case ActionTypes.DELETE_JOB:
    //   console.log(action.payload)
    //   return { ...state }

    // case ActionTypes.DELETE_JOB_SUCCESS:
    //   console.log(action.payload)
    //   return { ...state, 
    //     data:state.data.filter((job)=>job.jobID!=action.payload) }
    // case ActionTypes.DELETE_JOB_FAILURE:
    //   console.log()
    //   return { ...state, isLoading: false }

    default:
      return state
  }
}

export default jobs