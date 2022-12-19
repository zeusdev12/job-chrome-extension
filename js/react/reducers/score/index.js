import { combineReducers } from 'redux'

import list from './list'
// import clear from './list'
import messageSettings from './messageSettings'
import meetingSettings from './meetingSettings'
import selected from './selected'
import archive from './archive'
import unarchive from './unarchive'
import save from './save'
import unsave from './unsave'
import downloaded from './downloaded'
import composeMessage from './composeMessage'
import requestMeeting from './requestMeeting'
import enhancing from './enhancing'
import allProspects from './allProspects'
import dailyLimit from './dailyLimit'
import advancedFilters from './advancedFilters'
import scoringFilters from './scoringFilters'
import advancedFilterData from './advancedFilterData'
import fetchPencilitAccountDetail from './pencilitAccountFetch'
import integratePencilitAccount from "./pencilitCreateProfile";
import { preEvaluationForm } from './preEvaluationForm'
import { notesMeta } from './notesMeta'



export default combineReducers({
  list,
  messageSettings,
  meetingSettings,
  selected,
  archive,
  unarchive,
  composeMessage,
  requestMeeting,
  save,
  unsave,
  downloaded,
  enhancing,
  allProspects,
  dailyLimit,
  advancedFilters,
  scoringFilters,
  advancedFilterData,
  fetchPencilitAccountDetail,
  integratePencilitAccount,
  preEvaluationForm,
  notesMeta
})
