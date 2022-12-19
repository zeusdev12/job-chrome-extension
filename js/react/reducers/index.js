import { combineReducers } from 'redux'
// import {} from '../../'
// import * as ActionTypes from '../actions'

import jobDescription from './jobDescription'
import editJob from './editJob'
import popup from './popup'
import auth from './auth'
import score from './score'
import calendar from './calendar'
import editProgress from './editProgress'
import tribe from './tribe'
import jobs from './jobs'
import tabs from './tabs'
// const user = (state = { isLoading: false, isDataAvailable: false, data: null }, action) => {
//   switch (action.type) {
//     case ActionTypes.REQUEST_SET_USER:
//       return { ...state, isLoading: true }

//     case ActionTypes.REQUEST_SET_USER_FAILURE:
//       return { ...state, isLoading: false, isDataAvailable: false }

//     case ActionTypes.REQUEST_SET_USER_SUCCESS:
//       return { ...state, isLoading: false, isDataAvailable: true, data: action.payload }
//     default:
//       return state
//   }
// }

export default combineReducers({
  jobDescription,
  auth,
  editJob,
  popup,
  // user,
  editJob,
  score,
  calendar,
  editProgress,
  tribe,
  jobs,
  tabs
})