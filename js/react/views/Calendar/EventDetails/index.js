import React, { useState, useRef, useEffect } from 'react'
import { Button, Progress } from 'reactstrap'
import { connect } from 'react-redux'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import DisplayPlaceholder from '../../../../../img/displayPlaceholder.svg'
import LinkedIcon from '../../../../../img/LinkedinIcon.svg'
import closeIcon from '../../../../../img/close.svg'
import user from '../../../../../img/user.svg'
import optionsIcon from '../../../../../img/options.svg'

import DropDownSkills from "../../ScoreandConnect/DropDownSkills"
import OldJobsSkillsComponent from "../../ScoreandConnect/OldJobsSkillsComponent";

import { saveNotes } from '../../../actions/calendar'
import { deleteNotes } from '../../../actions/calendar'
import moment from 'moment'
import zoom from '../../../../../img/zoom.svg'
import phone from '../../../../../img/phone.svg'
import copy from '../../../../../img/copy-small.svg'

const NA = <a className="notAvailable">Not Available</a>

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
  id: 5,
  name: 'Skills',
  tag: 'skill'

}, {
  id: 4,
  name: 'Industry',
  tag: 'industry'
}]

const locations = {
  "googleMeets": "Google Meet",
  "zoom": "Zoom",
  "webEx": "WebEx"
};

