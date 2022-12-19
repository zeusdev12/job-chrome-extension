import { manualApiCall } from '../utils/index'

export const FETCH_USER = 'FETCH_USER'
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS'
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE'
export const LOGOUT = 'LOGOUT'

export const fetchUser = () => (dispatch) => {
  dispatch({ type: FETCH_USER })
  chrome.storage.local.get(['recruiterID', 'emailAddress', 'name', 'isPopupOpened', 'isBlocked', 'CARDINAL_CSRF_Token'], async function (result) {
    // if (result.recruiterID) {
    if (result.recruiterID || result.CARDINAL_CSRF_Token /* TODO-TEMP */) {
      // const status = await manualApiCall(`/check-status`)
      dispatch({
        type: FETCH_USER_SUCCESS,
        payload: result
      })
    } else {
      dispatch({
        type: FETCH_USER_FAILURE
      })
    }
  })
}

export const logout = () => ({
  type: LOGOUT
})