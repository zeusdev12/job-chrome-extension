import React from 'react'
import { Container } from 'reactstrap'
import { connect } from 'react-redux'

import Header from '../../components/Header'
import JdSteps from '../../components/JdSteps'
import PickJd from '../../components/PickJd'
import ReviseJd from '../../components/ReviseJd'
import ContinueSearch from '../../components/ContinueSearch'
import './JobDescription.css'



const JobDescription = ({ step, auth, isPopupOpened }) => {
  const heading = auth.isAuthenticated ?  `Welcome ${auth.user.isPopupOpened ? 'back' : 'aboard'}, ${auth.user.name.split(' ')[0]}` :
    `Welcome aboard`

  const message = auth.isAuthenticated ? `Let's get started with your ${auth.user.isPopupOpened ? '' : 'first'} prospect search!` :
    `Let's get started with your first prospect search`
  return (
    <div>
      <Header {...auth.user} hideDD={(step === 3) && (!isPopupOpened)} tabNumber={1} push={push}/>

      <div className='jd-headerContainer'>
        <h1 className="jd-heading">{heading}</h1>
        <p className='jd-message'>{message}</p>
        <JdSteps onStep={step} />
        <hr className='jd-bottomBorder' />
      </div>

      <Container className='jd-container'>

        <div className='jd-content'>

          {step === 1 && <PickJd />}

          {step === 2 && <ReviseJd />}

          {step === 3 && <ContinueSearch />}

        </div>

      </Container>
    </div>
  )
}

export default connect(state => ({
  step: state.jobDescription.step,
  auth: state.auth,
  // user: state.user,
  isPopupOpened: _.get(state, 'user.data.isPopupOpened', false)
}))(JobDescription)