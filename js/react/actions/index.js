export * from './jobDescription'
export * from './editJob'
export * from './calendar'

export const REQUEST_SET_USER = 'REQUEST_SET_USER'
export const REQUEST_SET_USER_SUCCESS = 'REQUEST_SET_USER_SUCCESS'
export const REQUEST_SET_USER_FAILURE = 'REQUEST_SET_USER_FAILURE'


export const setUser = () => dispatch => {
  dispatch({ type: REQUEST_SET_USER })
  chrome.storage.local.get(['name', 'recruiterID', 'isPopupOpened', 'emailAddress'], (r) => {
    if (r.name && r.recruiterID) {
      dispatch({ type: REQUEST_SET_USER_SUCCESS, payload: r })
    } else {
      dispatch({ type: REQUEST_SET_USER_FAILURE })
    }
  })
}

// export const requestSetUser = () => ({
//   type: SET_USER
// })

// export const requestSetUserSuccess = (payload) => ({
//   type: REQUEST_SET_USER_SUCCESS,
//   payload
// })
// export const requestSetUserFailure = () => ({
//   type: REQUEST_SET_USER_FAILURE
// })

