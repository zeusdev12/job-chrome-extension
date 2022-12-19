import React, { useState } from 'react'
import { connect } from 'react-redux'

import dnIcon from '../../../../img/logo.png'
import infoIcon from '../../../../img/info.svg'
import analyticsIcon from '../../../../img/bar-chart-2.svg'
import settingsIcon from '../../../../img/settings.svg'
import calendarIcon from '../../../../img/calendar_grey.svg'
import emptyProfileIcon from '../../../../img/place_profile.png'
import chevDwon from '../../../../img/chevron-down-small.svg'
import Dropdown from '../Dropdown'
import DropdownItem from '../DropdownItem'
import { logout } from '../../actions/auth'
import { DASHBOARD_HOST } from '../../../config/index'

import './Header.css'
import { ACTIVITY_TYPES, MESSAGE_TYPES } from '../../../config/constants'

const Header = ({
  auth: {
    isAuthenticated
  },
  dispatch
}) => {
  const [ddOpen, setDdOpen] = useState(false)

  const handleClickButtonSettings = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.LOG_ACTIVITY,
      payload: ACTIVITY_TYPES.OPEN_SETTINGS
    })
    chrome.runtime.sendMessage({ type: 'OPEN_SETTINGS_PAGE' })
  }

  const handleClickIconInfo = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.LOG_ACTIVITY,
      payload: ACTIVITY_TYPES.OPEN_SUPPORT_PAGE
    })
    window.open(`${DASHBOARD_HOST}/recruiter/support`, '_blank')
    // 
  }

  const handleClickButtonAnalytics = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.LOG_ACTIVITY,
      payload: ACTIVITY_TYPES.OPEN_ANALYTICS
    })
    window.open(`${DASHBOARD_HOST}/recruiter/jobs/statistics`, '_blank')
  }

  const handleClickIconCalendar = () => {
    // chrome-extension://pljkkpkngkeokcdecjlhaddgdleefljf/html/score.html?connectionFilter=2&firstSort=title_score&firstSortOrder=desc&secondSort=skill_score&secondSortOrder=desc&isConnectPage=1&extensionJobId=998

    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.LOG_ACTIVITY,
      payload: ACTIVITY_TYPES.CALENDAR_PAGE_OPENED
    })
    chrome.tabs.create({
      url: `chrome-extension://${chrome.runtime.id}/html/calendar.html`
    })

  }

  return (
    <div className='header-root'>
      <div>
        <img src={dnIcon} alt={'icon'} />
        {!isAuthenticated &&
          <span style={{ fontSize: '17px', fontWeight: 'bold' }}>DNNae</span>
        }
      </div>
      {isAuthenticated &&
        <div>
          <img
            style={{ cursor: 'pointer' }}
            onClick={handleClickIconCalendar}
            src={calendarIcon}
            alt={'calendar'}
          />
          <img
            style={{ cursor: 'pointer' }}
            onClick={handleClickIconInfo}
            src={infoIcon}
            alt={'info_icon'}
          />
          <img
            style={{ cursor: 'pointer' }}
            src={analyticsIcon}
            alt={'analytics'}
            onClick={handleClickButtonAnalytics}
          />
          <img style={{ cursor: 'pointer' }}
            onClick={handleClickButtonSettings}
            src={settingsIcon}
            alt={'settings_icon'}
          />
          <div className='profile-icon'>
            <img src={emptyProfileIcon} alt={'profile_pic'} />
            <img
              src={chevDwon}
              alt={'chevron'}
              onClick={() => setDdOpen(!ddOpen)}
            />
            <div className='dd-container'>
              <Dropdown isOpen={ddOpen}>
                <DropdownItem
                  style={{ color: '#EF5555' }}
                  onClick={() => { dispatch(logout()) }}
                >
                  Logout
              </DropdownItem>
              </Dropdown>
            </div>

          </div>
        </div>
      }
    </div>
  )
}

export default connect(state => ({ auth: state.auth }))(Header)