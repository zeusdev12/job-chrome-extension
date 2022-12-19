import React, { useState, useEffect, useCallback } from "react";
import { Button, Input, Label, Tooltip } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import qs from 'query-string'

import useInterval from 'use-interval'

import * as ActionTypes from '../../../../actions/score'

import { connect } from 'react-redux'

import {
  setMessageValue,
  // setMessageSetting,
  setFollowUpDays,
  toggleMessageEnabled,
  getMessageSetting,
  incrementConnectSent

} from '../../../../actions/score'
import BackButtonIcon from '../../../../../../img/BackButton.svg'
import alertIcon from '../../../../../../img/alert-circle-3.svg'

import TagButtonComponent from './TagButtonComponent'
import Loader from '../../../../components/Loader'

import SendMessage from './SendMessage'
import EditAndSend from './EditAndSend'

import {
  manualApiCall,
  callLinkedinApi,
  sendMessageFirstConnection,
  getRandomInt
} from '../../../../utils/index'

import { toast } from 'react-toastify'

import './style.css'
import MessagePreview from "./MessagePreview";



// const SendMessageStatus = ({
//   isSending,
//   isSent,
//   total,
//   sentCount,
//   onClickDismiss,
//   onClickStop,
//   isStopped,
//   isExceeded
// }) => {
//   return (

//   )
// }


