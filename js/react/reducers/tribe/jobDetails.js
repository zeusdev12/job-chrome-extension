import * as ActionTypes from '../../actions/tribe'
import { omit } from 'lodash'
const initialState = {
    isLoading: false
}

const jobDetails = (state = initialState, action) => {

    switch (action.type) {

        case ActionTypes.FETCH_JOB_DETAILS:
            return {
                ...state,
                isLoading:true
            }

        case ActionTypes.FETCH_JOB_DETAILS_SUCCESS:
          
            return {
                ...state,
                isLoading:false,
                data: action.payload.jobData[0],
                permissions: action.payload.permissions
            }

        case ActionTypes.FETCH_JOB_DETAILS_FAILURE:
            return initialState

        case ActionTypes.SET_JOB_LABEL:
            return {
                ...state,
                data: {
                    ...state.data,
                         meta: {
                            ...state.data.meta,
                            label: action.payload
                        }
                }
            }
        default:
            return state
    }
}

export default jobDetails;