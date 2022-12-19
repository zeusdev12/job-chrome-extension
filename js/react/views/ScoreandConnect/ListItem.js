import React, { useState, useRef, memo } from "react";
import { onlyUpdateForKeys } from 'recompose'
import { withRouter } from 'react-router-dom'
import qs from 'query-string'
import moment from 'moment'


import {
  selectProspect,
  unselectProspect,
  enhanceProfile
} from '../../actions/score'
import Loader from '../../components/Loader'
import { getToken } from '../../utils/index'
import { Container, Button, Card, CardBody, CardHeader, Row, Col, Progress, Input, Collapse, Tooltip } from 'reactstrap'
import './style.css'

import DropDownIcon from '../../../../img/dropdown.svg'

import DisplayPlaceholder from '../../../../img/displayPlaceholder.svg'
import SaveProspectGrey from '../../../../img/SaveProspectGrey.svg'
import SaveIconHover from '../../../../img/SaveIconHover.svg'
import UnsaveProspectBlue from '../../../../img/UnsaveProspectBlue.svg'
import CalendarGrey from '../../../../img/calendar_grey.svg'

import DropDownSkills from "./DropDownSkills"

import LinkedIcon from '../../../../img/LinkedinIcon.svg'
import MoreDetails from "./MoreDetails";
import OldJobsSkillsComponent from "./OldJobsSkillsComponent";

import { NotesSection } from './NotesSection'
import { ActivitiesSection } from './ActivitiesSection'

import {
  saveProspects,
  unsaveProspects
} from '../../actions/score'

import { manualApiCall } from '../../utils'

const progressItems = [{
  id: 1,
  name: 'Current Title',
  tag: 'title'
}, {
  id: 2,
  name: 'Experience',
  tag: 'experience'
}, {
  id: 3,
  name: 'Education',
  tag: 'education'
}, {
  id: 4,
  name: 'Skills',
  tag: 'skill'
}, {
  id: 5,
  name: 'Industry',
  tag: 'industry'

},]

// const months = [{
//   id: 1,
//   name: 'Jan'
// },{
//   id: 2,
//   name: 'Feb'
// },{
//   id: 3,
//   name: 'Mar'
// },{
//   id: 4,
//   name: 'Apr'
// },{
//   id: 5,
//   name: 'May'
// },{
//   id: 6,
//   name: 'Jun'
// },{
//   id: 7,
//   name: 'Jul'
// },{
//   id: 8,
//   name: 'Aug'
// },{
//   id: 9,
//   name: 'Sep'
// },{
//   id: 10,
//   name: 'Oct'
// },{
//   id: 11,
//   name: 'Nov'
// },{
//   id: 12,
//   name: 'Dec'
// }
// ]



