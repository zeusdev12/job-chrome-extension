
import { CALL_API } from '../middlewares/apiMiddleware'
import { manualApiCall } from '../utils/index'

export const FETCH_TEAM_MEMBERS_LIST = 'FETCH_TEAM_MEMBERS_LIST'
export const FETCH_TEAM_MEMBERS_LIST_SUCCESS = 'FETCH_TEAM_MEMBERS_LIST_SUCCESS'
export const FETCH_TEAM_MEMBERS_LIST_FAILURE = 'FETCH_TEAM_MEMBERS_LIST_FAILURE'

export const fetchTeamMembersList = () => ({
  [CALL_API]: {
    types: [FETCH_TEAM_MEMBERS_LIST, FETCH_TEAM_MEMBERS_LIST_SUCCESS, FETCH_TEAM_MEMBERS_LIST_FAILURE],
    endpoint: `/api/auth/tribes/team/list`,
    options: {
      method: 'GET'
    }
  }
})

export const ADD_USER_TO_TRIBE = 'ADD_USER_TO_TRIBE'
export const addUserToTribe = id => {
  return {
    type: ADD_USER_TO_TRIBE,
    payload: {
      userId: id,
      permissions: [2, 3]
    }
  }
}

export const TOGGLE_USER_ACTIVITY_PERMISSION = 'TOGGLE_USER_ACTIVITY_PERMISSION'
export const toggleActivityPermission = id => {
  return {
    type: TOGGLE_USER_ACTIVITY_PERMISSION,
    payload: {
      userId: id
    }
  }
}

export const TOGGLE_USER_REACHOUT_PERMISSION = 'TOGGLE_USER_REACHOUT_PERMISSION'
export const toggleReachoutPermission = id => {
  return {
    type: TOGGLE_USER_REACHOUT_PERMISSION,
    payload: {
      userId: id
    }
  }
}

export const REMOVE_TRIBE_MEMBER = 'REMOVE_TRIBE_MEMBER'
export const removeTribeMember = id => {
  return {
    type: REMOVE_TRIBE_MEMBER,
    payload: {
      userId: id
    }
  }
}

export const SKIP_ASSIGN_TRIBE_STEP = 'SKIP_ASSIGN_TRIBE_STEP'
export const skipAssignTribe = () => {
  return {
    type: SKIP_ASSIGN_TRIBE_STEP
  }
}

export const FETCH_TRIBE_MEMBERS = 'FETCH_TRIBE_MEMBERS'
export const FETCH_TRIBE_MEMBERS_SUCCESS = 'FETCH_TRIBE_MEMBERS_SUCCESS'
export const FETCH_TRIBE_MEMBERS_FAILURE = 'FETCH_TRIBE_MEMBERS_FAILURE'
export const fetchTribeMembers = (tribeId, userId = null) => ({
  [CALL_API]: {
    types: [FETCH_TRIBE_MEMBERS, FETCH_TRIBE_MEMBERS_SUCCESS, FETCH_TRIBE_MEMBERS_FAILURE],
    endpoint: `/api/auth/tribes/jobs/members/list?tribeId=${tribeId}${userId ? '&userId=' + userId : ``}`,
    options: {
      method: 'GET'
    }
  }
})

export const CLEAR_TRIBE_STATE = 'CLEAR_TRIBE_STATE'
export const clearTribeState = () => {
  return {
    type: CLEAR_TRIBE_STATE
  }
}

export const CLEAR_STATE_ACTIVITY = 'CLEAR_STATE_ACTIVITY'
export const clearStateActivity = () => {
  return {
    type: CLEAR_STATE_ACTIVITY
  }
}



export const ADD_TRIBE = 'ADD_TRIBE'
export const ADD_TRIBE_SUCCESS = 'ADD_TRIBE_SUCCESS'
export const ADD_TRIBE_FAILURE = 'ADD_TRIBE_FAILURE'
export const addTribeToJob = (tribeData, jobId) => ({
  [CALL_API]: {
    types: [ADD_TRIBE, ADD_TRIBE_SUCCESS, ADD_TRIBE_FAILURE],
    endpoint: `/api/auth/tribes/jobs/add/tribe`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        tribeData,
        jobId
      })
    }
  }
})

export const FETCH_TRIBE_ACTIVITY = 'FETCH_TRIBE_ACTIVITY'
export const FETCH_TRIBE_ACTIVITY_SUCCESS = 'FETCH_TRIBE_ACTIVITY_SUCCESS'
export const FETCH_TRIBE_ACTIVITY_FAILURE = 'FETCH_TRIBE_ACTIVITY_FAILURE'
export const fetchTribeActivity = (jobId, pageNo=1,userId = null) => ({
  [CALL_API]: {
    types: [FETCH_TRIBE_ACTIVITY, FETCH_TRIBE_ACTIVITY_SUCCESS, FETCH_TRIBE_ACTIVITY_FAILURE],
    endpoint: `/api/auth/tribes/activity?jobId=${jobId}&pageNo=${pageNo}${userId ? '&userId=' + userId : ``}`,
    options: {
      method: 'GET'
    }
  }
})

