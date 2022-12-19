import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Container } from 'reactstrap'
import { fetchJob } from '../../actions/editJob'
import qs from 'query-string'

import '../JobDescription/JobDescription.css'
import Header from '../../components/Header'
import JdSteps from '../../components/JdSteps'
import ReviseJd from '../../components/ReviseJd'
import ContinueSearch from '../../components/ContinueSearch'
import Loader from '../../components/Loader'

const EditJob = ({
  auth,
  notifications,
  jobData,
  dispatch,
  editJob,
  history: {
    push
  },
  ...rest
}) => {

  const jobId = qs.parse(rest.location.search).jId

  useEffect(() => {
    dispatch(fetchJob(jobId))
  }, [])

  const heading = jobData.jobTitle

  const message = ``

  return (
    <div>

      <Header {...auth.user} tabNumber={1} push={push} {...notifications}/>

      <div className='add-job-headerContainer'>
        <div className="add-job-top-container">
          <h1 className="add-job-heading">
            {heading}
          </h1>
        </div>

        <JdSteps onStep={editJob.step} />
        
      </div>

      <hr className='add-job-bottomBorder' />

      <div >

       
          {editJob.isLoading && <Loader />}
          {(!editJob.isLoading && editJob.isDataAvailable) &&
            <React.Fragment>
              {editJob.step === 4 &&
                <ReviseJd
                  editMode={true}
                  jobId={jobId}
                  push={push}
                />
              }
              {/* {editJob.step === 3 &&
                <ContinueSearch
                  editMode={true}
                  jobId={jobId}
                  {...editJob}
                />
              } */}
            </React.Fragment>
          }
        
      </div>
    </div>
  )
}

export default connect(state => ({
  auth: state.auth,
  editJob: state.editJob,
  notifications:state.tribe.notifications,
  ...state.jobDescription.revise
}))(EditJob)