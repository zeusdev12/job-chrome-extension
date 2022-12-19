import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Loader from '../Loader'

import { setSelectedJd, setJdText, fetchNer, setStep } from '../../actions/jobDescription'

import './PickJd.css'
import { manualApiCall } from '../../utils'


const JdText = ({
  text,
  dispatch,
  onClickChoose,
  isLoading,
  isDataAvailable
}) => {
  useEffect(() => {
    if (isDataAvailable) {
      //dispatch step
      dispatch(setStep(5))
    }
  }, [isDataAvailable])
  return (
    <div className='jd-text'>
      <textarea
        value={text}
        placeholder='Paste or compose your JD'
        onChange={(e) => { dispatch(setJdText(e.target.value)) }}
      />
      <button
        disabled={text.trim() === ''}
        onClick={() => {
          if (!isLoading) {
            onClickChoose()
          }
        }}> {isLoading ? <Loader /> : 'Choose this JD'}</button>
    </div>
  )
}

const Sidebar = ({
  selectedJd,
  jds,
  dispatch
}) => {
  return (
    <div className='jd-sidebar-root'>
      {
        jds.map((item, i) =>
          <div
            className={(selectedJd === item.id) ? "jd-sidebar-item jd-sidebar-item-active" : "jd-sidebar-item"}
            key={item.id || i}
            onClick={() => dispatch(setSelectedJd({ id: item.id, text: item.text }))}
          >
            {item.title}
          </div>)
      }
    </div>
  )
}

const PickJd = ({
  dispatch,
  jds,
  selectedJd,
  selectedJdText,
  isLoading,
  isDataAvailable
}) => {

  // console.log('revise: ', revise)
  const [statusChecking, setStatusChecking] = useState(false)

  const handleClickChoose = async () => {
    try {
      setStatusChecking(true)
      const status = await manualApiCall(`/check-status`)
      setStatusChecking(false)
      if (status.isBlocked) {
        alert('Please contact admin@dnnae.com to access this feature.')
      } else {
        dispatch(fetchNer(selectedJdText))
      }
    } catch (e) {
      setStatusChecking(false)
    }
  }

  return (
    <div className='pick-jd-root-container'>
    <div className='pick-jd-root'>
      <Sidebar
        selectedJd={selectedJd}
        jds={jds}
        dispatch={dispatch}
      />
      <JdText
        text={selectedJdText}
        dispatch={dispatch}
        onClickChoose={() => handleClickChoose(selectedJdText)}
        isLoading={isLoading || statusChecking}
        isDataAvailable={isDataAvailable}
        dispatch={dispatch}
      />
    </div>
    </div>
  )
}

export default connect(state => ({
  ...state.jobDescription.choose,
  isLoading: state.jobDescription.revise.isLoading,
  isDataAvailable: state.jobDescription.revise.isDataAvailable,
}))(PickJd)