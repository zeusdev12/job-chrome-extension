import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { MESSAGE_TYPES } from '../../../../../config/constants'
import Loader from '../../../../components/Loader'

// import { fetchJobs } from '../../actions/home'
import { fetchJobs, setCurrentJob } from '../../../../actions/popup/home'
import { setPopupStep } from '../../../../actions/popup/step'
import JobItem from '../../../../components/JobItem'
import LimitIndicator from '../../../../components/LimitIndicator'
import { manualApiCall } from '../../../../utils/index'
import JobToggle from './jobToggle'
import './home.css'

const Home = ({
  jobs: {
    isLoading,
    isDataAvailable,
    data
  },
  dailyLimit: {
    isReached = false
  },
  dispatch,
  runningJobs
}) => {

  // const [runningJobIds, setRunningJobIds] = useState([])

  const [statusLoading, setStatusLoading] = useState(false)
  const [jobToggle, setJobToggle] = useState(1)

  useEffect(() => {
    dispatch(fetchJobs())
  }, [])

  async function getStatus() {
    setStatusLoading(true)
    const status = await manualApiCall('/check-status')
    setStatusLoading(false)
    return status
  }

  const handleClickNewProspectSearch = async () => {
    const status = await getStatus()
    if (status.isBlocked) {
      alert('Please contact admin@dnnae.com to access this feature.')
    } else {
      window.open('/html/add-job.html', '_blank')
    }
  }

  const handleClickViewJobs = async () => {
    const status = await getStatus()
    if (status.isBlocked) {
      alert('Please contact admin@dnnae.com to access this feature.')
    } else {
      window.open('/html/jobs.html', '_blank')
    }
  }
  const handleClickFindAndRank = async (job) => {
    const running = runningJobs.filter(item => item.jobId == job.jobID)
    if (running.length > 0) {
      const runningJob = running[0]
      if (runningJob.windowId === runningJob.currentWindowId) {
        chrome.tabs.update(runningJob.tabId, { active: true })
      } else {
        chrome.runtime.sendMessage({
          type: MESSAGE_TYPES.ACTIVATE_WIN_TAB,
          payload: {
            tabId: runningJob.tabId,
            windowId: runningJob.windowId
          }
        })
      }
    } else {
      dispatch(setPopupStep(2))
      dispatch(setCurrentJob(job))
    }
  }

  return (
    <div className='home'>
      <LimitIndicator />

      {isLoading &&
        <div className='jobs-container' style={{ textAlign: 'center', paddingTop: '32px' }}>
          <Loader color='blue' />
        </div>
      }
      {(!isLoading && isDataAvailable) &&
        <>
          <button
            className='nxt-btn'
            onClick={handleClickNewProspectSearch}
            disabled={isReached}
          >
            {statusLoading ? <Loader /> : 'New Prospect Search'}
          </button>
          {/* <button
            className='nxt-btn'
            onClick={handleClickViewJobs}
            disabled={isReached}
          >
            {statusLoading ? <Loader /> : 'View Jobs'}
          </button> */}
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0px 20px 0px' }}>
            <span style={{marginTop:'10px'}}>My prospect searches:</span>
            <JobToggle jobToggle={jobToggle} setJobToggle={setJobToggle} />
          </div>
          <div className='jobs-container'>
            {data.map((item, i) =>
             ((jobToggle === 1 && item.isOwner  )|| (jobToggle === 2 && !item.isOwner)) &&
               
                <JobItem
                  key={item.id || i}
                  job={item}
                  isRunning={runningJobs.map(it => it.jobId).some(jbId => jbId == item.jobID)} //runningJobIds.includes(item.jobID)
                  anyRunning={runningJobs.length > 0}
                  onClickFindAndRank={handleClickFindAndRank}
                  disabled={isReached}
                  dispatch={dispatch}
                  jobToggle={jobToggle}
                />
            )}
          </div>
        </>
      }

      {(!isLoading && !isDataAvailable) &&
        <>
          <div className='empt-popup-root'>
            <div className='empt-popup-content'>
              <h2>No Prospect Searches</h2>
              <p>You do not have any prospect search yet. Let's get started with a new one.</p>
              <button
                className='nxt-btn'
                onClick={handleClickNewProspectSearch}
                disabled={isReached}
              > {statusLoading ? <Loader /> : 'New Prospect Search'}</button>
              {/* <button
                className='nxt-btn'
                onClick={handleClickViewJobs}
                disabled={isReached}
              > {statusLoading ? <Loader /> : 'View Jobs'}</button> */}
            </div>
          </div>
        </>
      }
    </div>
  )
}



const BaseWrapper = (props) => {
  const [runningJobs, setRunningJobs] = useState({
    data: [],
    isDataAvailable: false,
  })

  useEffect(() => {
    chrome.windows.getCurrent(win => {
      chrome.tabs.query({}, function (tabs) {
        const runningTabsObj = tabs.reduce((obj, item) => {
          return { ...obj, [item.id]: { ...item } }
        }, {})
        const runningTabIds = Object.keys(runningTabsObj).map(item => parseInt(item, 10)) //tabs.map(item => item.id)

        chrome.storage.local.get('tabsMeta', function (response) {

          const tabsMeta = response['tabsMeta']
          const tabMetaToRemove = []
          const jobs = []

          for (const tabId in tabsMeta) {

            if (tabsMeta[tabId].step == 6 && tabsMeta[tabId].currentJob && runningTabIds.includes(parseInt(tabId, 10))) {
              jobs.push({
                jobId: tabsMeta[tabId].currentJob.jobID,
                tabId: parseInt(`${tabId}`, 10),
                windowId: runningTabsObj[tabId].windowId,
                currentWindowId: win.id
              })
            } else {
              if (tabsMeta[tabId].step == 6) {
                tabMetaToRemove.push(tabId)
              }
            }
          }

          chrome.storage.local.set({
            'tabsMeta': _.omit(tabsMeta, tabMetaToRemove)
          }, function () {
            setRunningJobs(prevState => {
              return {
                ...prevState,
                isDataAvailable: true,
                data: jobs
              }
            })
          })
        })
      })
    })
  }, [])


  return (
    <React.Fragment>
      {runningJobs.isDataAvailable ?
        <Home
          runningJobs={runningJobs.data}
          {...props}
        /> :
        null}
    </React.Fragment>
  )

}


export default connect(state => ({
  ...state.popup.home
}))(BaseWrapper)