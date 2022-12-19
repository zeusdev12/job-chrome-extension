import * as ActionTypes from '../../actions/score'

const initialState = {
  isLoading: false,
  isDataAvailable: true,
  data: {
    sampleMessage: '',

    followUpMessage1Enabled: 0,
    followUpMessage1Template: '',
    followUpMessage1Days: 1,
    followUpMessage1Type: 'CONNECT_NO_REPLY',

    followUpMessage2Enabled: 0,
    followUpMessage2Template: '',
    followUpMessage2Days: 2,
    followUpMessage2Type: 'CONNECT_NO_REPLY',

    sampleZoom15Message: '',
    sampleZoom30Message: '',

    connectMessageFirstDegree:'',
    followUp1MessageFirstDegree:'',
    followUp2MessageFirstDegree:'',
    zoom15MessageFirstDegree: '',
    zoom30MessageFirstDegree: ''
  },

  isConnectMessageEnabled: false,
  isSetting: false,
  isSet: false,
  isGetting: false,
  isGotten: false,

}


const messageSettings = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_MESSAGE_VALUE: {
      const { connectionType, type, value } = action.payload
      switch (type) {
        case 'connect':
          return connectionType === 1 ?
            {
              ...state,
              data: { ...state.data, connectMessageFirstDegree: value },
            }
            : {
              ...state, data: { ...state.data, sampleMessage: value }
            }

        case 'fu1':
          return connectionType === 1 ?
            {
              ...state,
              data: { ...state.data, followUp1MessageFirstDegree: value },
            }
            : {
              ...state, data: { ...state.data, followUpMessage1Template: value }
            }

        case 'fu2':
          return connectionType === 1 ?
            {
              ...state,
              data: { ...state.data, followUp2MessageFirstDegree: value },
            }
            : {
              ...state, data: { ...state.data, followUpMessage2Template: value }
            }
        case '15':
          return connectionType === 1 ?
            {
              ...state,
              data: { ...state.data, zoom15MessageFirstDegree: value },
            }
            : {
              ...state, data: { ...state.data, sampleZoom15Message: value }
            }
        case '30':
          return connectionType === 1 ?
            {
              ...state,
              data: { ...state.data, zoom30MessageFirstDegree: value },
            }
            : {
              ...state, data: { ...state.data, sampleZoom30Message: value }
            }
        default:
          return state
      }
      // if(type === 'connect'){
      //   return {...state, data: {...state.data, connectMessage: value}}
      // } else 

      // return state
    }

    case ActionTypes.TOGGLE_MESSAGE_ENABLED: {
      const { connectionType, type } = action.payload
      const map = {
        'fu1': 'followUpMessage1Enabled',
        'fu2': 'followUpMessage2Enabled'
      }

      return  {
          ...state,
          data: {
            ...state.data,
            [map[type]]: !state.data[map[type]]
          }
        }
    }
    case ActionTypes.SET_FOLLOWUP_DAYS:
      {
        const { connectionType, type, value } = action.payload
        const map = {
          'fu1': 'followUpMessage1Days',
          'fu2': 'followUpMessage2Days'
        }

        return  {
            ...state,
            data: {
              ...state.data,
              [map[type]]: value
            }
          }
      }

    case ActionTypes.SET_MESSAGE_SETTING:
      return { ...state, isSetting: true }

    case ActionTypes.SET_MESSAGE_SETTING_SUCCESS:
      return { ...state, isSetting: false, isSet: true }

    case ActionTypes.SET_MESSAGE_SETTING_FAILURE:
      return { ...state, isSetting: false, isSet: false }

    case ActionTypes.GET_MESSAGE_SETTING:
      return { ...state, isLoading: true }

    case ActionTypes.GET_MESSAGE_SETTING_SUCCESS:
      return {
        ...state, isLoading: false, isDataAvailable: true,
        data: action.payload
      }

    case ActionTypes.GET_MESSAGE_SETTING_FAILURE:
      return state

    // case ActionTypes.GET_MESSAGE_SETTING:
    //   return { ...state, }

    default:
      return state
  }
}

export default messageSettings
