import { MESSAGE_TYPES, DEFAULT_DAILY_PROFILES_LIMIT } from './config/constants.js'
import { DASHBOARD_HOST } from './config/index.js'
import { openDatabase, getJobMeta, addJobMeta, updateJobMeta, deleteJobMeta } from './background/db/index.js'
import {
  // getApiUrl
  getApiEndpoint
} from './background/searchTerms/index.js'
import {
  // simulateTimeout,
  // getCsrf,
  callLinkedinApi,
  // sendMessageToActiveTab,
  simulateTimeout,
  manualApiCall,
  extractPublicIdentifier,
  visitApiProfile,
  parseLiQs,
  getRandomInt,
  transformQuickProfilesApiData,
  getTabsMeta
} from './react/utils/index.js'

import { initializeCrons } from './background/crons/index.js'
// import { setPopupStep } from './react/actions/popup/step.js'

openDatabase()
initializeCrons()

chrome.runtime.onInstalled.addListener(function (details) {

  if (details.reason == "install") {
    chrome.storage.local.clear();

    chrome.storage.local.set({ isPopupOpened: false })

    var homeUrl = DASHBOARD_HOST + "/recruiter/home?calledFromExtension=1";


    chrome.tabs.create({
      url: 'https://www.linkedin.com'
    })

    chrome.tabs.create({
      // url: homeUrl
      url: DASHBOARD_HOST
    });





  } else if (details.reason == 'update') {
    console.log("New update installed");
    //force logout
    // chrome.storage.local.remove(['userDetailsSent', 'emailAddress', 'isRecruiter', 'jobArray', 'name', 'recruiterID', 'tabsMeta'])

  }

  reloadAllLinkedInPages();

});

function reloadAllLinkedInPages(callback) {
  chrome.windows.getAll({ populate: true }, function (windows) {
    windows.forEach(function (window) {
      var tabs_count = 0;
      window.tabs.forEach(function (tab) {
        if (tab.url.indexOf('www.linkedin.com') > -1 || tab.url.indexOf(chrome.runtime.id) > -1) {
          chrome.tabs.reload(tab.id);
          tabs_count++;
        }
      });
      if (typeof callback == 'function') {
        callback();
        if (tabs_count > 0) {
          callback();
        }
      }
    });
  });
}

chrome.runtime.onConnect.addListener(function (externalPort) {
  externalPort.onDisconnect.addListener(function () {
    console.log('popup closed')
  })
})


chrome.tabs.onRemoved.addListener(function (tabId, removed) {
  cleanUpAgainstJob(tabId)
})


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // console.log('onTabUpdated: ', tab)
  if (changeInfo.status === 'complete') {
    // console.log('UPDATED TAB IS: ', tab)
    if (!tab.url.includes('search/results/people')) {
      cleanUpAgainstJob(tabId)
    }
  }
})


