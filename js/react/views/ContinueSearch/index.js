import React, { useEffect, useState } from 'react'
import { Button } from 'reactstrap'
import { connect } from 'react-redux'
import qs from 'query-string'
import Header from '../../components/Header'
import EditProgress from '../../components/EditProgress'

import './style.css'

const ContinueSearch = ({
  auth,
  notifications,
  history: { push },
  location: { search },
  shouldScoreAgain,
  totalCount
}) => {

  const params = qs.parse(search)
  const [heading, setHeading] = useState('')

  useEffect(() => {

    // console.log('SHOULD SCORE AGAIN: ', shouldScoreAgain)
    qs.parse(search).jId ?
      chrome.storage.local.get('jobArray', (result) => {
        const [jobData] = result.jobArray.filter(jobs => jobs.jobID == qs.parse(search).jId)
        setHeading(jobData.jobTitle)
      })
      :
      setHeading('New Job')
  }, [])

  const handleClickCancel = () => {
    push('/html/jobs.html')
  }
  const handleClickRedirect = () => {
    window.open('https://www.linkedin.com', '_self')
  }

  const message = shouldScoreAgain && totalCount > 0 ?
    'Please wait while we rescore prospects against new criteria.' :
    'Job Updated Successfully'

  return (
    <div>
      <Header {...auth.user} tabNumber={1} push={push} {...notifications} />
      <div className="continue-search-top-container">
        <p className="add-job-heading">{heading}</p>
        <Button
          color="primary"
          outline
          className="continue-search-finish-button"
          onClick={handleClickCancel}
        >
          Finish
                </Button>
      </div>
      <div className="tribe-container">
        <div className="tribe-title">
          <p className="tribe-heading-text">
            Find and Rank
                    </p>
        </div>
      </div>
      <hr className='add-job-bottomBorder' />

      <div className="continue-search-content">
        {shouldScoreAgain &&
          <>
            {(shouldScoreAgain && totalCount > 0) && <h4>Rescoring Prospects</h4>}
            <p style={{ marginBottom: '24px' }}>{message}</p>
            <EditProgress jobId={params.jId} />
          </>

        }
        {!shouldScoreAgain && <>
          <span className="continue-search-heading-text">
            Add Prospects
                </span>
          <p className="continue-search-secondary-text">On LinkedIn, Please click on <b>Start Search</b> under this job on extension.</p>
          <Button
            color="primary"
            className="continue-search-content-button"
            onClick={handleClickRedirect}
          >
            <span className="text">Continue To LinkedIn</span>
          </Button>
        </>
        }
      </div>
    </div>
  )
}

export default connect(state => ({
  auth: state.auth,
  notifications: state.tribe.notifications,
  shouldScoreAgain: _.get(state, 'editJob.updateMeta.shouldScoreAgain', false),
  totalCount: _.get(state, 'editJob.updateMeta.totalCount', 0)
}))(ContinueSearch)