import React, { useState, useEffect, memo } from 'react'
import { connect } from 'react-redux'
import qs from 'query-string'

import Header from '../../components/Header'
import TopContainer from './TopContainer'
import Loader from '../../components/Loader'
import { fetchJobDetails } from '../../actions/tribe'
import { loadPreEvalForm } from '../../actions/preEvaluationForm'
// import { setActiveTab } from '../../actions/tabs'
import Content from './Content'

import './style.css'

const Job = memo(({
  auth,
  notifications,
  job,
  dispatch,
  permissions,
  tabNumber,
  location: {
    search
  },
  history: {
    push
  },
  isLoading
}) => {

  // const [jobData, setJobData] = useState([])
  const [tab, setTabNumber] = useState(qs.parse(search).tN)
  const [viewState, setView] = useState('ScoreAndConnect')

  const setTab = number => {

    switch (number) {
      case '1':
        push('/html/job.html?tN=1&jId=' + qs.parse(search).jId)
        break;
      case '2':
        push('/html/job.html?tN=2&cTF=2&fS=title_score&fSO=desc&secS=skill_score&secSO=desc&isConnectPage=1&jId=' + qs.parse(search).jId)
        break;
      case '3':
        push('/html/job.html?tN=3&jId=' + qs.parse(search).jId)
        break;
      case '4':
        push('/html/job.html?tN=4&jId=' + qs.parse(search).jId)
        break;
    }
    setTabNumber(number)
  }
  useEffect(() => {
    dispatch(fetchJobDetails(qs.parse(search).jId))
  }, [])

  return (
    <div className="job-view">
      <Header {...auth.user} tabNumber={1} push={push}  {...notifications} />
      { isLoading ?
        <div style={{ marginTop: '20%' }}>
          <span className="loader-wrapper">
            <Loader color='#297AF7' height='50px' width='50px' />
          </span>
        </div>
        :
        <>
          {!(viewState === 'ComposeMessage' || viewState === 'RequestMeeting') &&
            <TopContainer
              title={job?.jobTitle}
              job={job}
              dispatch={dispatch}
              tabNumber={tab}
              setTab={setTab}
              push={push}
              search={search}
              id={job?.id}
              permissions={permissions}
            />
          }

          <Content
            tabNumber={tab}
            search={search}
            push={push}
            dispatch={dispatch}
            viewState={viewState}
            setView={setView}
            permissions={permissions}
          />
        </>}
    </div>
  )
})

export default connect(state => ({
  auth: state.auth,
  tabNumber: state.tabs.tabNumber,
  job: state.tribe.jobDetails.data,
  isLoading: state.tribe.jobDetails.isLoading,
  permissions: state.tribe.jobDetails.permissions,
  notifications: state.tribe.notifications
}))(Job)