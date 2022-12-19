import React, { useState } from 'react'
import {
  Dropdown,
  DropdownToggle,
} from 'reactstrap'
import DropDown from './DropDown'
import './style.css'
import {getCurrentTabUrl} from '../../utils'

const NotificationIcon = ({ tabNumber, push, newNotifications }) => {
  const [isDdOpen, setDdOpen] = useState(false)
  let [check, setCheck] = useState(false);
  getCurrentTabUrl()
    .then(url => {
      url.includes('notifications.html') ?setCheck(true):setCheck(false)
    })
    .catch(err => {
      console.log('an error occured: ', err.message)
    })
  return (
    <>
      <Dropdown isOpen={isDdOpen} toggle={() => setDdOpen(!isDdOpen&&!check)}>
        <DropdownToggle className="NdropDownButtons" color='transparent' onClick={() => setDdOpen(!isDdOpen&&!check)}>
          <div className='notification-icon'>
            <img src={tabNumber === 3 ? "../../../img/blue-bell.svg" : "../../../img/bell.svg"} alt="n/a"
              onClick={() => setDdOpen(!isDdOpen)} />
            {newNotifications && <span className="dot"></span>}
          </div>
        </DropdownToggle>
        <DropDown push={push} isDdOpen={isDdOpen} setDdOpen={setDdOpen} />
      </Dropdown>
    </>
  )
}

export default NotificationIcon