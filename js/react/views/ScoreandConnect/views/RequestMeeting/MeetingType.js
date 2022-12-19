import React, { useState, useEffect } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label } from 'reactstrap'
import closeIcon from '../../../../../../img/close.svg'
import eyeIcon from '../../../../../../img/eye.svg'
import addNewIcon from '../../../../../../img/addNew.svg'

import { withRouter } from 'react-router-dom'
import { Button } from 'reactstrap'

const MeetingType = ({
    dispatch,
    data,
    onSelectMeeting,
    meetingSlot
}) => {

    let [isSelected, setIsSelected] = useState(false);
    let [slot, setSlot] = useState(null);

    if (meetingSlot != null) {
        slot = meetingSlot
    }
    const onSelectMeetingType = (slot) => {
        setIsSelected(true)
        setSlot(slot)
        onSelectMeeting(slot)
    }

    return (
        
            <div className="meetingTimeTabPanelConatiner">
                <p className="meetingTypeLable">What kind of a meeting request do you want to send?</p>
                <div className="meetingTypeButtonsContainer">
                    <Button className="meetingTypeButtons" 
                        style={{backgroundColor: slot == 15 ? '#297AF7' : 'white', color: slot == 15 ? 'white' : '#297AF7',marginRight:'16px'}}
                        onClick={() => onSelectMeetingType(15)}
                        color='primary'
                        className='settingButton'>
                        15 Minutes Meeting
                    </Button>
                    <Button className="meetingTypeButtons" 
                        style={{backgroundColor: slot == 30 ? '#297AF7' : 'white', color: slot == 30 ? 'white' : '#297AF7',marginRight:'16px'}}
                        onClick={() => onSelectMeetingType(30)}
                        color='primary'
                        className='settingButton'>
                        30 Minutes Meeting
                    </Button>
                </div>
            </div>
        
    )
}


export default withRouter(MeetingType)
