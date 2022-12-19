import React, { useState, useEffect, useCallback } from "react";
import { Button, Input, Label, Tooltip } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import qs from 'query-string'

import useInterval from 'use-interval'

import * as ActionTypes from '../../../../actions/score'


import {
  setMessageValue,
  setFollowUpDays,
  toggleMessageEnabled,
  getMessageSetting,
  incrementConnectSent

} from '../../../../actions/score'
import alertIcon from '../../../../../../img/alert-circle-3.svg'

import TagButtonComponent from './TagButtonComponent'
import {
  manualApiCall
} from '../../../../utils/index'

import './style.css'


const FollowUpMeetings = ({
  messageEnabled,
  connectionType,
  followUpMessage1Enabled,
  followUpMessage1Template,
  followUpMessage1Days,
  followUpMessage2Enabled,
  followUpMessage2Template,
  followUpMessage2Days,
  connectMessageFirstDegree,
  followUp1MessageFirstDegree,
  followUp2MessageFirstDegree,
  variableTranslator,
  dispatch,
  data,
  meetingTime,
  setPreviewMessage,
  toggle,
  ...rest

}) => {


  const [fu1CharLimitCounter, setfu1CharLimitCounter] = useState(0)
  const [fu2CharLimitCounter, setfu2CharLimitCounter] = useState(0)
  const [tooltipOpenFu1, setTooltipOpenFu1] = useState(false)
  const [tooltipOpenFu2, setTooltipOpenFu2] = useState(false)
  const [tooltipOpenFu1Count, setTooltipOpenFu1Count] = useState(false)
  const [tooltipOpenFu2Count, setTooltipOpenFu2Count] = useState(false)
  const [fu1CharLimitFlag, setfu1CharLimitFlag] = useState(0)
  const [fu2CharLimitFlag, setfu2CharLimitFlag] = useState(0)
  const [fu1CursorPos, setfu1CursorPos] = useState(0)
  const [fu2CursorPos, setfu2CursorPos] = useState(0)
  const [myTimeout, setMyTimeout] = useState(null)

  useEffect(() => {
    setfu1CharLimitCounter(followUpMessage1Template.length)
  }, [followUpMessage1Template])
  useEffect(() => {
    setfu2CharLimitCounter(followUpMessage2Template.length)
  }, [followUpMessage2Template])

  useEffect(() => {
    if (myTimeout) {
      clearTimeout(myTimeout)
      setMyTimeout(setTimeout(timeoutHandler, 300))
    } else {
      setMyTimeout(setTimeout(timeoutHandler, 300))
    }
  }, [
    followUpMessage1Template,
    followUpMessage2Template
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
    const params = qs.parse(rest.location.search)
    const payload = {
      jobID: params.jId,

      followUpMessage1Enabled,
      followUpMessage1Template,
      followUpMessage1Days: followUpMessage1Days || 2,


      followUpMessage2Enabled,
      followUpMessage2Template,
      followUpMessage2Days: followUpMessage2Days || 6,

      connectMessageFirstDegree,
      followUp1MessageFirstDegree,
      followUp2MessageFirstDegree
    }

    manualApiCall(`/api/auth/job/meeting/setting/set`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  }

  const handleChange = (e, type) => {
    const value = e.target.value
    dispatch(setMessageValue({ connectionType, type, value }))
  }

  return (
    <div>
      <hr className="HoriBar" />
      <div className="followUp1stContainer">
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
            type='checkbox'
            id="fu1"
            onChange={() => {
              manualApiCall('/api/auth/user/activity/store',
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    "actionName": !followUpMessage1Enabled ?
                      "FIRST_FOLLOW_UP_MESSAGE_ENABLED" : "FIRST_FOLLOW_UP_MESSAGE_DISABLED"
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
                name="number"
                placeholder="2"
                min={1}
                id="fu1Count"
                max={followUpMessage2Days ? followUpMessage2Days - 1 : 5}
                onChange={(e) => {
                  dispatch(setFollowUpDays(connectionType, 'fu1', e.target.value))
                }}
                value={followUpMessage1Days || 1}
              />     {connectionType === 1 &&
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
                setPreviewMessage(followUpMessage1Template ? variableTranslator(followUpMessage1Template) : "")
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
                value={followUpMessage1Template || ''}
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
                    value={followUpMessage1Template ? variableTranslator(followUpMessage1Template, meetingTime) : ""}
                />
                </span> */}
          </div>
          <TagButtonComponent
            cursorPos={fu1CursorPos}
            skillsReq={data[0].scoring.skills_required || []}
            followUpMessage1Template={followUpMessage1Template}
            handleChange={handleChange}
            tagType='fu1'
          />
        </div>
        <hr className="HoriBar" />
      </div>
      <div className="followUp2ndContainer">
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
                      "SECOND_FOLLOW_UP_MESSAGE_ENABLED" : "SECOND_FOLLOW_UP_MESSAGE_DISABLED"
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
                id="fu2Count"
                min={2}
                onChange={(e) =>
                  dispatch(setFollowUpDays(connectionType, 'fu2', e.target.value))
                }
                value={followUpMessage2Days || 2}
              />
                {connectionType === 1 &&
                  <Tooltip
                    target='fu2Count'
                    placement='bottom'
                    toggle={() => setTooltipOpenFu2Count(!tooltipOpenFu2Count)}
                    isOpen={tooltipOpenFu1}
                    // fade={true}
                    style={{ zIndex: 9 }}
                    className='tooltip-root'>
                    This setting will apply to the 2nd follow up for your 2nd/3rd degree connections too
                  </Tooltip>
                }
              day(s) if connected but not replied</p>
            </div>
            <p className="preview"
              onClick={() => {
                setPreviewMessage(followUpMessage2Template ? variableTranslator(followUpMessage2Template) : "")
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
                value={followUpMessage2Template || ''}
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
                    value={followUpMessage2Template ? variableTranslator(followUpMessage2Template, meetingTime) : ""}
                />
                </span> */}
          </div>
          <TagButtonComponent
            cursorPos={fu2CursorPos}
            skillsReq={data[0].scoring.skills_required || []}
            followUpMessage2Template={followUpMessage2Template}
            handleChange={handleChange}
            tagType='fu2'
          />
        </div>
      </div>
    </div>
  )
}

export default withRouter(FollowUpMeetings)