const ListItem = memo(({
  composeMessageState,
  requestMeetingState,
  isArchiving,
  isUnarchiving,
  isDownloading,
  activeTab,
  index,
  userName,
  ownerName,
  // SelectAllProspectsFlag,
  setSelectAllProspectsFlag,
  // moreDetailsPopUp,
  // setMoreDetailsPopUp,
  item,
  // selected,
  isSelected,
  selectedCount,
  isEnhancing,
  dispatch,
  totalRecord,
  loadingActivities,
  setRefState,
  thisUser,
  // refState,
  location: {
    search
  }
}) => {

  const [seeMoreExp, setSeeMoreExp] = useState(false)
  const [DisplayPictureURL, setDisplayPictureURL] = useState(item.imageUrl)
  const [TooltipSaveOpen, setTooltipSaveOpen] = useState(false)
  const [TooltipUnsaveOpen, setTooltipUnsaveOpen] = useState(false)
  const [currCompanyTooltip, setcurrCompanyTooltip] = useState(false)
  const [showActivities, setShowActivities] = useState(true)
  const [showNotes, setShowNotes] = useState(true)
  const [moreDetailsPopUp, setMoreDetailsPopUp] = useState(false)
  const SaveIconRef = useRef(null)
  const UnsaveIconRef = useRef(null)
  const params = qs.parse(search)
  const NA = <a className="notAvailable">Not Available</a>

  let educationArr = []

  const totalExperiences = item.experience ?
    item.experience.map((itm, idx) => {
      const job = itm.title ? itm.title : ''


      const company = itm?.company_name ? itm?.company_name : ''

      const start = itm.start ?
        moment(itm.start, 'MM-YYYY').format('MMM YY') == 'Invalid date' ?
          moment(itm.start, 'YYYY').format('YY') == 'Invalid date' ? itm.start :
            moment(itm.start, 'YYYY').format('YY') :
          moment(itm.start, 'MM-YYYY').format('MMM YY') : ''

      const end = itm.end ?
        moment(itm.end, 'MM-YYYY').format('MMM YY') == 'Invalid date' ?
          moment(itm.end, 'YYYY').format('YY') == 'Invalid date' ? itm.end :
            moment(itm.end, 'YYYY').format('YY') :
          moment(itm.end, 'MM-YYYY').format('MMM YY') : itm.start ? 'Now' : ''

      const diff = end === '' && start === '' ? '' : end === 'Now' ?
        moment(itm.start, 'MM-YYYY').fromNow(true) == 'Invalid date' ?
          moment(itm.start.slice(-4), 'YYYY').fromNow(true) == 'Invalid date' ? '' :
            moment(itm.start.slice(-4), 'YYYY').fromNow(true) :
          moment(itm.start, 'MM-YYYY').fromNow(true) : start === end ? '1 month' :
          moment(itm.start, 'MM-YYYY').from(moment(itm.end, 'MM-YYYY'), true) == 'Invalid date' ?
            moment(itm.start.slice(-4), 'YYYY').from(moment(itm.end.slice(-4), 'YYYY'), true) == 'Invalid date' ? '' :
              moment(itm.start.slice(-4), 'YYYY').from(moment(itm.end.slice(-4), 'YYYY'), true) :
            moment(itm.start, 'MM-YYYY').from(moment(itm.end, 'MM-YYYY'), true)

      let diffMonths = false
      return { date: start && end && `${start} - ${end}`, job: `${job}`, company: company === '' ? false : `@ ${company}`, timeSpan: `${diff[0] === 'a' ? '1' + diff.slice(1) : diff} ${diffMonths ? diffMonths : ''}` }
    }) : []


  let ethnicity = null
  let maxEthnicity = 0.0

  let totalExperience = null
  let relevantExperienceTime = []
  let relevantExperiences = []

  if (item?.scoring?.experience_found) {
    item?.scoring?.experience_found.forEach((exp, i) => {
      if (exp.includes('prospect has worked')) {
        relevantExperienceTime.push(exp
          .split(' ')
          .slice(exp.split(' ').lastIndexOf('for') + 1)
          .join(' '))
        relevantExperiences.push(exp
          .split(' ')
          .slice(3)
          .slice(0, exp
            .split(' ')
            .slice(3)
            .lastIndexOf('for'))
          .join(' ')
        )
      }
      else if (exp.includes('of total experience')) {
        totalExperience = exp
          .split(' ')
          .slice(0, 2)
          .join(' ')
      }
      else if (exp.includes('The prospect has previously worked')) {
        return null
      }
      else if (i + 1 === item?.scoring?.experience_found?.length) {
        totalExperience = exp
      }
      else {
        relevantExperienceTime.push(exp
          .split(' ')
          .slice(exp.split(' ').lastIndexOf('for') + 1)
          .join(' '))
        relevantExperiences.push(exp
          .split(' ')
          .slice(0, exp.split(' ').lastIndexOf('for'))
          .join(' ')
        )
      }
    })
  }
  

  const handleChangeCheckbox = (id) => {
    
    const params = qs.parse(search)
    // dispatch(selected.includes(id) ? unselectProspect(id) : selectProspect(id))
    dispatch(isSelected ? unselectProspect(id) : selectProspect(id))


    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "actionName": "TOGGLE_SELECT_PROSPECTS",
          "jobId": params.jId
        })
      })

    if (!isSelected && selectedCount + 1 === totalRecord)
      setSelectAllProspectsFlag(true)

    else
      setSelectAllProspectsFlag(false)
  }

  const handleClickEnhanceProfile = (prospect) => {
    const params = qs.parse(search)


    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "actionName": "ENHANCE_PROFILE",
          "jobId": params.jId
        })
      })


    getToken()
      .then(token => {
        dispatch(enhanceProfile({
          publicIdentifier: prospect.publicIdentifier,
          id: prospect.id,
          jobId: params.jId,
          token: token,
          profileUrl: prospect.profileUrl
        }))
      })
    setRefState(item.id)

  }

  const handleSaveProspect = (e, pId) => {
    const params = qs.parse(search)
    setTooltipSaveOpen(false)



    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "actionName": "SAVE_PROSPECTS",
          "jobId": params.jId
        })
      })


    dispatch(saveProspects({ jobId: params.jId, prospects: [pId], saveFilterFlag: qs.parse(search)?.sF === 'Saved' }))

  }
  const handleUnsaveProspect = (e, pId) => {
    const params = qs.parse(search)
    setTooltipUnsaveOpen(false)

    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "actionName": "UNSAVE_PROSPECTS",
          "jobId": params.jId
        })
      })


    dispatch(unsaveProspects({ jobId: params.jId, prospects: [pId], saveFilterFlag: qs.parse(search)?.sF === 'Saved' }))

  }

  educationArr = item.education ? item.education.map(({ end, degreeName, schoolName }) => {
    return {
      date: degreeName || schoolName ? end ? end : '' : '',
      degree: `${!degreeName && !schoolName ? '' :
        `${degreeName ? degreeName : ''} ${degreeName && schoolName ?
          'from' : ''} ${schoolName ? schoolName : ''}`}`
    }
  }) : []



  if (item.ethnicity) {
    for (const [key, value] of Object.entries(item.ethnicity)) {
      if (parseFloat(value) > maxEthnicity) {
        maxEthnicity = parseFloat(value);
        ethnicity = key;
      }
    }
  }

  const Education = (props) => {
    const eduDateFlag = props.educationArr.length > 0 ? props.educationArr.every(({ date }) => !date) : false
    return (props.educationArr.length > 0 ?
      props.educationArr.map(({ date, degree }, i) =>
        <div key={i}>
          <div className='expContainer'>
            {eduDateFlag ? ''
              : date ?
                <p className='exp1'>
                  {date}
                </p> : <p className='exp1'>{''}</p>}
            {degree ?
              <p key={i} className="exp2">
                {degree}
              </p> : NA}
          </div>
          {i < props.educationArr.length - 1 && <hr className="bar" />}
        </ div>) : NA)
  }

  const findClosedCompany = (exp) => {
    const arr = exp
      .trim()
      .split(' ')
      .map(itm => itm === 'at' ? '@' : itm)
    if (arr[arr.length - 1] === '@')
      return [...arr].slice(0, -1).join(' ')
    return arr.join(' ')
  }

  const getRelevantTime = time => {
    return `${time}`
  }

  const RelevantExperience = (props) => {

    return (props.relevantExperiences.length > 0 ?
      props.relevantExperiences.map((exp, i) => (
        <div key={i} style={{ width: '100%' }}>
          <div className='expContainer'>
            {props.relevantExperienceTime[i] ?
              <p className='exp1'>
                {getRelevantTime(props.relevantExperienceTime[i])}
              </p> : ''}
            {exp ? <p className='exp2'>{findClosedCompany(exp)}</p> : NA}
          </div>
          {i < props.relevantExperiences.length - 1 && <hr className="bar" />}
        </div>)) : NA)
  }
  

  const TotalExperience = ({ totalExperiences, setcurrCompanyTooltip, currCompanyTooltip, pId }) =>
    totalExperiences.length > 0 ?
      totalExperiences.length < 4 ?
        totalExperiences.map(({ date, job, company, timeSpan }, i) =>
          <div key={`a${i}`} style={{ width: '100%' }}>
            <div className='expContainer'>
              <p className='exp1'>
                {date}
              </p>
              <div className='exp2'>
                {job}
                {i === 0 ?
                  <span className="currentCompanyTagContainer">
                    <a
                      className="currentCompanyTag"
                      id={`currentCompanyTag${pId}`}
                      onMouseEnter={() => setcurrCompanyTooltip(true)}
                    >
                      {company ? company : ""}
                    </a>
                    <Tooltip
                      className='currentCompanyTagTooltip'
                      target={`currentCompanyTag${pId}`}
                      placement='auto'
                      isOpen={currCompanyTooltip}
                    // toggle={() => setcurrCompanyTooltip(prev => !prev)}
                    >
                      Current Company
                    </Tooltip>
                  </ span> :
                  `${company ? company : ""}`}
                <span className='verBar' />
                <a className='timeSpan'>{timeSpan}</a>
              </ div>
            </div>
            {i < totalExperiences.length - 1 && <hr className="bar" />}
          </div>) :
        <React.Fragment>
          {totalExperiences.slice(0, 3).map(({ date, job, company, timeSpan }, i) =>
            <div key={`a${i}`} style={{ width: '100%' }}>
              <div className='expContainer'>
                <p className='exp1'>
                  {date}
                </p>
                <p className='exp2'>
                  {job}
                  {i === 0 ?
                    <span className="currentCompanyTagContainer">
                      <a
                        className="currentCompanyTag"
                        id={`currentCompanyTag${pId}`}
                      >
                        {company ? company : ""}
                      </a>
                      <Tooltip
                        target={`currentCompanyTag${pId}`}
                        placement='top'
                        isOpen={currCompanyTooltip}
                        toggle={() => setcurrCompanyTooltip(prev => !prev)}
                      >
                        Current Company
                        </Tooltip>
                    </ span> :
                    `${company ? company : ""}`}
                  <span className='verBar' />
                  <a className='timeSpan'>{timeSpan}</a>
                </p>
              </div>
              {<hr className="bar" />}
            </div>
          )}
        </React.Fragment> : NA

  const CurrentCompanySmallBatch = ({
    currentCompanySize,
    currentCompanyIndustry,
    currentCompanyName
  }) => (
    currentCompanySize &&
      currentCompanyIndustry &&
      currentCompanyName ?
      <div className="currentCompanySmallBatchContainer">
        <p style={{ borderRight: `${currentCompanySize && currentCompanyIndustry ? '1px solid #555555' : 'none'}` }}>
          {currentCompanySize ? currentCompanySize : ""}
        </p>
        {currentCompanyIndustry ? currentCompanyIndustry : ""}
      </ div> : NA
  )


  const getHeadline = (headline) => headline
    .trim()
    .split(' ')
    .map(itm => itm === 'at' ? '@' : itm)
    .join(' ')

  const getAddedDate = (addedDate) => {
    // var a = moment([2007, 0, 28]);
    // var b = moment([2007, 0, 29]);
    // a.from(b) // "a day ago"
    const days = moment().diff(addedDate.slice(0, 10), 'days')
    const months = moment().diff(addedDate.slice(0, 10), 'months')
    const years = moment().diff(addedDate.slice(0, 10), 'years')
    switch (true) {
      case days === 0:
      case days === 1:
        return `today`
      case days > 1 && days < 7:
        return `${days} days ago`
      case days > 6 && days < 14:
        return `a week ago`
      case days > 13 && days < 21:
        return `2 weeks ago`
      case days > 20 && days < 30:
        return `3 weeks ago`
      case days > 29 && days < 60:
        return `a month ago`
      case days > 59 && days < 365:
        return `${months} months ago`
      case days > 364 && days < 730:
        return `a year ago`
      case days > 729:
        return `${years} years ago`
    }
  }

  const getMeetingDate = (dateAndTime) => {
    const x = new Date(dateAndTime)
    return `${x.toLocaleString('en-US', { hour: 'numeric', hour12: true })}, ${x.toDateString().split(" ")[1]} ${x.toDateString().split(" ")[2]}`
  }

  const byYou = (name) => name.toLowerCase() === thisUser?.name.toLowerCase() ? 'You' : name

  return (
    <div className="sectionlist" key={item.id} id={item.id}>
      <ul>
        <li >
          {item.scoringType !== "DEEP" ?
            <React.Fragment>
              <Card className="scorecard-container">
                <CardHeader
                  className="cardHeader"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <div className="prospectActionContainer">
                      <div className="prospectSelectionContainer">
                        <Input
                          type="checkbox"
                          name="prospect"
                          className="checkbox"
                          onChange={() => handleChangeCheckbox(item.id)}
                          checked={isSelected} />
                        <div className='prospectIndexContainer'>
                          <p className='prospectIndex'>
                            {index + 1}
                          </p>
                        </div>
                      </div>
                    </div>
                    <img
                      className="enhanceDisplayPicture"
                      src={DisplayPictureURL ? DisplayPictureURL : DisplayPlaceholder}
                      onError={() => setDisplayPictureURL(DisplayPlaceholder)} />
                    <h2 className='displayName'>{item.fullName}</h2>
                    <a
                      href={item.profileUrl}
                      target='_blank' >
                      <img
                        className='linkedIcon'
                        src={LinkedIcon}
                        alt="Linkedin Profile" /></a>
                    {/* <p className='connectionDegree'>
                      {item.connectionDegree ? item.connectionDegree : '3rd'}
                    </p> */}
                  </div>
                  <Button
                    disabled={isEnhancing}
                    outline
                    color='primary'
                    style={{ width: '145px' }}
                    onClick={() => handleClickEnhanceProfile(item)}
                  >
                    {isEnhancing ? <Loader color={'#007bff'} /> : 'Enhance Profile'}
                  </Button>
                </CardHeader>
                <CardBody>
                  <Container className="scoreContainer" style={{ display: 'block' }} >
                    <Row className="odd">
                      <Col className="values">
                        <div className="attributes" xs="3" lg="3" md="3" >
                          <h6 className="boldAttributes">
                            Current Title
                          </h6>
                        </div>
                        {item.headline ? <p className="info">{item.headline}</p> : NA}
                      </Col>
                    </Row>
                    <Row className="even">
                      <Col className="values">
                        <div className="attributes" xs="3" lg="3" md="3">
                          <h6 className="boldAttributes">
                            Location
                          </h6>
                        </div>
                        {item.locationName ? <p className="info">{item.locationName}</p> : NA}
                      </Col>
                    </Row>
                  </Container>
                </ CardBody>
              </ Card>
            </React.Fragment> :
            <React.Fragment>
              <Card className="scorecard-container">
                <CardBody>
                  <Container className="scoreContainer">
                    <span className="sidebarContainer">
                      <div className="sidebar">
                        <div className="prospectActionContainer">
                          <div className="prospectSelectionContainer">
                            <Input
                              type="checkbox"
                              name="prospect"
                              className="checkbox"
                              onChange={() => handleChangeCheckbox(item.id)}
                              checked={isSelected} />
                            <div className='prospectIndexContainer'>
                              <p className='prospectIndex'>
                                {index + 1}
                              </p>
                            </div>
                          </div>
                          {!(["Archived"].includes(qs.parse(search).tF)) &&
                            <React.Fragment>
                              {item.saved ?
                                <React.Fragment>
                                  <Button
                                    disabled={composeMessageState.isLoading ||
                                      requestMeetingState.isLoading ||
                                      isDownloading || isArchiving || isUnarchiving}
                                    id={`unsaveIcnBtn${item.id}`}
                                    outline color="secondary"
                                    onClick={(e) => handleUnsaveProspect(e, item.jobProfileId)}
                                    onMouseEnter={() => {
                                      UnsaveIconRef.current.src = SaveIconHover
                                      setTooltipUnsaveOpen(true)
                                    }}
                                    onMouseOut={() => {
                                      UnsaveIconRef.current.src = UnsaveProspectBlue
                                      setTooltipUnsaveOpen(false)
                                    }}
                                    className='bookmarkProspectIconButton'>
                                    <img
                                      ref={UnsaveIconRef}
                                      src={UnsaveProspectBlue}
                                      className="bookmarkProspectIcon" />
                                  </Button>
                                  <Tooltip
                                    target={`unsaveIcnBtn${item.id}`}
                                    placement='bottom'
                                    isOpen={TooltipUnsaveOpen}
                                    // fade={true}
                                    style={{ zIndex: 9 }}
                                    className='tooltip-root'>
                                    Unsave this prospect
                              </Tooltip>
                                </React.Fragment> :
                                <React.Fragment>
                                  <Button
                                    disabled={composeMessageState.isLoading ||
                                      requestMeetingState.isLoading ||
                                      isDownloading || isArchiving || isUnarchiving}
                                    id={`saveIcnBtn${item.id}`}
                                    outline color="secondary"
                                    onClick={(e) => handleSaveProspect(e, item.jobProfileId)}
                                    onMouseEnter={() => {
                                      SaveIconRef.current.src = SaveIconHover
                                      setTooltipSaveOpen(true)
                                    }}
                                    onMouseOut={() => {
                                      SaveIconRef.current.src = SaveProspectGrey
                                      setTooltipSaveOpen(false)
                                    }}
                                    className='bookmarkProspectIconButton'>
                                    <img
                                      ref={SaveIconRef}
                                      src={SaveProspectGrey}
                                      className="bookmarkProspectIcon" />
                                  </Button>
                                  <Tooltip
                                    target={`saveIcnBtn${item.id}`}
                                    placement='bottom'
                                    isOpen={TooltipSaveOpen}
                                    // fade={true}
                                    style={{ zIndex: 9 }}
                                    className='tooltip-root'>
                                    Save this prospect
                                </Tooltip>
                                </React.Fragment>}
                            </React.Fragment>}
                        </div>
                        <div className='displayProspectContainer'>
                          <img
                            className="displayPicture"
                            src={DisplayPictureURL ? DisplayPictureURL : DisplayPlaceholder}
                            onError={() => setDisplayPictureURL(DisplayPlaceholder)} />
                          <div className='displayNameContainer'>
                            <h2 className='displayName' >
                              {item.fullName}
                            </h2>
                            <a
                              href={item.profileUrl}
                              target='_blank' >
                              <img
                                className='linkedIcon'
                                src={LinkedIcon}
                                alt="Linkedin Profile" />
                            </a>
                            {/* <p className='connectionDegree'>
                              {item.connectionDegree ? item.connectionDegree : '3rd'}
                            </p> */}
                          </div>
                          {item.headline ? <p className="info">{getHeadline(item?.headline)}</p> : NA}
                          {item?.experience && item?.experience[0] && item?.experience[0]?.location ? <p className="info locationInfo">{item.experience[0].location}</p> : ''}
                          <div className="prospectTagContainer">
                            {/* {item?.addedAt &&  
                                <p className="downloadedProspectTag">
                                  {getAddedDate(item.addedAt)}
                                </p>} */}
                            {item?.isDownloaded && activeTab !== 'Downloaded' &&
                              <p className="downloadedProspectTag">
                                Downloaded
                                </p>}
                            </div>
                            {(() => {
                                switch (activeTab) {
                                  case "ConnectMessaged":
                                  case "FollowUp1st":
                                  case "FollowUp2nd":
                                  case "Replied":  
                                      return (
                                        <div className="prospectTagContainer prospectTagMargins">
                                          {item?.messagedBy &&
                                            <p className="downloadedProspectTag">
                                              {`${ 
                                                  (() => {
                                                    switch (activeTab) {
                                                      default:
                                                      case "ConnectMessaged":
                                                        return `Messaged`
                                                      case "FollowUp1st":
                                                        return `1st Follow Up`
                                                      case "FollowUp2nd":
                                                        return `2nd Follow Up`   
                                                      case "Replied":  
                                                        return `Replied`                                               }
                                                  })()
                                                } ${userName.filter(u => item.messagedBy==u?.id).length > 0 ?
                                                  `${activeTab==="Replied" ? 'to' : 'by'} ${
                                                    byYou(userName.filter(u => item.messagedBy==u?.id)[0]?.name).split(' ')[0]} ` : ""}${ 
                                                  (() => {
                                                    switch (activeTab) {
                                                      default:
                                                      case "ConnectMessaged":
                                                        return item?.connectMessageAt ? 
                                                        `${getAddedDate(item?.connectMessageAt)}`: ""
                                                      case "FollowUp1st":
                                                        return item?.followUpFirstMessageAt ? 
                                                        `${getAddedDate(item?.followUpFirstMessageAt)}`: ""
                                                      case "FollowUp2nd":
                                                        return item?.followUpSecondMessageAt ? 
                                                        `${getAddedDate(item?.followUpSecondMessageAt)}`: ""   
                                                      case "Replied":
                                                        return item?.repliedAt ? 
                                                        `${getAddedDate(item?.repliedAt)}`: ""                                                   }
                                                  })()
                                                }`}
                                            </p>}
                                        </div>
                                      )
                                  case "Archived":
                                      return (
                                        <div className="prospectTagContainer prospectTagMargins">
                                          {item?.archivedBy &&
                                            <p className="downloadedProspectTag">
                                              {`Archived ${userName.filter(u => item.archivedBy==u?.id).length > 0 ?
                                                `by ${byYou(userName.filter(u => item.archivedBy==u?.id)[0]?.name).split(' ')[0]} ` : ""}${
                                                item?.archivedAt ? 
                                                `${getAddedDate(item.archivedAt)}` : ""
                                              }`}
                                            </p>}
                                        </div>
                                      )
                                  case "Downloaded":
                                      return (
                                        <div className="prospectTagContainer prospectTagMargins">
                                          {item?.downloadedBy &&
                                            <p className="downloadedProspectTag">
                                              {`Downloaded ${userName.filter(u => item.downloadedBy==u?.id).length > 0 ?
                                                `by ${byYou(userName.filter(u => item.downloadedBy==u?.id)[0]?.name).split(' ')[0]} ` : ""}${
                                                item?.downloadedAt ? 
                                                `${getAddedDate(item?.downloadedAt)}` : ""
                                              }`}
                                            </p>}
                                        </div>
                                      )
                                  default:
                                      return (
                                        <div className="prospectTagContainer prospectTagMargins">
                                          {item?.userId &&
                                            <p className="downloadedProspectTag">
                                              {`Added ${userName.filter(u => item.userId==u?.id).length > 0 ?
                                                `by ${byYou(userName.filter(u => item.userId==u?.id)[0]?.name).split(' ')[0]} ` : ""}${
                                                  item?.addedAt ? 
                                                  `${getAddedDate(item.addedAt)}` : ""
                                              }`}
                                            </p>}
                                        </div>
                                      )
                                  }
                            })()}
                        </div>
                      </div>
                      {activeTab === "MeetingConfirmed" &&
                        <div className="sidebarMeetingInfoContainer">
                          <span>
                            <img src={CalendarGrey} />
                            <p>
                              {getMeetingDate(item.startMeeting)} {/* 11 PM, Jul 24 */}
                            </p>
                          </span>
                          <span>
                            <a href={`chrome-extension://${chrome.runtime.id}/html/calendar.html?meetingId=${encodeURIComponent(item.meetingId)}&startMeeting=${encodeURIComponent(item.startMeeting)}`} target="blank">
                              View Event
                            </a>
                          </span>
                        </div>}
                      <div className="sidebar">
                        {progressItems.map(it => {
                          const progress = ((item?.scoring && item?.scoring[`${it.tag}_score`] || 0) /
                            (item?.scoring && item?.scoring[`${it.tag}_total`] || 1)) * 100
                          return (
                            <div key={it.id} className="progressContainer">
                              <p className="progressTitles">
                                {it.name}
                              </p>
                              {item?.scoring && item?.scoring[`${it.tag}_total`] == 0 ?
                                <p className="notSpecified">
                                  Not Specified
                        </p> :
                                <Progress value={progress} />}
                            </ div>)
                        })}

                      </ div>
                      {/* {showNotes && <div className="sidebar sep-borders">
                        <NotesSection
                          recentNote={item.recent_note}
                          setShowActivities={setShowActivities}
                          jobProfileId={item.jobProfileId}
                          jId={qs.parse(search).jId}
                          dispatch={dispatch}
                          userName={ownerName}
                          notesCount={item.noteCount ? parseInt(item.noteCount) : 0}
                        />

                      </div>
                      } */}
                      <div>
                        {showActivities && <ActivitiesSection
                          userName={ownerName}
                          activities={item.recent_actvities}
                          setShowNotes={setShowNotes}
                          jobProfileId={item.jobProfileId}
                          jId={qs.parse(search).jId}
                          dispatch={dispatch}
                          activityCount={item.activityCount ? parseInt(item.activityCount) : 0}
                          loadingActivities={loadingActivities}
                        />}
                      </div>
                    </span>
                    <span className="scoreTable">
                      <Row className="even">
                        <Col className="values" id='expValues'>
                          <div className="attributes">
                            <h6 className="boldAttributes">Experience</h6>
                          </div>
                          {/* <TotalExperience
                            pId={item.id}
                            setcurrCompanyTooltip={ setcurrCompanyTooltip }
                            currCompanyTooltip={ currCompanyTooltip }
                            totalExperiences={totalExperiences} /> */}

                          {totalExperiences.length > 0 ?
                            totalExperiences.length < 4 ?
                              totalExperiences.map(({ date, job, company, timeSpan }, i) =>
                                <div key={`a${i}`} style={{ width: '100%' }}>
                                  <div className='expContainer'>
                                    <p className='exp1'>
                                      {date}
                                    </p>
                                    <div className='exp2'>
                                      {job}
                                      {i === 0 ?
                                        <span
                                          className="currentCompanyTagContainer"
                                          id={`currentCompanyTag${item.id}`}>
                                          {company ? company.split(' ')[0] : ""}
                                          <a
                                            className="currentCompanyTag"
                                          // onMouseEnter={()=>setcurrCompanyTooltip(true)}
                                          >
                                            {company ? company.split(" ").splice(1).join(" ") : ""}
                                          </a>
                                          <Tooltip
                                            className='currentCompanyTagTooltip'
                                            target={`currentCompanyTag${item.id}`}
                                            placement='top'
                                            isOpen={currCompanyTooltip}
                                            toggle={() => setcurrCompanyTooltip(prev => !prev)}
                                          >
                                            <CurrentCompanySmallBatch
                                              NA={NA}
                                              currentCompanySize={item?.currentCompanySize}
                                              currentCompanyIndustry={item?.currentCompanyIndustry}
                                              currentCompanyName={item?.currentCompanyName}
                                            />
                                          </Tooltip>
                                        </ span> :
                                        `${company ? company : ""}`}
                                      <span className='verBar' />
                                      <a className='timeSpan'>{timeSpan}</a>
                                    </ div>
                                  </div>
                                  {i < totalExperiences.length - 1 && <hr className="bar" />}
                                </div>) :
                              <React.Fragment>
                                {totalExperiences.slice(0, 3).map(({ date, job, company, timeSpan }, i) =>
                                  <div key={`a${i}`} style={{ width: '100%' }}>
                                    <div className='expContainer'>
                                      <p className='exp1'>
                                        {date}
                                      </p>
                                      <p className='exp2'>
                                        {job}
                                        {i === 0 ?
                                          <span
                                            className="currentCompanyTagContainer"
                                            id={`currentCompanyTag${item.id}`}>
                                            {company ? company.split(' ')[0] : ""}
                                            <a
                                              className="currentCompanyTag"
                                            // onMouseEnter={()=>setcurrCompanyTooltip(true)}
                                            >
                                              {company ? company.split(" ").splice(1).join(" ") : ""}
                                            </a>
                                            <Tooltip
                                              className='currentCompanyTagTooltip'
                                              target={`currentCompanyTag${item.id}`}
                                              placement='top'
                                              isOpen={currCompanyTooltip}
                                              toggle={() => setcurrCompanyTooltip(prev => !prev)}
                                            >
                                              <CurrentCompanySmallBatch
                                                NA={NA}
                                                currentCompanySize={item?.currentCompanySize}
                                                currentCompanyIndustry={item?.currentCompanyIndustry}
                                                currentCompanyName={item?.currentCompanyName}
                                              />
                                            </Tooltip>
                                          </ span> :
                                          `${company ? company : ""}`}
                                        <span className='verBar' />
                                        <a className='timeSpan'>{timeSpan}</a>
                                      </p>
                                    </div>
                                    {<hr className="bar" />}
                                  </div>
                                )}
                              </React.Fragment> : NA}




                          {totalExperiences.length > 3 &&
                            <React.Fragment>
                              <Collapse
                                isOpen={seeMoreExp}>
                                <Card id="collapse-card" className="dropcard">
                                  <CardBody className="dropcardbody">
                                    {totalExperiences.slice(3).map(({ date, job, company, timeSpan }, i) =>
                                      <div key={`b${i}`} style={{ width: '100%' }}>
                                        <div className='expContainer'>
                                          <p className='exp1'>
                                            {date}
                                          </p>
                                          <p className='exp2'>
                                            {job}
                                            {`${company ? company : ''}`}
                                            <span className='verBar' />
                                            <a className='timeSpan'>{timeSpan}</a>
                                          </p>
                                        </div>
                                        {<hr className="bar" />}
                                      </div>)}
                                  </CardBody>
                                </Card>
                              </Collapse>
                              {/* <hr className="bar" /> */}
                              <Button
                                className="toggler"
                                outline
                                color="secondary"
                                id="togglerEXP"
                                style={{ border: "0px" }}
                                onClick={() => setSeeMoreExp(!seeMoreExp)}
                                aria-controls="collapse-card"
                                aria-expanded={seeMoreExp}>
                                <div className="greyed">
                                  {`See ${totalExperiences.length - 3} ${seeMoreExp ? 'less' : 'more'} experiences    `}
                                </div>
                                <img
                                  src={DropDownIcon}
                                  alt="drop down"
                                  style={{ transform: seeMoreExp ? "rotate(180deg)" : "rotate(0deg)" }} />
                              </Button>
                            </React.Fragment>
                          }
                        </Col>
                      </Row>
                      <Row className="odd">
                        <Col className="values" id='expValues'>
                          <div className="attributes" xs="3" lg="3" md="3">
                            <h6 className="boldAttributes">Relevant Experience</h6>
                            <p
                              className={item?.scoring?.qualification_status ?
                                item?.scoring?.qualification_status === "Under Qualified" ?
                                  "RelevantExpQualificationTagUnder" : "RelevantExpQualificationTagOver" : ''}
                            >
                              {item?.scoring?.qualification_status ?
                                item?.scoring?.qualification_status === "Under Qualified" ?
                                  "Underqualified" : "Overqualified" : ''}
                            </p>
                          </div>
                          <RelevantExperience
                            relevantExperienceTime={relevantExperienceTime}
                            relevantExperiences={relevantExperiences} />
                        </Col>
                      </Row>
                      <Row className="even">
                        <Col className="values" id='expValues'>
                          <div id="expDiv" className="attributes" xs="3" lg="3" md="3">
                            <h6 className="boldAttributes">Total Experience</h6>
                          </div>
                          <p className="info">{totalExperience ? totalExperience : NA}</p>
                        </Col>
                      </Row>
                      <Row className="odd">
                        <Col className="values">
                          <div className="attributes" xs="3" lg="3" md="3">
                            <h6 className="boldAttributes">Education</h6>
                          </div>
                          <Education educationArr={educationArr} NA={NA} />
                        </Col>
                      </Row>
                      <Row className="even">
                        <Col className="values">
                          <div className="attributes" xs="3" lg="3" md="3">
                            <h6 className="boldAttributes">Skills</h6>
                          </div>
                          {item?.scoring?.skill_importance ?
                            <DropDownSkills importance={item?.scoring?.skill_importance} skills_required={item?.scoring?.skills_required} /> :
                            <OldJobsSkillsComponent skills_required={item?.scoring?.skills_required} skills_found={item?.scoring?.skills_profile} />
                          }
                        </Col>
                      </Row>
                      <Row className="even">
                        <Col className="valuesVisa">
                          <div className="attributes" xs="3" lg="3" md="3">
                            <h6 className="boldAttributes">Visa Status</h6>
                          </div>
                          {item.visa_status ? item.visa_status !== 'None' ?
                            <p className="info">{item?.visa_status}</p> : NA : NA}
                        </Col>
                        <Col className="values">
                          <div className="attributes" xs="3" lg="3" md="3">
                            <h6 className="boldAttributes">Demographics</h6>
                          </div>
                          {item.gender || item.age || ethnicity ?
                            <>
                              <p className="Info">
                                {item.gender ? parseFloat(item.gender.male) > parseFloat(item.gender.female) ? 'Male' : 'Female' : item.age ?
                                  `${item.age}` : ethnicity ?
                                    `${ethnicity}` : <></>}
                                {item.gender && item.age ?
                                  `, ${item.age}` : ethnicity ?
                                    `${ethnicity}` : <></>}
                                {item.gender && item.age && ethnicity ? `, ${ethnicity}` : <></>}
                              </p>
                            </> : NA}
                        </Col>
                      </Row>
                      <Row id="detailsContainer" className="odd">
                        <MoreDetails
                          moreDetailsPopUp={moreDetailsPopUp}
                          setMoreDetailsPopUp={setMoreDetailsPopUp}
                          data={item} />
                      </Row>
                    </span>
                  </Container>
                </CardBody>
              </Card>
            </ React.Fragment >}
        </li>
      </ul>
    </div >
  )
})

export default withRouter(onlyUpdateForKeys([
  'item',
  'isSelected',
  'isEnhancing',
  'location'
  // 'moreDetailsPopUp',

])(ListItem))


// index,
//   // SelectAllProspectsFlag,
//   setSelectAllProspectsFlag,
//   moreDetailsPopUp,
//   setMoreDetailsPopUp,
//   item,
//   // selected,
//   isSelected,
//   selectedCount,
//   isEnhancing,
//   dispatch,
//   totalRecord,
//   setRefState,
//   // refState,
//   location: {
//     search
//   }