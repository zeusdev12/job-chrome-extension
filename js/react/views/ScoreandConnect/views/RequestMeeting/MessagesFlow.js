import React, { useState, useEffect } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label } from 'reactstrap'
import qs from 'query-string'
import { withRouter } from 'react-router-dom'


import { manualApiCall } from '../../../../utils/index.js'

import VectorIcon from '../../../../../../img/vector.svg'
import TagButtonComponent from './TagButtonComponent'

import {
  setMessageValue,
  // setMessageSetting,
  setFollowUpDays,
  toggleMessageEnabled,
  getMessageSetting,
  incrementConnectSent

} from '../../../../actions/score'

const MessagesFlow = ({
  messageEnabled,
  connectionType,
  setMessageEnabled,
  Drop,
  setDrop,
  sampleZoom15Message,
  sampleZoom30Message,
  variableTranslator,
  meetingType15,
  meetingType30,
  dispatch,
  data,
  setPreviewMessage,
  toggle,
  ...rest
}) => {

  const [myTimeout, setMyTimeout] = useState(null)
  const [msg30CursorPos, setmsg30CursorPos] = useState(0)
  const [msg15CursorPos, setmsg15CursorPos] = useState(0)

  const [msg30CharLimitCounter, setmsg30CharLimitCounter] = useState(0)
  const [msg15CharLimitCounter, setmsg15CharLimitCounter] = useState(0)
  const [msg30CharLimitFlag, setmsg30CharLimitFlag] = useState(false)
  const [msg15CharLimitFlag, setmsg15CharLimitFlag] = useState(false)

  const timeoutHandler = () => {
    const params = qs.parse(rest.location.search)
    const payload = {
      jobID: params.jId,
      sampleZoom15Message,
      sampleZoom30Message
    }

    manualApiCall(`/api/auth/job/meeting/setting/set`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  }

  useEffect(() => {

    setmsg30CharLimitCounter(sampleZoom30Message ? sampleZoom30Message.length : 0)
    setmsg15CharLimitCounter(sampleZoom15Message ? sampleZoom15Message.length : 0)
    if (myTimeout) {
      clearTimeout(myTimeout)
      setMyTimeout(setTimeout(timeoutHandler, 300))
    } else {
      setMyTimeout(setTimeout(timeoutHandler, 300))
    }
  }, [sampleZoom15Message, sampleZoom30Message])




  const handleChange = (e, type) => {
    const value = e.target.value
    if (value.length <= 280) {
      dispatch(setMessageValue({ connectionType,type, value }))
    }
    else {
      if (type === "15") {
        setmsg15CharLimitFlag(true)
        setTimeout(() => {
          setmsg15CharLimitFlag(false)
        }, 500)
      }
      else if (type === "30") {
        setmsg30CharLimitFlag(true)
        setTimeout(() => {
          setmsg30CharLimitFlag(false)
        }, 500)
      }
    }


  }

  return (
    <React.Fragment>

      <div className="requestMessageHeadingContainer">
        <div className="requestMessageCheckboxContainer">
          <Input
            className='checkBox'
            type='checkbox'
            checked={true}
            disabled={true}
          />
        </div>
        <div className="requestMessageDropDownContainer" >
         <div style={{display:'flex',justifyContent:'space-between'}}> 
              <h2>Request Message</h2>
              <span className="preview"
                onClick={() => {
                  Drop && Drop.time === '30 Minutes Long' && setPreviewMessage(sampleZoom30Message ? variableTranslator(sampleZoom30Message,30) : "")
                  Drop && Drop.time === '15 Minutes Long' && setPreviewMessage(sampleZoom15Message ? variableTranslator(sampleZoom15Message,15) : "")
                  toggle()
                }
                }
              >Preview</span>
          </div>
          {/* <Dropdown isOpen={Drop.toggle}
            toggle={() =>{
              manualApiCall('/api/auth/user/activity/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  "actionName": `TOGGLE_DROP_DOWN_REQUEST_MEETING`
                })
              })
              setDrop({
                ...Drop,
                toggle: !Drop.toggle
              })}}>
            <DropdownToggle
              className="selectTime"
              outline
              color="secondary" >
              <p className="dropDownTimeToggle">
                {`${Drop.time} Meeting`}
              </p>
              <img className="caret" src={VectorIcon}
                style={{
                  transform: Drop.toggle ?
                    "rotate(180deg)" : "rotate(0deg)"
                }} />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem className="dropDownTimes"
                onClick={() => {
                  manualApiCall('/api/auth/user/activity/store', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      "actionName": `SELECT_15_MINUTES_REQUEST_MEETING`
                    })
                  })
                  setDrop(Object.assign(Drop, { time: '15 Minutes Long' }))
                }}>
                15 Minutes Long Meeting
                </DropdownItem>
              <DropdownItem divider />
              <DropdownItem className="dropDownTimes"
                onClick={() => {
                  manualApiCall('/api/auth/user/activity/store', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      "actionName": `SELECT_30_MINUTES_REQUEST_MEETING`
                    })
                  })
                  setDrop(Object.assign(Drop, { time: '30 Minutes Long' }))
                }}>
                30 Minutes Long Meeting
                </DropdownItem>
            </DropdownMenu>
          </Dropdown> */}
        </div>
      </div>
      {Drop && Drop.time === '30 Minutes Long' &&
        <div >
          <div className="messsageContainer">
            <span className="inputMessageContainer">
              <Input
                className={msg30CharLimitFlag ?
                  "messageInputTextArea messageInputTextAreaFlash" :
                  "messageInputTextArea"}
                type="textarea"
                name="text"
                value={sampleZoom30Message || ''}
                onChange={(e) => handleChange(e, meetingType30)}
                onClick={(e) => setmsg30CursorPos(e.target.selectionEnd)}
                onKeyUp={(e) => setmsg30CursorPos(e.target.selectionEnd)} />
              <p
                className={msg30CharLimitFlag ?
                  "CharcLimitCounter CharcLimitCounterFlash" :
                  "CharcLimitCounter"} >
                {`${msg30CharLimitCounter}/280`}
              </p>
            </span>
            {/* <span className="outputMessageContainer">
              <Label className="infoTag">This is what the receipient would see:</Label>
              <Input
                disabled
                type="textarea"
                className="messageOutput"
                value={variableTranslator(sampleZoom30Message || "", 30)} />
            </span> */}
          </div>
          <TagButtonComponent
            cursorPos={msg30CursorPos}
            sampleZoom30Message={sampleZoom30Message}
            handleChange={handleChange}
            tagType={meetingType30}
            skillsReq={data[0].scoring.skills_required || []}
          />
        </div>
      }
      {Drop && Drop.time === '15 Minutes Long' &&
        <div >
          <div className="messsageContainer">
            <span className="inputMessageContainer">
              <Input
                className={msg15CharLimitFlag ?
                  "messageInputTextArea messageInputTextAreaFlash" :
                  "messageInputTextArea"}
                type="textarea"
                name="text"
                value={sampleZoom15Message || ''}
                onChange={(e) => handleChange(e, meetingType15)}
                onClick={(e) => setmsg15CursorPos(e.target.selectionEnd)}
                onKeyUp={(e) => setmsg15CursorPos(e.target.selectionEnd)} />
              <p
                className={msg15CharLimitFlag ?
                  "CharcLimitCounter CharcLimitCounterFlash" :
                  "CharcLimitCounter"} >
                {`${msg15CharLimitCounter}/280`}
              </p>
            </span>
            {/* <span className="outputMessageContainer">
                  <Label className="infoTag">This is what the receipient would see:</Label>
                  <Input
                    disabled
                    type="textarea"
                    className="messageOutput"
                    value={variableTranslator(sampleZoom15Message || "", 15)} />
                </span> */}
          </div>
          <TagButtonComponent
            cursorPos={msg15CursorPos}
            sampleZoom15Message={sampleZoom15Message}
            handleChange={handleChange}
            tagType={meetingType15}
            skillsReq={data[0].scoring.skills_required || []}
          />
        </div>
      }
    </React.Fragment>
  )
}


export default withRouter(MessagesFlow)