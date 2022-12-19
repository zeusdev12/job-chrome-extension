import { combineReducers } from 'redux'

import * as ActionTypes from '../../actions/jobDescription'
import { choose } from './choose'
import { revise } from './revise'
import { jobLocation } from './jobLocation'
import { benchmarkProspects } from './benchmarkProspects'



const step = (state = 1, action) => {
  switch (action.type) {
    case ActionTypes.SET_STEP:
      return action.payload
    default:
      return state
  }
}

const initialStateContinueSearchPage = { isLoading: false, isDataAvailable: false }
const continueSearchPage = (state = initialStateContinueSearchPage, action) => {
  switch (action.type) {

    default:
      return state
  }
}

export default combineReducers({
  choose,
  revise,
  step,
  jobLocation,
  continueSearchPage,
  benchmarkProspects
})