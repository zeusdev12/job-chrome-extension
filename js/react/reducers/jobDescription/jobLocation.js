import * as ActionTypes from '../../actions'

const initialState = {
  suggestionsFetched: [],
  isLoadingSuggestions: false,
  value: '',
  locationState: []
}

const jobLocation = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.FETCH_LOCATIONS: {
      return { ...state, isLoadingSuggestions: true }
    }

    case ActionTypes.FETCH_LOCATIONS_SUCCESS: {
      return {
        ...state,
        isLoadingSuggestions: false,
        suggestionsFetched: action.payload.elements.map(item => ({
          name: item.text.text,
          id: item.targetUrn.split(':').pop()
        }))
      }
    }

    case ActionTypes.FETCH_LOCATIONS_FAILURE: {
      return initialState
    }

    case ActionTypes.SET_LOCATION_VALUE:
      return { ...state, value: action.payload }

    case ActionTypes.SET_LOCATION_STATE:
      return { ...state, locationState: action.payload }

    case ActionTypes.CLEAR_LOCATION_SUGGESTIONS:
      return { ...state, suggestionsFetched: [] }


    case ActionTypes.FETCH_JOB_SUCCESS: {
      const locs = action.payload.jobArray.filter(item => item.tag === 'JOB_LOCATION')
      const locactions = locs.length > 0 ? locs[0].data : []
      return {
        ...state,
        value: '',
        locationState: locactions
      }
    }
    case ActionTypes.CLEAR_JOB_LOCATION: {
      return {
        ...state,
        value: '',
        locationState: []
      }
    }


    default:
      return state
  }
}

export { jobLocation }