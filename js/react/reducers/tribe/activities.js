import * as ActionTypes from '../../actions/tribe'
import { omit } from 'lodash'
const initialState = {
    isLoading: false,
    activityList: [],
    totalCount:0,
    totalDataLeft: 0,
    currentPageNo:1
}

const tribeActivity = (state = initialState, action) => {

    switch (action.type) {

        case ActionTypes.FETCH_TRIBE_ACTIVITY:
            return { 
                ...state, 
                isLoading: true,
                isDataAvailable:false,
                totalDataLeft: 0
             }

        case ActionTypes.FETCH_TRIBE_ACTIVITY_SUCCESS:
            
            if (action.payload.pageNo == 1) {
                state.totalDataLeft = 0
                state.activityList = []
            }
            return { ...state, 
                isLoading: false ,
                activityList: (parseInt(action.payload.pageNo, 10) === 1) || (action.payload.activity.length > 10) ?
                    action.payload.activity :
                    [...state.activityList, ...action.payload.activity],
                ...omit(action.payload, 'activity'),
                totalCount: action.payload.totalCount,
                totalDataLeft: action.payload.totalCount - (state.activityList.length+action.payload.activity.length),
                isDataAvailable: action.payload.activity.length > 0,
                currentPageNo: action.payload.pageNo,
            }

        case ActionTypes.FETCH_TRIBE_ACTIVITY_FAILURE:
            return initialState

        default:
            return state
    }
}

export default tribeActivity;