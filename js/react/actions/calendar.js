import { CALL_API, CALL_PENCILIT_API } from '../middlewares/apiMiddleware'
import { manualApiCall } from '../utils/index'
export const REQUEST_UPDATE_EVENT = 'REQUEST_UPDATE_EVENT'
export const REQUEST_UPDATE_EVENT_SUCCESS = 'REQUEST_UPDATE_EVENT_SUCCESS'
export const REQUEST_UPDATE_EVENT_FAILURE = 'REQUEST_UPDATE_EVENT_FAILURE'

export const updateEvent = (payload) => {
    return {
        [CALL_PENCILIT_API]: {
            types: [REQUEST_UPDATE_EVENT, REQUEST_UPDATE_EVENT_SUCCESS, REQUEST_UPDATE_EVENT_FAILURE],
            endpoint: `/api/v1/meeting/reschedule`,
            options: {
                method: 'PATCH',
                headers: { 'Content-Type':'application/json','Accept':'application/json' },
                body: JSON.stringify(payload)
            }
        }
    }
}

export const FETCH_EVENTS = 'FETCH_EVENTS'
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS'
export const FETCH_EVENTS_FAILURE = 'FETCH_EVENTS_FAILURE'

export const fetchEvents = ({ startDate, endDate }) => {

    return {
        [CALL_API]: {
            types: [FETCH_EVENTS, FETCH_EVENTS_SUCCESS, FETCH_EVENTS_FAILURE],
            endpoint: `/api/auth/meeting/fetch/by/range`,
            options: {
                method: 'POST',
                headers: { 'Content-Type':'application/json','Accept':'application/json' },
                body: JSON.stringify({
                    startDate: startDate,
                    endDate: endDate,
                })
            }
        }
    }
}

export const fetchEventsWithJobs = ({ startDate, endDate, fetchedJobs }) => {

    return {
        [CALL_API]: {
            types: [FETCH_EVENTS, FETCH_EVENTS_SUCCESS, FETCH_EVENTS_FAILURE],
            endpoint: `/api/auth/meeting/fetch/by/range`,
            options: {
                method: 'POST',
                headers: { 'Content-Type':'application/json','Accept':'application/json' },
                body: JSON.stringify({
                    startDate: startDate,
                    endDate: endDate,
                    fetchedJobs: fetchedJobs
                })
            }
        }
    }
}

export const FETCH_AVAILABILITY_DATE = 'FETCH_AVAILABILITY_DATE'
export const FETCH_AVAILABILITY_DATE_SUCCESS = 'FETCH_AVAILABILITY_DATE_SUCCESS'
export const FETCH_AVAILABILITY_DATE_FAILURE = 'FETCH_AVAILABILITY_DATE_FAILURE'

export const fetchAvailabilityDates = ({ date, slot, timeZone, ownerSlug }) => {

    return {
        [CALL_PENCILIT_API]: {
            types: [FETCH_AVAILABILITY_DATE, FETCH_AVAILABILITY_DATE_SUCCESS, FETCH_AVAILABILITY_DATE_FAILURE],
            endpoint: `/api/v1/${ownerSlug}/availability?date=${date}&slot=${slot}&time_zone=${timeZone}`,
            options: {
                method: 'GET',
                headers: { 'Content-Type':'application/json','Accept':'application/json' }
            }
        }
    }
}

export const FETCH_AVAILABILITY_MONTH = 'FETCH_AVAILABILITY_MONTH'
export const FETCH_AVAILABILITY_MONTH_SUCCESS = 'FETCH_AVAILABILITY_MONTH_SUCCESS'
export const FETCH_AVAILABILITY_MONTH_FAILURE = 'FETCH_AVAILABILITY_MONTH_FAILURE'

export const fetchAvailabilityMonths = ({ month, year, span, ownerSlug }) => {

    return {
        [CALL_PENCILIT_API]: {
            types: [FETCH_AVAILABILITY_MONTH, FETCH_AVAILABILITY_MONTH_SUCCESS, FETCH_AVAILABILITY_MONTH_FAILURE],
            endpoint: `/api/v1/${ownerSlug}/month/status?month=${month}&year=${year}&span=${span}&extraMonths=3`,
            options: {
                method: 'GET'
            }
        }
    }
}

