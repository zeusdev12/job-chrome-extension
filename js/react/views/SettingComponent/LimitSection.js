import React, {useState, useEffect} from 'react'
import {Tooltip, Input, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'

import qs from 'query-string'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { manualApiCall } from '../../utils'
import alertIcon from '../../../../img/alert-circle 1.svg'


import {
    initializeConnectSent,
    setConnectLimit
  } from '../../actions/score'

const LimitDropDown = ({
    limits,
    selected,
    handleOnClick
}) => {
    const [DropState, setDropState] = useState(false)
    const toggleDrop = () => {
        setDropState(prev => !prev)
    }

    return (
        <React.Fragment>
            <ButtonDropdown 
                className='limitSelector'
                isOpen={DropState} 
                toggle={toggleDrop}>
            <DropdownToggle caret>
                {selected}
            </DropdownToggle>
            <DropdownMenu> 
                {limits.map(item => (
                    <React.Fragment>
                        <DropdownItem 
                            className="limitSelectorItem"
                            onClick={() => handleOnClick(item.value)}
                            key={item.id}>
                            {item.name}
                        </DropdownItem>
                        {/* {limits.length > limits.id &&
                            <DropdownItem 
                                className="limitSelectorDevider" 
                                divider />
                        } */}
                    </React.Fragment>
                ))}
            </DropdownMenu>
            </ButtonDropdown>
        </React.Fragment>
    )
}


const LimitSection = ({ 
    dailyLimit,
    dispatch,
    isPremium,
    profileLimit,
    setProfileLimit,
    ...rest
    }) => {

    const [messageLimitTooltip, setMessageLimitTooltip] = useState(false)

    const dailyLimitSelectOptions = [{
        id: 1,
        value: 100,
        name: "100 messages"
        }, {
        id: 2,
        value: 250,
        name: "250 messages"
        }, {
        id: 3,
        value: 500,
        name: "500 messages"
        }, {
        id: 4,
        value: 1000,
        name: "1000 messages"
    }]
    const dailyProfileLimitSelectOptions = [{
        id: 1,
        value: 100,
        name: "100 profiles"
        }, {
        id: 2,
        value: 250,
        name: "250 profiles"
        }, {
        id: 3,
        value: 500,
        name: "500 profiles"
        }, {
        id: 4,
        value: 1000,
        name: "1000 profiles (Recruiter)"
        }, {
        id: 5,
        value: 1500,
        name: "1500 profiles (Not Recomended - Select at your own risk)"
        }, {
        id: 6,
        value: 2000,
        name: "2000 profiles (Not Recomended - Select at your own risk)"
    }]


    // useEffect(() => {
    //     if(profileLimit===0)
    //         setProfileLimit(isPremium ? 1000 : 500)
    // }, [])

    const handleChangeDailyLimit = (val) => {
        dispatch(setConnectLimit(parseInt(val)))
    }

    const handleChangeProfileLimit = (val) => {
        setProfileLimit(parseInt(val))
    }
    console.log(typeof profileLimit)
   
  return (
    <div className="settingLimitSection"> 
        <div className="settingLimitHeader">
            Daily Limits
        </div>
        <div className="settingLimitBody">
            <div className="limitWarningContainer">
                <h4 className="limitWarning">
                    <img src={alertIcon}/>
                    Selecting a limit too high may result in LinkedIn blocking your account!
                </h4>
            </div>
            <div className="LimitsContainer">
                <div className="LimitsCounterContainer">
                    <div id="messageLimitsTooltip">
                        <p  className="LimitsCounterLables">
                            Messages / Connection
                        </p>
                        <p className="LimitsCounterLables">
                            Requests (daily)
                        </p>
                    </div>
                    <LimitDropDown
                        limits={dailyLimitSelectOptions}
                        selected={dailyLimitSelectOptions.filter(itm => itm.value === dailyLimit.limit)[0].name || 500}
                        handleOnClick={handleChangeDailyLimit}
                    />
                </div>
                <div className="LimitsCounterContainer">
                    <p className="LimitsCounterLables">
                        Profiles Visited (daily)
                    </p>
                    <LimitDropDown
                        limits={dailyProfileLimitSelectOptions}
                        selected={dailyProfileLimitSelectOptions.filter(itm => itm.value === profileLimit)[0]?.name || 500}
                        handleOnClick={handleChangeProfileLimit}
                    />
                    {/* <select
                        value={profileLimit}
                        onChange={handleChangeProfileLimit}
                        className='limitSelector'
                        >
                        {dailyProfileLimitSelectOptions.map(item =>
                            <option key={item.id}>{item.value}</option>
                        )}
                    </select> */}
                </div>
            </div>
        </div>
    </div>
  )
}

export default withRouter(connect(state => ({
    dailyLimit: state.score.dailyLimit,
    
}))(LimitSection))
