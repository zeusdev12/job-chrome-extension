import React, { useState, useEffect } from 'react'
import UserAvatar from '../UserAvatar'
import './Header.css'

import NotificationIcon from '../NotificationIcon'

const Header = (props) => {
const { hideDD = false, tabNumber, push, newNotifications } = props

  return (
    <div className="header">
      <div>
        <img src="../../../img/navbar-logo.svg" />
        <span className={tabNumber === 1 ? "header-link" : "header-link-inactive"} onClick={() => push(`/html/jobs.html`)} >Jobs</span>
        <span className={tabNumber === 2 ? "header-link" : "header-link-inactive"} onClick={() => push(`/html/calendar.html`)}>Calendar</span>
      </div>
      {!hideDD &&
        <div style={{display:'flex'}}>
          {/* <NotificationIcon {...props} tabNumber={tabNumber} push={push} newNotifications={newNotifications}/> */}
          <UserAvatar {...props} />
        </div>
      }
    </div>
  )
}

export default Header