import * as ActionTypes from '../../actions/tribe'
import { omit } from 'lodash'
const initialState = {
    isLoading: false,
    list: [],
    totalCount:0,
    totalDataLeft: 0,
    currentPageNo:1,
    newNotifications:false,
    shouldFetchNotificaions:true
}

const notifications= (state = initialState, action) => {

    switch (action.type) {

        case ActionTypes.FETCH_NOTIFICATIONS:
            return { 
                ...state, 
                isLoading: true,
                isDataAvailable:false,
                totalDataLeft: 0
             }

        case ActionTypes.FETCH_NOTIFICATIONS_SUCCESS:
            
            if (action.payload.pageNo == 1) {
                state.totalDataLeft = 0
                state.list = []
                if(action.payload.notifications.length>0)
                {
                    const N=action.payload.notifications.filter(item => item.is_read ===false)
                    if(N.length>0)
                    state.newNotifications=true
                    else
                    state.newNotifications=false
                }
            }
            return { ...state, 
                isLoading: false ,
                list: (parseInt(action.payload.pageNo, 10) === 1) || (action.payload.notifications.length > 10) ?
                    action.payload.notifications :
                    [...state.list, ...action.payload.notifications],
                ...omit(action.payload, 'notifications'),
                totalCount: action.payload.totalCount,
                totalDataLeft: action.payload.totalCount - (state.list.length+action.payload.notifications.length),
                isDataAvailable: action.payload.notifications.length > 0,
                currentPageNo: action.payload.pageNo,
            }
            

        case ActionTypes.FETCH_NOTIFICATIONS_FAILURE:
            return initialState

            case ActionTypes.STOP_NOTIFICATIONS_FETCHING:
                return {...state, shouldFetchNotificaions:!state.shouldFetchNotificaions}
        default:
            return state
    }
}

export default notifications;