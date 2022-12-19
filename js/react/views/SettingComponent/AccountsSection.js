import React, {useState, useEffect} from 'react'
import {Tooltip, Collapse, Nav, NavItem, NavLink, TabContent, TabPane, Input} from 'reactstrap'

import qs from 'query-string'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { manualApiCall } from '../../utils'
import LinIcon from '../../../../img/LinLogo.svg'
import PenIcon from '../../../../img/penLogo.svg'
import GoogleIcon from '../../../../img/googleLogo.svg'
import OutlookIcon from '../../../../img/outlookIcon.png'
import ZoomLogo from '../../../../img/zoom.svg'


const AccountModule = ({
    imgSource,
    accountName,
    nameContext,
    accountType,
    accountValue,
    unlinkLabel,
    ...rest
}) => {


    return(
        <li className="accountContainer">
            <span className="iconContainer">
                <img
                    className="accountIcon"
                    src={imgSource}
                />
                <label className="accountLabel">
                    {accountName}
                </label>
                <label className="accountLabelContext">
                    {nameContext}
                </label>
            </span>
            <label className="accountTypeLabel">
                {accountType}
            </label>
            <Input
                className="accountInput"
                disabled={true}
                defaultValue={accountValue}
            />
            {/* <a 
                className="unlinkLabel"
            >
                {unlinkLabel}
            </a> */}
        </li>
    )
}

const AccountsSection = ({ 
    dispatch,
    LinkedinIdentifier,
    PencilitIdentifier,
    ZoomIdentifier,
    CalendarIdentifier,
    ...rest
    }) => {

   
  return (
    <div className="settingLimitSection"> 
        <div className="settingLimitHeader">
            Linked Accounts
        </div>
        <div className="settingLimitBody">
            <ul className="accountsList">
                <AccountModule 
                    imgSource = {LinIcon}
                    accountName = "Linked In"
                    nameContext = ""
                    accountType = "Profile Link"
                    accountValue = {`https://www.linkedin.com/in/${LinkedinIdentifier}/`}
                    unlinkLabel = {""}
                />
                <AccountModule 
                    imgSource = {PenIcon}
                    accountName = "Pencilit"
                    nameContext = ""
                    accountType = "Account Email"
                    accountValue = {PencilitIdentifier}
                    unlinkLabel = {"Unlink"}
                />
                <AccountModule 
                    imgSource = {ZoomLogo}
                    accountName = "Zoom"
                    nameContext = "(Linked with Pencilit)"
                    accountType = "Account Email"
                    accountValue = {ZoomIdentifier}
                    unlinkLabel = {"Unlink from Pencilit"}
                />
                {CalendarIdentifier.includes("gmail") &&            
                    <AccountModule 
                        imgSource = {GoogleIcon}
                        accountName = "Google"
                        nameContext = "(Linked with Pencilit)"
                        accountType = "Account Email"
                        accountValue = {CalendarIdentifier}
                        unlinkLabel = {"Unlink from Pencilit"}
                    />}
                {CalendarIdentifier.includes("hotmail") &&            
                    <AccountModule 
                        imgSource = {OutlookIcon}
                        accountName = "Outlook"
                        nameContext = "(Linked with Pencilit)"
                        accountType = "Account Email"
                        accountValue = {CalendarIdentifier}
                        unlinkLabel = {"Unlink from Pencilit"}
                    />}
            </ul>
        </div>
    </div>
  )
}

export default withRouter(connect(state => ({
    dailyLimit: state.score.dailyLimit,
    
}))(AccountsSection))