export const FETCH_AVAILABILITY_DAYS = 'FETCH_AVAILABILITY_DAYS'
export const FETCH_AVAILABILITY_DAYS_SUCCESS = 'FETCH_AVAILABILITY_DAYS_SUCCESS'
export const FETCH_AVAILABILITY_DAYS_FAILURE = 'FETCH_AVAILABILITY_DAYS_FAILURE'

export const fetchAvailabilityDays = ({ ownerSlug }) => {

    return {
        [CALL_PENCILIT_API]: {
            types: [FETCH_AVAILABILITY_DAYS, FETCH_AVAILABILITY_DAYS_SUCCESS, FETCH_AVAILABILITY_DAYS_FAILURE],
            endpoint: `/api/v1/${ownerSlug}/owner`,
            options: {
                method: 'GET'
            }
        }
    }
}

export const EDIT_CALENDAR_SETTINGS = 'EDIT_CALENDAR_SETTINGS'
export const EDIT_CALENDAR_SETTINGS_SUCCESS = 'EDIT_CALENDAR_SETTINGS_SUCCESS'
export const EDIT_CALENDAR_SETTINGS_FAILURE = 'EDIT_CALENDAR_SETTINGS_FAILURE'

export const editSettings = (payload) => {

    return {
        [CALL_PENCILIT_API]: {
            types: [EDIT_CALENDAR_SETTINGS, EDIT_CALENDAR_SETTINGS_SUCCESS, EDIT_CALENDAR_SETTINGS_FAILURE],
            endpoint: `/api/v1/calendar/setting`,
            options: {
                method: 'POST',
                headers: { 'Content-Type':'application/json','Accept':'application/json' },
                body: JSON.stringify(payload)
            }
        }
    }
}

export const FETCH_SETTINGS = 'FETCH_SETTINGS'
export const FETCH_SETTINGS_SUCCESS = 'FETCH_SETTINGS_SUCCESS'
export const FETCH_SETTINGS_FAILURE = 'FETCH_SETTINGS_FAILURE'

export const fetchSettings = ({ month, year, span, email, monthTill }) => {

    return {
        [CALL_PENCILIT_API]: {
            types: [FETCH_SETTINGS, FETCH_SETTINGS_SUCCESS, FETCH_SETTINGS_FAILURE],
            endpoint: `/api/v1/calendar/setting/15/edit?month=${month}&year=${year}&type=${span}&dnnaeEmail=${email}&monthTill=${monthTill}`,
            options: {
                method: 'GET',
                headers: { 'Content-Type':'application/json','Accept':'application/json' }
            }
        }
    }
}

export const SAVE_NOTES = 'SAVE_NOTES'
export const SAVE_NOTES_SUCCESS = 'SAVE_NOTES_SUCCESS'
export const SAVE_NOTES_FAILURE = 'SAVE_NOTES_FAILURE'
export const saveNotes = ({meetingId, savedNotes}) => {

    return {
        [CALL_API]: {
            types: [SAVE_NOTES, SAVE_NOTES_SUCCESS, SAVE_NOTES_FAILURE],
            endpoint: `/api/auth/meeting/notes/save`,
            options: {
                method: 'POST',
                headers: { 'Content-Type':'application/json','Accept':'application/json' },
                body: JSON.stringify({
                    meetingId: meetingId,
                    savedNotes: savedNotes
                })
            }
        }
    }
}

export const DELETE_NOTES = 'DELETE_NOTES'
export const DELETE_NOTES_SUCCESS = 'DELETE_NOTES_SUCCESS'
export const DELETE_NOTES_FAILURE = 'DELETE_NOTES_FAILURE'
export const deleteNotes = ({id}) => {

    return {
        [CALL_API]: {
            types: [DELETE_NOTES, DELETE_NOTES_SUCCESS, DELETE_NOTES_FAILURE],
            endpoint: `/api/auth/meeting/notes/destroy`,
            options: {
                method: 'DELETE',
                headers: { 'Content-Type':'application/json','Accept':'application/json' },
                body: JSON.stringify({
                    id: id
                })
            }
        }
    }
}