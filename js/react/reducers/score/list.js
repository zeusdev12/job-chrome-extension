import { omit } from 'lodash'
import moment from 'moment'
import { ACTIVITY_TYPES } from '../../../config/constants'
import * as ActionTypes from '../../actions/score'

const initialState = {
  isLoading: false,
  isDataAvailable: false,
  permissions: [],
  data: { prospectsArray: [] },
  isLoadingMore: false,
  isBlocked: false,
  shouldFetchAgain: false,
  loadingActivities: false,
  activeTab: 'Home'
}

const list = (state = initialState, action) => {
  const isLoadingMore = (action.meta && action.meta.pageNo) > 1 ? true : false
  switch (action.type) {
    case ActionTypes.FETCH_PROSPECTS:
      return {
        ...state,
        isLoading: !isLoadingMore,
        isLoadingMore: isLoadingMore
      }

    case ActionTypes.FETCH_PROSPECTS_SUCCESS: {

      // console.log('ACTION.PAYLOAD: ', action.payload)
      const isBlocked = action.payload.isBlocked || false
      console.log('isBlocked, ', isBlocked)
      return {
        ...state,
        isLoading: false,
        isLoadingMore: false,
        isBlocked: isBlocked,
        shouldFetchAgain: false,
        permissions: action.payload.permissions,
        data: isBlocked ? { ...initialState.data } : {
          prospectsArray: (parseInt(action.payload.pageNo, 10) === 1) || (action.payload.prospectsArray.length > 100) ?
            action.payload.prospectsArray :
            [...state.data.prospectsArray, ...action.payload.prospectsArray],
          ...omit(action.payload, 'prospectsArray')
        },
        isDataAvailable: isBlocked ? false : state.data.prospectsArray.length > 0 ? true : action.payload.prospectsArray.length > 0
      }
    }

    case ActionTypes.FETCH_PROSPECTS_FAILURE:
      return initialState

    case ActionTypes.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload
      }

    case ActionTypes.SAVE_PROSPECTS_SUCCESS:
    case ActionTypes.UNSAVE_PROSPECTS_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          prospectsArray: action.payload.saveFilterFlag ?
            state.data.prospectsArray.filter(item => !action.payload.ids.includes(item.jobProfileId)) :
            state.data.prospectsArray.map(item => {
              if (action.payload.ids.includes(item.jobProfileId))
                return ({
                  ...item,
                  saved: action.payload.action,
                  activityCount: parseInt(item.activityCount, 10) + 1,
                  recent_actvities: Array.isArray(item?.recent_actvities) && item?.recent_actvities.length > 0 ? [
                    ...item.recent_actvities,
                    {
                      activityText: action.payload.action ? 'Saved' : 'Unsaved',
                      name: action.payload.userName || '',
                      activityAt: moment.now(),
                      jobProfileId: item.jobProfileId
                    }
                  ] :
                    [{
                      activityText: action.payload.action ? 'Saved' : 'Unsaved',
                      name: action.payload.userName || '',
                      activityAt: moment.now(),
                      jobProfileId: item.jobProfileId
                    }
                    ]
                })
              return ({
                ...item
              })
            })
        }
      }
    }


    case ActionTypes.ARCHIVE_PROSPECTS_SUCCESS:
    case ActionTypes.UNARCHIVE_PROSPECTS_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          counts: { ...action.payload.counts, currentCount: ["Added1st", "Home"].includes(action.payload.activeTab) ? state.data.counts.currentCount - action.payload.ids.length : state.data.counts.currentCount },
          prospectsArray: ["Added1st", "Home"].includes(action.payload.activeTab) ? state.data.prospectsArray.filter(item => !action.payload.ids.includes(item.jobProfileId)) : state.data.prospectsArray,
          totalAddedProspects: state.data.totalAddedProspects - action.payload.length,
          totalProspectsArchived: state.data.totalProspectsArchived + action.payload.length
        },
        shouldFetchAgain: action.shouldFetchAgain
      }
    }

    case ActionTypes.SETDOWNLOADED_PROSPECTS_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          counts: { ...state.data.counts, ...action.payload.counts },
          prospectsArray: state.data.prospectsArray.map(item => (action.payload.ids.includes(item.jobProfileId) ? {
            ...item,
            isDownloaded: true,
            activityCount: parseInt(item.activityCount, 10) + 1,
            recent_actvities: Array.isArray(item?.recent_actvities) && item?.recent_actvities.length > 0 ? [
              ...item.recent_actvities,
              {
                activityText: 'Downloaded',
                name: action.payload.userName || '',
                activityAt: moment.now(),
                jobProfileId: item.jobProfileId
              }
            ] :
              [{
                activityText: 'Downloaded',
                name: action.payload.userName || '',
                activityAt: moment.now(),
                jobProfileId: item.jobProfileId
              }
              ]
            // recent_actvities: [
            //   ...item.recent_actvities, 
            //   { activityText: 'Downloaded', 
            //   name: item.recent_actvities[0].name, 
            //   activityAt: moment.now() 
            // }]
          } : { ...item })),
          totalAddedProspects: state.data.totalAddedProspects - action.payload.length,
          totalProspectsArchived: state.data.totalProspectsArchived + action.payload.length
        },
        shouldFetchAgain: action.shouldFetchAgain
      }
    }


    case ActionTypes.ADD_NOTE_SUCCESS: {
      console.log(action.payload)
      return {
        ...state,
        data: {
          ...state.data,
          prospectsArray: state.data.prospectsArray.map(item => item.jobProfileId === action.payload.jobProfileId ?
            {
              ...item,
              recent_note: [omit(action.payload, 'jobProfileId')],
              noteCount: parseInt(item.noteCount, 10) + 1,
              activityCount: parseInt(item.activityCount, 10) + 1,
              recent_actvities: [
                ...item.recent_actvities,
                {
                  activityText: 'Added a note',
                  name: item.recent_actvities[0].name,
                  activityAt: moment.now(),
                  jobProfileId: item.jobProfileId
                }
              ]
            } : item)
        }
      }
    }


    case ActionTypes.SET_RECENT_NOTE: {
      return {
        ...state,
        data: {
          ...state.data,
          prospectsArray: state.data.prospectsArray.map(item => item.jobProfileId === action.payload.jobProfileId ?
            { ...item, recent_note: action.payload.note } : item)
        }
      }
    }


    case ActionTypes.DECREMENT_NOTE_COUNT: {
      return {
        ...state,
        data: {
          ...state.data,
          prospectsArray: state.data.prospectsArray.map(item => item.jobProfileId === action.payload ?
            {
              ...item,
              noteCount: parseInt(item.noteCount, 10) - 1,
              activityCount: parseInt(item.activityCount, 10) + 1,
              recent_actvities: [...item.recent_actvities,
              {
                activityText: 'Deleted a note',
                name: item.recent_actvities[0].name,
                activityAt: moment.now(),
                jobProfileId: item.jobProfileId
              }]
            } : item)
        }
      }
    }

    case ActionTypes.FETCH_PROSPECT_ACTIVITIES: {
      return {
        ...state,
        loadingActivities: true
      }
    }
    case ActionTypes.FETCH_PROSPECT_ACTIVITIES_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          counts: { ...state.data.counts, ...action.payload.counts },
          prospectsArray: state.data.prospectsArray.map(item => {
            return (action.payload.jobProfileId === item.jobProfileId) ? {
              ...item,
              activityCount: parseInt(item.activityCount, 10) + 1,
              recent_actvities: Array.isArray(item?.recent_actvities) ? [
                ...item.recent_actvities,
                ...action.payload.data.activity
              ] :
                [
                  ...action.payload.data.activity
                ]
            } : { ...item }
          })
        },
        loadingActivities: false
      }
    }

    // case ActionTypes.SET_JOB_LABEL:
    //   return {
    //     ...state,
    //     data: {
    //       ...state.data,
    //       jobData: {
    //         ...state.data.jobData,
    //         meta: {
    //           ...state.data.jobData.meta,
    //           label: action.payload
    //         }
    //       }
    //     }
    //   }

    default:
      return state
  }
}

export default list