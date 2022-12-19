import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Loader from '../Loader'

import { setStep } from '../../actions/jobDescription'

import './SetCompanyPreferences.css'
import { manualApiCall } from '../../utils'


const SetCompanyPreferences = ({
  dispatch
}) => {

useEffect(() => {
    
      dispatch(setStep(3))
      
}, [])

  // console.log('revise: ', revise)

  return (
    <div className='pick-jd-root-container'>
    <div className='pick-jd-root'>
     
    </div>
    </div>
  )
}

export default connect(state => ({
    
}))(SetCompanyPreferences)