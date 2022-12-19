import { combineReducers } from 'redux'
import selected from './selected'
import tribeMembers from './tribeMembers'
import activities from './activities'
import tribeMemberActivities from './tribeMemberActivities'
import notifications from './notifications'
import jobDetails from './jobDetails'
export default combineReducers({
  selected,
  tribeMembers,
  activities,
  tribeMemberActivities,
  notifications,
  jobDetails
})
