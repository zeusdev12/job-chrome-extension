import * as ActionTypes from '../../actions/calendar'
import moment from 'moment'

const initialState = {
    isLoading: false,
    isDataAvailable: false,
    isUpdating: false,
    isUpdated: false,
    events: [],
    fetchedJobs: [],
    availabilityDays: [],
    availabilityDate: [],
    availabilityMonth: [],
    settings: {}
}

const calendar = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.FETCH_EVENTS:
            return { ...state, isLoading: true, isDataAvailable: false }

        case ActionTypes.FETCH_EVENTS_SUCCESS:
            action.payload.data.events.map(event => {
                event.startMeeting = moment.tz(event.startMeeting, event.ownerTimeZone).format('YYYY-MM-DD HH:mmZZ');
                event.endMeeting = moment.tz(event.endMeeting, event.ownerTimeZone).format('YYYY-MM-DD HH:mmZZ');
                event["start"] = event.startMeeting;
                event["end"] = event.endMeeting;
            });
            return { ...state, isLoading: false, isDataAvailable: true, events: action.payload.data.events, fetchedJobs: action.payload.data.fetchedJobs }

        case ActionTypes.FETCH_EVENTS_FAILURE:
            return { ...initialState }

        case ActionTypes.REQUEST_UPDATE_EVENT:
            return { ...state, isUpdating: true }

        case ActionTypes.REQUEST_UPDATE_EVENT_SUCCESS:
            return { ...state, isUpdating: false, isUpdated: true }

        case ActionTypes.REQUEST_UPDATE_EVENT_FAILURE:
            return { ...state, isUpdating: false, isUpdated: false }


        case ActionTypes.FETCH_SETTINGS:
            return { ...state, isLoading: true }

        case ActionTypes.FETCH_SETTINGS_SUCCESS:
            return { ...state, isLoading: false, settings: action.payload }

        case ActionTypes.FETCH_SETTINGS_FAILURE:
            return { ...initialState }


        case ActionTypes.EDIT_CALENDAR_SETTINGS:
            return { ...state, isUpdating: true }

        case ActionTypes.EDIT_CALENDAR_SETTINGS_SUCCESS:
            return { ...state, isUpdating: false, isUpdated: true }

        case ActionTypes.EDIT_CALENDAR_SETTINGS_FAILURE:
            return { ...state, isUpdating: false, isUpdated: false }

        case ActionTypes.FETCH_SETTINGS:
            return { ...state }


        case ActionTypes.FETCH_AVAILABILITY_DATE:
            return state

        case ActionTypes.FETCH_AVAILABILITY_DATE_SUCCESS:
            return { ...state, availabilityMonth: action.payload.slots }

        case ActionTypes.FETCH_AVAILABILITY_DATE_FAILURE:
            return initialState


        case ActionTypes.FETCH_AVAILABILITY_MONTH:
            return state

        case ActionTypes.FETCH_AVAILABILITY_MONTH_SUCCESS:
            return { ...state, availabilityDate: action.payload.fetchedResults }

        case ActionTypes.FETCH_AVAILABILITY_MONTH_FAILURE:
            return initialState


        case ActionTypes.FETCH_AVAILABILITY_DAYS:
            return state

        case ActionTypes.FETCH_AVAILABILITY_DAYS_SUCCESS:
            return { ...state, availabilityDays: action.payload.days }

        case ActionTypes.FETCH_AVAILABILITY_DAYS_FAILURE:
            return initialState


        default:
            return state
    }
}

export default calendar
