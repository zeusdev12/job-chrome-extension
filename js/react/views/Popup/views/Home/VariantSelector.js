import React, { useState } from 'react'
import { connect } from 'react-redux'
import { MESSAGE_TYPES } from '../../../../../config/constants'
import BackNav from '../../../../components/BackNav'
import './home.css'

// import { updateCurrentTab } from '../../../../utils/index'
// import { setCurrentJob } from '../../../../actions/popup/home'
import { setPopupStep } from '../../../../actions/popup/step'
// import usePrevious from '../../../../customHooks/usePrevious'

const VariantSelector = ({
  currentJob: {
    isLoading,
    isDataAvailable,
    job
  },
  dispatch,
  updateListener,
  setApplyingPreviousFilters
}) => {

  const [variant, setVariant] = useState('regular')
  // const [tabId, setTabId] = useState(null)
  // https://www.linkedin.com/search/results/people/?keywords=project%20manager
  // const prevJob = usePrevious(job)
  const handleClick = () => {
    if (variant === 'regular') {
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.GET_JOB_META,
        payload: job.jobID
      }, function (jobMeta) {
        if (jobMeta && jobMeta.mainSearchUrl) {
          setApplyingPreviousFilters(true)
          dispatch(setPopupStep(4))
          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
              chrome.tabs.update(tabs[0].id, { url: jobMeta.mainSearchUrl })
            }
            chrome.tabs.onUpdated.addListener(updateListener)
          })
        } else {
          dispatch(setPopupStep(3))
          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
              chrome.tabs.update(tabs[0].id, { url: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(job.jobTitle)}` })
            }
            chrome.tabs.onUpdated.addListener(tabUpdateListener)
          })
        }
      })


    } else if (variant === 'recruiter') {
      alert('Recruiter lite support coming soon..')
    }
  }

  function tabUpdateListener(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tabId === tab.id) {
      dispatch(setPopupStep(4))
      chrome.tabs.onUpdated.removeListener(tabUpdateListener)
    }
  }


  const handleClickButtonBack = () => {
    dispatch(setPopupStep(1))
  }

  return (
    <div className='variant-selector-root'>
      <BackNav onClickButtonBack={handleClickButtonBack} />
      <p className='sub-heading'>Select Type of Search</p>
      <div className='variant-actions'>
        <button
          className={variant === 'regular' ? 'variant-active' : ''}
          onClick={() => setVariant('regular')}
        >
          Regular
        </button>
        <button
          className={variant === 'recruiter' ? 'variant-active' : ''}
          onClick={() => setVariant('recruiter')}
        >
          Recruiter
          </button>
      </div>
      <button className='nxt-btn' onClick={handleClick} >Next</button>
    </div>
  )
}

export default connect(state => ({
  currentJob: state.popup.home.currentJob
}))(VariantSelector)