const ComposeMessage = (props) => {

  const [modal, setModal] = useState(false);
  const [previewMessage, setPreviewMessage] = useState('');
  const [messageType, setMessageType] = useState(false)

  const toggle = () => setModal(!modal);

  const [messageEnabled, setMessageEnabled] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [sentCount, setSentCount] = useState(0)
  // const [sendStatusVisible, setSendStatusVisibility] = useState(false)
  const [isStopped, setIsStopped] = useState(false)
  const [recepientIndex, setRecepientIndex] = useState(0)
  const [receivers, setReceivers] = useState([])

  // const [sendMessageViewActive, setSendMessageViewActive] = useState(false)

  const [currentView, setCurrentView] = useState(null)
  // 'send' 'edit
  const [tooltipOpenFu1, setTooltipOpenFu1] = useState(false)
  const [tooltipOpenFu2, setTooltipOpenFu2] = useState(false)
  const [tooltipOpenFu1Count, setTooltipOpenFu1Count] = useState(false)
  const [tooltipOpenFu2Count, setTooltipOpenFu2Count] = useState(false)
  const [sendMessageInterval, setSendMessageInterval] = useState(5000)
  const [editedMessageInterval, setEditedMessageInterval] = useState(5000)
  const [limitExceeded, setLimitExceeded] = useState(false)
  const [requestRateExceeded, setRequestRateExceeded] = useState(false)
  const [failedMessages, setFailedMessages] = useState([])

  const [editedMessages, setEditedMessages] = useState({})
  const [selectedFailed, setSelectedFailed] = useState([])
  const [isSendingEdited, setIsSendingEdited] = useState(false)
  const [editedReceivers, setEditedReceivers] = useState([])
  const [editedRecepientIndex, setEditedRecepientIndex] = useState(0)
  const [editedSentCount, setEditedSentCount] = useState(0)
  const [isEditedSent, setIsEditedSent] = useState(false)

  const [msgCharLimitCounter, setmsgCharLimitCounter] = useState(0)
  const [fu1CharLimitCounter, setfu1CharLimitCounter] = useState(0)
  const [fu2CharLimitCounter, setfu2CharLimitCounter] = useState(0)
  const [msgCharLimitFlag, setmsgCharLimitFlag] = useState(0)
  const [fu1CharLimitFlag, setfu1CharLimitFlag] = useState(0)
  const [fu2CharLimitFlag, setfu2CharLimitFlag] = useState(0)


  const [myTimeout, setMyTimeout] = useState(null)


  const [msgCursorPos, setmsgCursorPos] = useState(0)
  const [fu1CursorPos, setfu1CursorPos] = useState(0)
  const [fu2CursorPos, setfu2CursorPos] = useState(0)

  useInterval(() => {
    sendMessage()
  }, (isSending && (recepientIndex < receivers.length)) && !limitExceeded && !requestRateExceeded ? sendMessageInterval : null)


  useInterval(() => {
    sendEditedMessage()
  }, (isSendingEdited && (editedRecepientIndex < editedReceivers.length) && !limitExceeded && !requestRateExceeded) ? editedMessageInterval : null)
  // const prevSentCount = usePrevious(sentCount)
  // let isSendStopped = false

  const {
    // viewState,
    userName,
    setView,
    connectMessage,
    messageSettings: {
      data: {
        sampleMessage,
        followUpMessage1Enabled,
        followUpMessage1Template,
        followUpMessage1Days,
        followUpMessage1Type,

        followUpMessage2Enabled,
        followUpMessage2Template,
        followUpMessage2Days,
        followUpMessage2Type,

        connectMessageFirstDegree,
        followUp1MessageFirstDegree,
        followUp2MessageFirstDegree
      },
    },
    dispatch,
    selected,
    location: { search },
    data,
    user,
    setSelectAllProspectsFlag,
    dailyLimit,
    jobData,
    connectionType,
    connectionMessage
  } = props

  const connectMessageSample = connectionType === 2 ? sampleMessage : connectMessageFirstDegree,
    followUp1Message = connectionType === 2 ? followUpMessage1Template : followUp1MessageFirstDegree,
    followUp2Message = connectionType === 2 ? followUpMessage2Template : followUp2MessageFirstDegree

  const params = qs.parse(search)


  useEffect(() => {
    window.scrollTo(0, 0);

    dispatch(getMessageSetting(params.jId))
  }, [])


  useEffect(() => {
    if (messageType) {
      dispatch(setMessageValue({ connectionType: 1, type: 'connect', value: sampleMessage }))
      dispatch(setMessageValue({ connectionType: 1, type: 'fu1', value: followUpMessage1Template }))
      dispatch(setMessageValue({ connectionType: 1, type: 'fu2', value: followUpMessage2Template }))
    }
  }, [messageType])

  useEffect(() => {

    (isSent || limitExceeded || requestRateExceeded)
      &&
      manualApiCall('/api/auth/user/activity/store',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "actionName": "SENT_MESSAGE",
            "jobId": params.jId,
            "count": sentCount
          })
        })


  }, [isSent, limitExceeded, requestRateExceeded])


  // if (connectionType === 2 || messageType) {
  //   connectMessageSample = sampleMessage
  //   followUp1Message = followUpMessage1Template
  //   followUp2Message = followUpMessage2Template
  // }
  // else {
  //   connectMessageSample = connectMessageFirstDegree
  //   followUp1Message = followUp1MessageFirstDegree
  //   followUp2Message = followUp2MessageFirstDegree
  // }


  useEffect(() => {
    setmsgCharLimitCounter(connectMessageSample.length)
  }, [connectMessageSample])
  useEffect(() => {
    setfu1CharLimitCounter(followUp1Message.length)
  }, [followUp1Message])
  useEffect(() => {
    setfu2CharLimitCounter(followUp2Message.length)
  }, [followUp2Message])

  useEffect(() => {
    if (myTimeout) {
      clearTimeout(myTimeout)
      setMyTimeout(setTimeout(timeoutHandler, 300))
    } else {
      setMyTimeout(setTimeout(timeoutHandler, 300))
    }
  }, [
    connectMessageSample,
    followUp1Message,
    followUp2Message,
    connectMessageFirstDegree,
    followUp1MessageFirstDegree,
    followUp2MessageFirstDegree
  ])


  useEffect(() => {
    if (followUpMessage1Enabled)
      dispatch(toggleMessageEnabled(connectionType, 'fu1'))

  }, [!(messageEnabled)])

  useEffect(() => {
    if (followUpMessage2Enabled)
      dispatch(toggleMessageEnabled(connectionType, 'fu2'))

  }, [!(messageEnabled && followUpMessage1Enabled)])


  const timeoutHandler = () => {
    const params = qs.parse(search)
    const payload = {
      jobID: params.jId,
      sampleMessage,

      followUpMessage1Enabled,
      followUpMessage1Template,
      followUpMessage1Days: followUpMessage1Days || 2,
      followUpMessage1Type,

      followUpMessage2Enabled,
      followUpMessage2Template,
      followUpMessage2Days: followUpMessage2Days || 6,
      followUpMessage2Type,

      connectMessageFirstDegree,
      followUp1MessageFirstDegree,
      followUp2MessageFirstDegree

    }

    console.log('hello world im here....', payload)
    manualApiCall(`/api/auth/job/meeting/setting/set`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  }


  const showToast = ({
    type,
    message,
    pauseTime = 2
  }) => {

    console.log('PAUSE TIME: ', pauseTime)

    //types, error, success, info

    const borderBottom = {
      error: '5px solid #EF5555',
      success: '5px solid #63B780',
      info: 'none'
    }

    toast(message, {
      position: "bottom-right",
      autoClose: pauseTime * 1000,
      hideProgressBar: type != 'info',
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      closeButton: false,
      style: {
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        borderBottom: borderBottom[type]
      },
      progressStyle: {
        backgroundColor: '#297AF7',
        background: '#297AF7',
        color: '#297AF7'
      }

    });
  }

  const handleChange = (e, type) => {
    const value = e.target.value
    if ((value.length <= 280 && type === "connect") || ['fu1', 'fu2'].includes(type)) {
      dispatch(setMessageValue({ connectionType, type, value }))
    }
    else {
      if (type === "connect") {
        setmsgCharLimitFlag(true)
        setTimeout(() => {
          setmsgCharLimitFlag(false)
        }, 500)
      }
      else if (type === "fu1") {
        setfu1CharLimitFlag(true)
        setTimeout(() => {
          setfu1CharLimitFlag(false)
        }, 500)
      }
      else if (type === "fu2") {
        setfu2CharLimitFlag(true)
        setTimeout(() => {
          setfu2CharLimitFlag(false)
        }, 500)
      }
    }
  }

  const incrementConnectCount = () => {
    const todaysDate = new Date()
    const key = `${todaysDate.getDate()}-${todaysDate.getMonth()}-${todaysDate.getFullYear()}-connects`

    chrome.storage.local.get(key, function (r) {
      if (r[key]) {
        dispatch(incrementConnectSent())
        chrome.storage.local.set({ [key]: r[key] + 1 })
      } else {
        dispatch(incrementConnectSent())
        chrome.storage.local.set({ [key]: 1 })
      }
    })
  }

  const handleClickSend = async () => {

    setCurrentView('send')

    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "actionName": "SEND_MESSAGE",
          "jobId": params.jId
        })
      })


    const payload = {
      jobID: params.jId,
      sampleMessage,

      followUpMessage1Enabled,
      followUpMessage1Template,
      followUpMessage1Days: followUpMessage1Days || 2,
      followUpMessage1Type,

      followUpMessage2Enabled,
      followUpMessage2Template,
      followUpMessage2Days: followUpMessage2Days || 6,
      followUpMessage2Type,

      connectMessageFirstDegree,
      followUp1MessageFirstDegree,
      followUp2MessageFirstDegree
    }

    try {
      const recepients = data.filter(item => selected.includes(item.id))

      console.log(recepients)
      // setSendStatusVisibility(true)
      setIsSending(true)
      setIsSent(false)
      setSentCount(0)

      await manualApiCall(`/api/auth/job/meeting/setting/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const messageSettings = await manualApiCall(`/api/auth/job/meeting/setting/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobID: params.jId })
      })

      dispatch({
        type: ActionTypes.GET_MESSAGE_SETTING_SUCCESS,
        payload: messageSettings
      })

      setReceivers(recepients)

    } catch (e) {
      console.log('ERROR: ', e.message)
    }
  }

  const handleClickSendEdited = () => {
    const editedReceivers = failedMessages
      .map(item => item.recepient)
      .filter(item => selectedFailed.includes(item.id))

    setEditedReceivers(editedReceivers)
    setIsSendingEdited(true)
    setIsEditedSent(false)
  }


  const sendMessage = async () => {
    try {

      let degree

      const isLimitExceeded = parseInt(dailyLimit.sent, 10) >= parseInt(dailyLimit.limit, 10)

      if (isLimitExceeded) {
        setLimitExceeded(true)
        setIsSending(false)
      }

      if (!isLimitExceeded) {

        const recepient = receivers[recepientIndex]
        const params = qs.parse(search)

        const networkInfo = await callLinkedinApi(`/voyager/api/identity/profiles/${recepient.publicIdentifier}/networkinfo`, {
          method: 'GET'
        })

        const distanceDegreeMap = {
          'DISTANCE_1': '1st',
          'DISTANCE_2': '2nd',
          'DISTANCE_3': '3rd+'
        }

        degree = distanceDegreeMap[networkInfo.distance.value]

        // console.log("========== before ==============: ", { connectMessageFirstDegree, 
        //   sampleMessage })

        let template = degree === '1st' ? connectMessageFirstDegree : sampleMessage

        // console.log('CON DEG AND SAMPLE MSSAGE: ', { degree, template })

        const varsUsedInTemplate = template.match(/{{.(\w+)}}/g)

        const varPropMap = {
          '{{.First_Name}}': 'firstName',
          '{{.Last_Name}}': 'lastName',
          '{{.Full_Name}}': 'full_name',
          '{{.Current_Title}}': 'headline',
          '{{.Job_Title}}': 'jobTitle',
          '{{.My_Name}}': 'name',
          '{{.My_First_Name}}': 'name',
          '{{.My_Full_Name}}': 'name',
          '{{.User_Name}}': 'name',
          '{{.School_Name}}': 'schoolName',
          '{{.Current_Company}}': 'company'
        }


        const variables = {
          // firstName: recepient.firstName,
          firstName: recepient.firstName,
          lastName: recepient.lastName,
          full_name: recepient.fullName,
          jobTitle: jobData.jobTitle,
          headline: recepient.headline,
          name: user.name,
          schoolName: recepient.education && recepient.education[0] ? recepient.education[0].schoolName : null,
          company: recepient.currentCompanyName ? recepient.currentCompanyName : null
        }

        const areRequiredVarsPresent = varsUsedInTemplate ? varsUsedInTemplate.map(key => variables[varPropMap[key]]).every(v => v) : true


        let message = template
          .replace(/{{.First_Name}}/g, variables.firstName || '{{.First_Name}}')
          .replace(/{{.Last_Name}}/g, variables.lastName || '{{.Last_Name}}')
          .replace(/{{.Full_Name}}/g, variables.full_name || '{{.Full_Name}}')
          .replace(/{{.Current_Title}}/g, variables.headline || '{{.Current_Title}}')
          .replace(/{{.Job_Title}}/g, variables.jobTitle || '{{.Job_Title}}')
          .replace(/{{.My_Name}}/g, variables.name || '{{.My_Name}}')
          .replace(/{{.My_First_Name}}/g, variables.name.split(" ")[0] || '{{.My_First_Name}}')
          .replace(/{{.My_Full_Name}}/g, variables.name || "{{.My_Full_Name}}")
          .replace(/{{.User_Name}}/g, variables.name || '{{.User_Name}}')
          .replace(/{{.School_Name}}/g, variables.schoolName || '{{.School_Name}}')
          .replace(/{{.Current_Company}}/g, variables.company || '{{.Current_Company}}')


        if (areRequiredVarsPresent && message.length < 300) {
          let hasError = false
          let errorCode


          if (degree === '1st') {
            await sendMessageFirstConnection(recepient.fullName, message)
          } else {
            const profileView = await callLinkedinApi(`/voyager/api/identity/profiles/${recepient.publicIdentifier}/profileView`, {
              method: 'GET'
            })

            if (profileView.error) {
              hasError = true
              errorCode = profileView.code
            }

            if (!hasError) {

              const trackingId = profileView.profile.miniProfile.trackingId

              const res = await callLinkedinApi(`/voyager/api/growth/normInvitations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  "trackingId": trackingId,
                  "message": message,
                  "invitations": [],
                  "invitee": {
                    "com.linkedin.voyager.growth.invitation.InviteeProfile": {
                      "profileId": recepient.publicIdentifier
                    }
                  }
                })
              })


              // console.log('RESPONSE NORMINVITATION: ', res)

              incrementConnectCount()
              if (res && res.error) { //res.code
                showToast({
                  type: 'error',
                  message: `Message to ${receivers[recepientIndex].fullName} unsuccessful`
                })
                hasError = true
                errorCode = res.code
                if (errorCode == 429) {
                  setRequestRateExceeded(true)
                  setIsSending(false)
                }
              }
            } else {
              showToast({
                type: 'error',
                message: `Message to ${receivers[recepientIndex].fullName} unsuccessful`
              })
            }

          }

          if (!hasError) {
            await manualApiCall('/api/auth/user/connection/sent', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jobID: `${jobData.jobId}`,
                requestArray: [
                  {
                    profileUrl: recepient.profileUrl,
                    id: recepient.id,
                    jobProfileId: recepient.jobProfileId,
                    status: 'SENT',
                    message: message,
                    degree: degree
                  }
                ]
              })
            })

            showToast({
              type: 'success',
              message: `Message to ${receivers[recepientIndex].fullName} sent successfully`
            })


            setSentCount(sentCount + 1)
          }
          setRecepientIndex(recepientIndex + 1)

          if (recepientIndex === receivers.length - 1) {
            setIsSending(false)
            setIsSent(true)
          }


          let pauseTime = getRandomInt(5, 10)
          if (sentCount && sentCount % 25 == 0) {
            pauseTime = 120
          }
          if (sentCount && sentCount % 50 == 0) {
            pauseTime = 300
          }

          if (!(recepientIndex === receivers.length - 1)) {
            showToast({
              type: 'info',
              message: `Pausing for ${pauseTime} seconds..`,
              pauseTime: pauseTime
            })

          }

          setSendMessageInterval(pauseTime * 1000)
        } else {

          showToast({
            type: 'error',
            message: `Message to ${receivers[recepientIndex].fullName} unsuccessful`
          })


          console.log('FAILED MESSAGE DEGREE: ', degree)

          setFailedMessages([...failedMessages, {
            recepient: recepient,
            message: message,
            degree: degree
          }])
          setRecepientIndex(recepientIndex + 1)
          if (recepientIndex === receivers.length - 1) {
            setIsSending(false)
            setIsSent(true)
          }
        }
      }

    } catch (e) {
      throw e
    }
  }

  const sendEditedMessage = async () => {
    try {
      const recepient = editedReceivers[editedRecepientIndex]
      const message = editedMessages[recepient.id].message
      const degree = editedMessages[recepient.id].degree
      const params = qs.parse(search)

      const isLimitExceeded = parseInt(dailyLimit.sent, 10) >= parseInt(dailyLimit.limit, 10)

      if (isLimitExceeded) {
        setLimitExceeded(true)
        setIsSendingEdited(false)
      }

      if (!isLimitExceeded) {

        let hasError = false
        let errorCode
        if (degree === '1st') {
          await sendMessageFirstConnection(recepient.fullName, message)

        } else {
          const profileView = await callLinkedinApi(`/voyager/api/identity/profiles/${recepient.publicIdentifier}/profileView`, {
            method: 'GET'
          })

          if (profileView.error) {
            hasError = true
            errorCode = profileView.code
          }

          const trackingId = profileView.profile.miniProfile.trackingId

          const resp = await callLinkedinApi(`/voyager/api/growth/normInvitations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              "trackingId": trackingId,
              "message": message,
              "invitations": [],
              "invitee": {
                "com.linkedin.voyager.growth.invitation.InviteeProfile": {
                  "profileId": recepient.publicIdentifier
                }
              }
            })
          })

          if (resp && resp.error) {
            hasError = true
            errorCode = resp.code
          }
          // console.log('RESPONSE NORM INVITATION [1]: ', resp)

          incrementConnectCount()
        }

        if (!hasError) {
          await manualApiCall('/api/auth/user/connection/sent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jobID: `${jobData.jobId}`,
              requestArray: [
                {
                  profileUrl: recepient.profileUrl,
                  id: recepient.id,
                  jobProfileId: recepient?.jobProfileId,
                  status: 'SENT',
                  message: message,
                  degree: degree
                }
              ]
            })
          })
          setEditedSentCount(editedSentCount + 1)
        }
        setEditedRecepientIndex(editedRecepientIndex + 1)

        if (editedRecepientIndex === editedReceivers.length - 1) {
          setIsSendingEdited(false)
          setIsEditedSent(true)
        }



        let pauseTime = getRandomInt(5, 10)
        if (editedSentCount && editedSentCount % 25 == 0) {
          pauseTime = 120
        }
        if (editedSentCount && editedSentCount % 50 == 0) {
          pauseTime = 300
        }

        showToast({
          type: 'info',
          message: `Pausing for ${pauseTime} seconds..`,
          pauseTime: pauseTime
        })
        setEditedMessageInterval(pauseTime * 1000)


      }


    } catch (e) {
      throw e
    }
  }

  const showSendMessageButton = (currentView === 'send' && !isSent && !limitExceeded && !requestRateExceeded) || (currentView === 'edit' && !isEditedSent && !limitExceeded && !requestRateExceeded) || !['edit', 'send'].includes(currentView)

  const variableTranslator = (variableTag) => {
    const prospectData = data.filter(itm => itm.id === selected[0])[0]
    const firstName = prospectData.firstName
    const lastName = prospectData.lastName
    const fullName = prospectData.fullName
    return variableTag.replace(/{{.First_Name}}/g, firstName)
      .replace(/{{.Last_Name}}/g, lastName)
      .replace(/{{.Full_Name}}/g, fullName)
      .replace(/{{.School_Name}}/g, 'Midtown High School')
      .replace(/{{.Job_Title}}/g, jobData.jobTitle)
      .replace(/{{.My_Name}}/g, userName)
      .replace(/{{.My_First_Name}}/g, userName.split(" ")[0])
      .replace(/{{.My_Full_Name}}/g, userName)
      .replace(/{{.User_Name}}/g, userName)
      .replace(/{{.Current_Company}}/g, 'The Daily Bugle')
      .replace(/{{.Current_Title}}/g, 'Photographer')
  }


  return (
    <div>
      <>
        <div>
          <div className="top-label-container-message">
            <span style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              <div>
                {currentView === 'send' && <h2>Sending Messages</h2>}
                {currentView === 'edit' && <h2>Send Unsent Messages</h2>}
                {!(['edit', 'send'].includes(currentView)) && <h2>Compose Message Sequence</h2>}

                {currentView === 'edit' && <p>{failedMessages.length} recipients</p>}
                {currentView === 'send' && <p>{selected.length} recipients</p>}
                {!(['edit', 'send'].includes(currentView)) && <p>To be sent to {selected.length} recipients</p>}
              </div>
            </span>
            {!(isSending || isSent || isSendingEdited || isStopped) ?
              <Button
                style={{ borderRadius: '8px' }}
                color="primary"
                outline
                onClick={() => {
                  console.log('BACK BUTTON CLICKED')
                  if (currentView === 'send') {

                    // setSendMessageViewActive(false)
                    // console.log('SET CURRENT VIEW: TO NULL')
                    window.scrollTo(0, 0);
                    setSelectAllProspectsFlag(false)
                    setView('ScoreAndConnect')
                  } else {
                    window.scrollTo(0, 0);
                    setSelectAllProspectsFlag(false)
                    setView('ScoreAndConnect')
                  }
                }
                }
              >
                Cancel
                </Button>

              :
              <div>
                {currentView === 'send' && !limitExceeded && !isSent && !requestRateExceeded &&
                  <span>
                    <Button
                      color='danger'
                      outline
                      onClick={() => {
                        if (isStopped) {
                          setIsSending(true)
                          setIsStopped(false)
                        } else {
                          setIsSending(false)
                          setIsStopped(true)
                        }
                      }}
                    >

                      {isStopped ? 'Resume Sending' : 'Stop Sending'}
                    </Button>
                  </span>
                }
                {currentView === 'send' && isSent &&
                  <span>
                    <Button
                      color="primary"
                      outline
                      onClick={() => {
                        console.log('BACK BUTTON CLICKED')
                        if (currentView === 'send') {

                          // setSendMessageViewActive(false)
                          // console.log('SET CURRENT VIEW: TO NULL')
                          window.scrollTo(0, 0);
                          setSelectAllProspectsFlag(false)
                          setView('ScoreAndConnect')
                        } else {
                          window.scrollTo(0, 0);
                          setSelectAllProspectsFlag(false)
                          setView('ScoreAndConnect')
                        }
                      }
                      }
                    >
                      Back To Prospects
                </Button>
                  </span>
                }
                {currentView === 'edit' &&
                  <span>
                    <Button
                      color='danger'
                      outline
                      style={{
                        display: 'inline-flex',
                        height: '42px',
                        marginRight: '16px',
                        fontSize: '16px'
                      }}
                      onClick={() => {
                        setView('ScoreAndConnect')
                      }}>
                      Discard
              </Button>
                  </span>}
                {showSendMessageButton &&
                  <span>
                    <Button
                      color='primary'
                      className='sendMessageButton'
                      onClick={currentView === 'edit' ? handleClickSendEdited : handleClickSend}
                      disabled={
                        ['edit', 'send'].includes(currentView) ?
                          selectedFailed.length === 0 :
                          (isSendingEdited || isSending || limitExceeded || requestRateExceeded)
                      }
                    >
                      {(isSending || isSendingEdited) ? <Loader /> : 'Send Message'}
                    </Button>
                  </span>
                }
              </div>
            }
          </div>
          {!(isSending || isSent || isSendingEdited || isStopped) &&
            <div className="secondary-label-container-message">

              <span style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p className="compose-message-label">
                  {connectionType === 2 ? 'Compose Message for 2nd/3rd Connections' : 'Compose Message for 1st Connections'}</p>
                {connectionType === 1 &&
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '-10px' }}>
                    <Input
                      className='checkBox'
                      type='checkbox'
                      onChange={() => {
                        setMessageType(!messageType)
                      }}
                      checked={messageType}
                    />
                    <p className="checkbox-text">Same as 2nd/3rd connections  </p>
                  </div>
                }
              </span>


              {connectionType === 2 ?
                <Button
                  style={{ borderRadius: '8px' }}
                  color="primary"
                  onClick={() => connectMessage(1)}
                >
                  Next
             </Button> :
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {!(currentView === 'send' || currentView === 'edit') && <Button
                    style={{ borderRadius: '8px' }}
                    outline
                    color="primary"
                    onClick={() => connectMessage(2)}
                  >
                    Back
             </Button>
                  }

                  {showSendMessageButton &&
                    <span>
                      <Button
                        color='primary'
                        className='sendMessageButton'
                        onClick={currentView === 'edit' ? handleClickSendEdited : handleClickSend}
                        disabled={
                          ['edit', 'send'].includes(currentView) ?
                            selectedFailed.length === 0 :
                            (isSendingEdited || isSending || limitExceeded || requestRateExceeded)
                        }
                      >
                        {(isSending || isSendingEdited) ? <Loader /> : 'Send Message'}
                      </Button>
                    </span>
                  }
                </div>
              }

            </div>
          }
        </div>
        {/* <div className="composeMessageHead">
          <span> */}
        {/* <Button outline color="secondary" className="composeBackButton"
              onClick={() => {
                console.log('BACK BUTTON CLICKED')
                if (currentView === 'send') {
                  // setSendMessageViewActive(false)
                  // console.log('SET CURRENT VIEW: TO NULL')
                  window.scrollTo(0, 0);
                  setSelectAllProspectsFlag(false)
                  setView('ScoreAndConnect')
                } else {
                  window.scrollTo(0, 0);
                  setSelectAllProspectsFlag(false)
                  setView('ScoreAndConnect')
                }
              }}>
              <img src={BackButtonIcon} alt="back" />
            </Button> */}
        {/* <div>
              {currentView === 'send' && <h2>Sending Messages</h2>}
              {currentView === 'edit' && <h2>Send Unsent Messages</h2>}
              {!(['edit', 'send'].includes(currentView)) && <h2>Compose Message Sequence</h2>}

              {currentView === 'edit' && <p>{failedMessages.length} recipients</p>}
              {currentView === 'send' && <p>{selected.length} recipients</p>}
              {!(['edit', 'send'].includes(currentView)) && <p>To be sent to {selected.length} recipients</p>}
            </div> 
          </span>
          {/* <div>
            {currentView === 'send' && !limitExceeded && !isSent && !requestRateExceeded &&
              <span>
                <Button
                  color='danger'
                  outline
                  onClick={() => {
                    if (isStopped) {
                      setIsSending(true)
                      setIsStopped(false)
                    } else {
                      setIsSending(false)
                      setIsStopped(true)
                    }
                  }}
                >

                  {isStopped ? 'Resume Sending' : 'Stop Sending'}
                </Button>
              </span>
            }
            {currentView === 'edit' &&
              <span>
                <Button
                  color='danger'
                  outline
                  style={{
                    display: 'inline-flex',
                    height: '42px',
                    marginRight: '16px',
                    fontSize: '16px'
                  }}
                  onClick={() => {
                    setView('ScoreAndConnect')
                  }}>
                  Discard
              </Button>
              </span>}
            {showSendMessageButton &&
              <span>
                <Button
                  color='primary'
                  className='sendMessageButton'
                  onClick={currentView === 'edit' ? handleClickSendEdited : handleClickSend}
                  disabled={
                    ['edit', 'send'].includes(currentView) ?
                      selectedFailed.length === 0 :
                      (isSendingEdited || isSending || limitExceeded || requestRateExceeded)
                  }
                >
                  {(isSending || isSendingEdited) ? <Loader /> : 'Send Message'}
                </Button>
              </span>
            }
          </div> */}
        {/* </div>  */}

        {currentView === 'send' &&
          <SendMessage
            isSending={isSending}
            isSent={isSent}
            total={receivers.length}
            sentCount={sentCount}
            isStopped={isStopped}
            isExceeded={limitExceeded}
            rateExceeded={requestRateExceeded}
            failedCount={failedMessages.length}
            setCurrentView={setCurrentView}
            setSelectAllProspectsFlag={setSelectAllProspectsFlag}
            setView={setView}
            sendingTo={receivers[recepientIndex]}
          />
        }
        {
          currentView === 'edit' &&
          <EditAndSend
            recepients={failedMessages}
            messages={editedMessages}
            setMessages={setEditedMessages}
            selected={selectedFailed}
            setSelected={setSelectedFailed}
            isSendingEdited={isSendingEdited}
            editedSentCount={editedSentCount}
            isEditedSent={isEditedSent}
            setView={setView}
            user={user}
          />
        }
        {!((currentView === 'send') || (currentView === 'edit')) &&
          <ul className="composeMessageBody">
            <li className="connectMessageContainer">
              <div className="connectMessageHead">
                <Input
                  className='checkBox'
                  type='checkbox'
                  onChange={() => setMessageEnabled(!messageEnabled)}
                  checked={true}
                  disabled={true}
                />
                <div >
                  <div>
                    <h2>Connect Message</h2>
                    <p>To be sent now</p>
                  </div>
                  <p className="preview"
                    onClick={() => {
                      setPreviewMessage(connectMessageSample ? variableTranslator(connectMessageSample) : "")

                      toggle()
                    }
                    }
                  >Preview</p>
                </div>

              </div>
              <div className="connectMessageBody">
                <div className="messsageContainer">
                  <span className="inputMessageContainer">
                    <Input
                      className={msgCharLimitFlag ?
                        "messageInputTextArea messageInputTextAreaFlash" :
                        "messageInputTextArea"}
                      type="textarea"
                      name="text"
                      value={connectMessageSample || ''}
                      onChange={(e) => handleChange(e, 'connect')}
                      onClick={(e) => setmsgCursorPos(e.target.selectionEnd)}
                      onKeyUp={(e) => setmsgCursorPos(e.target.selectionEnd)} />

                    <p
                      className={msgCharLimitFlag ?
                        "CharcLimitCounter CharcLimitCounterFlash" :
                        "CharcLimitCounter"} >
                      {`${msgCharLimitCounter}/280`}
                    </p>
                  </span>
                  {/* <span className="outputMessageContainer">
                    <Label className="infoTag">This is what the recipient would see:</Label>
                    <Input
                      disabled
                      type="textarea"
                      className="messageOutput"
                      value={sampleMessage ? variableTranslator(sampleMessage) : ""}
                    />
                  </span> */}
                </div>
                <TagButtonComponent
                  cursorPos={msgCursorPos}
                  skillsReq={data[0].scoring.skills_required || []}
                  connectMessage={connectMessageSample}
                  handleChange={handleChange}
                  tagType='connect'
                />
              </div>
              <hr className="HoriBar" />
            </li>
            <li className="followUp1stContainer">
              <div className="infoTag">
                <img
                  style={{ marginTop: '-20px', marginRight: '10px' }}
                  src={alertIcon}
                  alt={'alert'}
                />
                <span>{connectionType === 2
                  ? 'Follow up settings set for 2nd/3rd connections will be applied to 1st connections too, other than the content of the messages'
                  :
                  'Follow up settings set for 1st connections will be applied to 2nd/3rd connections too, other than the content of the messages.'
                }
                </span>
              </div>
              <div className="followUp1stHead">
                <Input
                  disabled={!messageEnabled}
                  className='checkBox'
                  id="fu1"
                  type='checkbox'
                  onChange={() => {
                    manualApiCall('/api/auth/user/activity/store',
                      {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          "actionName": !followUpMessage1Enabled ?
                            "FIRST_FOLLOW_UP_MESSAGE_ENABLED" : "FIRST_FOLLOW_UP_MESSAGE_DISABLED",
                          "jobId": params.jId
                        })
                      })
                    dispatch(toggleMessageEnabled(connectionType, 'fu1'))
                  }}
                  checked={followUpMessage1Enabled}
                />
                {connectionType === 1 &&
                  <Tooltip
                    target='fu1'
                    placement='bottom'
                    toggle={() => setTooltipOpenFu1(!tooltipOpenFu1)}
                    isOpen={tooltipOpenFu1}
                    // fade={true}
                    style={{ zIndex: 9 }}
                    className='tooltip-root'>
                    This will disable 1st follow up for 2nd/3rd degree connections too
                  </Tooltip>
                }
                <div>
                  <div>
                    <h2>1st Follow Up</h2>
                    <p>To be sent after <Input
                      className="followUpDays"
                      type="number"
                      id="fu1Count"
                      name="number"
                      placeholder="2"
                      min={1}
                      max={followUpMessage2Days ? followUpMessage2Days - 1 : 5}
                      onChange={(e) => {
                        dispatch(setFollowUpDays(connectionType, 'fu1', e.target.value))
                      }}
                      value={followUpMessage1Days || 2}
                    />
                      {connectionType === 1 &&
                        <Tooltip
                          target='fu1Count'
                          placement='bottom'
                          toggle={() => setTooltipOpenFu1Count(!tooltipOpenFu1Count)}
                          isOpen={tooltipOpenFu1Count}
                          // fade={true}
                          style={{ zIndex: 9 }}
                          className='tooltip-root'>
                          This setting will apply to the 1st follow up for your 2nd/3rd degree connections too
                  </Tooltip>
                      }

                    day(s) if connected but not replied</p>
                  </div>
                  <p className="preview"
                    onClick={() => {
                      setPreviewMessage(followUp1Message ? variableTranslator(followUp1Message) : "")
                      toggle()
                    }
                    }
                  >Preview</p>
                </div>

              </div>
              <div className="followUp1stBody">
                <div className="messsageContainer">
                  <span className="inputMessageContainer">
                    <Input
                      className={fu1CharLimitFlag ?
                        "messageInputTextArea messageInputTextAreaFlash" :
                        "messageInputTextArea"}
                      type="textarea"
                      name="text"
                      id="connectMessageText"
                      value={followUp1Message || ''}
                      onChange={(e) => handleChange(e, 'fu1')}
                      onClick={(e) => setfu1CursorPos(e.target.selectionEnd)}
                      onKeyUp={(e) => setfu1CursorPos(e.target.selectionEnd)} />

                    {/* <p
                      className={fu1CharLimitFlag ?
                        "CharcLimitCounter CharcLimitCounterFlash" :
                        "CharcLimitCounter"} >
                      {`${fu1CharLimitCounter}/280`}
                    </p> */}
                  </span>
                  {/* <span className="outputMessageContainer">
                    <Label className="infoTag">This is what the recipient would see:</Label>
                    <Input
                      disabled
                      type="textarea"
                      className="messageOutput"
                      value={followUpMessage1Template ? variableTranslator(followUpMessage1Template) : ""}
                    />
                  </span> */}
                </div>
                <TagButtonComponent
                  cursorPos={fu1CursorPos}
                  skillsReq={data[0].scoring.skills_required || []}
                  followUpMessage1Template={followUp1Message}
                  handleChange={handleChange}
                  tagType='fu1'
                />
              </div>
              <hr className="HoriBar" />
            </li>
            <li className="followUp2ndContainer">
              <div className="followUp2ndHead">
                <Input
                  disabled={!(messageEnabled && followUpMessage1Enabled)}
                  className='checkBox'
                  type='checkbox'
                  id="fu2"
                  onChange={() => {
                    manualApiCall('/api/auth/user/activity/store',
                      {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          "actionName": !followUpMessage2Enabled ?
                            "SECOND_FOLLOW_UP_MESSAGE_ENABLED" : "SECOND_FOLLOW_UP_MESSAGE_DISABLED",
                          "jobId": params.jId
                        })
                      })
                    dispatch(toggleMessageEnabled(connectionType, 'fu2'))
                  }}
                  checked={followUpMessage2Enabled}
                />
                {connectionType === 1 &&
                  <Tooltip
                    target='fu2'
                    placement='bottom'
                    toggle={() => setTooltipOpenFu2(!tooltipOpenFu2)}
                    isOpen={tooltipOpenFu2}
                    // fade={true}
                    style={{ zIndex: 9 }}
                    className='tooltip-root'>
                    This will disable 2nd follow up for 2nd/3rd degree connections too
                  </Tooltip>
                }
                <div>
                  <div>
                    <h2>2nd Follow Up</h2>
                    <p>To be sent after <Input
                      className="followUpDays"
                      type="number"
                      name="number"
                      placeholder="6"
                      min={2}
                      id='fu2Count'
                      onChange={(e) =>
                        dispatch(setFollowUpDays(connectionType, 'fu2', e.target.value))
                      }
                      value={followUpMessage2Days || 6}
                    />
                      {connectionType === 1 &&
                        <Tooltip
                          target='fu2Count'
                          placement='bottom'
                          toggle={() => setTooltipOpenFu2Count(!tooltipOpenFu2Count)}
                          isOpen={tooltipOpenFu2Count}
                          // fade={true}
                          style={{ zIndex: 9 }}
                          className='tooltip-root'>
                          This setting will apply to the 2nd follow up for your 2nd/3rd degree connections too
                  </Tooltip>
                      }
                     day(s) if connected but not replied</p>
                  </div>
                  <p className="preview" onClick={() => {
                    setPreviewMessage(followUp2Message ? variableTranslator(followUp2Message) : "")
                    toggle()
                  }
                  }
                  >Preview</p>
                </div>

              </div>
              <div className="followUp2ndBody">
                <div className="messsageContainer">
                  <span className="inputMessageContainer">
                    <Input
                      className={fu2CharLimitFlag ?
                        "messageInputTextArea messageInputTextAreaFlash" :
                        "messageInputTextArea"}
                      type="textarea"
                      name="text"
                      id="connectMessageText"
                      value={followUp2Message || ''}
                      onChange={(e) => handleChange(e, 'fu2')}
                      onClick={(e) => setfu2CursorPos(e.target.selectionEnd)}
                      onKeyUp={(e) => setfu2CursorPos(e.target.selectionEnd)} />
                    {/* <p
                      className={fu2CharLimitFlag ?
                        "CharcLimitCounter CharcLimitCounterFlash" :
                        "CharcLimitCounter"} >
                      {`${fu2CharLimitCounter}/280`}
                    </p> */}
                  </span>
                  {/* <span className="outputMessageContainer">
                    <Label className="infoTag">This is what the recipient would see:</Label>
                    <Input
                      disabled
                      type="textarea"
                      className="messageOutput"
                      value={followUpMessage2Template ? variableTranslator(followUpMessage2Template) : ""}
                    />
                  </span> */}
                </div>
                <TagButtonComponent
                  cursorPos={fu2CursorPos}
                  skillsReq={data[0].scoring.skills_required || []}
                  followUpMessage2Template={followUp2Message}
                  handleChange={handleChange}
                  tagType='fu2'
                />
              </div>
            </li>
          </ul>
        }
      </>
      <MessagePreview
        toggle={toggle}
        description={previewMessage}
        modal={modal} />
    </div>
  )
}

export default withRouter(connect(state => ({
  messageSettings: state.score.messageSettings,
  user: state.auth.user,
  dailyLimit: state.score.dailyLimit
}))(ComposeMessage))