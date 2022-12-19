import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import Header from '../../../components/Header'

const MeetingComponent = ({ step, user, isPopupOpened, calendar }) => {

  let [data, setData] = useState("");
  useEffect(() => {
    let _data = localStorage.getItem("pageData")
    setData(_data)
    localStorage.removeItem("pagedata");
  })
  return (
    <div style={{ height: '100vh' }}>
      <Header {...user.user} hideDD={(step === 3) && (!isPopupOpened)} tabNumber={2} push={push} />
      <div style={{width: '100%', height: 'calc(100% - 64px)', display: 'flex'}}>
        <div style={{ margin: '10% auto' }}>
          <div>The candidate should be waiting for your call at</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>{data}</div>
        </div>
      </div>
    </div >
  )
}

export default connect(state => ({
  calendar: state.calendar,
  step: state.jobDescription.step,
  user: state.auth,
  isPopupOpened: _.get(state, 'user.data.isPopupOpened', false)
}))(MeetingComponent)
