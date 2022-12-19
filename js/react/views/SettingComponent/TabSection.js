import React, {useState, useEffect} from 'react'
import {Collapse, Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap'

import qs from 'query-string'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { manualApiCall } from '../../utils'


const TabModule = ({
  tabState,
  viewState,
  handleChangeTab
}) => {

  const handleOnClick = () => {
    if (viewState !== tabState)
      handleChangeTab(tabState)
  }

  return(
    <div
      className={`${viewState === tabState ?
          "active " : ""}settingTab`}
      onClick={handleOnClick} >
        {tabState}
    </div>
    )
}

const TabSection = ({ 
    viewState,
    handleChangeTab,
    ...rest
  }) => {
   
  return (
    <ul className="settingTabSection" >
        <li className="settingTabContainer">
            <TabModule 
                tabState={'My Limits'}
                viewState={viewState}
                handleChangeTab={handleChangeTab}
            />
        </li>
        <li className="settingTabContainer">
            <TabModule 
                tabState={'Linked Accounts'}
                viewState={viewState}
                handleChangeTab={handleChangeTab}
            />
        </li>
    </ul>
  )
}

export default withRouter(connect(state => ({

}))(TabSection))
