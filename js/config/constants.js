const MESSAGE_TYPES = {
  GET_USER: 'GET_USER',
  GET_STEP: 'GET_STEP',
  SET_STEP: 'SET_STEP',
  SET_JOB: 'SET_JOB',
  GET_JOB: 'GET_JOB',
  STOP_JOB: 'STOP_JOB',
  GET_JOB_META: 'GET_JOB_META',
  ADD_JOB_META: 'ADD_JOB_META',
  UPDATE_JOB_META: 'UPDATE_JOB_META',
  APPLY_FILTERS: 'APPLY_FILTERS',
  CHECK_FILTERS: 'CHECK_FILTERS',
  INITIALIZE_SEARCH: 'INITIALIZE_SEARCH',
  GET_INITIALIZATION_STATUS: 'GET_INITIALIZATION_STATUS',
  START_COLLECTION: 'START_COLLECTION',
  GET_SEARCH_TERM_FOR_COLLECTION: 'GET_SEARCH_TERM_FOR_COLLECTION',
  UPDATE_URL: 'UPDATE_URL',
  SCRAPE_DATA: 'SCRAPE_DATA',
  GET_NEXT_SEARCHTERM: 'GET_NEXT_SEARCHTERM',
  SET_CONTINUE_URL: 'SET_CONTINUE_URL',
  GET_COLLECTION_PROGRESS: 'GET_COLLECTION_PROGRESS',
  POST_QUICK: 'POST_QUICK',
  START_AI_ENHANCING: 'START_AI_ENHANCING',
  GET_AI_ENHACNING_PROGRESS: 'GET_AI_ENHACNING_PROGRESS',
  PAUSE_JOB: 'PAUSE_JOB',
  RESUME_JOB: 'RESUME_JOB',
  CHECK_IF_PAUSED: 'CHECK_IF_PAUSED',
  SET_IS_EXHAUSTED: 'SET_IS_EXHAUSTED',
  PROFILE_VISIT_LIMIT_REACHED: 'PROFILE_VISIT_LIMIT_REACHED',
  UPDATE_JOBS: 'UPDATE_JOBS',
  OPEN_JOB_DES: 'OPEN_JOB_DES',
  OPEN_SETTINGS_PAGE: 'OPEN_SETTINGS_PAGE',
  ACTIVATE_WIN_TAB: 'ACTIVATE_WIN_TAB',
  LOG_ACTIVITY: 'LOG_ACTIVITY',
  GET_DASHBOARD_HOST: 'GET_DASHBOARD_HOST',
  GET_JOB_ID: 'GET_JOB_ID',
  FETCH_JOB_META: 'FETCH_JOB_META',
  SET_POPUP_STEP: 'SET_POPUP_STEP',
  CHECK_USER_STATUS: 'CHECK_USER_STATUS',
  DELETE_JOB_META: 'DELETE_JOB_META',
  LOG_JOB_ACTIVITY:'LOG_JOB_ACTIVITY',
  SCRAPE_FROM_API: 'SCRAPE_FROM_API'
}

const DEFAULT_DAILY_PROFILES_LIMIT = 500

const ACTIVITY_TYPES = {
  POPUP_OPENED: 'POPUP_OPENED',
  CREATE_JOB: 'CREATE_JOB',
  EDIT_JOB: 'EDIT_JOB',
  DOWNLOAD_CSV: 'DOWNLOAD_CSV',
  DELETE_JOB: 'DELETE_JOB',
  FIND_AND_RANK: 'FIND_AND_RANK',
  OPEN_ANALYTICS: 'OPEN_ANALYTICS',
  OPEN_MESSAGE_PROSPECTS: 'OPEN_MESSAGE_PROSPECTS',
  OPEN_SETTINGS: 'OPEN_SETTINGS',
  OPEN_SUPPORT_PAGE: 'OPEN_SUPPORT_PAGE',
  ADD_SEARCH_TERM: 'ADD_SEARCH_TERM',
  DELETE_SEARCH_TERM: 'DELETE_SEARCH_TERM',
  START_SEARCH_CLICKED: 'START_SEARCH_CLICKED',
  VIEW_RESULTS_CLICKED: 'VIEW_RESULTS_CLICKED',
  PAUSE_JOB_CLICKED: 'PAUSE_JOB_CLICKED',
  RESUME_JOB_CLICKED: 'RESUME_JOB_CLICKED',
  CALENDAR_PAGE_OPENED: 'CALENDAR_PAGE_OPENED'
}

export {
  MESSAGE_TYPES,
  DEFAULT_DAILY_PROFILES_LIMIT,
  ACTIVITY_TYPES
}