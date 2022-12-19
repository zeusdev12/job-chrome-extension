import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import useInterval from 'use-interval'

import { fetchUser } from './actions/auth'
import { fetchNotifications } from './actions/tribe'
import { getCurrentTabUrl } from './utils/index'

import JobDescription from './views/JobDescription'

import EditJob from './views/EditJob'
import Popup from './views/Popup'
import Jobs from './views/Jobs'
import CreateJob from './views/CreateJob'
import Job from './views/Job'

import ScoreAndConnect from './views/ScoreandConnect'
import SettingComponent from './views/SettingComponent'
import CalendarComponent from './views/Calendar'
import MeetingComponent from './views/Calendar/Meeting'
import ContinueSearch from './views/ContinueSearch'
import Notifications from './views/Notifications'

const App = ({ dispatch,shouldFetchNotificaions }) => {
  useEffect(() => {
    dispatch(fetchUser())
  }, [])

useInterval(() => {
  getCurrentTabUrl()
  .then(url => {
    // !url.includes('notifications.html') && !shouldFetchNotificaions && dispatch(fetchNotifications())
  })
  .catch(err => {
    console.log('an error occured: ', err.message)
  })
}, 2000);

  return (
    <BrowserRouter>
      <Switch>
        <Route path='/html/jd.html' component={CreateJob} />
        <Route path='/html/edit.html' component={EditJob} />
        <Route path='/html/popup_new.html' component={Popup} />
        {/* <Route path='/html/score.html' component={ScoreAndConnect} /> */}
        <Route path='/html/calendar.html' component={CalendarComponent} />
        <Route path='/html/meeting.html' component={MeetingComponent} />
        <Route path='/html/jobs.html' component={Jobs} />
        <Route path='/html/add-job.html' component={CreateJob} />
        <Route path='/html/continue-search.html' component={ContinueSearch} />
        <Route path='/html/job.html' component={Job} />
        <Route path='/html/settings.html' component={SettingComponent} />
        <Route path='/html/notifications.html' component={Notifications} />
      </Switch>
    </BrowserRouter>
  )
}

export default connect(state => ({
  ...state.tribe.notifications
}))(App)