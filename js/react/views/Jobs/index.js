import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { fetchMyJobs, fetchMyJobsWithKeyword, fetchTribeJobs, deleteJob } from '../../actions/jobs'
import { setActiveTab } from '../../actions/tabs'

import './style.css'

import { manualApiCall } from '../../utils'
import Header from '../../components/Header'
import TopContainer from './TopContainer'
import Content from './Content'

const Jobs = ({
  data,
  isLoading,
  auth,
  notifications,
  dispatch,
  history: { push }
}) => {

  const [jobToggle, setJobToggle] = useState(1)
  const [jobId, setJobId] = useState('')
  const [searchTextBox, setSearchTextBox] = useState('')


  const [customTimeout, setCustomTimeout] = useState(null)

  //confirm search logic

  //   const searchTextBoxChange = e => {
  //     setSearchTextBox(e.target.value);
  //     const timer = setTimeout(() =>  

  //     dispatch(jobToggle === 1 ? fetchMyJobsWithKeyword(e.target.value) : fetchTribeJobs(e.target.value)), 2000);

  //     return () => clearTimeout(timer);
  // }

  const searchTextBoxChange = (e) => {
    setSearchTextBox(e.target.value)
    clearTimeout(customTimeout)
    setCustomTimeout(setTimeout(() => {
      dispatch(jobToggle === 1 ? fetchMyJobsWithKeyword(e.target.value) : fetchTribeJobs(e.target.value))
    }, 500))
  }

  const handleViewJobCriteria = id => {
    // dispatch(setActiveTab('1'))
    push('/html/job.html?tN=1&jId=' + id)
  }

  const handleViewJobProspects = id => {
    push('/html/job.html?tN=2&fS=title_score&fSO=desc&secS=skill_score&secSO=desc&isConnectPage=1&jId=' + id)
  }

  const handleRemoveJob = id => {
    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "actionName": "DELETED_A_JOB",
          "jobId": id
        })
      })
    dispatch(deleteJob(id))
    // dispatch(fetchMyJobs())
  }

  const handleAddProspects = id => {
    push('/html/continue-search.html?jId=' + id)
  }

  useEffect(() => {
    jobToggle === 1 ? dispatch(fetchMyJobs()) : dispatch(fetchTribeJobs())
  }, [jobToggle])

  return (
    <div>
      <Header {...auth.user} tabNumber={1} push={push} {...notifications} />
      <TopContainer jobToggle={jobToggle} push={push} />
      <Content
        data={data}
        jobToggle={jobToggle}
        setJobToggle={setJobToggle}
        isLoading={isLoading}
        searchTextBox={searchTextBox}
        searchTextBoxChange={searchTextBoxChange}
        handleViewJobCriteria={handleViewJobCriteria}
        handleRemoveJob={handleRemoveJob}
        handleViewJobProspects={handleViewJobProspects}
        handleAddProspects={handleAddProspects}
      />
    </div>
  )
}

export default connect(state => ({
  auth: state.auth,
  editJob: state.editJob,
  data: state.jobs.data,
  notifications: state.tribe.notifications,
  isLoading: state.jobs.isLoading
}))(Jobs)