import React, { useState } from 'react'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'

import {
  DASHBOARD_HOST
} from '../../../config/index.js'

import './UserAvatar.css'

const ddItems = [{
  id: 1,
  name: 'Settings',
  link: `${window.location.origin}/html/settings.html?isSettingsPage=1`
}, {
  id: 2,
  name: 'Analytics',
  link: `${DASHBOARD_HOST}/recruiter/jobs/statistics`
}, {
  id: 3,
  name: 'Support',
  link: `${DASHBOARD_HOST}/recruiter/support`
}, {
  id: 4,
  name: 'Logout',
  link: '/'
}]


const UserAvatar = (user) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const logout = () => {

    // console.log('LOGOUT FUNCTION ')
    chrome.storage.local.get(['recruiterID', 'isPopupOpened', 'GA_F_logout'], function (result) {

      chrome.storage.local.clear(function () {
        const error = chrome.runtime.lastError
        if (error) {
          alert(error.message)
        } else {
          chrome.storage.local.set({
            'GA_F_logout': true,
            isPopupOpened: result.isPopupOpened
          }, function () {
            window.open(`${DASHBOARD_HOST}/recruiter/home`, '_self')
          })
        }
      })
      // if (result.recruiterID) {
      //   // var rID = result.recruiterID;

      //   if (result.GA_F_logout) {
      //     // Do Nothing
      //   }
      //   else {
      //     // ga('send', 'event', '11. Logout', '11. Logout - Click', rID);

      //     chrome.storage.local.clear(function () {
      //       const error = chrome.runtime.lastError
      //       if (error) {
      //         alert(error.message)
      //       } else {
      //         chrome.storage.local.set({
      //           'GA_F_logout': true,
      //           isPopupOpened: result.isPopupOpened
      //         }, function () {
      //           window.open('https://caramel-world-255706.web.app/recruiter/home')
      //         })
      //       }
      //     })

      //   }
      // }

    });
  }

  const handleClickItemDd = (item) => {
    if (item.name !== 'Logout') {
      window.open(item.link, '_newtab')
    } else {
      console.log('logging out')
      logout()
      // alert('handle logout here')
    }
  }
  return (
    <div className='user-avatar'>
      <img src="../../../img/user.svg" alt="n/a" />
      <Dropdown isOpen={dropdownOpen} toggle={() => { setDropdownOpen(!dropdownOpen) }}>
        <DropdownToggle className='dd-toggle' caret>
          {user && user.name && <p>Hi, {user.name.split(' ')[0]}</p>}
        </DropdownToggle>
        <DropdownMenu className='dd-menu'>
          {ddItems.map((item, i) =>
            <DropdownItem
              key={item.id || i}
              className="UserAvatarDDItem"
              onClick={() => handleClickItemDd(item)}
              style={(i === ddItems.length - 1) ? { color: '#EF5555' } : {}}
            >
              {item.name}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

export default UserAvatar