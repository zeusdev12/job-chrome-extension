import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import Loader from '../../../../components/Loader'
import { setPopupStep } from '../../../../actions/popup/step'
import { sendMessageToActiveTab } from '../../../../utils/index'
import { MESSAGE_TYPES } from '../../../../../config/constants'

import BackNav from '../../../../components/BackNav'

import './home.css'

const ApplyingFilters = ({
  dispatch,
  currentJob,
  shouldApplyFilters,
  applyingPreviousFilters
}) => {

  const [isSetting, setIsSetting] = useState(false)

  // useEffect(() => {
  //   chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  //     if (changeInfo === 'complete') {
  //       alert('tab updated yo')
  //     }
  //   })
  // }, [])
  // useEffect(() => {
  //   alert('applied filters mounted....')
  // }, [])

  useEffect(async () => {
    try {
      if (currentJob.isDataAvailable && shouldApplyFilters) {

        const { filtersApplied } = await sendMessageToActiveTab({ type: MESSAGE_TYPES.CHECK_FILTERS })
        // console.log('FILTERS APPLIED: ', filtersApplied)


        if (!filtersApplied) {
          setIsSetting(true)
          await sendMessageToActiveTab({
            type: MESSAGE_TYPES.APPLY_FILTERS,
            payload: currentJob.job
          })

          chrome.tabs.onUpdated.addListener(tabUpdateListener)


          function tabUpdateListener(tabId, changeInfo, tab) {
            if (changeInfo.status === 'complete') {
              setIsSetting(false)
            }
          }


        }
      }
    } catch (e) {
      setIsSetting(false)
    }

  }, [currentJob.isDataAvailable, shouldApplyFilters])

  const handleClickContinue = () => {

    const tagFilterMap = {
      "COMPANY_INDUSTRY_SPECIALTIES": "industry",
      "JOB_LOCATION": "geoUrn"
    }

    const filtersToBeApplied = currentJob.job.jobArray.filter(item =>
      ["COMPANY_INDUSTRY_SPECIALTIES", "JOB_LOCATION"].includes(item.tag))
      .reduce((obj, item) => {
        return {
          ...obj,
          [tagFilterMap[item.tag]]: item.data.map(i => `${i.id}`).filter(item => item !== 'undefined')
        }
      }, {})

    // console.log('FILTERS TO BE APPLIED ARE: ', filtersToBeApplied)



    chrome.tabs.query({
      currentWindow: true,
      active: true
    }, function (tabs) {
      // console.log('========================================')
      // console.log(tabs[0])
      const url = tabs[0].url

      const [base, qs] = url.split('?')

      const filtersApplied = qs.split('&').map(item => {
        const [key, val] = item.split('=')

        return { [key]: decodeURIComponent(val) }

      }).filter(i => i).reduce((obj, item) => ({ ...obj, ...item }), {})

      console.log('FILTERS APPLIED ARE: ', filtersApplied)


      const required = {
        geoUrn: filtersApplied.geoUrn ? JSON.parse(filtersApplied.geoUrn) : [],
        industry: filtersApplied.industry ? JSON.parse(filtersApplied.industry) : []
      }



      console.log('REQUIRED FILTERS ARE: ', filtersToBeApplied)


      const geoCheck = filtersToBeApplied.geoUrn.every(item => _.get(required, 'geoUrn', []).includes(item))
      const industryCheck = filtersToBeApplied.industry.every(item => _.get(required, 'industry', []).includes(item))

      const areFiltersEqual = geoCheck && industryCheck //_.isEqual(filtersToBeApplied, required)
      console.log('ARE FILTERS EQUAL? ', areFiltersEqual)
      
      if (areFiltersEqual || !((filtersToBeApplied.geoUrn && filtersToBeApplied.geoUrn.length > 0) && (filtersToBeApplied.industry && filtersToBeApplied.industry.length > 0))) {
        dispatch(setPopupStep(5))
      } else {
        const stringifiedFiltersToBeApplied = Object.keys(filtersToBeApplied).reduce((obj, item) => {
          return {
            ...obj,
            [item]: encodeURIComponent(JSON.stringify(filtersToBeApplied[item]))
          }
        }, {})


        const stringifiedFiltersApplied = Object.keys(filtersApplied).reduce((obj, item) => {
          return {
            ...obj,
            [item]: encodeURIComponent(JSON.stringify(filtersApplied[item])).replace(/%22/g, '')
          }
        }, {})

        const filterObj = {
          ...stringifiedFiltersApplied,
          ...stringifiedFiltersToBeApplied
        }

        const str = Object.keys(filterObj).map(item => {
          return `${item}=${filterObj[item]}`
        }).join('&').replace(/%22/g, '"')

        // console.log('FILTER STRING IS: ', str)
        const urlToRedirect = [base, str].join('?')

        // console.log('URL TO REDIRECT TO: ', urlToRedirect)
        // }


        setIsSetting(true)
        chrome.tabs.update(tabs[0].id, { url: urlToRedirect })
        chrome.tabs.onUpdated.addListener(tabUpdateListener)

        function tabUpdateListener(tabId, changeInfo, tab) {
          if (changeInfo.status === 'complete') {
            setIsSetting(false)
            dispatch(setPopupStep(5))
          }
        }

      }
    })


  }

  return (
    <div>
      <BackNav onClickButtonBack={() => { dispatch(setPopupStep(1)) }} />
      <p className='sub-heading'>Apply Additional Filters</p>
      <p
        className='info-text'
        style={{ marginBottom: '80px' }}
      >
        You can add any additional filters at this step to further refine your search.
      </p>
      <button
        onClick={handleClickContinue}
        className='nxt-btn'
        disabled={isSetting || applyingPreviousFilters}
      >
        {(isSetting || applyingPreviousFilters) ? <Loader /> : 'Continue'}
      </button>
    </div>
  )
}

export default connect(state => ({
  currentJob: state.popup.home.currentJob
}))(ApplyingFilters)
