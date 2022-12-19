import React, { useState, useRef, useEffect } from 'react'
import { Button, Input } from 'reactstrap'
import { connect } from 'react-redux'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './EditEvent.css'
import backArrow from '../../../../../img/backArrow.svg'
import _calendar from '../../../../../img/calendar.svg'
import DisplayPlaceholder from '../../../../../img/displayPlaceholder.svg'
import user from '../../../../../img/user.svg'
import { fetchAvailabilityDates } from '../../../actions/calendar'
import { fetchAvailabilityMonths } from '../../../actions/calendar'
import { fetchAvailabilityDays } from '../../../actions/calendar'
import { updateEvent } from '../../../actions/calendar'
import zoom from '../../../../../img/zoom.svg'
import '../Calendar.css'
import './EditEvent.css'

const days = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday"
}

const EditEvent = ({ dispatch, currentUser, event, onSave, onBack, calendar }) => {

    let [eventName, setEventName] = useState(event.name)
    let [startDate, setStartDate] = useState(new Date(event.start));
    let [startTime, setStartTime] = useState(new Date(event.start));
    let [endTime, setEndTime] = useState(new Date(event.end));
    let [location, setLocation] = useState(event.location);
    let [canSave, setCanSave] = useState(true);
    const startDateRef = useRef();

    let _span = Math.abs(((new Date(event.start).getTime() - new Date(event.end).getTime()) / 1000) / 60);

    let minDate = new Date();
    let maxDate = null;
    if (minDate.getMonth() + 3 <= 11) {
        maxDate = new Date(minDate.getFullYear(), minDate.getMonth() + 3, 0);
    }
    else {
        maxDate = new Date(minDate.getFullYear() + 1, minDate.getMonth() - 12 + 3, 0);
    }

    const endFilterPassedTime = time => {
        if (calendar.availabilityMonth) {
            let isValid = false;
            let length = calendar.availabilityMonth.length;
            let startSlot = new Date(startTime.toDateString() + " " + calendar.availabilityMonth[length - 1]);
            let endSlot = new Date(startSlot);
            endSlot.setMinutes(endSlot.getMinutes() + _span);

            calendar.availabilityMonth.map(slot => {
                let _time = new Date(new Date().toDateString() + " " + slot).toLocaleTimeString();
                if (_time == time.toLocaleTimeString()) {
                    isValid = true;
                }
                let __time = new Date(time);
                __time.setDate(startTime.getDate());
                __time.setMonth(startTime.getMonth());
                __time.setFullYear(startTime.getFullYear());
                let span = ((__time.getTime() - startTime.getTime()) / 1000) / 60;
                if (__time.getTime() <= startTime.getTime() || (span != _span)) {
                    isValid = false;
                }
                if (__time.getTime() == endSlot.getTime() && startTime.getTime() == startSlot.getTime()) {
                    isValid = true;
                }
            })
            return isValid;
        }
        return false;
    }

    const filterPassedTime = time => {

        if (calendar.availabilityMonth) {
            let isValid = false;
            calendar.availabilityMonth.map(slot => {
                let _time = new Date(new Date().toDateString() + " " + slot).toLocaleTimeString();
                if (_time == time.toLocaleTimeString()) {
                    isValid = true;
                }
            })
            return isValid;
        }
        return false;
    }

    const isValidDate = date => {
        const day = days[date.getDay()];
        const _date = date.getDate();
        let month = date.getMonth();
        if (calendar.availabilityDate && calendar.availabilityDate[month] && calendar.availabilityDate[month].data && calendar.availabilityDate[month].data.calendar == "disable") {
            return false;
        }
        else if (calendar.availabilityDate && calendar.availabilityDate[month] && calendar.availabilityDate[month].data && calendar.availabilityDate[month].data.dates) {
            return calendar.availabilityDays[day] && calendar.availabilityDate[month].data.dates.includes(_date);
        }
        else if (calendar.availabilityDays)
            return calendar.availabilityDays[day];
        else
            return true;
    };

    useEffect(() => {
        dispatch(fetchAvailabilityMonths({
            month: new Date(startDate).getMonth() + 1,
            year: new Date(startDate).getFullYear(),
            span: event.span,
            ownerSlug: event.ownerSlug
        }))
        dispatch(fetchAvailabilityDays({
            ownerSlug: event.ownerSlug
        }))
        dispatch(fetchAvailabilityDates({
            date: formatDate(startDate),
            slot: event.span,
            timeZone: event.timeZone,
            ownerSlug: event.ownerSlug
        }))
    }, [])

    const formatTime = (time) => {
        return time.split(" ")[0];
    }

    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    const startDateEdit = () => {
        startDateRef.current.setFocus();
    }

    const onLocationChange = (e) => {
        setLocation(e.target.value);
        event.location = location;
    }

    const startDateChange = (e) => {
        setStartDate(e);
        event.startDate = startDate;
        dispatch(fetchAvailabilityDates({
            date: formatDate(e),
            slot: event.span,
            timeZone: event.timeZone,
            ownerSlug: event.ownerSlug
        }))
    }

    const startTimeChange = (e) => {
        let diff = ((endTime.getTime() - e.getTime()) / 1000) / 60;
        if (diff != _span) {
            setCanSave(false);
        }
        else {
            setCanSave(true);
        }
        setStartTime(e);
    }

    const endTimeChange = (e) => {
        let diff = ((e.getTime() - startTime.getTime()) / 1000) / 60;
        if (diff != _span) {
            setCanSave(false);
        }
        else {
            setCanSave(true);
        }
        setEndTime(e);
    }

    const onSaveEvent = () => {
        let diff = ((endTime.getTime() - startTime.getTime()) / 1000) / 60;
        if (diff != _span) {
            return;
        }

        let span = ((endTime.getTime() - startTime.getTime()) / 1000) / 60;
        let payload = {
            "email": event.inviteeEmail,
            "name": event.name,
            "notes": null,
            "number": event.number,
            "time": formatTime(startTime.toTimeString()),
            "date": formatDate(startDate.toDateString()),
            "span": span.toString(),
            "time_zone": event.timeZone,
            "customLink": false,
            "prospectId": event.prospectId,
            "jobId": event.jobId
        }
        dispatch(updateEvent(payload));
        onSave();
    }

    return (
        <div className="container-fluid editEvents">
            <div className="row" style={{ background: '#E5E5E5' }}>
                <div style={{ margin: 'auto' }}>
                    <div>
                        <div className="head">
                            <div>
                                <img style={{ margin: '-15px 10px 0 -5px', padding: '2px', border: '1px solid #A7ABB0', borderRadius: '8px', cursor: 'pointer' }} src={backArrow} alt='backArrow' onClick={onBack} />
                                <span className="editEventHeading">Edit Event</span>
                            </div>
                            <Button
                                style={{ opacity: canSave ? '1' : '0.5' }}
                                color='primary'
                                outline
                                onClick={onSaveEvent}
                                className='saveChanges'>
                                Save Changes
                            </Button>
                        </div>
                        <div className="container-fluid content">
                            <div className="row">
                                <div className="col-6">
                                    <div>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            margin: '10px 5px'
                                        }}>
                                            <div className="leftHeading">Event Name</div>
                                            <div className='rightContent'>
                                                {eventName}
                                            </div>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            margin: '10px 5px'
                                        }}>
                                            <div className="leftHeading">From</div>
                                            <div style={{ display: 'flex', minWidth: '250px' }}>
                                                <div className="dateInput" style={{ width: '160px', marginRight: '10px', display: 'flex' }}>
                                                    <DatePicker
                                                        ref={startDateRef}
                                                        selected={startDate}
                                                        onChange={startDateChange}
                                                        filterDate={isValidDate}
                                                        minDate={minDate}
                                                        maxDate={maxDate}
                                                        dateFormat="d MMM, yyyy"
                                                    />
                                                    <img style={{ margin: '5px 0 0 -20px', width: '15px', height: '15px', zIndex: '2' }} src={_calendar} alt='_calendar' onClick={startDateEdit} />
                                                </div>
                                                <div className="timeInput" style={{ width: '80px' }}>
                                                    <DatePicker
                                                        selected={startTime}
                                                        onChange={startTimeChange}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        filterTime={filterPassedTime}
                                                        timeIntervals={event.span}
                                                        dateFormat="h:mm aa"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            margin: '10px 5px'
                                        }}>
                                            <div className="leftHeading">To</div>
                                            <div style={{ display: 'flex', minWidth: '250px' }}>
                                                <div className="timeInput" style={{ width: '80px', marginRight: '10px' }}>
                                                    <DatePicker
                                                        selected={endTime}
                                                        onChange={endTimeChange}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        timeIntervals={event.span}
                                                        filterTime={endFilterPassedTime}
                                                        dateFormat="h:mm aa"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            !canSave ?
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    margin: '10px 5px'
                                                }}>
                                                    <div className="leftHeading"></div>
                                                    <div style={{ display: 'flex', minWidth: '250px' }}>
                                                        <div style={{ color: 'red', fontSize: '9px' }}>
                                                            <div>Start time can not be greater than or equal to end time.</div>
                                                            <div>Slots should not be greater than {_span} minutes.</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                []
                                        }
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            margin: '5px'
                                        }}>
                                            <div className="leftHeading">Location</div>
                                            <div className="rightContent" style={{ display: 'flex', minWidth: '250px' }}>
                                                <img style={{ margin: 'auto 5px' }} className="zoomIcon" src={zoom} alt='zoom' />Zoom
                                                {/* <select className="inputBoxes" style={{ width: '100%' }}
                                                    name="location"
                                                    value={location}
                                                    onChange={onLocationChange}>
                                                    <option value="googleMeets">
                                                        Google Meet
                                                    </option>
                                                    <option value="zoom">
                                                        Zoom
                                                    </option>
                                                    <option value="webEx">
                                                        WebEx
                                                    </option>
                                                </select> */}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-6">
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        margin: '10px 5px'
                                    }}>
                                        <div className="leftHeading">Attendees</div>
                                        <div style={{ marginRight: '50px' }}>
                                            <div className="rightContent" style={{ display: 'flex', marginBottom: '10px', border: '1px solid #CDD1D7' }}>
                                                <img
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '50%'
                                                    }}
                                                    src={event.imageUrl ? event.imageUrl : DisplayPlaceholder} />
                                                <div style={{ margin: 'auto 10px' }}>
                                                    <h2 style={{ fontWeight: '400', fontSize: '16px' }}>
                                                        {event.full_name}
                                                    </h2>
                                                    <span style={{ color: '#A7ABB0' }}>{event.inviteeEmail}</span>
                                                </div>
                                            </div>
                                            <div className="rightContent" style={{ display: 'flex', marginBottom: '10px', border: '1px solid #CDD1D7' }}>
                                                <img
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '50%'
                                                    }}
                                                    src={user} alt='user' />
                                                <div style={{ margin: 'auto 10px' }}>
                                                    <h2 style={{ fontWeight: '400', fontSize: '16px' }}>
                                                        {currentUser.name}<span style={{ color: '#A7ABB0' }}> (you)</span>
                                                    </h2>
                                                    <span style={{ color: '#A7ABB0' }}>{currentUser.emailAddress}</span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default connect(state => ({
    calendar: state.calendar,
}))(EditEvent)
    // export default EditEvent