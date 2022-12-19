import React from 'react'
import { connect } from 'react-redux'

import './LimitIndicator.css'
import infoIconRed from '../../../../img/info-small-red.svg'

const LimitIndicator = ({
  dailyLimit: {
    isReached = false
  }
}) => {
  return (
    <>
      {isReached ? <div className='limit-indicator'>
        <img src={infoIconRed} alt='warning' />
        <p>
          Daily profile visit limit reached
      </p>
      </div> : null}
    </>

  )
}

export default connect(state => ({
  dailyLimit: state.popup.home.dailyLimit
}))(LimitIndicator)

