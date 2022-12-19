import React, { useState, useEffect } from 'react'
import moment from 'moment'


import './JobItem.css'
import optionsIcon from '../../../../img/normal.svg'
import Dropdown from '../Dropdown'
import DropdownItem from '../DropdownItem'
// import Loader from '../Loader'
import Loader from '../Loader'
import { deleteJob } from '../../actions/popup/home'
import { setActiveTab } from '../../actions/tabs'
import { manualApiCall, transformCsvData } from '../../utils/index'
import CsvExport from '../../views/ScoreandConnect/csvExport'
import { ACTIVITY_TYPES, MESSAGE_TYPES } from '../../../config/constants'
import { AddLabel } from './AddLabel'
import { fetchJobs } from '../../actions/popup/home'
// import { DASHBOARD_HOST } from '../../config'

const JobItem = ({
  job,
  onClickFindAndRank,
  disabled = false,
  dispatch,
  isRunning = false,
  anyRunning = false,
  jobToggle
  // isBlocked = false
}) => {
  // console.log('REST JOB PROPS: ', rest)
  const [isDdOpen, setDdOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [addLabelOpen, setAddLabelOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const ddOptions = [{
    id: 1,
    text: 'Download as CSV',
    label: 'download',
    clickHandler: (jobId) => {
      // manualApiCall(``)

      console.log('download csv against id: ', jobId)
    }
  }, {
    id: 2,
    text: 'Edit Criteria',
    label: 'edit',
    clickHandler: (jobId) => {
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.LOG_ACTIVITY,
        payload: ACTIVITY_TYPES.EDIT_JOB
      })
      window.open(`/html/edit.html?jId=${jobId}`, '_blank')
    }
  }, {
    id: 3,
    text: 'Delete Job',
    label: 'delete',
    clickHandler: (jobId) => {
      manualApiCall('/api/auth/user/activity/store',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "actionName": "DELETED_A_JOB",
            "jobId": jobId
          })
        })
      dispatch(deleteJob(jobId))
    }
  }]
  const ddOptions2 = [{
    id: 1,
    text: 'Download as CSV',
    label: 'download',
    clickHandler: (jobId) => {
      // manualApiCall(``)

      console.log('download csv against id: ', jobId)
    }
  }]

  const handleClickMessageProspects = (jobId) => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.LOG_ACTIVITY,
      payload: ACTIVITY_TYPES.OPEN_MESSAGE_PROSPECTS
    })
    // chrome.windows.create({
    //   url: [`chrome-extension://${chrome.runtime.id}/html/score.html?connectionFilter=2&firstSort=title_score&firstSortOrder=desc&secondSort=skill_score&secondSortOrder=desc&isConnectPage=1&extensionJobId=${jobId}`, 'https://www.linkedin.com'],
    //   state: 'maximized',
    //   focused: true
    // })
    // dispatch(setActiveTab('2'))
    console.log("++++++++++++++++++++++++++++++++++")
    window.open(`job.html?tN=2&cTF=2&fS=title_score&fSO=desc&secS=skill_score&secSO=desc&isConnectPage=1&jId=${jobId}`, '_blank')
  }


  const handleDownload = async (jobId) => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.LOG_ACTIVITY,
      payload: ACTIVITY_TYPES.DOWNLOAD_CSV
    })
    // setDdOpen(false)
    setIsDownloading(true)
    const data = await manualApiCall(`/api/auth/job/profile/list/advancedFilter?jId=${jobId}&fS=title_score&fSO=desc&secS=skill_score&secSO=desc&pFlag=false`
    )

    // const transformed = transformCsvData(data.prospectsArray)
    setIsDownloading(false)

    if (!data.isBlocked) {

      const transformed = transformCsvData(data.prospectsArray)

      return {
        data: transformed,
        filename: transformed.length > 0 ? `${data.jobData.jobTitle}.csv` : 'filename.csv',
      }
    } else {
      setDdOpen(false)
      alert('Please contact admin@dnnae.com to access this feature.')
    }
  }

  const handleClickLabelSave = (label) => {
    setIsUpdating(true)
    manualApiCall(`/api/auth/job/addLabel`, {
      method: 'POST',
      body: JSON.stringify({
        jobId: job.jobID,
        label
      }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(r => {
        setIsUpdating(false)
        setAddLabelOpen(false)
        dispatch(fetchJobs())
        console.log('RESPONSE IS: ', r)
      })
      .catch(e => {
        setIsUpdating(false)
        setAddLabelOpen(false)
        console.log('An Error occured: ', e.message)
        alert('An unexpected error occured.')
      })
  }


  console.log('JOB ==== ', job)

  const locations = job.jobArray.filter(item => item.tag === "JOB_LOCATION")[0]
  const locationString = locations.data.map(item => typeof (item) === 'string' ? item : item.name).join(', ')

  return (
    <div className='job-item'>
      {addLabelOpen &&
        <AddLabel
          onClickSave={handleClickLabelSave}
          onClickDiscard={() => { setAddLabelOpen(false) }}
          isLoading={isUpdating}
          existingValue={job?.meta?.label || ''}
        />
      }
      <div className='job-item-head'>
        <h2>{job.jobTitle}</h2>

        <img
          src={optionsIcon}
          alt={'options'}
          onClick={() => setDdOpen(!isDdOpen)}
        />
        <div className='dd-options-container'>
          <Dropdown isOpen={isDdOpen}>
            {jobToggle === 1 &&
              <DropdownItem onClick={() => {
                setAddLabelOpen(!addLabelOpen)
                setDdOpen(false)
              }}>
                {!(job.meta && job.meta.label) ? 'Add a label' : 'Edit label'}
              </DropdownItem>
            }
            {
              jobToggle === 1 && ddOptions.map((item, i) =>
                <DropdownItem
                  key={item.id || i}
                  style={i === ddOptions.length - 1 ? { color: '#EF5555' } : {}}
                  onClick={() => item.clickHandler(job.jobID)}
                >
                  {item.label === 'download' ?
                    <span>
                      <CsvExport
                        asyncExportMethod={() => handleDownload(job.jobID)}
                      >
                        {isDownloading ? <Loader color='blue' /> : item.text}
                      </CsvExport>
                    </span> :
                    item.text}
                </DropdownItem>
              )
            }
            {
              jobToggle === 2 && ddOptions2.map((item, i) =>
                <DropdownItem
                  key={item.id || i}
                  style={i === ddOptions.length - 1 ? { color: '#EF5555' } : {}}
                  onClick={() => item.clickHandler(job.jobID)}
                >
                  {item.label === 'download' ?
                    <span>
                      <CsvExport
                        asyncExportMethod={() => handleDownload(job.jobID)}
                      >
                        {isDownloading ? <Loader color='blue' /> : item.text}
                      </CsvExport>
                    </span> :
                    item.text}
                </DropdownItem>
              )
            }
          </Dropdown>
        </div>
      </div>
      {job.meta && job.meta.label && <p className='job-item-label'>{job.meta.label}</p>}

      <p>{locationString}</p>
      <p>Created on {moment(job.createdAt).format('DD MMM YYYY')}</p>
      <div className='job-item-actions'>
        <button
          onClick={async () => {
            chrome.runtime.sendMessage({
              type: MESSAGE_TYPES.LOG_JOB_ACTIVITY,
              payload: {
                actionName: ACTIVITY_TYPES.FIND_AND_RANK,
                jobId: job.jobID
              }
            })
            if (anyRunning && !isRunning) {
              alert('You can only run one job at a time, for a safer experience.')
            } else {
              setStatusLoading(true)
              const status = await manualApiCall('/check-status')
              setStatusLoading(false)
              if (status.isBlocked) {
                alert('Please contact admin@dnnae.com to access this feature.')
              } else {
                onClickFindAndRank(job)
              }
            }
          }}
          disabled={disabled}
          style={{
            display: 'flex',
            justifyContent: 'space-around'
          }}
        >{(isRunning || statusLoading) ?
          <>
            {isRunning && <span>Running</span>}
            <span><Loader color='blue' width='14px' height='14px' /></span>
          </> :
          'Add Prospects'}</button>
        <button onClick={() => {
          console.log("+++++++++++++++++")
          handleClickMessageProspects(job.jobID)
        }}>
          View Prospects</button>
      </div>
    </div>
  )
}

export default JobItem