export const SET_TAB = 'SET_TAB'
export const setActiveTab = tab => {
  return {
    type: SET_TAB,
    payload: tab
  }
}