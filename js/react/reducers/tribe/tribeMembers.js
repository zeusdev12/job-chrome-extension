import * as ActionTypes from '../../actions/tribe'

const initialState = {
    isLoading: false,
    list: []
}

const tribeMembers = (state = initialState, action) => {

    switch (action.type) {

        case ActionTypes.FETCH_TRIBE_MEMBERS:
            return { ...state, isLoading: true }

        case ActionTypes.FETCH_TRIBE_MEMBERS_SUCCESS:
            console.log(action.payload)
            return { ...state, list: action.payload.members, isLoading: false }

        case ActionTypes.FETCH_TRIBE_MEMBERS_FAILURE:
            return action.payload


        default:
            return state
    }
}

export default tribeMembers