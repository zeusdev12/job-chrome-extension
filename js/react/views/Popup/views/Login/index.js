import React from 'react'
import { DASHBOARD_HOST } from '../../../../../config/index.js'
import './Login.css'

const Login = () => {
  const handleClickLoginSignup = (type) => {
    if(type === 'signup'){
      window.open(`${DASHBOARD_HOST}/users/sign_in`, '_blank')
    }
    if(type === 'login'){
      window.open(`${DASHBOARD_HOST}/users/sign_in`, '_blank')
    }
  }
  return (
    <div className='login-root'>
      <h1>Hire Smartly.</h1>
      <p>Sign up with DNNae to automate:</p>
      <div className='features'>
        <div>
          <div className='feature-icon search-icon' />
          <p>Sourcing hundreds of prospects</p>
        </div>
        <div>
          <div className='feature-icon user-icon' />
          <p>Evaluating each of them</p>
        </div>
        <div>
          <div className='feature-icon message-icon' />
          <p>Reaching out to them</p>
        </div>
        <div>
          <div className='feature-icon calendar-icon' />
          <p>Setting up meetings with them</p>
        </div>
      </div>
      <div className='login-cta'>
        <button onClick={() => handleClickLoginSignup('signup')}>Sign Up</button>
        <p>Already a User? <a href="#" onClick={() => handleClickLoginSignup('login')}>Log In</a></p>
      </div>
    </div>
  )
}

export default Login