function cleanUpAgainstJob(tabId) {
  console.log('HELLO CLEANUP YAYYYYYYY: ', tabId)
  chrome.tabs.sendMessage(tabId, { type: MESSAGE_TYPES.STOP_JOB })
  chrome.storage.local.get('tabsMeta', function (result) {
    if (result.tabsMeta && result.tabsMeta[tabId]) {
      let newTabsMeta = result.tabsMeta
      const job = newTabsMeta[tabId].currentJob
      console.log('JOB IS: ', job)
      if (job) {
        cleanUp(job.jobID)
      }
      delete newTabsMeta[tabId]

      chrome.storage.local.set({ 'tabsMeta': newTabsMeta })
    }
  })
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case MESSAGE_TYPES.GET_USER: {
      getUser(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.GET_JOB_META: {
      getJobMeta(request.payload)
        .then(r => {
          sendResponse(r)
        })
      return true
    }

    case MESSAGE_TYPES.ADD_JOB_META: {
      addJobMeta(request.payload)
        .then(r => {
          sendResponse(r)
        })
      return true
    }

    case MESSAGE_TYPES.DELETE_JOB_META: {
      deleteJobMeta(request.payload)
      return true
    }


    case MESSAGE_TYPES.UPDATE_JOB_META: {
      // console.log('UPDATING META LINE 85')
      updateJobMeta(request.payload)
        .then(r => {
          sendResponse(r)
        })
      return true
    }

    case MESSAGE_TYPES.INITIALIZE_SEARCH: {
      initializeSearch(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.GET_INITIALIZATION_STATUS: {
      getInitializationStatus(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.GET_SEARCH_TERM_FOR_COLLECTION: {
      getSearchTermForCollection(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.UPDATE_URL: {
      updateUrl(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.GET_NEXT_SEARCHTERM: {
      getNextSearchTerm(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.SET_CONTINUE_URL: {
      setContinueUrl(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.POST_QUICK: {
      postQuick(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.START_AI_ENHANCING: {
      console.log('>>>>> 198')
      startAiEnhancingThread(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.GET_AI_ENHACNING_PROGRESS: {
      getAiThreadProgress(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.PAUSE_JOB: {
      pauseJob(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.RESUME_JOB: {
      resumeJob(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.CHECK_IF_PAUSED: {
      checkIfPaused(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.SET_IS_EXHAUSTED: {
      setIsExhausted(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.UPDATE_JOBS: {
      updateJobs(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.OPEN_SETTINGS_PAGE: {
      chrome.tabs.create({ url: "html/settings.html" })
      return true
    }

    case MESSAGE_TYPES.OPEN_JOB_DES: {
      chrome.tabs.create({ url: "html/jd.html" })
      return true
    }

    case MESSAGE_TYPES.LOG_ACTIVITY: {
      logActivity(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.LOG_JOB_ACTIVITY: {
      logJobActivity(request, sender, sendResponse)
      return true
    }




    case MESSAGE_TYPES.GET_JOB_ID: {
      getJobId(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.FETCH_JOB_META: {
      fetchJobMeta(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.SET_POPUP_STEP: {
      setStepPopup(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.ACTIVATE_WIN_TAB: {
      activateWinTab(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.GET_DASHBOARD_HOST: {
      getDashboardHost(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.CHECK_USER_STATUS: {
      checkUserStatus(request, sender, sendResponse)
      return true
    }

    case MESSAGE_TYPES.SCRAPE_FROM_API: {
      scrapeFromApi(request, sender, sendResponse)
      return true
    }


    default:
      return true

  }
})

async function scrapeFromApi(request, sender, sendResponse) {
  try {
    const {
      payload: {
        url,
        params
      }
    } = request


    const tabsMeta = await getTabsMeta()

    const jobId = tabsMeta[sender.tab.id].currentJob.jobID


    const searchTerm = decodeURI(params.keywords)

    const endpoint = getApiEndpoint(searchTerm, url)
    // console.log('ENDPOINT IS: ', endpoint)
    const response = await initApiCall(endpoint)

    console.log('RESPONSE IS: ', response)

    // transformQuickProfilesApiData()
    let results
    if (response?.paging?.total > 0) {
      const resultsObj = response.elements.filter(item => Object.keys(item).includes('results'))
      results = resultsObj[0].results //response.elements[1].results
      const transformed = transformQuickProfilesApiData(results, searchTerm)
      postQuickApiCall(jobId, transformed)
    }

    const r = {
      success: true,
      count: results.length,
      url: url
    }


    // console.log('xoxo SENDING RESPONSE xoxo: ', r)

    sendResponse(r)

  } catch (e) {
    // console.log('AN awesome ERROR OCCURED: ', e.message)
    sendResponse({ success: false })
  }



}

function checkUserStatus(request, sender, sendResponse) {
  manualApiCall('/check-status', { method: 'GET' })
    .then(function (response) {
      console.log('CHECK STATUS RESPONSE: ', response)
      sendResponse(response)
    })
    .catch(err => {
      console.log('AN ERROR OCCURED: ', err.message)
    })
}

function getDashboardHost(request, sender, sendResponse) {
  sendResponse(DASHBOARD_HOST)
}

function logActivity(request, sender, sendResponse) {

  manualApiCall(`/api/auth/user/activity/store`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      actionName: request.payload
    })
  })
}

function logJobActivity(request, sender, sendResponse) {
  console.log('INSIDE LOG JOB ACTIVITY')

  manualApiCall(`/api/auth/user/activity/store`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      actionName: request.payload.actionName,
      jobId: request.payload.jobId
    })
  })
}
async function activateWinTab(request, sender, sendResponse) {
  const { tabId, windowId } = request.payload
  chrome.windows.update(windowId, { focused: true })
  await simulateTimeout(50)
  chrome.tabs.update(tabId, { active: true })
}

function setStepPopup(request, sender, sendResponse) {
  chrome.storage.local.get('tabsMeta', function (response) {
    const tabsMeta = response['tabsMeta']

    const newTabsMeta = {
      ...tabsMeta, [sender.tab.id]: {
        ...tabsMeta[sender.tab.id],
        step: request.payload
      }
    }

    chrome.storage.local.set({ 'tabsMeta': newTabsMeta })

  })
}

async function updateJobs(request, sender, sendResponse) {
  chrome.storage.local.get('recruiterID', async function (response) {
    if (response['recruiterID']) {
      const resp = await manualApiCall(`/api/auth/job/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response['recruiterID'] })
      })

      chrome.storage.local.set({ 'jobArray': resp.job })
      sendResponse(true)
    }
  })
}

async function setIsExhausted(request, sender, sendResponse) {
  chrome.storage.local.get('tabsMeta', async function (resp) {
    const jobId = resp['tabsMeta'][sender.tab.id].currentJob.jobID

    const jobMeta = await getJobMeta(jobId)

    const updatedSearchTerms = jobMeta.searchTerms.map((item, i) =>
      item.isRunning ? { ...item, isExhausted: true } : item
    )

    console.log('UPDATING META LINE 185')
    await updateJobMeta({
      ...jobMeta,
      searchTerms: updatedSearchTerms
    })

    sendResponse(true)

  })
}

async function fetchJobMeta(request, sender, sendResponse) {
  chrome.storage.local.get('tabsMeta', async function (resp) {
    const jobId = resp['tabsMeta'][sender.tab.id].currentJob.jobID
    const jobMeta = await getJobMeta(jobId)
    sendResponse(jobMeta)
  })
}

function getJobId(request, sender, sendResponse) {
  chrome.storage.local.get('tabsMeta', function (meta) {
    sendResponse(meta[sender.tab.id].currentJob.jobID)
  })
}

function checkIfPaused(request, sender, sendResponse) {
  sendResponse(window[`isPaused_${request.payload}`] || false)
}

async function resumeJob(request, sender, sendResponse) {
  console.log('RESUME_JOB.....................................', request)
  const { jobId, tabId } = request.payload
  window[`isPaused_${jobId}`] = false

  const jobMeta = await getJobMeta(jobId)

  initializeSearch({ payload: { jobId, tabUrl: jobMeta.mainSearchUrl } }, sender, sendResponse)

  chrome.tabs.sendMessage(tabId, {
    type: MESSAGE_TYPES.RESUME_JOB,
    payload: jobId
  })

  clearInterval(window[`aiEnhanceThread_${jobId}`])
  // await simulateTimeout(100)
  // if (!window[`aiEnhanceThread_${jobId}`]) {
  console.log('>>>>> 463')
  startAiEnhancingThread(request, sender, sendResponse)
  // }


}

function pauseJob(request, sender, sendResponse) {
  console.log('PAUSE JOB ............................................. , ', request)
  console.log('sender: ', sender)
  const { jobId, tabId } = request.payload
  window[`isPaused_${jobId}`] = true
  window[`pauseFlag_${jobId}`] = true

  //this stops initializationThread
  if (window[`initInterval_${jobId}`]) {
    clearInterval(window[`initInterval_${jobId}`])
  }

  //this should stop collection thread
  chrome.tabs.sendMessage(tabId, {
    type: MESSAGE_TYPES.PAUSE_JOB,
    payload: jobId
  })

  //implementation here to stop ai enhancing


  // clearInterval(window[`aiEnhanceThread_${jobId}`])
  // window[`aiEnhanceThread_${jobId}`] = null

  if (window[`aiEnhanceThread_${jobId}`]) {
    console.log('CALLING CLEAR INTERVAL: 381')

    clearInterval(window[`aiEnhanceThread_${jobId}`])
    // window[`aiEnhanceThread_${jobId}`] = null
  }

  if (window[`enhance_interval_${jobId}`]) {
    clearInterval(window[`enhance_interval_${jobId}`])
  }

}

function getAiThreadProgress(request, sender, sendResponse) {
  const { jobId } = request.payload
  sendResponse(window[`aiEnhancingStatus_${jobId}`])
}

async function startAiEnhancingThread(request, sender, sendResponse) {
  const { jobId } = request.payload
  window[`aiEnhanceThread_${jobId}`] = setInterval(() => aiEnhanceThread(jobId), 2000)
  window[`aiEnhancingStatus_${jobId}`] = {
    enhancedCount: null,
    totalCount: null,
    viewResultsCount: null,
    currentlyEnhancing: null,
    isExhausted: false
  }
}

function getCollectionProgressAgainstJob(jobId) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('tabsMeta', function (response) {
      const tabsMeta = response['tabsMeta']
      let tabIdToCheck = null

      // Object.keys(tabsMeta).forEach(tabId => {
      //   if (tabsMeta[tabId].currentJob) {
      //     if (tabsMeta[tabId].currentJob.jobID == jobId) {
      //       tabIdToCheck = tabId
      //       break;
      //     }
      //   }
      // })

      for (let tabId in tabsMeta) {
        if (tabsMeta[tabId].currentJob) {
          if (tabsMeta[tabId].currentJob.jobID == jobId) {
            tabIdToCheck = tabId
            break;
          }
        }
      }

      if (tabIdToCheck) {
        console.log('GETTING COLLECTION PROGRESS TAB Id', tabIdToCheck)

        chrome.tabs.sendMessage(parseInt(tabIdToCheck, 10), { type: 'GET_COLLECTION_PROGRESS', payload: 'FROM BACKGROUND' }, function (response) {
          console.log('COLLECTION PROGRESS RESPONSE: ', response)
          resolve(response)
        })
      } else {
        resolve(null)
      }
    })
  })
}

async function aiEnhanceThread(jobId) {
  // console.log('AI ENHANCE THREAD FX CALLED: ', jobId)
  // console.log('WINDOWOBJECT: ', window)
  window[`cleanup_${jobId}`] = false
  const data = await manualApiCall(`/api/auth/get-quick/prospects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jobID: jobId
    })
  })

  // window[`prevProspects_${jobId}`] = data.listQuickApplicant

  const collectionProgress = await getCollectionProgressAgainstJob(jobId) //isSearchExhausted
  const initStatus = await fetchInitializationStatus(jobId) //

  console.log('=============================')
  console.log('collectionProgress: ', collectionProgress)
  console.log('initStatus: ', initStatus)
  console.log('=============================')

  // window[`prospects_${jobId}`]




  if (data.listQuickApplicant.length > 0) {
    // const todata.listQuickApplicant.length
    const totalCount = data.listQuickApplicant.length
    const enhancedCount = 0
    const viewResultsCount = data.enhancedCount

    window[`aiEnhancingStatus_${jobId}`] = {
      ...window[`aiEnhancingStatus_${jobId}`],
      enhancedCount: enhancedCount,
      totalCount: totalCount,
      viewResultsCount: viewResultsCount,
    }

    if (_.isEqual(data.listQuickApplicant.map(item => item.link).sort(), _.get(window, `prospects_${jobId}`, []).sort())) {
      if ((collectionProgress.progress == 100 && collectionProgress.isSearchExhausted) && initStatus.progress == 100) {
        // console.log('CLEAR INTERVAL: 486')
        clearInterval(window[`aiEnhanceThread_${jobId}`])
        window[`aiEnhancingStatus_${jobId}`] = {
          ...window[`aiEnhancingStatus_${jobId}`],
          enhancedCount: enhancedCount,
          totalCount: totalCount,
          viewResultsCount: viewResultsCount,
          isExhausted: true
        }
      } else {
        window[`prospects_${jobId}`] = data.listQuickApplicant.map(item => item.link)
        aiEnhanceProfiles(data.listQuickApplicant, jobId)
        // console.log('CALLING CLEAR INTERVAL 498')
        clearInterval(window[`aiEnhanceThread_${jobId}`])
      }
    } else {
      window[`prospects_${jobId}`] = data.listQuickApplicant.map(item => item.link)
      aiEnhanceProfiles(data.listQuickApplicant, jobId)
      // console.log('CALLING CLEAR INTERVAL: 504')
      clearInterval(window[`aiEnhanceThread_${jobId}`])
    }

  } else {
    if ((collectionProgress.progress == 100 && collectionProgress.isSearchExhausted) && initStatus.progress == 100) {
      // console.log('CALLING CLEAR INTERVAL 506')
      clearInterval(window[`aiEnhanceThread_${jobId}`])
      window[`aiEnhancingStatus_${jobId}`] = {
        ...window[`aiEnhancingStatus_${jobId}`],
        viewResultsCount: data.enhancedCount,
        isExhausted: true
      }
    } else {


      // if (!window[`aiEnhanceThread_${jobId}`]) {
      clearInterval(window[`aiEnhanceThread_${jobId}`])
      if (!window[`isPaused_${jobId}`]) {
        console.log('>>>>> 633')
        startAiEnhancingThread({ payload: { jobId: jobId } }, null, null)
      }
      // }

      // async function startAiEnhancingThread(request, sender, sendResponse) {
      //   const { jobId } = request.payload
      //start ai enhance thread again here
    }
  }
}


function enhanceIntervalCb(jobId) {
  const profiles = window[`profiles_${jobId}`]
  const currentProfileIndex = window[`enhancing_index_${jobId}`]
  const profile = profiles[currentProfileIndex]
  const areAllProfilesExhausted = currentProfileIndex == profiles.length - 1

  aiEnhanceSingleProfile(profile, jobId)

  window[`enhancing_index_${jobId}`] = currentProfileIndex + 1

  clearInterval(window[`enhance_interval_${jobId}`])

  if (areAllProfilesExhausted) {
    aiEnhanceThread(jobId)
  }


  const condition = window[`cleanup_${jobId}`] || window[`isPaused_${jobId}`]
  if (!condition && !areAllProfilesExhausted) {
    window[`enhance_interval_${jobId}`] = setInterval(() => { enhanceIntervalCb(jobId) }, (getRandomInt(7, 11) * 1000))
  }
}


async function aiEnhanceProfiles(profiles, jobId) {

  window[`profiles_${jobId}`] = profiles
  window[`enhancing_index_${jobId}`] = 0
  window[`enhance_interval_${jobId}`] = setInterval(() => { enhanceIntervalCb(jobId) }, (getRandomInt(7, 11) * 1000))

  /**
   * profiles is an array of people that need to be enhanced
   * setInterval to a random number between 7 and 11 seconds
   * on each execution clear interval and set interval again at another value
   * continue until all profiles are enhanced
   */

  // console.log('AI ENHANCE PROFILES CALLED...', profiles)
  // for (const profile of profiles) {
  //   const condition = window[`cleanup_${jobId}`] || window[`isPaused_${jobId}`]
  //   if (condition) {
  //     break
  //   }

  //   if (window[`pauseFlag_${jobId}`]) {
  //     console.log('BREAKING FROM LOOP NOW...')
  //     window[`pauseFlag_${jobId}`] = false
  //     break
  //   }

  //   aiEnhanceSingleProfile(profile, jobId)
  //   await simulateTimeout(getRandomInt(7, 11) * 1000)

  // }

  // // console.log('windowcleanup: ', window[`cleanup_${jobId}`])
  // // console.log('windoispaused: ', window[`isPaused_${jobId}`])
  // const condition = !window[`cleanup_${jobId}`] && !window[`isPaused_${jobId}`]
  // // console.log('CONDITION: ', condition)
  // if (condition) {
  //   console.log('<<<<<<<<<<<<<<<<< 672: ', condition)
  //   aiEnhanceThread(jobId)
  // }
}

async function aiEnhanceSingleProfile(profile, jobId) {
  try {
    window[`aiEnhancingStatus_${jobId}`] = {
      ...window[`aiEnhancingStatus_${jobId}`],
      currentlyEnhancing: profile.full_name
    }
    // profile.link, profile.full_name
    const publicIdentifier = extractPublicIdentifier(profile.link)
    const apiProfile = await visitApiProfile(publicIdentifier)

    const resp = await manualApiCall('/api/auth/post-applicants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobID: jobId,
        profileArray: [{ ...apiProfile, profileUrl: profile.link }],
      })
    })

    window[`aiEnhancingStatus_${jobId}`] = {
      ...window[`aiEnhancingStatus_${jobId}`],
      enhancedCount: (window[`aiEnhancingStatus_${jobId}`].enhancedCount || 0) + 1,
      viewResultsCount: resp && resp.enhancedCount ? resp.enhancedCount : window[`aiEnhancingStatus_${jobId}`].viewResultsCount
    }

    const d = new Date()
    const dateKey = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear() + "-profiles"

    chrome.storage.local.get([dateKey, 'DailyLimitSelected', 'tabsMeta'], function (response) {

      console.log('DAILYLIMITSSTORAGERESPONSE: ', response)


      const dailyLimit = response['DailyLimitSelected'] || DEFAULT_DAILY_PROFILES_LIMIT
      const consumed = response[dateKey] || 0



      chrome.storage.local.set({ [dateKey]: consumed + 1 })

      console.log('DAILY LIMITS ARE: ', { dailyLimit, consumed })

      if (parseInt(consumed, 10) + 1 >= parseInt(dailyLimit, 10)) {
        console.log('limits are reached')
        const tabsMeta = response['tabsMeta']
        // const tabIds = []
        Object.keys(tabsMeta).forEach(tabId => {
          if (tabsMeta[tabId].currentJob) {
            cleanUpAgainstJob(parseInt(tabId, 10))
            // console.log('SENDING MESSAGE TO STOP TAB ID: ', tabId)
            // chrome.tabs.sendMessage(parseInt(tabId, 10), { type: MESSAGE_TYPES.STOP_JOB })
          }
        })

        // console.log('JOB IDS TO CLEANUP AGAINST: ',)
        // const tabIds = Object.keys(tabsMeta)
        // tabIds.forEach(tabId => cleanUpAgainstJob(tabId))
        // chrome.runtime.sendMessage({ type: MESSAGE_TYPES.PROFILE_VISIT_LIMIT_REACHED })
        //stop everything and 
        // cleanUp()

      }
    })

    return true

  } catch (e) {
    console.log('AN ERROR OCCURRED: ', e.message)
    return true
  }
}

function postQuick(request, sender, sendResponse) {
  // console.log('POST QUICK METHOD: ', request)
  const tabId = sender.tab.id
  chrome.storage.local.get('tabsMeta', async function (response) {
    const tabsMeta = response['tabsMeta']
    const jobId = tabsMeta[tabId].currentJob.jobID

    postQuickApiCall(jobId, request.payload)

  })
}


function postQuickApiCall(jobId, profileArray) {
  manualApiCall(`/api/auth/post-applicants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jobID: jobId,
      profileArray: profileArray//request.payload
    })
  })
}


async function setContinueUrl(request, sender, sendResponse) {
  // console.log('SET CONTINUER URL FUNCTION: ', request)
  const {
    continueUrl
  } = request.payload


  const comps = continueUrl.split('&page=')
  let contUrl = comps[0]
  if (comps[1]) {
    // console.log('PAGE EXISTS: ', comps[1])
    contUrl = [comps[0], parseInt(comps[1], 10) + 1].join('&page=')
    // console.log('SETTING CONTINUE URL TO: ', contUrl)
  }


  chrome.storage.local.get('tabsMeta', async function (result) {
    const jobId = result['tabsMeta'][sender.tab.id].currentJob.jobID
    const jobMeta = await getJobMeta(jobId)

    const runningSt = jobMeta.searchTerms.filter(item => item.isRunning)[0]

    if (runningSt) {
      const updatedSts = jobMeta.searchTerms.map((item, i) => {
        if (item.searchTermValue.toLowerCase().trim() === runningSt.searchTermValue.toLowerCase().trim()) {
          return {
            ...item,
            continueUrl: contUrl
          }
        } else {
          return item
        }
      })

      console.log('UPDATING META LINE 453')
      await updateJobMeta({
        ...jobMeta,
        searchTerms: updatedSts
      })
    }
  })



}

async function getNextSearchTerm(request, sender, sendResponse) {
  console.log('GET NEXT ST: ', request)
  // console.log('')
  const tabId = sender.tab.id
  chrome.storage.local.get('tabsMeta', async function (response) {
    const job = response['tabsMeta'][tabId].currentJob

    const jobMeta = await getJobMeta(job.jobID)

    const searchTerms = jobMeta.searchTerms

    // const prevRunning = searchTerms.filter(item => item.isRunning)[0]
    // const prevRunning = searchTerms.filter(item =>
    //   item.searchTermValue.toLowerCase().trim() === request.payload.searchTerm.searchTermValue.toLowerCase().trim()
    // )[0]

    // console.log('GET NEXT: STS ', searchTerms)
    // console.log('GET NEXT: prevRunning: ', prevRunning)

    const updatedSts = searchTerms.map((item, i) => {
      // console.log('GET NEXT ST: ', item)
      if (item.isRunning) {
        return {
          ...item,
          isRunning: false,
          isVisited: true,
          isExhausted: request.payload.isExhausted || false
        }
      } else {
        return item
      }
    })

    console.log('UPDATED STS YO: ', updatedSts)

    const newJobMeta = { ...jobMeta, searchTerms: updatedSts }

    console.log('new job meta is: ', newJobMeta)

    console.log('UPDATING META LINE 501')
    await updateJobMeta(newJobMeta)

    const updatedMeta = await getJobMeta(job.jobID)

    console.log('updated meta: ', updatedMeta)

    const areAllExhausted = updatedSts.every(st => st.isExhausted)

    const data = await fetchSearchTermForCollection(job.jobID)
    sendResponse({
      jobId: job.jobID,
      data: data,
      exhausted: areAllExhausted
    })

    // console.log('GET NEXT SEARCH TERM: jobMeta: ', jobMeta)

  })
}

async function updateUrl(request, sender, sendResponse) {


  chrome.tabs.update(sender.tab.id, { url: request.payload })
  chrome.tabs.onUpdated.addListener(tabUpdateListener)

  function tabUpdateListener(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tabId === sender.tab.id) {
      chrome.tabs.sendMessage(sender.tab.id, { type: MESSAGE_TYPES.SCRAPE_DATA, jobId: request.jobId })
      chrome.tabs.onUpdated.removeListener(tabUpdateListener)
    }
  }
}



async function getSearchTermForCollection(request, sender, sendResponse) {
  const jobId = request.payload
  const data = await fetchSearchTermForCollection(jobId)

  sendResponse(data)
}


async function fetchSearchTermForCollection(jobId) {
  // console.log('FETCH SEARCH TERM FOR COLLECTION: ', jobId)
  let st
  const meta = await getJobMeta(jobId)

  // console.log('JOB META IS: ', meta)

  // console.log('JOB ID TO GET SEARCH TERM FOR COLLECTION :', jobId)
  // console.log('META IS: ', meta)

  // find a search term that is initialized and is not visited,
  // if all search terms are visited, set all visited to false, and return the most strict initialized term

  const searchTerms = meta.searchTerms

  console.log('fetchSt SEARCH TERMS : ', searchTerms)

  const running = searchTerms.filter(item => item.isRunning && !item.isExhausted)
  if (running.length > 0) {
    console.log('found running')
    return {
      searchTerm: running[0],
      mainSearchUrl: meta.mainSearchUrl
    }
  }

  const initAndNotVisited = searchTerms.filter(item => (item.isInitialized && !item.isVisited && !item.isExhausted && !item.isRunning && !item.isDeleted)).sort((a, b) => b - a)
  if (initAndNotVisited.length > 0) {
    console.log('initAndNotVisited: ', initAndNotVisited)
    st = initAndNotVisited[0]
    console.log('ST: ', st)
    const updatedSts = searchTerms.map(item =>
      item.searchTermValue.toLowerCase().trim() === st.searchTermValue.toLowerCase().trim() ?
        { ...item, isRunning: true } : item
    )

    console.log('fetchSt UPDATED STS: ', updatedSts)
    console.log('UPDATE JOB META LINE 583')
    await updateJobMeta({
      ...meta,
      searchTerms: updatedSts
    })
  } else {
    // here u have no search terms that are not visited, set all search terms isVisited to false, sort and return 
    // const initialized = searchTerms.filter(item => item.isInitialized)
    let updatedSts = searchTerms.map((item, i) => ({ ...item, isVisited: false }))
    const initalizedAndNotRunning = searchTerms.filter(item => item.isInitialized && !item.isRunning && !item.isExhausted && !item.isDeleted)

    if (initalizedAndNotRunning.length > 0) {
      st = initalizedAndNotRunning[0]
      updatedSts = updatedSts.map(item => item.searchTermValue.toLowerCase().trim() === st.searchTermValue.toLowerCase().trim() ? { ...item, isRunning: true } : item)
    } else {
      st = null
    }
    // st = updatedSts[0]
    // const notExhausted = updatedSts.filter(item => !item.isExhausted)
    // st = notExhausted.length > 0 ? notExhausted[0] : null
    // console.log('UPDATING META LINE 603')
    await updateJobMeta({
      ...meta,
      searchTerms: updatedSts
    })
  }

  const areAllExhausted = searchTerms.every(item => (item.isExhausted || item.isDeleted))

  return {
    searchTerm: st,
    mainSearchUrl: meta.mainSearchUrl,
    exhausted: areAllExhausted
  }
}

// async function findSearchTermForCollection(){}

function cleanUp(jobId) {
  // console.log('CLEANUP AGAINST JOB: ', jobId)
  if (window[`initInterval_${jobId}`]) {
    clearInterval(window[`initInterval_${jobId}`])
  }
  if (window[`aiEnhanceThread_${jobId}`]) {
    console.log('CALLING CLEAR INTERVAL: 837')
    clearInterval(window[`aiEnhanceThread_${jobId}`])
  }

  if (window[`aiEnhancingStatus_${jobId}`]) {
    delete window[`aiEnhancingStatus_${jobId}`]
  }

  delete window[`isPaused_${jobId}`]


  if (window[`enhance_interval_${jobId}`]) {
    clearInterval(window[`enhance_interval_${jobId}`])
  }

  window[`cleanup_${jobId}`] = true
}

async function getInitializationStatus(request, sender, sendResponse) {
  const { payload } = request

  const initStatus = await fetchInitializationStatus(payload)
  // console.log('GET INITIALIZATION PROGRESS: ', jobId)
  // const jobMeta = await getJobMeta(payload)
  // const searchTerms = jobMeta.searchTerms.sort((a, b) => b - a)

  // const searchTermCount = searchTerms.length
  // const progress = (searchTerms.filter(item => item.isInitialized).length / searchTerms.length) * 100
  // const onTerm = searchTerms.map((it, ind) => ({ ...it, index: ind })).filter(item => (!item.isInitializing && !item.isInitialized))
  // const termBeingVisited = searchTerms.filter(item => item.isRunning)

  // console.log('ON TERM: ', onTerm)


  sendResponse({
    progress: initStatus.progress,
    onTerm: initStatus.onTerm, //initStatus.onTerm.length > 0 ? initStatus.onTerm[0] : null,
    searchTermCount: initStatus.searchTermCount,
    termBeingVisited: initStatus.termBeingVisited.length > 0 ? initStatus.termBeingVisited[0] : null
  })
}

async function fetchInitializationStatus(jobId) {
  const jobMeta = await getJobMeta(jobId)
  const searchTerms = jobMeta.searchTerms.sort((a, b) => b - a)


  // console.log('FETCH INITIALIZATION STATUS: ', window[`onTerm_${ jobId }`])

  const searchTermCount = searchTerms.length
  const progress = (searchTerms.filter(item => (item.isInitialized || item.isDeleted)).length / searchTerms.length) * 100
  const onTerm = _.get(window, `onTerm_${jobId}`, null) //searchTerms.map((it, ind) => ({ ...it, index: ind })).filter(item => (item.isInitializing && !item.isInitialized))
  const termBeingVisited = searchTerms.filter(item => item.isRunning)

  const r = {
    searchTermCount,
    progress,
    onTerm,
    termBeingVisited
  }

  // console.log('FETCH INITIALIZATION STATUS: returning ', r)
  return r

}


async function initializeSearch(request, sender, sendResponse) {
  try {
    const { jobId, tabUrl } = request.payload
    window[`isPaused_${jobId}`] = false


    const meta = await getJobMeta(jobId)
    console.log('META IS: ', meta)
    console.log('UPDATING META LINE 664')
    console.log({
      prevMain: meta.mainSearchUrl,
      currentMain: tabUrl
    })

    if (meta && meta.mainSearchUrl) {
      if (_.isEqual(parseLiQs(meta.mainSearchUrl), parseLiQs(tabUrl))) {
        console.log('PREVIOUS AND CURRENT ARE EQUAL')
        await updateJobMeta({
          ...meta,
          mainSearchUrl: tabUrl
        })
      } else {
        console.log('URLS ARE DIFFERENT.... should reInitializeSearchTerms')
        await updateJobMeta({
          ...meta,
          mainSearchUrl: tabUrl,
          searchTerms: meta.searchTerms.map(item => ({
            ...item,
            isInitialized: false,
            isInitializing: false,
            isRunning: false,
            isExhausted: false,
            continueUrl: ''
          }))
        })
      }
    } else {
      console.log('MAIN URL DOESNT EXIST')
      await updateJobMeta({
        ...meta,
        mainSearchUrl: tabUrl
      })
    }

    initializeTerm(jobId, tabUrl)
    window[`initInterval_${jobId}`] = setInterval(async () => {
      initializeTerm(jobId, tabUrl)
    }, 7000)

  } catch (e) {
    console.log('AN ERROR OCCURED: ', e.message)
  }

}


async function initializeTerm(jobId, tabUrl) {
  console.log('INITIALIZE TERM FUNCTION CALLED....')
  let isLast = false
  let stToInitialize = []
  const meta = await getJobMeta(jobId)
  const searchTerms = meta.searchTerms.sort((a, b) => b - a)

  for (let i = 0; i < searchTerms.length; i++) {
    stToInitialize = []
    if (!searchTerms[i].isInitializing && !searchTerms[i].isInitialized && !searchTerms[i].isDeleted) {
      const obj = { ...searchTerms[i], index: i }
      // console.log('OBJECT IS: ', obj)
      stToInitialize.push(obj)
      // console.log('stToInitialize: ', stToInitialize)

      if (i === searchTerms.length - 1) {
        isLast = true
      }
      break
    }
  }


  // console.log('STS TO INITIALIZE ARE: ', stToInitialize)

  if (stToInitialize.length > 0) {
    const term = stToInitialize[0]
    const updateInitializing = searchTerms.map((item) => {

      if (item.searchTermValue.toLowerCase().trim() === term.searchTermValue.toLowerCase().trim()) {
        // console.log('SETTING ON TERM ========================= :', item)
        window[`onTerm_${jobId}`] = { ...item, index: term.index }
        // console.log('SET TO: =============: ', window[`onTerm_${ jobId }`])
        return { ...item, isInitializing: true }
      } else {
        return item
      }
    })

    // console.log('UPDATE INITIALIZING: ', updateInitializing)
    console.log('UPDATING META LINE 716')
    await updateJobMeta({
      ...meta,
      searchTerms: updateInitializing
    })


    const endpoint = getApiEndpoint(term.searchTermValue, tabUrl)
    // console.log('ENDPOINT IS: ', endpoint)
    const response = await initApiCall(endpoint)
    // await callLinkedinApi(endpoint, {
    //   method: 'GET',
    //   headers: {
    //     'x-restli-protocol-version': '2.0.0'
    //   }
    // })

    if (!response?.error && response.paging.total > 0) {

      const resultsObj = response.elements.filter(item => Object.keys(item).includes('results'))

      const results = resultsObj[0].results //response.elements[1].results
      const transformed = transformQuickProfilesApiData(results, term.searchTermValue)

      // console.log('TRANSFORMED DATA IS:12341234:  ', transformed)

      postQuickApiCall(jobId, transformed)

    }



    const updateInitialized = searchTerms.map(item => {
      if (item.searchTermValue.toLowerCase().trim() === term.searchTermValue.toLowerCase().trim()) {
        return {
          ...item,
          isInitializing: false,
          isInitialized: !response?.error && response.initAgain ? true : true,
          totalResults: (response?.error || response?.initAgain) ? null : response.paging.total,
          isExhausted: (response?.error || response?.initAgain) ? true : (response.paging.total === 0 || (response.paging.count >= response.paging.total))
        }
      } else {
        return item
      }
    })

    // console.log('update initialized: ', updateInitialized)
    console.log('UPDATING META LINE 748')
    await updateJobMeta({
      ...meta,
      searchTerms: updateInitialized
    })

    // console.log('IS LAST: ', isLast)
    if (isLast && updateInitialized.every(item => item.isInitialized)) {
      // console.log('CALLING CLEAR INTERVAL')
      clearInterval(window[`initInterval_${jobId}`])
    }

  } else {
    clearInterval(window[`initInterval_${jobId}`])
  }
}

async function initApiCall(endpoint) {
  try {
    const response = await callLinkedinApi(endpoint, {
      method: 'GET',
      headers: {
        'x-restli-protocol-version': '2.0.0'
      }
    })
    return response
  } catch (e) {
    return {
      initAgain: true
    }
  }
}

function getUser(request, sender, sendResponse) {
  chrome.storage.local.get('user', function (result) {
    console.log('user: ', result)
    if (result.user) {

      sendResponse(user)
    }
  })
}