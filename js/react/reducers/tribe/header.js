import * as ActionTypes from '../../actions/tribe'
import { omit } from 'lodash'
const initialState = {
    isLoading: false,
    list: [],
    totalCount:0,
    totalDataLeft: 0,
    currentPageNo:1
}

const header= (state = initialState, action) => {

    switch (action.type) {
        case ActionTypes.FETCH_NOTIFICATION_DETAILS:
            return { 
                ...state, 
                isLoading: true,
                isDataAvailable:false,
                totalDataLeft: 0
             }

        case ActionTypes.FETCH_NOTIFICATION_DETAILS_SUCCESS:
            console.log(action.payload.notifications)
            if (action.payload.pageNo == 1) {
                state.totalDataLeft = 0
                state.list = []
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

        case ActionTypes.FETCH_NOTIFICATIONS_DETAILS_FAILURE:
            return initialState

        default:
            return state
    }
}

export default header;