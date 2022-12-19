import { combineReducers } from 'redux'
import * as ActionTypes from '../../../actions/popup/home'
import jobs from './jobs'
import step from './step'
import currentJob from './currentJob'
import searchTerms from './searchTerms'

const dailyLimit = (state = {
  consumed: 0,
  dailyLimit: 500,
  isReached: false
}, action) => {
  switch (action.type) {
    case ActionTypes.CHECK_DAILY_LIMIT:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
  jobs,
  step,
  currentJob,
  searchTerms,
  dailyLimit
})