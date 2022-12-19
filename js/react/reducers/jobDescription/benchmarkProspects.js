import * as ActionTypes from '../../actions'

const initialState = {
    isSimilarLoading: false,
    isSimilarDataAvailable: false,
    isIdealLoading: false,
    isIdealDataAvailable: false,
    similar: {
        empty: true,
    },
    ideal: []
}

export const benchmarkProspects = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_SIMILAR:
        return { 
            ...state, 
            isSimilarLoading: true 
        }

    case ActionTypes.FETCH_SIMILAR_SUCCESS:
    
        return {
            ...state,
            isSimilarLoading: false,
            isSimilarDataAvailable: true,
            similar: {
                empty: false,
                ...action.payload
            }
        }

    case ActionTypes.FETCH_SIMILAR_FAILURE: 
        alert("Could not find the prospect!")
        return {
            ...state,
            isSimilarLoading: false,
            isSimilarDataAvailable: false,
            similar: {
                empty: true
            }
        }
    case ActionTypes.FETCH_IDEAL:
        return { 
            ...state, 
            isIdealLoading: true 
        }

    case ActionTypes.FETCH_IDEAL_SUCCESS:
    
        console.log("====================================")
        console.log(action.payload)
        return {
            ...state,
            isIdealLoading: false,
            isIdealDataAvailable: true,
            ideal: [...state.ideal, {...action.payload}]
        }

    case ActionTypes.FETCH_IDEAL_FAILURE:

        console.log("====================================")
        console.log(action.payload)
        return {
            ...state,
            isIdealLoading: false,
            isIdealDataAvailable: false,
        }

    case ActionTypes.CLEAR_SIMILAR:
        return {
            ...state,
            similar: {
                empty: true
            }
        }
    case ActionTypes.CLEAR_IDEAL:
        return {
            ...state,
            ideal: state.ideal.filter(itm => itm.publicIdentifier!==action.payload.id)
        }

    case ActionTypes.CLEAR_BENCHMARK:
        return initialState

    default:
        return state

  }
}