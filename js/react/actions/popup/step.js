import { MESSAGE_TYPES } from '../../../config/constants'
import { sendMessageToActiveTab } from '../../utils/index'

export const GET_STEP = 'GET_STEP'
export const GET_STEP_SUCCESS = 'GET_STEP_SUCCESS'
export const GET_STEP_FAILURE = 'GET_STEP_FAILURE'

export const SET_POPUP_STEP = 'SET_POPUP_STEP'
export const SET_POPUP_STEP_SUCCESS = 'SET_POPUP_STEP_SUCCESS'
export const SET_POPUP_STEP_FAILURE = 'SET_POPUP_STEP_FAILURE'

export const getStep = () => (dispatch) => {
  // dispatch({ type: GET_STEP })
  // sendMessageToActiveTab({ type: MESSAGE_TYPES.GET_STEP })
  //   .then(resp => {
  //     dispatch({ type: GET_STEP_SUCCESS, payload: resp })
  //   })
  //   .catch(err => {
  //     dispatch({ type: GET_STEP_FAILURE, error: err })
  //   })

  dispatch({ type: GET_STEP })
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    if (tabs[0]) {
      const tabId = tabs[0].id
      chrome.storage.local.get(`tabsMeta`, function (result) {
        if (result.tabsMeta) {
          if (result.tabsMeta[tabId] && result.tabsMeta[tabId].step) {
            let step = result.tabsMeta[tabId].step
            if (!tabs[0].url.includes('/search/results/people')) {
              step = 1
              chrome.storage.local.set({ 'tabsMeta': { ...result.tabsMeta, [tabId]: { step } } }, function () {
                dispatch({
                  type: GET_STEP_SUCCESS,
                  payload: step
                })
              })
            } else {
              dispatch({
                type: GET_STEP_SUCCESS,
                payload: step
              })
            }

          } else {
            chrome.storage.local.set({ 'tabsMeta': { ...result.tabsMeta, [tabId]: { step: 1 } } }, function () {
              dispatch({
                type: GET_STEP_SUCCESS,
                payload: 1
              })
            })
          }
        } else {
          chrome.storage.local.set({ 'tabsMeta': { [tabId]: { step: 1 } } }, function () {
            dispatch({
              type: GET_STEP_SUCCESS,
              payload: 1
            })
          })
        }
      })
    }
  })
}

export const setPopupStep = (step) => (dispatch) => {
  // dispatch({ type: SET_POPUP_STEP })
  // sendMessageToActiveTab({ type: MESSAGE_TYPES.SET_STEP, payload: step })
  //   .then(resp => {
  //     dispatch({
  //       type: SET_POPUP_STEP_SUCCESS,
  //       payload: resp
  //     })
  //   })
  //   .catch(err => {
  //     dispatch({ type: SET_POPUP_STEP_FAILURE, error: err })
  //   })

  dispatch({ type: SET_POPUP_STEP })
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const tab = tabs[0] || null

    chrome.storage.local.get('tabsMeta', function (result) {
      chrome.storage.local.set({
        'tabsMeta': {
          ...result.tabsMeta,
          [tab.id]: { ...result.tabsMeta[tab.id], step: step }
        }
      }, function () {
        dispatch({
          type: SET_POPUP_STEP_SUCCESS,
          payload: step
        })
      })
    })

  })

}