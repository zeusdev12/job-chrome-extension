import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import useInterval from 'use-interval'
import { Button } from 'reactstrap'

import BackNav from '../../../../components/BackNav'
import ProgressItem from '../../../../components/ProgressItem'
import LimitIndicator from '../../../../components/LimitIndicator'
import { setPopupStep } from '../../../../actions/popup/step'
import { checkDailyLimit } from '../../../../actions/popup/home'
import { ACTIVITY_TYPES, MESSAGE_TYPES } from '../../../../../config/constants'
import Loader from '../../../../components/Loader'

const Search = ({
  dispatch,
  currentJob,
  dailyLimit
}) => {

  // console.log('DAILY LIMIT IS: ', dailyLimit)

  const [isPaused, setIsPaused] = useState(false)
  const [isPausing, setIsPausing] = useState(false)

  const [initStatus, setInitStatus] = useState({
    progress: null,
    onTerm: null,
    searchTermCount: null,
    termBeingVisited: null
  })

  const [collectionProgress, setCollectionProgress] = useState({
    progress: 0,
    isSearchExhausted: false,
    isReady: true
  })

  const [aiThreadProgress, setAiThreadProgress] = useState({
    enhancedCount: null,
    totalCount: null,
    viewResultsCount: null,
    currentlyEnhancing: null,
    isExhausted: false
  })

  useEffect(() => {
    getInitializationStatus()
    getCollectionProgress()
    getAiEnhancingStatus()
    checkIfJobPaused()
  }, [])

  useInterval(async () => {
    getInitializationStatus()
    getCollectionProgress()
    getAiEnhancingStatus()
    checkIfJobPaused()
    dispatch(checkDailyLimit())
  }, 500)

  const checkIfJobPaused = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.CHECK_IF_PAUSED,
      payload: currentJob.job.jobID
    }, function (response) {
      setIsPaused(response)
    })
  }

  const getInitializationStatus = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.GET_INITIALIZATION_STATUS,
      payload: currentJob.job.jobID
    }, function (response) {
      console.log('INIT RESPONSE: ', response)
      setInitStatus(response)
    })
  }

  const getCollectionProgress = () => {

    // sendResponse({
    //   progress: r,
    //   isSearchExhausted: isSearchExhausted
    // })

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGE_TYPES.GET_COLLECTION_PROGRESS }, function (response) {
        console.log('COLLECTION PROGRESS IS: ', response)
        if (response) {
          setCollectionProgress(response)
        }
      })
    })
  }

  const getAiEnhancingStatus = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.GET_AI_ENHACNING_PROGRESS,
      payload: {
        jobId: currentJob.job.jobID
      }
    }, function (response) {

      if (response) {
        console.log('AI THREAD PROGRESS: ', aiThreadProgress)
        setAiThreadProgress(response)
      }

    })
  }

  const handleClickViewResults = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.LOG_ACTIVITY,
      payload: ACTIVITY_TYPES.VIEW_RESULTS_CLICKED
    })
    chrome.windows.create({
      url: [`chrome-extension://${chrome.runtime.id}/html/job.html?tN=2&cTF=2&fS=title_score&fSO=desc&secS=skill_score&secSO=desc&isConnectPage=1&jId=${currentJob.job.jobID}`, 'https://www.linkedin.com'],
      state: 'maximized',
      focused: true
    })
    // window.open(`score.html?connectionFilter=2&firstSort=title_score&firstSortOrder=desc&secondSort=skill_score&secondSortOrder=desc&isConnectPage=1&extensionJobId=${currentJob.job.jobID}`, '_blank')
  }

  const handleClickButtonPause = () => {
    setIsPausing(true)

    setTimeout(() => {
      setIsPausing(false)
    }, 525)

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      const jobId = currentJob.job.jobID

      chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.LOG_ACTIVITY,
        payload: isPaused ?
          ACTIVITY_TYPES.RESUME_JOB_CLICKED :
          ACTIVITY_TYPES.PAUSE_JOB_CLICKED
      })


      chrome.runtime.sendMessage({
        type: isPaused ? MESSAGE_TYPES.RESUME_JOB : MESSAGE_TYPES.PAUSE_JOB,
        payload: { jobId, tabId: tabs[0].id }
      })
    })

  }

  const enhanceProgress = ((aiThreadProgress.enhancedCount || 0) / (aiThreadProgress.totalCount || 0)) * 100

  const { viewResultsCount } = aiThreadProgress

  return (
    <div>
      <BackNav
        onClickButtonBack={() => {
          chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            dispatch(setPopupStep(1))
            chrome.tabs.update(tabs[0].id, { url: 'https://www.linkedin.com' })
          })

        }
        }
      />
      <LimitIndicator />
      <div>
        <div className='search-item'>
          <ProgressItem label='Evaluating Search Terms' progress={initStatus.progress || 0} />
          <div className='content-item'>
            {initStatus.progress && initStatus.progress < 100 && initStatus.onTerm &&
              <>
                <p>{initStatus.onTerm ? `${initStatus.onTerm.searchTermValue}` : ''}</p>
                <p style={{ marginBottom: 0 }}>{initStatus.onTerm.index + 1} of {initStatus.searchTermCount}</p>
              </>
            }
            {initStatus.progress && initStatus.progress === 100 &&
              <>
                <p><b>Completed!</b></p>
              </>
            }

          </div>
        </div>
        <div className='search-item'>
          <ProgressItem label='Finding Prospects' progress={collectionProgress.progress} />
          <div className='content-item'>
            {!collectionProgress.isSearchExhausted &&
              <p>{initStatus.termBeingVisited ? initStatus.termBeingVisited.searchTermValue : ''}</p>
            }
            {collectionProgress.isSearchExhausted && <p><b>Completed!</b></p>}
          </div>
        </div>
        <div className='search-item'>
          <ProgressItem label='AI Enhancing and Ranking' progress={aiThreadProgress.isExhausted ? 100 : enhanceProgress} />
          <div className='content-item'>
            {(enhanceProgress == 100 || aiThreadProgress.isExhausted) ?
              <React.Fragment>
                <p><b>Completed!</b></p>
              </React.Fragment> :
              <React.Fragment>
                {aiThreadProgress.currentlyEnhancing && <p>Enhancing Profile: {aiThreadProgress.currentlyEnhancing}</p>}
              </React.Fragment>
            }
          </div>
        </div>
      </div>
      <div className='search-actions'>
        {!dailyLimit.isReached &&
          <Button
            color='primary'
            outline
            onClick={handleClickButtonPause}
            disabled={isPausing || !collectionProgress.isReady}
            style={{ minWidth: '130px' }}
          >
            {isPausing && <Loader color='#297AF7' />}
            {(!isPausing && isPaused) && 'Resume Search'}
            {(!isPausing && !isPaused) && 'Pause Search'}

          </Button>
        }
        <Button
          color='primary'
          disabled={!(viewResultsCount && viewResultsCount > 0)}
          onClick={handleClickViewResults}
        >
          View Results {(viewResultsCount && viewResultsCount > 0) && `(${viewResultsCount})`}
        </Button>
      </div>
    </div>
  )
}

const Wrapper = ({
  dispatch,
  currentJob,
  dailyLimit
}) => {
  return (
    <React.Fragment>
      {currentJob.job &&
        <Search
          dispatch={dispatch}
          currentJob={currentJob}
          dailyLimit={dailyLimit}
        />}
    </React.Fragment>
  )
}

export default connect((state) => ({
  currentJob: state.popup.home.currentJob,
  dailyLimit: state.popup.home.dailyLimit
}))(Wrapper)
