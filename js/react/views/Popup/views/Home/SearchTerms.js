import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import BackNav from '../../../../components/BackNav'
import Loader from '../../../../components/Loader'
import { setPopupStep } from '../../../../actions/popup/step'
import trashSmall from '../../../../../../img/trash-small.svg'
import playBtn from '../../../../../../img/play.svg'
// import { store } from '../../../../store.js'
// import useInterval from 'use-interval'
import './home.css'
import {
  fetchSearchTerms,
  deleteSearchTerm,
  setSearchTermValue,
  setEditedSearchTerms,
  addNewSearchTerm
} from '../../../../actions/popup/searchTerms'

import { ACTIVITY_TYPES, MESSAGE_TYPES } from '../../../../../config/constants'
import { getCurrentTabUrl, sendMessageToActiveTab, simulateTimeout } from '../../../../utils/index'


const SearchTerm = ({
  searchTerm,
  index,
  onClickButtonDelete,
  handleChange,
  handleBlur,
  serial
}) => {

  const rows = Math.ceil(searchTerm.searchTermValue.length / 33)
  // console.log('ROWS ARE: ', rows)

  // useEffect(() => {
  //   console.log('IM CALLED YAYYYY')
  // }, [])
  // useInterval(() => {
  //   console.log('STORE IS: ', store)
  // }, 500)
  return (

    <div className='st-root'>
      <div className='st-head'>
        <p className='sub-heading'>Search Term {serial}</p>
        <img
          src={trashSmall}
          alt='trash'
          onClick={() => onClickButtonDelete(searchTerm)}
          onBlur={handleBlur}
        />
      </div>
      <textarea
        className='st-content'
        rows={rows}
        value={searchTerm.searchTermValue}
        onChange={(e) => handleChange({ index, value: e.target.value })}
        onBlur={handleBlur}
      />
    </div>

  )
}

const SearchTerms = ({
  dispatch,
  currentJob,
  searchTerms
}) => {

  const [isStarting, setIsStarting] = useState(false)

  useEffect(() => {
    if (currentJob.isDataAvailable) {
      dispatch(fetchSearchTerms(currentJob.job))
      // console.log('current job is: ', currentJob)
      //check indexed db for search terms against this job
      //if not found, calculate search terms, store in index db and display
    }
  }, [currentJob.isDataAvailable])

  const handleClickButtonDelete = (st) => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.LOG_ACTIVITY,
      payload: ACTIVITY_TYPES.DELETE_SEARCH_TERM
    })
    dispatch(deleteSearchTerm({
      job: currentJob.job,
      searchTermName: st.searchTermValue
    }))
  }

  const handleChangeSearchTerm = (payload) => {
    dispatch(setSearchTermValue(payload))
  }

  const handleBlurSearchTerm = () => {
    // console.log('INSIDE BLUR searchTerms are: ', searchTerms)
    // console.log('GOING TO DISPATCH SEARCH TERMS EDITED')
    dispatch(setEditedSearchTerms(currentJob.job, searchTerms.data))
  }

  const handleClickStartSearch = async () => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.LOG_ACTIVITY,
      payload: ACTIVITY_TYPES.START_SEARCH_CLICKED
    })
    setIsStarting(true)

    await simulateTimeout(100)

    const tabUrl = await getCurrentTabUrl()

    //this will start initialization thread
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.INITIALIZE_SEARCH,
      payload: {
        jobId: currentJob.job.jobID,
        tabUrl: tabUrl
      }
    })

    await simulateTimeout(300)

    //this will start collection thread
    sendMessageToActiveTab({
      type: MESSAGE_TYPES.START_COLLECTION,
      payload: {
        jobId: currentJob.job.jobID
      }
    })

    //this will start AI enhancing thread
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.START_AI_ENHANCING,
      payload: {
        jobId: currentJob.job.jobID
      }
    })

    setIsStarting(false)
    dispatch(setPopupStep(6))
  }

  let stIndex = 0

  return (
    <div>
      <BackNav
        onClickButtonBack={() => dispatch(setPopupStep(1))}
        subTitle={'Revise Search Terms'}
      />
      <p className='sub-heading'>Verify Search Terms</p>
      <p className='info-text'>We extracted these search terms from your job description and criteria:</p>

      <div style={{ marginBottom: '99px' }}>
        {searchTerms.data.map((item, i) => {

          if (!item.isDeleted) {
            stIndex += 1
          }


          return item.isDeleted ? null :
            <React.Fragment key={item.id || i}>
              <SearchTerm
                searchTerm={item}
                index={i}
                serial={stIndex}
                onClickButtonDelete={handleClickButtonDelete}
                handleChange={handleChangeSearchTerm}
                handleBlur={handleBlurSearchTerm}
              />
              <hr className='' />
            </React.Fragment>
        }
        )}
      </div>
      <div className='st-sticky-footer'>
        {/* <button >Add Search Term</button> */}
        <p
          style={{
            color: '#297AF7',
            margin: 0,
            cursor: 'pointer'
          }}
          onClick={() => {
            chrome.runtime.sendMessage({
              type: MESSAGE_TYPES.LOG_ACTIVITY,
              payload: ACTIVITY_TYPES.ADD_SEARCH_TERM
            })
            dispatch(addNewSearchTerm())
          }}>
          Add Search Term
          </p>
        <hr />
        <button className='nxt-btn' onClick={handleClickStartSearch}>
          {isStarting ? <Loader /> :
            <>
              <img style={{ marginRight: '8px' }} src={playBtn} alt='play' />
        Start Search
          </>
          }

        </button>
      </div>

    </div>
  )
}

export default connect(state => ({
  currentJob: state.popup.home.currentJob,
  searchTerms: state.popup.home.searchTerms
}))(SearchTerms)