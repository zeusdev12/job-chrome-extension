import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import './style.css'
import {withRouter} from 'react-router-dom'
import Header from '../../components/Header'
import { Button,Input } from 'reactstrap'
import Loader from '../../components/Loader'
import TabSection from './TabSection'
import LimitSection from './LimitSection'
import AccountsSection from './AccountsSection'
import {
    initializeConnectSent,
    fetchPencilitAccount, 
    setConnectLimit
  } from '../../actions/score'
import {callLinkedinApi} from '../../utils'


const SettingComponent = ({
    dailyLimit,
    user, 
    notifications,
    fetchPencilitAccountDetail,
    dispatch, 
    history: { push },
    ...rest}) => {
    const [viewState, setviewState] = useState('My Limits')
    const [isPremium, setIsPremium] = useState(false)
    const [profileLimit, setProfileLimit] = useState(0)
    const [LinkedinIdentifier, setLinkedinIdentifier] = useState("")
    const [PencilitIdentifier, setPencilitIdentifier] = useState("")
    const [ZoomIdentifier, setZoomIdentifier] = useState("")
    const [CalendarIdentifier, setCalendarIdentifier] = useState("")


    useEffect(() => {
        getLinkedAPI()
        getConnectLimit()
        getProfileLimit()
    }, [])

    useEffect(() => {
        getProfileLimit()
    }, [isPremium])

    

    useEffect(() => {
        if (user?.name) {
            dispatch(fetchPencilitAccount(user))
        }
    }, [user])
    
    useEffect(() => {
        // if(fetchPencilitAccountDetail.isAccountIntegrated)
        //     chrome.storage.local.get(r=>setGoogleIdentifier(r['emailAddress']))
        
        setPencilitIdentifier(fetchPencilitAccountDetail?.data?.pencilit_email ? 
            fetchPencilitAccountDetail?.data?.pencilit_email : 
            fetchPencilitAccountDetail?.data?.data?.pencilit_email ? 
            fetchPencilitAccountDetail?.data?.data?.pencilit_email : "") 

        setZoomIdentifier(fetchPencilitAccountDetail?.data?.data?.zoom_email ? 
            fetchPencilitAccountDetail?.data?.data?.zoom_email : "")

        setCalendarIdentifier(fetchPencilitAccountDetail?.data?.calendar_email ? 
            fetchPencilitAccountDetail?.data?.calendar_email : 
            fetchPencilitAccountDetail?.data?.data?.calendar_email ? 
            fetchPencilitAccountDetail?.data?.data?.calendar_email : "")
        
    }, [fetchPencilitAccountDetail])
    
    const getConnectLimit = () => {
        const todaysDate = new Date()
        const todaysConnects = `${todaysDate.getDate()}-${todaysDate.getMonth()}-${todaysDate.getFullYear()}-connects`
        chrome.storage.local.get(['ConnectDailyLimitSelected', todaysConnects], function (r) {
            if (r['ConnectDailyLimitSelected']) {
                dispatch(setConnectLimit(parseInt(r['ConnectDailyLimitSelected'])))
            } else {
                dispatch(setConnectLimit(500))
            }

            if (r[todaysConnects]) {
                dispatch(initializeConnectSent(parseInt(r[todaysConnects])))
            } else {
                dispatch(initializeConnectSent(0))
            }
        })
    }

    const getProfileLimit = () => {
        chrome.storage.local.get((r) => { 
            if('DailyLimitSelected' in r)
                setProfileLimit(parseInt(r['DailyLimitSelected']))
            else if(isPremium)
                setProfileLimit(1000)
            else
                setProfileLimit(500)
        })
    }

    const getLinkedAPI = async () => {
        const {
            miniProfile:{
                publicIdentifier
            },
            premiumSubscriber
        } = await callLinkedinApi(`/voyager/api/me`,{method: 'GET'})
        if(premiumSubscriber)
            setIsPremium(true)
        if(typeof publicIdentifier === "string")
            setLinkedinIdentifier(publicIdentifier)
    }

    const handleChangeTab = (tabState) => {
        setviewState(tabState)
        getConnectLimit()
        getProfileLimit()
    }

    const handleApply = () => {
        switch (viewState) {
            case 'My Limits': 
                applyLimits()
                alert("Limits Saved!")
                return
            case 'Linked Accounts':
                return
            default:
                return
        }
    }

    const handleDiscard = () => {
        switch (viewState) {
            case 'My Limits': 
                discardLimits()
                return
            case 'Linked Accounts':
                return
            default:
                return
        }
    }

    const applyLimits = () => {
        chrome.storage.local.set({
            'ConnectDailyLimitSelected': `${dailyLimit.limit}`,
            'DailyLimitSelected': `${profileLimit}`
        })
    }

    const discardLimits = () => {
        getConnectLimit()
        getProfileLimit()
    }
    return (
        <div style={{ height: '100vh' }}>
        <Header {...user} push={push} {... notifications}/>
        <div className="mainSettingContainer">
                <div className="settingHeader">
                    <h2 className="settingHeaderTitle">
                        Settings
                    </h2>
                    {viewState === "My Limits" &&
                        <div className="settingHeaderButtonsContainer">
                            <Button 
                                className="settingHeaderButtons"
                                outline
                                color="primary"
                                onClick={handleDiscard}
                                >
                                Discard
                            </Button>
                            <Button 
                                className="settingHeaderButtons"
                                color="primary"
                                onClick={handleApply}
                                >
                                Apply
                            </Button>
                        </div>
                    }
                </div>
                <div className="settingBody">
                    <TabSection
                        viewState={viewState}
                        handleChangeTab={handleChangeTab}
                    />
                    {(() => {
                        switch (viewState) {
                            case "My Limits":
                            default:
                                return (
                                    <LimitSection
                                        isPremium={isPremium}
                                        profileLimit={profileLimit}
                                        setProfileLimit={setProfileLimit}
                                    />
                                )
                            case "Linked Accounts":
                                return (
                                    <AccountsSection 
                                        LinkedinIdentifier={LinkedinIdentifier}
                                        PencilitIdentifier={PencilitIdentifier}
                                        ZoomIdentifier={ZoomIdentifier}
                                        CalendarIdentifier={CalendarIdentifier}
                                    />
                                )
                            }
                    })()}
                </div>
        </div>
        </div >
    )
}

export default withRouter(connect(state => ({
    dailyLimit: state.score.dailyLimit,
    user: state.auth.user,
    notifications:state.tribe.notifications,
    fetchPencilitAccountDetail: state.score.fetchPencilitAccountDetail
}))(SettingComponent))