const EventDetails = ({ currentUser, dispatch, selectedEvent, onEdit, onClose }) => {

  const textArea = useRef(null);
  let ethnicity = null;
  let maxEthnicity = 0.0

  let [notes, setNotes] = useState({
    createdAt: new Date(),
    id: 1,
    savedNotes: "",
  });
  let [addNote, setAddNote] = useState(false);
  let [savedNotesList, setSavedNotesList] = useState(selectedEvent ? selectedEvent.savednotes : []);

  const addNewNote = () => {
    setAddNote(true);
  }

  if (selectedEvent?.race) {
    for (const [key, value] of Object.entries(selectedEvent.race)) {
      if (parseFloat(value) > maxEthnicity) {
        maxEthnicity = parseFloat(value);
        ethnicity = key;
      }
    }
  }

  let totalExperience = null
  let relevantExperienceTime = []
  let relevantExperiences = []

  if (selectedEvent.score.experience_found) {
    selectedEvent.score.experience_found
      .forEach((exp, i) => {
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
        else if (i + 1 === selectedEvent.score.experience_found.length) {
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

  const onEditEvent = () => {
    onEdit();
  }

  const onCloseEvent = () => {
    onClose();
  }

  const addNotes = (e) => {
    let note = {
      createdAt: new Date(),
      id: 1,
      savedNotes: e.target.value,
    }
    setNotes(note);
  }

  const deleteNote = (index, id) => {
    if (index > -1) {
      savedNotesList.splice(index, 1);
      setSavedNotesList(JSON.parse(JSON.stringify((savedNotesList))));
    }
    dispatch(deleteNotes({
      id: id
    }))
  }

  const onDiscardNotes = () => {
    setNotes({
      createdAt: new Date(),
      id: 1,
      savedNotes: "",
    });
    setAddNote(false);
  }

  const onSaveNotes = () => {
    setNotes({
      createdAt: new Date(),
      id: 1,
      savedNotes: "",
    });
    savedNotesList.push(notes);
    setSavedNotesList(JSON.parse(JSON.stringify((savedNotesList))));
    setAddNote(false);
    dispatch(saveNotes({
      meetingId: selectedEvent.meetingId,
      savedNotes: notes.savedNotes
    }))
  }

  const totalExperiences = selectedEvent && selectedEvent.experience ?
    selectedEvent.experience.map((itm) => {
      const job = itm.title ? itm.title : ''

      const company = itm.company_name ? itm.company_name : ''

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
        moment('1-' + itm.start, 'DD-MM-YYYY').fromNow(true) == 'Invalid date' ?
          moment(itm.start.slice(-4), 'YYYY').fromNow(true) == 'Invalid date' ? '' :
            moment(itm.start.slice(-4), 'YYYY').fromNow(true) :
          moment('1-' + itm.start, 'DD-MM-YYYY').fromNow(true) : start === end ? '1 month' :
          moment('1-' + itm.start, 'DD-MM-YYYY').from(moment('1-' + itm.end, 'DD-MM-YYYY'), true) == 'Invalid date' ?
            moment(itm.start.slice(-4), 'YYYY').from(moment(itm.end.slice(-4), 'YYYY'), true) == 'Invalid date' ? '' :
              moment(itm.start.slice(-4), 'YYYY').from(moment(itm.end.slice(-4), 'YYYY'), true) :
            moment('1-' + itm.start, 'DD-MM-YYYY').from(moment('1-' + itm.end, 'DD-MM-YYYY'), true)


      return { end: end, date: start && end && `${start} - ${end}`, job: `${job}${company === '' ? '' : ` @ ${company}`}`, timeSpan: `${diff[0] === 'a' ? '1' + diff.slice(1) : diff} ` }
    }) : []

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
          {i < props.relevantExperiences.length - 1}
        </div>)) : NA)
  }

  const TotalExperience = (props) => {
    return (
      <div>
        {props.totalExperiences.length > 0 ?
          props.totalExperiences.length < 4 ?
            props.totalExperiences.map(({ date, job, timeSpan }, i) =>
              <div key={`a${i}`} style={{ width: '100%' }}>
                <div className='expContainer'>
                  <p className='exp1'>
                    {date}
                  </p>
                  <p className='exp2'>
                    {job}
                    <span className='verBar' />
                    <a className='timeSpan'>{timeSpan}</a>
                  </p>
                </div>
                {i < props.totalExperiences.length - 1 && <hr className="bar" />}
              </div>) :
            <React.Fragment>
              {props.totalExperiences.slice(0, 3).map(({ date, job, timeSpan }, i) =>
                <div key={`a${i}`} style={{ width: '100%' }}>
                  <div className='expContainer'>
                    <p className='exp1'>
                      {date}
                    </p>
                    <p className='exp2'>
                      {job}
                      <span className='verBar' />
                      <a className='timeSpan'>{timeSpan}</a>
                    </p>
                  </div>
                  {<hr className="bar" />}
                </div>
              )}
            </React.Fragment> : NA}
      </div>)
  }

  const getDateNote = (date) => {
    let noteDate = moment.tz(date, selectedEvent.ownerTimeZone).format('h A') + " " + moment.tz(date, selectedEvent.ownerTimeZone).format('LL');
    return noteDate;
  }

  const getDate = (date) => {
    return moment.tz(date, selectedEvent.ownerTimeZone).format('LL');
  }

  const getTime = (date) => {
    return moment.tz(date, selectedEvent.ownerTimeZone).format('HH:mm');
  }

  const getEndTime = (date) => {
    return moment.tz(date, selectedEvent.ownerTimeZone).format('HH:mm A');
  }

  const getDateDiff = (date1, date2 = new Date()) => {
    if (new Date(date1).getTime() - new Date(date2).getTime() < 0) {
      return "";
    }
    return Math.round(Math.abs(new Date(date2).getTime() - new Date(date1).getTime()) / 36e5) + " hours from now";
  }

  const onCopyToClipboard = () => {
    textArea.current.select();
    document.execCommand("copy")
  }

  const onJoinMeeting = () => {
    localStorage.setItem("pageData", selectedEvent.number)
    window.open('meeting.html');
  }

  const checkArray = (value) => {
    return Array.isArray(value)
  }

  return (
    <div>
      <div className="contentContainer" style={{ display: 'block' }}>
        <div className="detailHeader">
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 10px' }}>
            <div>
              <div className="heading1">You - {selectedEvent.name}</div>
              <div className="heading2">For - {selectedEvent.title}</div>
            </div>
            <div style={{ display: 'flex' }}>
              <button className="iconButton" onClick={onCloseEvent}>
                <img style={{ left: '-7.5px', position: 'relative' }} src={closeIcon} alt='closeIcon' onClick={onCloseEvent} />
              </button>
              <button className="iconButton" onClick={onEditEvent}>
                <img style={{ left: '-11px', top: '-4px', position: 'relative' }} src={optionsIcon} alt='optionsIcon' onClick={onEditEvent} />
              </button>
              {
                selectedEvent.meetingLink == null || selectedEvent.meetingLink == "null"
                  ?
                  <Button onClick={onJoinMeeting}
                    color='primary'
                    outline
                    className='joinMeeting'>
                    Join Meeting
                                        </Button>
                  :
                  <a
                    href={selectedEvent.meetingLink}
                    target='_blank' >
                    <Button
                      color='primary'
                      outline
                      className='joinMeeting'>
                      Join Meeting
                                        </Button>
                  </a>
              }
            </div>
          </div>
        </div>
        <div>
          <Tabs>
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Pre Eval Form</Tab>
              <Tab>Prospect's Profile</Tab>
              <Tab>Past Messages</Tab>
            </TabList>

            <TabPanel>
              <div style={{ margin: '10px', borderBottom: '1px solid #E6E9ED' }}>
                <div style={{ display: 'flex', margin: '10px 0' }}>
                  <div style={{ width: '150px' }} className="mainHeading">When</div>
                  <div>
                    <div className="mainHeading">{getDate(selectedEvent.start)}, {getTime(selectedEvent.start)} - {getEndTime(selectedEvent.end)}</div>
                    <div className="subHeading">{getDateDiff(selectedEvent.start)}</div>
                  </div>
                </div>
                {
                  selectedEvent.meetingLink == null || selectedEvent.meetingLink == "null"
                    ?
                    <div style={{ display: 'flex', margin: '10px 0' }}>
                      <div style={{ minWidth: '150px' }} className="mainHeading">Where</div>
                      <div style={{ fontSize: '13px' }}>
                        <div><img className="zoomIcon" src={phone} alt='phone' />Phone</div>
                        <div>
                          <div style={{ maxWidth: '250px', wordBreak: 'break-all', color: '#A7ABB0', display: 'flex' }}
                            target='_blank' >
                            <textarea style={{ resize: 'none', overflow: 'hidden', border: 'none' }} ref={textArea} value={selectedEvent.number} />
                            <img className="zoomIcon" style={{ marginLeft: '-30px', marginTop: '0' }} src={copy} alt='copy' onClick={onCopyToClipboard} />
                          </div>
                        </div>
                      </div>
                    </div>
                    :
                    <div style={{ display: 'flex', margin: '10px 0' }}>
                      <div style={{ minWidth: '150px' }} className="mainHeading">Where</div>
                      <div style={{ fontSize: '13px' }}>
                        <div><img className="zoomIcon" src={zoom} alt='zoom' />Zoom</div>
                        <div>
                          <a style={{ maxWidth: '250px', wordBreak: 'break-all' }}
                            href={selectedEvent.meetingLink}
                            target='_blank' >
                            {selectedEvent.meetingLink}
                          </a>
                        </div>
                      </div>
                    </div>
                }
                <div style={{ display: 'flex', margin: '10px 0' }}>
                  <div style={{ width: '150px' }} className="mainHeading">Attendees</div>
                  <div className="mainHeading" style={{ display: 'flex', marginBottom: '10px' }}>
                    <img
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%'
                      }}
                      src={selectedEvent.imageUrl ? selectedEvent.imageUrl : DisplayPlaceholder} />
                    <div style={{ margin: 'auto 10px' }}>
                      <h2 style={{ fontWeight: '400', fontSize: '16px' }}>
                        {selectedEvent.full_name}
                      </h2>
                      {selectedEvent.inviteeEmail}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', margin: '10px 0' }}>
                  <div style={{ width: '150px' }} className="mainHeading"></div>
                  <div className="mainHeading" style={{ display: 'flex', marginBottom: '10px' }}>
                    <img
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%'
                      }}
                      src={user} alt='user' />
                    <div style={{ margin: 'auto 10px' }}>
                      <h2 style={{ fontWeight: '400', fontSize: '16px' }}>
                        {currentUser?.name}
                      </h2>
                      {currentUser?.emailAddress}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', margin: '10px', borderBottom: '1px solid #E6E9ED', paddingBottom: '5px' }}>
                <div style={{ width: '150px' }} className="mainHeading">Job</div>
                <div className="mainHeading">{selectedEvent.jobTitle}</div>
              </div>
              <div className="mainHeading" style={{ margin: '10px', color: '#297AF7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ color: 'black', fontWeight: 'bold' }}>Notes ({savedNotesList.length})</div>
                  <div style={{ cursor: 'pointer' }} onClick={addNewNote}>Add New Note</div>
                </div>
                <textarea style={{ width: '100%', border: '1px solid #efefef', borderRadius: '4px', display: addNote ? 'block' : 'none' }} value={notes.savedNotes} onChange={addNotes} placeholder="Add Notes" />
                <div style={{ justifyContent: 'flex-end', display: addNote ? 'flex' : 'none' }}>
                  <Button
                    style={{ border: 'none', color: '#A7ABB0' }}
                    onClick={onDiscardNotes}
                    className='settingButton'>
                    Discard
                                    </Button>
                  <Button
                    style={{ border: 'none', color: 'rgb(41, 122, 247)', padding: '1px 1px 0', display: notes.savedNotes != "" ? 'flex' : 'none' }}
                    onClick={onSaveNotes}
                    className='settingButton'>
                    Save
                                    </Button>
                </div>
                {
                  savedNotesList.map((note, i) => {
                    return (
                      <div key={i}>
                        <div style={{ border: '1px solid rgb(167, 171, 176)', color: 'black' }} className="messageSubContainer">
                          {note.savedNotes}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div style={{ color: '#A7ABB0', fontSize: '10px' }}>{getDateNote(note.createdAt)}</div>
                          <Button
                            style={{ border: 'none', color: '#A7ABB0', margin: '0px' }}
                            onClick={() => deleteNote(i, note.id)}
                            className='settingButton'>
                            Delete
                                                    </Button>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </TabPanel>
            <TabPanel>
              {
                selectedEvent.evaluationForm && selectedEvent.evaluationForm.length > 0 ?

                  <div className="mainHeading" style={{ margin: '10px', color: '#297AF7' }}>
                    {
                      selectedEvent.evaluationForm.map((q, i) => {
                        return (
                          <div key={i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <div style={{ color: 'black', fontWeight: '600', fontSize: '16px', marginBottom: '12px' }}> {i + 1}. {q.question}</div>
                            </div>
                            {
                              !checkArray(q.answer) ?
                                <div style={{
                                  background: '#F8F9FA',
                                  borderRadius: '8px',
                                  padding: '16px',
                                  fontSize: '16px',
                                  color: '#2E2E2E'
                                }}>
                                  {q.savedAns}
                                </div>
                                :
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  {
                                    q.answer.map((a, index) => {
                                      return (
                                        <div key={index} style={{
                                          display: 'flex',
                                          justifyContent: 'flex-start',
                                          alignItems: 'center',
                                          marginBottom: '8px'
                                        }}>
                                          <input
                                            style={{
                                              width: '24px',
                                              height: '24px'
                                            }}
                                            type="radio"
                                            value="Male"
                                            checked={q.savedAns.toLowerCase().trim() === a.toLowerCase().trim()}
                                          />
                                          <div style={{
                                            fontSize: '16px',
                                            color: '#2E2E2E',
                                            marginLeft: '16px'
                                          }}>{a}</div>
                                        </div>
                                      )
                                    })
                                  }
                                </div>
                            }
                          </div>
                        )
                      })
                    }
                  </div>
                  :
                  []
              }
            </TabPanel>
            <TabPanel>
              {
                selectedEvent ?
                  <div>
                    <div style={{ padding: '10px', borderBottom: '1px solid #E6E9ED' }}>
                      <div style={{ display: 'flex', marginBottom: '10px' }}>
                        <img
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%'
                          }}
                          src={selectedEvent.imageUrl ? selectedEvent.imageUrl : DisplayPlaceholder} />
                        <div style={{ margin: 'auto 10px' }}>
                          <h2 className='displayName' >
                            {selectedEvent.full_name}
                          </h2>
                          <a
                            href={selectedEvent.profileUrl}
                            target='_blank' >
                            <img
                              className='linkedIcon'
                              style={{ marginTop: '-5px' }}
                              src={LinkedIcon}
                              alt="Linkedin Profile" />
                          </a>
                        </div>
                      </div>

                      {progressItems.map(it => {
                        const progress = ((selectedEvent.score[`${it.tag}_score`] || 0) /
                          (selectedEvent.score[`${it.tag}_total`] || 1)) * 100
                        return (
                          <div key={it.id} className="progressContainer">
                            <p className="detailsTitles">
                              {it.name}
                            </p>
                            {selectedEvent.score[`${it.tag}_total`] == 0 ?
                              <p className="notSpecified">
                                Not Specified
                                                                                    </p> :
                              <Progress value={progress} />}
                          </ div>)
                      })}
                    </div>
                    <div style={{ padding: '10px 10px 0 10px' }}>
                      <p className="detailsTitles" style={{ fontWeight: 'bold' }}>
                        Current Title
                                            </p>
                      <p style={{ fontSize: '13px' }}>
                        {selectedEvent.headline}
                      </p>
                    </div>
                    <div style={{ padding: '0 10px' }}>
                      <p className="detailsTitles" style={{ fontWeight: 'bold' }}>
                        Location
                                            </p>
                      <p style={{ fontSize: '13px' }}>
                        {selectedEvent.locationName}
                      </p>
                    </div>
                    <div style={{ padding: '0 10px' }}>
                      <p className="detailsTitles" style={{ fontWeight: 'bold' }}>
                        Experience
                                            </p>
                      <TotalExperience
                        totalExperiences={totalExperiences} />
                    </div>
                    <div style={{ padding: '10px' }}>
                      <p className="detailsTitles" style={{ fontWeight: 'bold' }}>
                        Relevant Experience Summary
                                            </p>
                      <div style={{ fontSize: '13px' }}>
                        <RelevantExperience
                          relevantExperienceTime={relevantExperienceTime}
                          relevantExperiences={relevantExperiences} />
                      </div>
                    </div>
                    <div style={{ padding: '10px' }}>
                      <p className="detailsTitles" style={{ fontWeight: 'bold' }}>
                        Total Experience
                                            </p>
                      <p style={{ fontSize: '13px' }}>
                        {totalExperience ? totalExperience : NA}
                      </p>
                    </div>
                    <div style={{ padding: '0 10px' }}>
                      <p className="detailsTitles" style={{ fontWeight: 'bold' }}>
                        Education
                                            </p>
                      <p style={{ fontSize: '13px' }}>
                        {selectedEvent.education ? selectedEvent.education[0].degreeName : ""}
                      </p>
                    </div>
                    <div style={{ padding: '10px' }}>
                      <p className="detailsTitles" style={{ fontWeight: 'bold' }}>
                        Skills
                                            </p>
                      <div>
                        {selectedEvent.score.skill_importance ?
                          <DropDownSkills importance={selectedEvent.score.skill_importance} skills_required={selectedEvent.score.skills_required} /> :
                          <OldJobsSkillsComponent skills_required={selectedEvent.score.skills_required} skills_found={selectedEvent.score.skills_profile} />}
                      </div>
                    </div>
                    <div style={{ padding: '0 10px' }}>
                      <p className="detailsTitles" style={{ fontWeight: 'bold' }}>
                        Visa Status
                                            </p>
                      <p style={{ fontSize: '13px' }}>
                        {selectedEvent.score.visa_status}
                      </p>
                    </div>
                    <div style={{ padding: '0 10px' }}>
                      <p className="detailsTitles" style={{ fontWeight: 'bold' }}>
                        Demographics
                                            </p>
                      <div style={{ fontSize: '13px' }}>
                        {selectedEvent.gender || selectedEvent.age || ethnicity ?
                          <>
                            <p className="Info">
                              {selectedEvent.gender ? parseFloat(selectedEvent.gender.male) > parseFloat(selectedEvent.gender.female) ? 'Male' : 'Female' : selectedEvent.age ?
                                `${selectedEvent.age}` : ethnicity ?
                                  `${ethnicity}` : <></>}
                              {selectedEvent.gender && selectedEvent.age ?
                                `, ${selectedEvent.age}` : ethnicity ?
                                  `${ethnicity}` : <></>}
                              {selectedEvent.gender && selectedEvent.age && ethnicity ? `, ${ethnicity}` : <></>}
                            </p>
                          </> : NA}
                      </div>
                    </div>
                  </div>
                  :
                  []
              }
            </TabPanel>
            <TabPanel>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '0 10px'
              }}>
                <h2 className="eventHeading">Past Messages</h2>
                <a
                  href={selectedEvent.profileUrl}
                  target='_blank' >
                  <Button
                    color='primary'
                    outline
                    className='joinMeeting'>
                    LinkedIn
                                </Button>
                </a>
              </div>
              {
                selectedEvent.connectMessage ?
                  <div className="messageContainer">
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 'normal',
                      fontSize: '13px',
                      lineHeight: '23px'
                    }}>
                      <div>You</div>
                      <div style={{ color: '#A7ABB0' }}>{getDate(selectedEvent.connectMessageAt)}</div>
                    </div>
                    <div className="messageSubContainer">
                      {selectedEvent.connectMessage}
                    </div>
                  </div>
                  :
                  []
              }
              {
                selectedEvent.followUpFirstMessage ?
                  <div className="messageContainer">
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 'normal',
                      fontSize: '13px',
                      lineHeight: '23px'
                    }}>
                      <div>You</div>
                      <div style={{ color: '#A7ABB0' }}>{getDate(selectedEvent.followUpFirstMessageAt)}</div>
                    </div>
                    <div className="messageSubContainer">
                      {selectedEvent.followUpFirstMessage}
                    </div>
                  </div>
                  :
                  []
              }
              {
                selectedEvent.followUpSecondMessage ?
                  <div className="messageContainer">
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 'normal',
                      fontSize: '13px',
                      lineHeight: '23px'
                    }}>
                      <div>You</div>
                      <div style={{ color: '#A7ABB0' }}>{getDate(selectedEvent.followUpSecondMessageAt)}</div>
                    </div>
                    <div className="messageSubContainer">
                      {selectedEvent.followUpSecondMessage}
                    </div>
                  </div>
                  :
                  []
              }
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div >
  )
}

export default connect(state => ({
  calendar: state.calendar,
}))(EventDetails)
