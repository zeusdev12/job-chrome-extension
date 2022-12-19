import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { MESSAGE_TYPES, ACTIVITY_TYPES } from '../../../config/constants'
import Layout from '../../components/Layout'
import Loader from '../../components/Loader'

import Home from './views/Home'
import Login from './views/Login'
const App = ({
  auth: {
    isAuthenticated,
    isLoading
  }
}) => {

  useEffect(() => {
    chrome.runtime.connect()
    chrome.storage.local.set({ 'isPopupOpened': true })

    // console.log('popup mounted')


    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.LOG_ACTIVITY,
      payload: ACTIVITY_TYPES.POPUP_OPENED
    })

  }, [])

  return (
    <Layout>
      {isLoading &&
        <div style={{
          textAlign: 'center',
          marginTop: '100px',
          marginBottom: '100px'
        }}
        >
          <Loader width='36px' height='36px' color='#297AF7' />
        </div>
      }
      {(!isLoading && isAuthenticated) && <Home />}
      {(!isLoading && !isAuthenticated) && <Login />}
    </Layout>
  )
}


export default connect(state => ({ auth: state.auth }))(App)