export const FETCH_TRIBE_MEMBERS_LIST = 'FETCH_TRIBE_MEMBERS_LIST'
export const FETCH_TRIBE_MEMBERS_LIST_SUCCESS = 'FETCH_TRIBE_MEMBERS_LIST_SUCCESS'
export const FETCH_TRIBE_MEMBERS_LIST_FAILURE = 'FETCH_TRIBE_MEMBERS_LIST_FAILURE'

export const fetchTribeMembersList = tribeId => ({
  [CALL_API]: {
    types: [FETCH_TRIBE_MEMBERS_LIST, FETCH_TRIBE_MEMBERS_LIST_SUCCESS, FETCH_TRIBE_MEMBERS_LIST_FAILURE],
    endpoint: `/api/auth/tribes/job/tribe/members?tribeId=${tribeId}`,
    options: {
      method: 'GET'
    }
  }
})


export const EDIT_TRIBE = 'EDIT_TRIBE'
export const EDIT_TRIBE_SUCCESS = 'EDIT_TRIBE_SUCCESS'
export const EDIT_TRIBE_FAILURE = 'EDIT_TRIBE_FAILURE'
export const editTribe = (tribeData, tribeId,jobId) => ({
  [CALL_API]: {
    types: [EDIT_TRIBE, EDIT_TRIBE_SUCCESS, EDIT_TRIBE_FAILURE],
    endpoint: `/api/auth/tribes/edit`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        tribeData,
        tribeId,
        jobId
      })
    }
  }
})


export const FETCH_TRIBE_MEMBER_ACTIVITY = 'FETCH_TRIBE_MEMBER_ACTIVITY'
export const FETCH_TRIBE_MEMBER_ACTIVITY_SUCCESS = 'FETCH_TRIBE_MEMBER_ACTIVITY_SUCCESS'
export const FETCH_TRIBE_MEMBER_ACTIVITY_FAILURE = 'FETCH_TRIBE_MEMBER_ACTIVITY_FAILURE'
export const fetchTribeMemberActivity = (jobId, pageNo=1,userId) => ({
  [CALL_API]: {
    types: [FETCH_TRIBE_MEMBER_ACTIVITY, FETCH_TRIBE_MEMBER_ACTIVITY_SUCCESS, FETCH_TRIBE_MEMBER_ACTIVITY_FAILURE],
    endpoint: `/api/auth/tribes/member/activity?jobId=${jobId}&pageNo=${pageNo}&userId=${userId}`,
    options: {
      method: 'GET'
    }
  }
})


export const FETCH_NOTIFICATIONS = ' FETCH_NOTIFICATIONS'
export const FETCH_NOTIFICATIONS_SUCCESS = ' FETCH_NOTIFICATIONS_SUCCESS'
export const FETCH_NOTIFICATIONS_FAILURE = ' FETCH_NOTIFICATIONS_FAILURE'
export const fetchNotifications = (pageNo=1) => ({
  [CALL_API]: {
    types: [FETCH_NOTIFICATIONS, FETCH_NOTIFICATIONS_SUCCESS, FETCH_NOTIFICATIONS_FAILURE],
    endpoint: `/api/auth/tribes/notifications?pageNo=${pageNo}`,
    options: {
      method: 'GET'
    }
  }
})

export const FETCH_JOB_DETAILS = 'FETCH_JOB_DETAILS'
export const FETCH_JOB_DETAILS_SUCCESS = 'FETCH_JOB_DETAILS_SUCCESS'
export const FETCH_JOB_DETAILS_FAILURE = 'FETCH_JOB_DETAILS_FAILURE'
export const fetchJobDetails = (jobId) => ({
  [CALL_API]: {
    types: [FETCH_JOB_DETAILS, FETCH_JOB_DETAILS_SUCCESS, FETCH_JOB_DETAILS_FAILURE],
    endpoint: `/api/auth/tribes/job/details?jId=${jobId}`,
    options: {
      method: 'GET'
    }
  }
})
export const SET_JOB_LABEL = 'SET_JOB_LABEL'
export const setJobLabel = (label) => ({
  type: SET_JOB_LABEL,
  payload: label
})

export const FETCH_NOTIFICATIONS_DETAILS = 'FETCH_NOTIFICATIONS_DETAILS'
export const FETCH_NOTIFICATIONS_DETAILS_SUCCESS = 'FETCH_NOTIFICATIONS_DETAILS_SUCCESS'
export const FETCH_NOTIFICATIONS_DETAILS_FAILURE = 'FETCH_NOTIFICATIONS_DETAILS_FAILURE'
export const fetchNotificationDetails = (pageNo=1) => ({
  [CALL_API]: {
    types: [FETCH_NOTIFICATIONS_DETAILS, FETCH_NOTIFICATIONS_DETAILS, FETCH_NOTIFICATIONS_DETAILS],
    endpoint: `/api/auth/tribes/notifications?pageNo=${pageNo}`,
    options: {
      method: 'GET'
    }
  }
})
export const STOP_NOTIFICATIONS_FETCHING = 'STOP_NOTIFICATIONS_FETCHING'

export const stopFetchingNotifications = () => ({
  type: STOP_NOTIFICATIONS_FETCHING
})