import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { getStep } from '../../../../actions/popup/step'
import { getCurrentJob, checkDailyLimit } from '../../../../actions/popup/home'
import { getCurrentTabUrl } from '../../../../utils/index'
// import { MESSAGE_TYPES } from '../../../../../config/constants'

import Base from './Base'
import VariantSelector from './VariantSelector'
import ApplyingFilters from './ApplyingFilters'
import FiltersApplied from './FiltersApplied'
import LinkedinRedirect from './LinkedinRedirect'

import usePrevious from '../../../../customHooks/usePrevious'
import SearchTerms from './SearchTerms'
import Search from './Search'

const Home = ({
  step: {
    isLoading,
    isDataAvailable,
    data
  },
  currentJob,
  dispatch
}) => {

  const [currentTabUrl, setCurrentTabUrl] = useState(null)
  const [applyingPreviousFilters, setApplyingPreviousFilters] = useState(false)

  useEffect(() => {
    dispatch(getStep())
    dispatch(checkDailyLimit())
    getCurrentTabUrl()
      .then(url => {
        // console.log('CURRENT TAB URL :', currentTabUrl)
        setCurrentTabUrl(url)
      })
      .catch(err => {
        console.log('an error occured: ', err.message)
        setCurrentTabUrl(null)
      })
  }, [])

  const prevStep = usePrevious(data)

  useEffect(() => {
    if (prevStep !== data && data > 1) {
      dispatch(getCurrentJob())
    }
  }, [data])

  // console.log('CURRENT TBA URL: ', currentTabUrl)

  // const baseCondition = !isLoading && isDataAvailable && currentTabUrl && (currentTabUrl.includes('linkedin.com') || currentTabUrl.includes('chrome-extension'))
  const baseCondition = true    //TODO-TEMP

  const shouldApplyFilters = (data - prevStep) === 1

  function tabUpdateListener(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tabId === tab.id) {
      setApplyingPreviousFilters(false)
    }
  }

  return (
    <React.Fragment>
      {(baseCondition && data === 1) && <Base />}
      {(baseCondition && data === 2) &&
        <VariantSelector
          updateListener={tabUpdateListener}
          setApplyingPreviousFilters={setApplyingPreviousFilters}
        />
      }
      {(baseCondition && data === 3) && <ApplyingFilters />}
      {(baseCondition && data === 4) &&
        <FiltersApplied
          shouldApplyFilters={shouldApplyFilters}
          applyingPreviousFilters={applyingPreviousFilters}
        />}
      {(baseCondition && data === 5) && <SearchTerms />}
      {(baseCondition && data === 6) && <Search />}
      {!baseCondition && <LinkedinRedirect />}
    </React.Fragment>
  )
}

export default connect(state => ({
  step: state.popup.home.step,
  currentJob: state.popup.home.currentJob
}))(Home)