import React, { useState, memo, useEffect } from "react";
import Container, { Button, Input, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { createBrowserHistory } from 'history';
import { withRouter } from 'react-router-dom'

import { toast } from 'react-toastify'


import { connect } from 'react-redux'
import {
  fetchPencilitAccount, getMessageSetting, incrementConnectSent,
  pencilitAccountIntegration, setMessageValue
} from '../../../../actions/score'
import { setRequestMeeting } from '../../../../actions/score'
import BackButtonIcon from '../../../../../../img/BackButton.svg'

import TimezonePicker from '../../../../components/TimeZonePicker/TimezonePicker'

import './style.css'

import moment from 'moment-timezone';
import {
  callLinkedinApi,
  isEmpty,
  manualApiCall,
  manualApiCallPencilit,
  getRandomInt,
  sendMessageFirstConnection
} from "../../../../utils";
import { isNull } from "lodash";
import integratePencilitAccount from "../../../../reducers/score/pencilitCreateProfile";
import Loader from "../../../../components/Loader";
import { REQUEST_SET_USER_FAILURE, REQUEST_SET_USER_SUCCESS } from "../../../../actions";
import qs from "query-string";
import meetingSettings from "../../../../reducers/score/meetingSettings";
import SendMessage from "../ComposeMessage/SendMessage";
import EditAndSend from "../ComposeMessage/EditAndSend";
import * as ActionTypes from "../../../../actions/score";
import useInterval from "use-interval";
import { API_HOST_PENCILIT } from "../../../../../config";
import MessagesFlow from "./MessagesFlow";
import PreEvaluationForm from "./PreEvaluationForm"
import MeetingType from "./MeetingType"
import FollowUpMeetings from "./FollowUpMeetings";
import MessagePreview from './MessagePreview'

// import meetingSettings from "../../../../reducers/score/meetingSettings";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const RequestMeeting = (props) => {
  // console.log('REQUEST MEETING PROPS AKSDJFHASKDHFKASHDFKJAHSDFAJSKDFH: ', props)
  const pencilitApiUrl = API_HOST_PENCILIT;
  let history = createBrowserHistory();

  const [modal, setModal] = useState(false);
  const [previewMessage, setPreviewMessage] = useState('');
  const [messageType, setMessageType] = useState(false)

  const toggle = () => setModal(!modal);

  const [accountIntegration, setAccountIntegration] = useState(false)
  const [calendarIntegration, setCalendarIntegration] = useState(false)
  const [zoomIntegration, setZoomIntegration] = useState(false)
  const [accountIntegrated, setAccountIntegrated] = useState(false)
  const [profileIntegration, setProfileIntegration] = useState(false)
  const [slug, setSlug] = useState(null);
  const [_errors, setErrors] = useState({});
  const [timeZone, setTimeZone] = useState(moment.tz.guess());
  const { href } = location
  const [googleCalendarLink, setGoogleCalendarLink] = useState(false);
  const [outlookCalendarLink, setOutlookCalendarLink] = useState(false);
  const [zoomCalendarLink, setZoomCalendarLink] = useState('/');
  const [meetingMessages, setMeetingMessages] = useState(false);
  const [isLoading, setLoading] = useState(true)
  const jobId = qs.parse(location.search).jId;

  const [sendMessageInterval, setSendMessageInterval] = useState(5000)
  const [editedMessageInterval, setEditedMessageInterval] = useState(5000)
  const [requestRateExceeded, setRequestRateExceeded] = useState(false)

  const [messageEnabled, setMessageEnabled] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [sentCount, setSentCount] = useState(0)
  // const [sendStatusVisible, setSendStatusVisibility] = useState(false)
  const [isStopped, setIsStopped] = useState(false)
  const [recepientIndex, setRecepientIndex] = useState(0)
  const [receivers, setReceivers] = useState([])
  const [currentView, setCurrentView] = useState(null)
  // 'send' 'edit

  const [limitExceeded, setLimitExceeded] = useState(false)
  const [failedMessages, setFailedMessages] = useState([])

  const [editedMessages, setEditedMessages] = useState({})
  const [selectedFailed, setSelectedFailed] = useState([])
  const [isSendingEdited, setIsSendingEdited] = useState(false)
  const [editedReceivers, setEditedReceivers] = useState([])
  const [editedRecepientIndex, setEditedRecepientIndex] = useState(0)
  const [editedSentCount, setEditedSentCount] = useState(0)
  const [isEditedSent, setIsEditedSent] = useState(false)
  const [skipZoom, setskipZoom] = useState(0)
  // const [firstVisit, setFirstVisit] = useState(false)

  const [msg30CursorPos, setmsg30CursorPos] = useState(0)
  const [msg15CursorPos, setmsg15CursorPos] = useState(0)
  const [fu1CursorPos, setfu1CursorPos] = useState(0)
  const [fu2CursorPos, setfu2CursorPos] = useState(0)

  const [msg30CharLimitCounter, setmsg30CharLimitCounter] = useState(0)
  const [msg15CharLimitCounter, setmsg15CharLimitCounter] = useState(0)
  const [fu1CharLimitCounter, setfu1CharLimitCounter] = useState(0)
  const [fu2CharLimitCounter, setfu2CharLimitCounter] = useState(0)
  const [fu1CharLimitFlag, setfu1CharLimitFlag] = useState(0)
  const [fu2CharLimitFlag, setfu2CharLimitFlag] = useState(0)

  const [msg30CharLimitFlag, setmsg30CharLimitFlag] = useState(false)
  const [msg15CharLimitFlag, setmsg15CharLimitFlag] = useState(false)
  const [Drop, setDrop] = useState({ time: '15 Minutes Long', toggle: false })
  const [DropFu1, setDropFu1] = useState({ time: '15 Minutes Long', toggle: false })
  const [DropFu2, setDropFu2] = useState({ time: '15 Minutes Long', toggle: false })

  let [step1, setStep1] = useState(true);
  let [step2, setStep2] = useState(false);
  let [step3, setStep3] = useState(true);
  let [meetingSlot, setMeetingSlot] = useState(null);
  let [addPreEValForm, setAddPreEvalForm] = useState(null);
  let [preEvalQuestions, setPreEvalQuestions] = useState(null);
  let [selectedIndex, setSelectedIndex] = useState(0);

  useInterval(() => {
    sendMessage()
  }, (isSending && (recepientIndex < receivers.length)) && !limitExceeded && !requestRateExceeded ? sendMessageInterval : null)

  useEffect(() => {

    (isSent || limitExceeded || requestRateExceeded)
      &&
      manualApiCall('/api/auth/user/activity/store',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "actionName": "SENT_MEETING_REQUEST",
            "jobId": params.jId,
            "count": sentCount
          })
        })


  }, [isSent, limitExceeded, requestRateExceeded])
  useInterval(() => {
    sendEditedMessage()
  }, (isSendingEdited && (editedRecepientIndex < editedReceivers.length) && !limitExceeded && !requestRateExceeded) ? editedMessageInterval : null)

  const {
    viewState,
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
        followUp2MessageFirstDegree,

        sampleZoom15Message,
        sampleZoom30Message,

        zoom15MessageFirstDegree,
        zoom30MessageFirstDegree
      }
    },
    dispatch,
    selected,
    fetchPencilitAccountDetail,
    dailyLimit,
    integratePencilitAccount,
    setSelectAllProspectsFlag,
    data,
    user,
    connectionType,
    jobData,
    visited,
    ...rest

  } = props

  // console.log('REQUEST MEETING JOB DATA: ', jobData)

  const params = qs.parse(location.search)
  // useEffect(() => {
  //   // alert(JSON.stringify(fetchPencilitAccountDetail))
  //   // selected.push(...qs.parse(location.search).selectedProspects.split('-').map(str => Number(str)))
  //   console.log(selected)
  //   console.log('Drop', Drop)

  // }, [Drop, fetchPencilitAccountDetail])

  let sampleMessage15, sampleMessage30, followUp1Message, followUp2Message

  if (connectionType === 2 || messageType) {
    sampleMessage15 = sampleZoom15Message
    sampleMessage30 = sampleZoom30Message
    followUp1Message = followUpMessage1Template
    followUp2Message = followUpMessage2Template
  }
  else {
    sampleMessage15 = zoom15MessageFirstDegree
    sampleMessage30 = zoom30MessageFirstDegree
    followUp1Message = followUp1MessageFirstDegree
    followUp2Message = followUp2MessageFirstDegree
  }

  useEffect(() => {

    // isLo
    dispatch(getMessageSetting(params.jId))

    setLoading(false)

  }, [])

  useEffect(() => {
    if (fetchPencilitAccountDetail) {
      console.log(JSON.stringify(fetchPencilitAccountDetail))
      if (isNull(slug)) {
        setSlug(fetchPencilitAccountDetail.data.availableSlug);
      }

      if (fetchPencilitAccountDetail.isNewAccount) {
        setAccountIntegration(true)
        setskipZoom(5)

        // setProfileIntegration(true)
      }
      if (!fetchPencilitAccountDetail.isNewAccount) {
        if (!fetchPencilitAccountDetail.isCalendarIntegrated) {

          setCalendarIntegration(true)
          setZoomIntegration(false)
          setProfileIntegration(false)
        } else if (!fetchPencilitAccountDetail.isZoomIntegrated) {
          setZoomIntegration(true)
          setCalendarIntegration(false)
          setProfileIntegration(false)
          setskipZoom(5)

        } else {
          setskipZoom(9)

          setAccountIntegration(false)
          setAccountIntegrated(true)
          setAccountIntegration(false)
          setCalendarIntegration(false)
          setAccountIntegration(false)
          setProfileIntegration(false)
        }
      }
      if (fetchPencilitAccountDetail.data.data) {
        if (fetchPencilitAccountDetail.data.data.pencilit_email) {
          setskipZoom(visited ? 9 : 2)
          setAccountIntegrated(true)
          setAccountIntegration(false)
          setAccountIntegration(false)
          setCalendarIntegration(false)
          setAccountIntegration(false)
          setProfileIntegration(false)
        }
      }
    }
    // alert(JSON.stringify(fetchPencilitAccountDetail))
  }, [fetchPencilitAccountDetail])


  const handleSkipZoomFlow = (e) => {
    manualApiCall('/api/auth/user/activity/store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "actionName": `SKIPPING_ZOOM_INTEGRATION`,
        "jobId": params.jId
      })
    })

    setskipZoom(visited ? 9 : 1)

    setAccountIntegrated(true)
    setAccountIntegration(false)
    setAccountIntegration(false)
    setCalendarIntegration(false)
    setAccountIntegration(false)
    setProfileIntegration(false)

  }

  const handleConfirmToMessagesButton = (e) => {
    manualApiCall('/api/auth/user/activity/store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "actionName": `ALL_DONE_REQUEST_MEETING`,
        "jobId": params.jId
      })
    })
    setskipZoom(9)
  }

  const validateSlug = () => {
    let error = {};

    let alphaNumeric = /^([0-9]|[a-z])+([0-9a-z]+)$/i;

    if (!alphaNumeric.test(slug)) {
      error.slug = 'Username can only be alphanumeric.';
    }

    if (isEmpty(slug)) {
      error.slug = 'Can not be blank.';
    }

    setErrors(error);

    return error;
  }

  const updateSetings = e => {
    e.preventDefault();
    const hasError = validateSlug();
    manualApiCall('/api/auth/user/activity/store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "actionName": `CONFIGUIRE_CALENDAR_REQUEST_MEETING`,
        "jobId": params.jId
      })
    })

    if (isEmpty(hasError)) {
      chrome.storage.local.get(['name', 'recruiterID', 'isPopupOpened', 'emailAddress'], (r) => {
        const profileData = {
          slug_url: slug,
          time_zone: timeZone,
          email: r.emailAddress,
          name: r.name,
          token: r.recruiterID
        }
        dispatch(pencilitAccountIntegration(profileData))
      })
    }
  }
  useEffect(() => {
    if (!fetchPencilitAccountDetail.isNewAccount) {
      chrome.storage.local.get(['emailAddress'], (r) => {
        // alert(selected)
        setGoogleCalendarLink(`${pencilitApiUrl}/dnnae/auth/google?callbackUrl=${encodeURIComponent(btoa(href.includes("calendarIntegrated") ? removeUrlParameter(removeUrlParameter(href, 'calendarIntegrated'), 'selectedProspects') : href))}&dnnaeEmail=${encodeURIComponent(btoa(r.emailAddress))}&selectedProspects=${encodeURIComponent(selected.join('-'))}`)
        setOutlookCalendarLink(`${pencilitApiUrl}/dnnae/auth/outlook?callbackUrl=${encodeURIComponent(btoa(href))}&dnnaeEmail=${encodeURIComponent(btoa(r.emailAddress))}&selectedProspects=${encodeURIComponent(selected.join('-'))}`)
        setZoomCalendarLink(`${pencilitApiUrl}/zoom?callbackUrl=${encodeURIComponent(btoa(href.includes("calendarIntegrated") ? removeUrlParameter(removeUrlParameter(href, 'calendarIntegrated'), 'selectedProspects') : href))}&dnnaeEmail=${encodeURIComponent(btoa(r.emailAddress))}&selectedProspects=${encodeURIComponent(selected.join('-'))}`)
      })
    } else if (integratePencilitAccount.data.user) {
      setCalendarIntegration(true)
      setZoomIntegration(false)
      setProfileIntegration(false)
      setAccountIntegration(false)
      chrome.storage.local.get(['emailAddress'], (r) => {
        setGoogleCalendarLink(`${pencilitApiUrl}/dnnae/auth/google?callbackUrl=${encodeURIComponent(btoa(href.includes("calendarIntegrated") ? removeUrlParameter(removeUrlParameter(href, 'calendarIntegrated'), 'selectedProspects') : href))}&dnnaeEmail=${encodeURIComponent(btoa(r.emailAddress))}&selectedProspects=${encodeURIComponent(selected.join('-'))}`)
        setOutlookCalendarLink(`${pencilitApiUrl}/dnnae/auth/outlook?callbackUrl=${encodeURIComponent(btoa(href))}&dnnaeEmail=${encodeURIComponent(btoa(r.emailAddress))}&selectedProspects=${encodeURIComponent(selected.join('-'))}`)
        setZoomCalendarLink(`${pencilitApiUrl}/zoom?callbackUrl=${encodeURIComponent(btoa(href.includes("calendarIntegrated") ? removeUrlParameter(removeUrlParameter(href, 'calendarIntegrated'), 'selectedProspects') : href))}&dnnaeEmail=${encodeURIComponent(btoa(r.emailAddress))}&selectedProspects=${encodeURIComponent(selected.join('-'))}`)
      })
    }
    if (integratePencilitAccount.isAccountIntegrated) {
      setAccountIntegrated(true)
      setAccountIntegration(false)
      setAccountIntegration(false)
      setCalendarIntegration(false)
      setAccountIntegration(false)
      setProfileIntegration(false)
    }

  }, [integratePencilitAccount])

  // useEffect(() => {
  //   setStep3(!rest.preEvaluationForm.preLoadFlag)
  // }, [rest.preEvaluationForm.preLoadFlag])


  const resetPageOnBack = () => {



    // const searchParams = qs.parse(location.search)
    // const newParams = {
    //   jId: searchParams.jId,
    //   fS: searchParams.fS,
    //   fSO: searchParams.fSO,
    //   secS: searchParams.secS,
    //   secSO: searchParams.secSO
    // }

    // if (searchParams.tF)
    //   newParams['tF'] = searchParams.tF
    // if (searchParams.calendarIntegrated)
    //   newParams['calendarIntegrated'] = searchParams.calendarIntegrated
    //   if (searchParams.selectedProspects)
    //   newParams['selectedProspects'] = searchParams.selectedProspects











    // const searchParams = qs.parse(location.search)
    setskipZoom(0)
    // const newParams = {
    //   jId: searchParams.jId,
    //   isConnectPage: 1
    // }
    // if(newParams?.calendarIntegrated)
    //   delete newParams.calendarIntegrated
    // history.push(`/html/score.html?${qs.stringify(newParams)}`)
  }
  // useInterval(() => {
  //   sendMessage()
  // }, (isSending && (recepientIndex < receivers.length)) && !limitExceeded ? 5500 : null)
  // useInterval(() => {
  //   sendEditedMessage()
  // }, (isSendingEdited && (editedRecepientIndex < editedReceivers.length) && !limitExceeded) ? 5500 : null)
  // const prevSentCount = usePrevious(sentCount)
  // let isSendStopped = false

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
    const params = qs.parse(location.search)

    setCurrentView('send')


    // const payload = {
    //   jobID: params.extensionJobId,
    //   sampleMessage,

    //   followUpMessage1Enabled,
    //   followUpMessage1Template,
    //   followUpMessage1Days,
    //   followUpMessage1Type,


    //   followUpMessage2Enabled,
    //   followUpMessage2Template,
    //   followUpMessage2Days,
    //   followUpMessage2Type,
    //   sampleZoom15Message,
    //   sampleZoom30Message

    // }

    try {
      const recepients = data.filter(item => selected.includes(item.id))

      // setSendStatusVisibility(true)
      setIsSending(true)
      setIsSent(false)
      setSentCount(0)

      // await manualApiCall(`/api/auth/job/meeting/setting/set`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // })
      const messageSettings = await manualApiCall(`/api/auth/job/meeting/setting/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobID: jobId })
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
        const params = qs.parse(location.search)
        const varsUsedInTemplate = Drop.time.includes('15') ? sampleZoom15Message.match(/{{.(\w+)}}/g) : sampleZoom30Message.match(/{{.(\w+)}}/g)

        const varPropMap = {
          '{{.First_Name}}': 'firstName',
          '{{.Last_Name}}': 'lastName',
          '{{.Full_Name}}': 'full_name',
          '{{.Current_Title}}': 'headline',
          '{{.Job_Title}}': 'jobTitle',
          '{{.My_Name}}': 'myName',
          '{{.My_First_Name}}': 'myFirstName',
          '{{.My_Full_Name}}': 'myFullName',
          '{{.User_Name}}': 'name',
          '{{.School_Name}}': 'schoolName',
          '{{.Current_Company}}': 'company',
          '{{.Meeting_Link}}': 'meetingLink'

        }
        // console.log(recepient)
        const getPrivateLink = await manualApiCall('/api/auth/user/connection/get/meeting/custom/link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobID: parseInt(jobId),
            profileID: parseInt(recepient.id),
            jobProfileId: parseInt(recepient.jobProfileId),
            meetingType: parseInt(Drop.time.substring(0, 2)),
          })
        });


        const networkInfo = await callLinkedinApi(`/voyager/api/identity/profiles/${recepient.publicIdentifier}/networkinfo`, {
          method: 'GET'
        })

        const distanceDegreeMap = {
          'DISTANCE_1': '1st',
          'DISTANCE_2': '2nd',
          'DISTANCE_3': '3rd+'
        }
        degree = distanceDegreeMap[networkInfo.distance.value]

        if (addPreEValForm && preEvalQuestions.length > 0) {
          onPreEvalFormDataChange(getPrivateLink.data.token)
        }
        // console.log(getPrivateLink)
        const variables = {
          firstName: recepient.firstName,
          lastName: recepient.lastName,
          full_name: recepient.full_name,
          jobTitle: jobData.jobTitle, //recepient.jobTitle,
          headline: recepient.headline,
          myFullName: user.name,
          myFirstName: user.name.split(" ")[0],
          name: user.name,
          myName: user.name,
          schoolName: recepient.education && recepient.education[0] ? recepient.education[0].schoolName : null,
          company: recepient.currentCompanyName ? recepient.currentCompanyName : null,
          meetingLink: "pencilit.io/" + getPrivateLink.data.slug + "/" + getPrivateLink.data.token + "/" + parseInt(Drop.time.substring(0, 2)) + "mins"
        }
        console.log(variables)
        const areRequiredVarsPresent = varsUsedInTemplate ? varsUsedInTemplate.map(key => variables[varPropMap[key]]).every(v => v) : true
        let message;
        if (Drop.time.includes('15')) {
          message = sampleZoom15Message
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
            .replace(/{{.Meeting_Link}}/g, variables.meetingLink || '{{.Meeting_Link}}')
        } else {
          message = sampleZoom30Message
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
            .replace(/{{.Meeting_Link}}/g, variables.meetingLink || '{{.Meeting_Link}}')
        }
        if (variables.meetingLink) {
          manualApiCall('/api/auth/job/profile/save/meetingLink', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              meetingLink: variables.meetingLink,
              jobProfileId: recepient.jobProfileId
            })
          })
        }

        if (areRequiredVarsPresent && message.length <= 300) {
          console.log('ALL VARIABLES PRESENT', { message })
          let hasError = false
          let errorCode




          if (degree === '1st') {
            manualApiCall('/api/auth/user/activity/store', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                "actionName": `SENDING_REQUEST_MEETING_TO_1ST_CONNECTION`,
                "jobId": params.jId
              })
            })
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

              manualApiCall('/api/auth/user/activity/store', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  "actionName": `SENDING_REQUEST_MEETING_TO_2ND/3RD_CONNECTION`,
                  "jobId": params.jId
                })
              })

              incrementConnectCount()

              if (res && res.error) {
                // if(false){
                hasError = true
                errorCode = res.code
                if (errorCode == 429) {
                  setRequestRateExceeded(true)
                  setIsSending(false)
                }
              }
            } else {
              showToast({
                message: `Message to ${recepient.fullName} unsuccessful`
              })
            }
          }



          if (!hasError) {
            await manualApiCall('/api/auth/user/connection/sent', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jobID: jobId,
                requestArray: [
                  {
                    profileUrl: recepient.profileUrl,
                    status: 'SENT',
                    id: recepient.id,
                    message: message,
                    degree: degree,
                    jobProfileId: recepient.jobProfileId,
                  }
                ]
              })
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
          showToast({
            message: `Pausing for ${pauseTime} seconds..`,
            type: 'info',
            pauseTime
          })
          // if(sentCount % 25 == 0 && sentCount % 50 != 0)
          setSendMessageInterval(pauseTime * 1000)

        }
        else {
          console.log('FAILED MESSAGE: ', { recepient, message })
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
      const params = qs.parse(location.search)

      const isLimitExceeded = parseInt(dailyLimit.sent, 10) >= parseInt(dailyLimit.limit, 10)

      if (isLimitExceeded) {
        setLimitExceeded(true)
        setIsSendingEdited(false)
      }

      if (!isLimitExceeded) {

        let hasError = false
        if (degree === '1st') {

          manualApiCall('/api/auth/user/activity/store', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "actionName": `SENDING_REQUEST_MEETING_EDITED_MESSAGE_TO_1ST_CONNECTION`,
              "jobId": params.jId
            })
          })
          await sendMessageFirstConnection(recepient.fullName, message)
        } else {
          const profileView = await callLinkedinApi(`/voyager/api/identity/profiles/${recepient.publicIdentifier}/profileView`, {
            method: 'GET'
          })

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
          manualApiCall('/api/auth/user/activity/store', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "actionName": `SENDING_REQUEST_MEETING_EDITED_MESSAGE_TO_2ND/3RD_CONNECTION`,
              "jobId": params.jId
            })
          })

          if (resp && resp.error) {
            hasError = true
          }
          incrementConnectCount()
        }

        if (!hasError) {
          await manualApiCall('/api/auth/user/connection/sent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jobID: jobId,
              requestArray: [
                {
                  profileUrl: recepient.profileUrl,
                  status: 'SENT',
                  jobProfileId: recepient?.jobProfileId,
                  id: recepient.id,
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
          message: `Pausing for ${pauseTime} seconds..`,
          pauseTime: pauseTime,
          type: 'info'
        })
        // if(sentCount % 25 == 0 && sentCount % 50 != 0)
        setEditedMessageInterval(pauseTime * 1000)
      }


    } catch (e) {
      throw e
    }
  }

  const onSelectMeeting = (slot) => {
    setStep1(false)
    setMeetingSlot(slot)
    setDrop({ ...Drop, time: `${slot} Minutes Long` })
    setSelectedIndex(1)

    // setStep2(true)
  }

  const onSetPreEvalForm = (option) => {
    if (!option) {
      onSkipToComposeMessage();
    }
    else {
      setAddPreEvalForm(option)
      setStep3(true);
    }
  }

  const onSetPreEvalFormData = (data) => {
    setPreEvalQuestions(data)
    setStep3(false);
    setSelectedIndex(2);
  }

  const onSkipToComposeMessage = () => {
    setAddPreEvalForm(false)
    setStep3(false);
    setSelectedIndex(2);
  }

  const onPreEvalFormDataChange = (token) => {
    if (rest.preEvaluationForm.questions.length > 0) {
      const payload = {
        token,
        list_questions: rest.preEvaluationForm.questions,
        form_description: rest.preEvaluationForm.formDescription
      }
      manualApiCallPencilit(`/api/v1/evalutation/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    }
  }

  const handleSelect = (index) => {
    setSelectedIndex(index);
  }

  const onCancel = () => {

  }

  const showSendMessageButton = ((currentView === 'send' && !isSent && !limitExceeded && !requestRateExceeded) || (currentView === 'edit' && !isEditedSent && !limitExceeded && !requestRateExceeded) || !['edit', 'send'].includes(currentView)) && selectedIndex === 2


  const removeUrlParameter = (url, parameter) => {
    var urlParts = url.split('?');

    if (urlParts.length >= 2) {
      // Get first part, and remove from array
      var urlBase = urlParts.shift();

      // Join it back up
      var queryString = urlParts.join('?');

      var prefix = encodeURIComponent(parameter) + '=';
      var parts = queryString.split(/[&;]/g);

      // Reverse iteration as may be destructive
      for (var i = parts.length; i-- > 0;) {
        // Idiom for string.startsWith
        if (parts[i].lastIndexOf(prefix, 0) !== -1) {
          parts.splice(i, 1);
        }
      }

      url = urlBase + '?' + parts.join('&');
    }

    return url;
  }


  const variableTranslator = (variableTag, minutes) => {
    const prospectData = data.filter(itm => itm.id === selected[0])[0]
    const firstName = prospectData.firstName
    const lastName = prospectData.lastName
    const fullName = prospectData.fullName
    const linkName = prospectData.fullName.replace(/\s/g, '')
    return variableTag.replace(/{{.First_Name}}/g, firstName)
      .replace(/{{.Last_Name}}/g, lastName)
      .replace(/{{.Full_Name}}/g, fullName)
      .replace(/{{.School_Name}}/g, 'Midtown High School')
      .replace(/{{.Job_Title}}/g, jobData.jobTitle) // data[0].jobTitle
      .replace(/{{.My_Name}}/g, user.name)
      .replace(/{{.My_First_Name}}/g, user.name.split(" ")[0])
      .replace(/{{.My_Full_Name}}/g, user.name)
      .replace(/{{.User_Name}}/g, user.name)
      .replace(/{{.Current_Company}}/g, 'The Daily Bugle')
      .replace(/{{.Current_Title}}/g, 'Photographer')
      .replace(/{{.Meeting_Link}}/g, `https://pencilit.io/${linkName}/${user.name}/${minutes}mins`)
  }

  return (
    <div>
      <div>
        <div className="top-label-container-meeting">
          <span>
            <div>
              {currentView === 'send' && <h2>Sending Messages</h2>}
              {currentView === 'edit' && <h2>Send Unsent Messages</h2>}
              {!(['edit', 'send'].includes(currentView)) && <h2>Request a Meeting</h2>}

              {currentView === 'edit' && <p>{failedMessages.length} recipients</p>}
              {currentView === 'send' && <p>{selected.length} recipients</p>}
              {!(['edit', 'send'].includes(currentView)) && <p>To be sent to {selected.length} recipients</p>}
            </div>
          </span>
          <div>
            {currentView === 'send' && !limitExceeded && !isSent && !requestRateExceeded &&
              <span>
                <Button
                  className="resumeStopButton"
                  color='danger'
                  outline
                  style={{borderRadius: '8px'}}
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
            } {currentView === 'send' && isSent &&
              <span>
                <Button
                  color="primary"
                  outline
                  style={{borderRadius: '8px'}}
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
                    fontSize: '16px',
                    height: '42px',
                    marginRight: '16px',
                    borderRadius: '8px'
                  }}
                  onClick={() => {
                    setView('ScoreAndConnect')
                  }}>
                  Discard
              </Button>
              </span>}
            {
              !(isSending || isSendingEdited) && currentView === 'edit' ?
                <Button
                  style={{
                    height: '42px',
                    fontSize: '16px',
                    borderRadius: '8px'
                  }}
                  color='primary'
                  outline
                  onClick={() => {
                    if (currentView === 'send') {
                      connectMessage(2)
                      setView('ScoreAndConnect')
                      resetPageOnBack()
                      // setCurrentView(null)
                      setSelectAllProspectsFlag(false)

                    } else {
                      connectMessage(2)
                      setView('ScoreAndConnect')
                      resetPageOnBack()
                      setSelectAllProspectsFlag(false)
                    }
                  }}>
                  Back To Prospects
                </Button>
                :
                []
            }
            {showSendMessageButton && accountIntegrated && skipZoom === 9 && currentView === 'edit' && !step3 &&
              <span>
                <Button style={{ marginLeft: '10px' }}
                  color='primary'
                  className='sendMessageButton'
                  style={{borderRadius: '8px'}}
                  onClick={currentView === 'edit' ? handleClickSendEdited : handleClickSend}
                  disabled={
                    currentView === 'edit' ?
                      selectedFailed.length === 0 :
                      (isSendingEdited || isSending || limitExceeded)
                  }
                >
                  {(isSending || isSendingEdited) ? <Loader /> : 'Send Message'}
                </Button>
              </span>
            }
          </div>
        </div>

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
        <div className='row accountIntegrationPanel requestMessageBody'>
          <div style={{ display: 'flex',justifyContent: 'center',width: '100%'}}>
            {accountIntegration && !profileIntegration &&
              <div style={{ width: '600px', paddingTop: '32px' }}>
                <p>Please configure your meetings by connecting your calendar and meeting channel to start using this
              feature.</p>
                <div className="buttonMeeting mt-4">
                  <Button
                    id={'calendarMeetingRequestBtn'}
                    color="primary t-2"
                    className="filterApplyButton"
                    onClick={() => {
                      if (parseInt(dailyLimit.sent, 10) >= parseInt(dailyLimit.limit, 10)) {
                        return
                      } else {
                        setProfileIntegration(true)
                      }
                    }}
                    disabled={parseInt(dailyLimit.sent, 10) >= parseInt(dailyLimit.limit, 10)}
                  >
                    Configure Meetings
              </Button>
                </div>
              </div>
            }
            {profileIntegration &&
              <div style={{ margin: '5% 40%', width: '900px' }}>
                <div >
                  <div className="vertical-center d-flex justify-content-center">
                    <div className="boxTitle">
                      <h4>Configure your Meetings</h4>
                      <p className="MeetingStepInfoTag">
                        Step 1 of 3: Complete Profile Details
                  </p>
                      <div className="form-group">
                        <label htmlFor="">Create your Username</label>
                        <div className="input-group mb-3">
                          <label htmlFor="">Pencilit.io/ </label>
                          <input
                            type="text"
                            id="slug-field"
                            required={true}
                            className={_errors.slug || integratePencilitAccount.data.errors ? "form-control is-invalid" : "form-control"}
                            name="slug"
                            value={slug}
                            onChange={e => { setErrors({}); integratePencilitAccount.data = ''; setSlug(e.target.value) }}
                          />
                        </div>
                        {_errors && _errors.slug &&
                          <div className="error invalid-feedback" style={{ display: 'block' }}>{_errors.slug}</div>
                        }
                        {integratePencilitAccount.data.errors &&
                          <div className="error invalid-feedback" style={{ display: 'block' }}>{integratePencilitAccount.data.errors.slug_url}</div>
                        }
                      </div>
                      <label htmlFor="">Select your Timezone</label>

                      <TimezonePicker
                        absolute={false}
                        //   defaultValue  = {timeZone}
                        placeholder="Select Timezone..."
                        onChange={zone => setTimeZone(zone)}
                        value={timeZone}
                      />
                      <div className="integrationSubmitButton">

                        <Button
                          className="filterbuttons"
                          id="submitIntegrationForm"
                          outline
                          color="primary"
                          onClick={updateSetings}
                          disabled={parseInt(dailyLimit.sent, 10) >= parseInt(dailyLimit.limit, 10) || integratePencilitAccount.isLoading ? true : false}
                        >
                          {
                            integratePencilitAccount.isLoading &&
                            <div className='d-inline btnConfigureMeeting'>
                              <Loader color='blue' />
                            </div>
                          }

                  Configure Meetings
                </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            {calendarIntegration &&
              <div style={{ margin: '5% 40%', width: '900px' }}>
                <div className="col-md-12">
                  <div className="vertical-center d-flex justify-content-center">
                    <div className="boxTitle">
                      <h4>Configure your Meetings</h4>
                      <p className="MeetingStepInfoTag">
                        Step 2 of 3: Connect your Calendar
                  </p>
                      <div>
                        <a
                          href={googleCalendarLink}
                          className="socialLoginButton"
                          onClick={() => {
                            manualApiCall('/api/auth/user/activity/store', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({
                                "actionName": `CONFIGURE_CALENDER_WITH_GOOGLE`
                              })
                            })
                          }}>

                          <span className="calendarIcon">
                            <img width="24" height="24" src="../../../../img/googleIcon.png" alt="google Icon" />
                          </span>
                  Connect Google
                </a>
                      </div>
                      <div>
                        <a
                          href={outlookCalendarLink}
                          className="socialLoginButton"
                          onClick={() => {
                            manualApiCall('/api/auth/user/activity/store', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({
                                "actionName": `CONFIGURE_CALENDER_WITH_OUTLOOK`,
                                "jobId": params.jId

                              })
                            })
                          }}>
                          <span className="calendarIcon">
                            <img width="24" height="24" src="../../../img/outlookIcon.png" alt="outlook Icon" /></span>
                      Connect Outlook
                    </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            {zoomIntegration && skipZoom === 5 &&
              <div style={{ margin: '5% 40%', width: '900px' }}>
                <div className="col-md-12">
                  <div className="vertical-center d-flex justify-content-center">
                    <div className="boxTitle">
                      <h4>Configure your Meetings</h4>
                      <div className="zoomMeetingIntegrationStepConatiner">
                        <p className="MeetingStepInfoTag">
                          Step 3 of 3: Connect your Meeting Channel
                  </p>
                        <p className="zoomMeetingIntegrationStepOptionalTag">
                          {"(Optional)"}
                        </p>
                      </div>
                      <a
                        href={zoomCalendarLink}
                        className="socialLoginButton"
                        onClick={() => {
                          manualApiCall('/api/auth/user/activity/store', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                              "actionName": `INTEGRATE_ZOOM`
                            })
                          })
                        }}>

                        <span>
                          <img width="24" height="24" src="../../../../img/zoomLogo.png" alt="Zoom Icon" />
                        </span>
                    Connect Zoom
                  </a>
                      <p
                        className="skipZoomMeetingLink"
                        onClick={handleSkipZoomFlow}>
                        Skip this for now
                  </p>
                    </div>
                  </div>
                </div>
              </div>
            }
            {accountIntegrated && (skipZoom === 2 || skipZoom === 1) &&
              <div style={{ margin: '5% 40%', width: '900px' }}>
                <div className="col-md-12">
                  <div className="vertical-center d-flex justify-content-center">
                    <div className="boxTitle">
                      <h4>All Done</h4>
                      <div className="zoomMeetingIntegrationStepConatiner">
                        <p className="MeetingStepInfoTag">
                          {`You will now be able to set up ${skipZoom === 2 ? "zoom" : "phone"} meetings with your prospects.`}
                        </p>
                      </div>
                      <Button
                        color='primary'
                        className="confirmaToMessagesButton"
                        onClick={handleConfirmToMessagesButton}>
                        ComposeMessage
                  </Button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
        {!((currentView === 'send') || (currentView === 'edit')) &&
          <ul className="requestMessageBody">
            {(accountIntegrated && isLoading) &&
              <li className="requestMessageContainer">
                <div className="LoaderRequestMeeting">
                  <Loader color='blue' height='100px' width='100px' />
                </div>
              </li>
            }
            {(accountIntegrated && !isLoading && skipZoom === 9) &&

              <li className="preEvalTabContainer">
                <Tabs
                  selectedIndex={selectedIndex}
                  onSelect={handleSelect}
                >
                  <TabList className="preEvalTabs">
                    <Tab > {`${!step1 ? "✔" : ""} Choose Meeting Type`}</Tab>
                    <hr className="preEvalTabsSeperator" />
                    {/* <Tab disabled={step1}>Set Availability</Tab> */}
                    <Tab disabled={step1 || step2}> {`${!(step3) ? "✔" : ""} Compose Pre Evaluation Form`} </Tab>
                    <hr className="preEvalTabsSeperator" />
                    <Tab disabled={step2 || step3}> {` Compose Message`}</Tab>
                  </TabList>
                  <TabPanel>
                    <MeetingType
                      meetingSlot={meetingSlot}
                      onSelectMeeting={onSelectMeeting}
                      dispatch={dispatch} />
                  </TabPanel>
                  {/* <TabPanel>
                      <div>Set Availability</div>
                    </TabPanel> */}
                  <TabPanel>
                    <PreEvaluationForm
                      addPreEValForm={addPreEValForm}
                      onSetPreEvalForm={onSetPreEvalForm}
                      onSetPreEvalFormData={onSetPreEvalFormData}
                      onSkipToComposeMessage={onSkipToComposeMessage}
                      dispatch={dispatch}
                      addMode={true}
                      data={data} />
                  </TabPanel>
                  <TabPanel>
                    <div className="secondary-label-container-message">
                      <span style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginLeft: '1.2%' }}>
                        <p className="compose-message-label" >
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
                                    connectMessage(2)
                                    setView('ScoreAndConnect')
                                  }}>
                                  Discard
                              </Button>
                              </span>}
                            {showSendMessageButton && accountIntegrated && skipZoom === 9 && !(currentView === 'send') && !step3 &&
                              <span>
                                <Button style={{ marginLeft: '10px' }}
                                  color='primary'
                                  className='sendMessageButton'
                                  onClick={currentView === 'edit' ? handleClickSendEdited : handleClickSend}
                                  disabled={
                                    currentView === 'edit' ?
                                      selectedFailed.length === 0 :
                                      (isSendingEdited || isSending || limitExceeded)
                                  }
                                >
                                  {(isSending || isSendingEdited) ? <Loader /> : 'Send Message'}
                                </Button>
                              </span>
                            }

                          </div>
                        </div>
                      }

                    </div>
                    <div className="preEvalTabPanelConatiner">
                      <MessagesFlow
                        messageEnabled={messageEnabled}
                        setMessageEnabled={setMessageEnabled}
                        Drop={Drop}
                        setDrop={setDrop}
                        sampleZoom15Message={sampleMessage15}
                        sampleZoom30Message={sampleMessage30}
                        variableTranslator={variableTranslator}
                        dispatch={dispatch}
                        setPreviewMessage={setPreviewMessage}
                        connectionType={connectionType}
                        toggle={toggle}
                        meetingType15={"15"}
                        meetingType30={"30"}
                        data={data} />
                      <FollowUpMeetings
                        followUpMessage1Enabled={followUpMessage1Enabled}
                        followUpMessage1Template={followUp1Message}
                        followUpMessage1Days={followUpMessage1Days}
                        followUpMessage2Enabled={followUpMessage2Enabled}
                        followUpMessage2Template={followUp2Message}
                        followUpMessage2Days={followUpMessage2Days}
                        messageEnabled={messageEnabled}
                        connectionType={connectionType}
                        connectMessageFirstDegree={connectMessageFirstDegree}
                        followUp1MessageFirstDegree={followUp1MessageFirstDegree}
                        followUp2MessageFirstDegree={followUp2MessageFirstDegree}
                        setMessageEnabled={setMessageEnabled}
                        setPreviewMessage={setPreviewMessage}
                        toggle={toggle}
                        variableTranslator={variableTranslator}
                        dispatch={dispatch}
                        meetingTime={Drop.time === '15 Minutes Long' ?
                          '15' :
                          Drop.time === '30 Minutes Long' ?
                            '30' : ''}
                        data={data}
                      />
                    </div>
                  </TabPanel>
                </Tabs>
              </li>}
          </ul>
        }
      </div>
      <MessagePreview
        toggle={toggle}
        description={previewMessage}
        modal={modal} />
    </div>
  )

}


const ReqMeetingWrapper = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [visited, setVisited] = useState(false)
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true)
    chrome.storage.local.get('visited', (res) => {
      if (res?.visited) {
        setVisited(true)
        setIsLoading(false)
      }
      else {
        chrome.storage.local.set({ visited: true })
        setVisited(false)
        setIsLoading(false)
      }
    })
  }, [])

  return (
    <>
      {!isLoading ?
        <RequestMeeting
          visited={visited}
          {...props} /> :
        null}
    </>
  )
}


export default connect(state => ({
  meetingSettings: state.score.meetingSettings,
  integratePencilitAccount: state.score.integratePencilitAccount,
  messageSettings: state.score.messageSettings,
  user: state.auth.user,
  preEvaluationForm: state.score.preEvaluationForm
}))(withRouter(ReqMeetingWrapper))


// export default ReqMeetingWrapper