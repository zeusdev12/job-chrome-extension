import React, { useState, useRef, useEffect } from 'react'
import { Button, Input } from 'reactstrap'
import { connect } from 'react-redux'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import backArrow from '../../../../../img/backArrow.svg'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import "@fullcalendar/daygrid/main.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Container } from 'reactstrap'

import { fetchSettings } from '../../../actions/calendar';
import { editSettings } from '../../../actions/calendar';
import TimezonePicker from '../../../components/TimeZonePicker/TimezonePicker'
import Loader from "../../../components/Loader"
import zoomIcon from '../../../../../img/zoom.svg'

const days = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
}

const months = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec"
}

const weekdays = [
    { "id": "monday", "value": "Monday" },
    { "id": "tuesday", "value": "Tuesday" },
    { "id": "wednesday", "value": "Wednesday" },
    { "id": "thursday", "value": "Thursday" },
    { "id": "friday", "value": "Friday" }
];

const CalendarSettings = (props) => {

    const {
        dispatch,
        calendar,
        currentUser,
        onBack
    } = props

    const getSettings = () => {
        dispatch(fetchSettings({
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            span: selectedIndex == 0 ? 15 : 30,
            email: currentUser ? currentUser.emailAddress : "",
            monthTill: new Date().getMonth() + 3
        }))
    }

    useEffect(() => {
        getSettings();
    }, [])

    let [selectedIndex, setSelectedIndex] = useState(0);
    let [selectedEvent, setSelectedEvent] = useState(null);
    let [applyMore, setApplyMore] = useState(false);
    let [startTime, setStartTime] = useState(null);
    let [endTime, setEndTime] = useState(null);
    let [selectedTimezone, setSelectedTimezone] = useState();
    let [location, setLocation] = useState(calendar.settings && calendar.settings.data ? calendar.settings.data.location : "zoom");
    let [isUnavailable, setIsUnavailable] = useState(false);
    let [applyToDay, setApplyToDay] = useState(false);
    let [applyToDate, setApplyToDate] = useState(false);
    let [selectedDays, setSelectedDays] = useState([]);
    let [canSave, setCanSave] = useState(true);
    const calendarRef = useRef();

    const onSetSelectedTimezone = (zone) => {
        setSelectedTimezone(zone)
    }

    const onSetApplyToDay = () => {
        if (!canSave) {
            return;
        }
        applyToDay = true;
        onSaveEvent();
    }

    const onSetApplyToDate = () => {
        if (!canSave) {
            return;
        }
        applyToDate = true;
        onSaveEvent();
    }

    const setUnavailablility = () => {
        if (!isUnavailable) {
            setCanSave(true);
        }
        else {
            let _time = new Date(endTime);
            _time.setDate(startTime.getDate());
            _time.setMonth(startTime.getMonth());
            _time.setFullYear(startTime.getFullYear());
            if (_time.getTime() <= startTime.getTime()) {
                setCanSave(false);
            }
        }
        setIsUnavailable(!isUnavailable);
    }

    const handleSelect = (index) => {
        setSelectedIndex(index);
        dispatch(fetchSettings({
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            span: selectedIndex == 0 ? 15 : 30,
            email: currentUser ? currentUser.emailAddress : "",
            monthTill: new Date().getMonth() + 3
        }))
    };

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

        return [day, month, year].join('/');
    }

    const onSaveSettings = () => {
        let payload = {
            apply_status: "date",
            available: "on",
            type: { eventType: selectedIndex == 0 ? "15" : "30" },
            ownerTimeZone: selectedTimezone,
            dnnaeEmail: currentUser ? currentUser.emailAddress : ""
        }
        if (selectedEvent && selectedEvent) {
            payload["apply_on"] = formatDate(selectedEvent.start.toDateString())
            if (isUnavailable) {
                payload["endMeetingTime"] = null;
                payload["startMeetingTime"] = null;
            }
            else {
                payload["startMeetingTime"] = formatTime(startTime.toTimeString());
                payload["endMeetingTime"] = formatTime(endTime.toTimeString());
            }
        }
        else {
            payload["onlyTimeZone"] = true;
        }
        if (applyToDate) {
            payload["apply_status"] = "date"
        }
        if (applyToDay) {
            payload["apply_status"] = "day"
        }
        if (selectedDays.length > 0) {
            payload["apply_status"] = "day"
            payload["list_days"] = selectedDays;
        }
        dispatch(editSettings(payload));
    }

    const onSaveEvent = () => {
        if (!canSave) {
            return;
        }
        onSaveSettings();
        onUnselectEvent();
    }

    const onApplySaveEvent = () => {
        onSaveSettings();
        onUnselectEvent();
    }

    const onCheckBoxSelect = (e) => {
        if (e.target.checked) {
            selectedDays.push(e.target.name);
        }
        else {
            const index = selectedDays.indexOf(e.target.name);
            if (index > -1) {
                selectedDays.splice(index, 1);
            }
        }
    }

    const onIsApplyMore = () => {
        if (!canSave) {
            return;
        }
        setApplyToDate(false);
        setApplyToDay(false);
        setApplyMore(true);
    }

    const onCancel = () => {
        isUnavailable = false;
        applyToDate = false;
        applyToDay = false;
        setSelectedDays([]);
        setApplyMore(false);
    }

    const onLocationChange = (e) => {
        setLocation(e.target.value);
    }

    const startTimeChange = (e) => {
        let _time = new Date(e);
        _time.setDate(endTime.getDate());
        _time.setMonth(endTime.getMonth());
        _time.setFullYear(endTime.getFullYear());
        if (endTime.getTime() <= _time.getTime()) {
            setCanSave(false);
        }
        else {
            setCanSave(true);
        }
        if ((selectedIndex == 0 && [0, 15, 30, 45].includes(e.getMinutes())) || (selectedIndex == 1 && [0, 30].includes(e.getMinutes()))) {
            setStartTime(e);
        }
    }

    const endTimeChange = (e) => {
        let _time = new Date(e);
        _time.setDate(startTime.getDate());
        _time.setMonth(startTime.getMonth());
        _time.setFullYear(startTime.getFullYear());
        if (_time.getTime() <= startTime.getTime()) {
            setCanSave(false);
        }
        else {
            setCanSave(true);
        }
        if ((selectedIndex == 0 && [0, 15, 30, 45].includes(e.getMinutes())) || (selectedIndex == 1 && [0, 30].includes(e.getMinutes()))) {
            setEndTime(e);
        }
    }

    const getDay = () => {
        return days[new Date(selectedEvent.start).getDay()];
    }

    const getDate = () => {
        return new Date(selectedEvent.start).getDate();
    }

    const getMonth = () => {
        return months[new Date(selectedEvent.start).getMonth()];
    }

    const renderEventContent = (eventInfo) => {
        if (eventInfo.event.title == "I'm unavailable") {
            return <div className="month" style={{ width: '100%' }}>
                <div>I'm unavailable</div>
            </div>
        }
        if (eventInfo.event.start && eventInfo.event.end) {
            let start = eventInfo.event.start.toLocaleTimeString().split(":");
            start = [start[0], start[1]].join(':');
            let end = eventInfo.event.end.toLocaleTimeString().split(":");
            end = [end[0], end[1]].join(':');

            return <div className="month" style={{ width: '100%' }}>
                <div>{eventInfo.event.title}</div>
                {/* <div>{start} - {end}</div> */}
            </div>
        }
    }

    const handleEventClick = (clickInfo) => {
        if (clickInfo.event.start.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
            return;
        }
        let event = {
            "start": new Date(clickInfo.event.start),
            "end": new Date(clickInfo.event.end)
        }
        setSelectedEvent(event);
        if (clickInfo.event.title == "I'm unavailable") {
            setIsUnavailable(true);
            setCanSave(true);
        }
        else {
            if (new Date(event.end).getTime() <= new Date(event.start).getTime()) {
                setCanSave(false);
            }
        }
        setStartTime(new Date(event.start));
        setEndTime(new Date(event.end));
    }

    const onUnselectEvent = () => {
        setSelectedEvent(null);
        getSettings();
    }

    const WeekDays = () => {
        return (
            <>
                {applyMore == false ?
                    <div>
                        <Button
                            style={{ opacity: canSave ? '1' : '0.5', width: '225px', fontWeight: 'normal',
                            height: '42px', fontSize: '16px' }}
                            color='primary'
                            onClick={onSetApplyToDate}
                            className='settingButton'>
                            Apply to {getDate()} {getMonth()} only
                        </Button>
                        <Button
                            style={{ opacity: canSave ? '1' : '0.5', width: '225px', fontWeight: 'normal',
                            height: '42px', fontSize: '16px' }}
                            color='primary'
                            onClick={onSetApplyToDay}
                            className='settingButton'>
                            Apply to all {getDay()}s
                        </Button>
                        <div onClick={onIsApplyMore} style={{ fontSize: '16px', color: '#297AF7', margin: '-5px 0 0 5px' }}>or apply to multiple</div>
                    </div>
                    :
                    <React.Fragment>
                        <div style={{ marginTop: '10px' }}>
                            {
                                weekdays.map((week, index) => {
                                    return <div key={week + index} style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '5px' }}>
                                        <Input className='checkBox'
                                            type='checkbox'
                                            name={week.id}
                                            id={week.id}
                                            defaultChecked={selectedDays.includes(week.id)}
                                            onChange={onCheckBoxSelect}
                                        /><span style={{ fontSize: '12px', marginLeft: '-5px' }}>{week.value}</span>
                                    </div>
                                })
                            }
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                color='primary'
                                style={{ border: '1px solid #0f0f0f', color: '#2E2E2E', margin: '10px 0', marginRight: '5px' }}
                                onClick={onCancel}
                                className='settingButton'>
                                Cancel
                            </Button>
                            <Button
                                color='primary'
                                style={{ border: '1px solid #0f0f0f', color: '#2E2E2E', margin: '10px 0' }}
                                onClick={onApplySaveEvent}
                                className='settingButton'>
                                Apply
                            </Button>
                        </div>
                    </React.Fragment>
                }
            </>
        )
    }

    const endFilterPassedTime = time => {

        let _time = new Date(time);
        _time.setDate(startTime.getDate());
        _time.setMonth(startTime.getMonth());
        _time.setFullYear(startTime.getFullYear());

        if (_time.getTime() <= startTime.getTime()) {
            return false;
        }
        return true;
    }

    const TabView = () => {
        return (
            <>
                <div style={{ margin: '10px' }}>
                    <div style={{
                        margin: '5px 0px 20px 20px'
                    }}>
                        <div className="leftHeading">Location</div>
                        <div style={{ display: 'flex', width: '250px' }}>
                            <div style={{ minWidth: '250px' }} className="inputBoxes">
                                <img style={{ margin: 'auto 5px' }} className="zoomIcon" src={zoomIcon} alt='zoomIcon' />Zoom
                            </div>
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
                    <div style={{ marginLeft: '20px' }}>When can people book this meeting?</div>
                    {
                        selectedEvent == null ?
                            <div style={{ background: 'white', margin: '20px', borderRadius: '8px' }}>
                                <FullCalendar
                                    ref={calendarRef}
                                    dayHeaders={true}
                                    initialView="dayGridMonth"
                                    headerToolbar={{
                                        left: 'title,prev,next',
                                        center: '',
                                        right: ''
                                    }}
                                    dayHeaderFormat={{
                                        weekday: 'short',
                                    }}
                                    nowIndicator={true}
                                    slotEventOverlap={true}
                                    plugins={[dayGridPlugin, interactionPlugin]}
                                    events={calendar.settings.events_list}
                                    editable={true}
                                    selectable={true}
                                    selectMirror={true}
                                    weekends={true}
                                    eventContent={renderEventContent}
                                    eventClick={handleEventClick}
                                />
                            </div>
                            :
                            <div style={{ background: 'white', margin: '20px', padding: '20px', borderRadius: '8px' }}>
                                <div style={{ display: 'flex' }}>
                                    <img style={{ margin: '5px 10px 0 -5px', padding: '2px', border: '1px solid #A7ABB0', borderRadius: '8px', height: '30px', cursor: 'pointer' }} src={backArrow} alt='backArrow' onClick={onUnselectEvent} />
                                    <span className="editEventHeading" style={{ fontSize: '16px' }}>Edit Availability</span>
                                </div>
                                <div style={{ width: 'fit-content', margin: '0 auto' }}>
                                    <div style={{ borderBottom: '1px solid #E6E9ED' }}>
                                        <div style={{ display: 'flex', fontSize: '16px' }}>
                                            <div style={{ width: '200px' }}>Start Time</div>
                                            <div>End Time</div>
                                        </div>
                                        <div style={{ display: 'flex' }}>
                                            <div className="timeSettingsInput" style={{ marginRight: '10px', width: '190px' }}>
                                                <DatePicker
                                                    selected={startTime}
                                                    onChange={startTimeChange}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={selectedIndex == 0 ? 15 : 30}
                                                    dateFormat="h:mm aa"
                                                    disabled={isUnavailable}
                                                />
                                            </div>
                                            <div className="timeSettingsInput" style={{ width: '190px' }}>
                                                <DatePicker
                                                    selected={endTime}
                                                    onChange={endTimeChange}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={selectedIndex == 0 ? 15 : 30}
                                                    dateFormat="h:mm aa"
                                                    disabled={isUnavailable}
                                                    filterTime={endFilterPassedTime}
                                                />
                                            </div>
                                        </div>
                                        {
                                            !canSave ?
                                                <div style={{ color: 'red', fontSize: '9px' }}>
                                                    Start time can not be greater than or equal to end time.
                                                </div>
                                                :
                                                []
                                        }
                                        <div style={{ display: 'flex' }}>
                                            <Button
                                                color='primary'
                                                style={{ border: '1px solid #0f0f0f', color: '#2E2E2E', margin: '10px 0', backgroundColor: isUnavailable ? '#297AF7' : 'none', width: '148px',
                                                fontWeight: 'normal', height: '42px', fontSize: '16px' }}
                                                onClick={setUnavailablility}
                                                className='settingButton'>
                                                {isUnavailable ? "I'm Unavailable" : "I'm Available"}
                                            </Button>
                                        </div>
                                    </div>
                                    <WeekDays />
                                </div>
                            </div>
                    }
                </div>

            </>
        )
    }
    return (
        <div className="container-fluid calendarSettings">
            <div className="row" style={{ background: '#E5E5E5' }}>
                <div style={{ margin: '20px auto', width: '90%' }}>
                    <div>
                        <div className="head">
                            <div>
                                <img style={{ margin: '-15px 10px 0 -5px', padding: '2px', border: '1px solid #A7ABB0', borderRadius: '8px', cursor: 'pointer' }} src={backArrow} alt='backArrow' onClick={onBack} />
                                <span className="editEventHeading">Calendar Settings</span>
                            </div>
                            <Button
                                style={{ opacity: canSave ? '1' : '0.5' }}
                                color='primary'
                                onClick={onSaveEvent}
                                className='saveChanges'>
                                Save Changes
                            </Button>
                        </div>
                        <div className="container-fluid content">
                            {!calendar.settings || !calendar.settings.data &&
                                <>
                                    <div className="loaderCalender">
                                        <Loader color='blue' height='100px' width='100px' />
                                    </div>
                                </>
                            }
                            {calendar.settings && calendar.settings.data &&
                                <>
                                    <div className="row">
                                        <div className="col-7">
                                            <div>
                                                <div style={{
                                                    display: 'flex',
                                                    margin: '10px 5px'
                                                }}>
                                                    <div className="leftHeading">URL</div>
                                                    <div style={{ display: 'flex' }}>
                                                        <div style={{ margin: 'auto' }}>Pencilit.io/</div>
                                                        <div style={{
                                                            width: '170px',
                                                            background: 'rgb(229, 229, 229)',
                                                            borderRadius: '8px',
                                                            padding: '5px'
                                                        }}>
                                                            {calendar.settings && calendar.settings.data ? calendar.settings.data.slugUrl : ""}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-5">
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                margin: '5px'
                                            }}>
                                                <div className="leftHeading">Time Zone</div>
                                                <div className="timeZoneDropdown" style={{ display: 'flex', minWidth: '250px' }}>

                                                    <TimezonePicker
                                                        absolute={true}
                                                        defaultValue={calendar.settings.data.time_zone}
                                                        placeholder="Select Timezone..."
                                                        onChange={zone => onSetSelectedTimezone(zone)}
                                                        value={selectedTimezone}
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    margin: '10px 5px'
                                                }}>
                                                    <div className="leftHeading">Meeting Settings</div>
                                                    <div style={{
                                                        width: '100%', background: '#F5F6F7', borderRadius: '8px', border: '1px solid #E6E9ED'
                                                    }}>
                                                        <Tabs selectedIndex={selectedIndex}
                                                            onSelect={handleSelect}>
                                                            <TabList>
                                                                <Tab>15 Minutes Meeting</Tab>
                                                                <Tab>30 Minutes Meeting</Tab>
                                                            </TabList>

                                                            <TabPanel>
                                                                <TabView />
                                                            </TabPanel>
                                                            <TabPanel>
                                                                <TabView />
                                                            </TabPanel>
                                                        </Tabs>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </>
                            }
                        </div>



                    </div>
                </div>
            </div >
        </div >
    )
}

export default connect(state => ({
    calendar: state.calendar,
}))(CalendarSettings)
