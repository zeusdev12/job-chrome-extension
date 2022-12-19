import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'

import Header from '../../components/Header'
import './Calendar.css'
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Input } from 'reactstrap'
import 'react-tabs/style/react-tabs.css';

import qs from 'query-string'

import { withRouter } from 'react-router-dom'


import EditEvent from './EditEvent'
import EventDetails from './EventDetails'
import { fetchEvents } from '../../actions/calendar'
import { fetchEventsWithJobs } from '../../actions/calendar'
import settingsIcon from '../../../../img/settingsIcon.svg'
import prevIcon from '../../../../img/prevIcon.svg'
import nextIcon from '../../../../img/nextIcon.svg'
import triSelector from '../../../../img/triSelector.svg'
import CalendarSettings from './CalendarSettings';
import moment from 'moment'
import Loader from '../../components/Loader'

const CalendarComponent = ({ step,  notifications, user, dispatch, isPopupOpened, calendar, location: { search }, history: { push } }) => {

  let [viewState, setViewState] = useState('calendarView');
  let [dayHeaders, setDayHeaders] = useState(false);
  let [calendarView, setCalendarView] = useState("day");
  let [selectedEvent, setSelectedEvent] = useState(null);
  let [selectedView, setSelectedView] = useState("timeGridDay");
  let [selectedDate, setSelectedDate] = useState();
  let [filteredjobs, setFilteredjobs] = useState([]);
  let [prevNode, setPrevNode] = useState(null);
  let [showTriSelector, setShowTriSelector] = useState(false);

  const calendarRef = useRef();
  let fetchedJobs = calendar.fetchedJobs;
  let fetchedJobsIDS = [];
  let checkedJobs = [];
  let todayEvent = [];

  fetchedJobs.map(job => {
    fetchedJobsIDS.push(job.id)
    checkedJobs.push(job.id)
  })

  const loadEvents = (start, end) => {
    dispatch(fetchEvents({
      startDate: start,
      endDate: end,
    }))
  }


  const getDoubleDigits = (timeStr) => timeStr.length==1 ? "0"+timeStr : timeStr

  useEffect(() => {
    
    const params = qs.parse(search)
    if("meetingId" in params && "startMeeting" in params){  
      setSelectedDate(new Date(params.startMeeting.slice(0,10)))
    }
    
  }, [])

 
  useEffect(() => {
    
    const params = qs.parse(search)
  
    if(calendar?.events?.length>0 && "meetingId" in params && "startMeeting" in params){
      if(calendar.events.some(e=> e.meetingId==params.meetingId)){
        const eventsArray = calendar.events.filter(e => e.meetingId == params.meetingId)
        setSelectedEvent(eventsArray);
      }
      else   
        alert("Meeting not found!");
  
      push(`/html/calendar.html`)
      
    }
  
      
  }, [calendar?.events?.length])

  useEffect(() => {
    const params = qs.parse(search)
    const date = selectedDate ? 
    selectedDate : 
    "meetingId" in params && "startMeeting" in params ? 
    new Date(params.startMeeting): 
    new Date()
    
    const { start, end } = getStartEnd(date)
    
    if (!calendar.isUpdating) {
      filteredjobs.map(job => {
        if (checkedJobs.includes(job)) {
          const index = checkedJobs.indexOf(job);
          if (index > -1) {
            checkedJobs.splice(index, 1);
          }
        }
      })
      if (checkedJobs.length > 0) {
        dispatch(fetchEventsWithJobs({
          startDate: start,
          endDate: end,
          fetchedJobs: checkedJobs
        }))
      }
      else {
        loadEvents(start, end);
      }
    }
  }, [calendar.isUpdating])


  const getStartEnd = (date) => {
      const startDate = new Date(date);
      const start = formatDate(new Date(startDate.setDate(startDate.getDate() - 2)));
      const end = new Date(date);

      switch (calendarView) {
        case "day":
          return { start, end: formatDate(new Date(end.setDate(end.getDate() + 2))) }
          
        case "week":
          const weekRange = getWeekRange(date);
          return { start: weekRange.firstday,
          end: weekRange.lastday }

        case "month":
          const monthRange = getMonthRange(date);
          return {start: monthRange.firstday,
          end: monthRange.lastday}
      }
  } 

  const changeDate = (e) => {
    if (prevNode != null) {
      if (prevNode?.dayEl?.classList?.contains("highlight-date")) {
        prevNode?.dayEl?.classList?.remove("highlight-date")
      }
      setPrevNode(e)
    }
    else {
      setPrevNode(e)
    }
    e?.dayEl?.classList.add("highlight-date");
    let ref = formatDate(new Date(e.date));
    let start = new Date(ref);
    start = formatDate(new Date(start.setDate(start.getDate() - 2)));
    let end = new Date(ref);
    switch (calendarView) {
      case "day":
        end = formatDate(new Date(end.setDate(end.getDate() + 2)));
        break;
      case "week":
        const weekRange = getWeekRange(e.date);
        start = weekRange.firstday;
        end = weekRange.lastday;
        break;
      case "month":
        const monthRange = getMonthRange(e.date);
        start = monthRange.firstday;
        end = monthRange.lastday;
        break;
    }
    filteredjobs.map(job => {
      if (checkedJobs.includes(job)) {
        const index = checkedJobs.indexOf(job);
        if (index > -1) {
          checkedJobs.splice(index, 1);
        }
      }
    })
    if (checkedJobs.length > 0) {
      dispatch(fetchEventsWithJobs({
        startDate: start,
        endDate: end,
        fetchedJobs: checkedJobs
      }))
    }
    else {
      loadEvents(start, end);
    }
    if (!selectedDate || selectedDate.toDateString() != e.date.toDateString()) {
      setSelectedEvent(null);
    }
    setSelectedDate(new Date(e.date));
  }

  const getMonthRange = (date) => {
    var curr_date = new Date(date);
    var first_day = new Date(curr_date.getFullYear(), curr_date.getMonth(), 1);
    var last_day = new Date(curr_date.getFullYear(), curr_date.getMonth() + 1, 0);

    return {
      firstday: formatDate(first_day),
      lastday: formatDate(last_day)
    }
  }

  const getWeekRange = (date) => {
    var curr = new Date(date);
    var first = curr.getDate() - curr.getDay();
    var last = first + 6;

    let start = new Date(curr);
    let end = new Date(curr);

    return {
      firstday: formatDate(start.setDate(first)),
      lastday: formatDate(end.setDate(last))
    }
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

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(calendar.events.filter(e => e.id == clickInfo.event.id));
  }

  const unselectEvent = () => {
    setSelectedEvent(null);
  }

  const onViewChange = (e) => {
    let calendarApi = calendarRef.current.getApi();
    let value = e.target.value;
    setCalendarView(value);
    let date = selectedDate ? selectedDate : new Date();
    let ref = formatDate(new Date(date));
    let start = new Date(ref);
    start = formatDate(new Date(start.setDate(start.getDate() - 2)));
    let end = new Date(ref);
    switch (value) {
      case "day":
        end = formatDate(new Date(end.setDate(end.getDate() + 2)));
        setSelectedView("timeGridDay");
        calendarApi.changeView('timeGridDay');
        setDayHeaders(false);
        break;
      case "week":
        const weekRange = getWeekRange(start);
        start = weekRange.firstday;
        end = weekRange.lastday;
        setSelectedView("timeGridWeek");
        calendarApi.changeView('timeGridWeek');
        setDayHeaders(true);
        break;
      case "month":
        const monthRange = getMonthRange(start);
        start = monthRange.firstday;
        end = monthRange.lastday;
        setSelectedView("dayGridMonth");
        calendarApi.changeView('dayGridMonth');
        setDayHeaders(true);
        break;
    }
    filteredjobs.map(job => {
      if (checkedJobs.includes(job)) {
        const index = checkedJobs.indexOf(job);
        if (index > -1) {
          checkedJobs.splice(index, 1);
        }
      }
    })
    if (checkedJobs.length > 0) {
      dispatch(fetchEventsWithJobs({
        startDate: start,
        endDate: end,
        fetchedJobs: checkedJobs
      }))
    }
    else {
      loadEvents(start, end);
    }
  }

  const onToday = () => {

    let todayDate = moment(new Date()).local()._d;
    let calendarApi = calendarRef.current.getApi();
    calendarApi.today();

    if (prevNode != null) {
      if (prevNode.dayEl.classList.contains("highlight-date")) {
        prevNode.dayEl.classList.remove("highlight-date")
      }
      setPrevNode(null);
    }

    let ref = formatDate(new Date(todayDate));
    let start = new Date(ref);
    start = formatDate(new Date(start.setDate(start.getDate() - 2)));
    let end = new Date(ref);
    switch (calendarView) {
      case "day":
        end = formatDate(new Date(end.setDate(end.getDate() + 2)));
        break;
      case "week":
        const weekRange = getWeekRange(todayDate);
        start = weekRange.firstday;
        end = weekRange.lastday;
        break;
      case "month":
        const monthRange = getMonthRange(todayDate);
        start = monthRange.firstday;
        end = monthRange.lastday;
        break;
    }
    filteredjobs.map(job => {
      if (checkedJobs.includes(job)) {
        const index = checkedJobs.indexOf(job);
        if (index > -1) {
          checkedJobs.splice(index, 1);
        }
      }
    })
    if (checkedJobs.length > 0) {
      dispatch(fetchEventsWithJobs({
        startDate: start,
        endDate: end,
        fetchedJobs: checkedJobs
      }))
    }
    else {
      loadEvents(start, end);
    }
    if (!selectedDate || selectedDate.toDateString() != todayDate.toDateString()) {
      setSelectedEvent(null);
    }
    setSelectedDate(new Date(todayDate));

  }

  const onPrevMonth = () => {
    let calendarApi = calendarRef.current.getApi();
    let date = calendarApi.getCurrentData().dateProfile.activeRange.start;
    date = new Date(date.setDate(date.getDate() - 1));

    let start = new Date(date);
    start = formatDate(new Date(start.setDate(start.getDate() - 2)));
    let end = new Date(date);

    switch (calendarView) {
      case "day":
        end = formatDate(new Date(end.setDate(end.getDate() + 2)));
        break;
      case "week":
        const weekRange = getWeekRange(date);
        start = weekRange.firstday;
        end = weekRange.lastday;
        break;
      case "month":
        const monthRange = getMonthRange(date);
        start = monthRange.firstday;
        end = monthRange.lastday;
        break;
    }
    setSelectedDate(date);
    filteredjobs.map(job => {
      if (checkedJobs.includes(job)) {
        const index = checkedJobs.indexOf(job);
        if (index > -1) {
          checkedJobs.splice(index, 1);
        }
      }
    })
    if (checkedJobs.length > 0) {
      dispatch(fetchEventsWithJobs({
        startDate: start,
        endDate: end,
        fetchedJobs: checkedJobs
      }))
    }
    else {
      loadEvents(start, end);
    }
  }

  const onNextMonth = () => {
    let calendarApi = calendarRef.current.getApi();
    let date = calendarApi.getCurrentData().dateProfile.activeRange.end;

    let start = new Date(date);
    start = formatDate(new Date(start.setDate(start.getDate() - 2)));
    let end = new Date(date);

    switch (calendarView) {
      case "day":
        end = formatDate(new Date(end.setDate(end.getDate() + 2)));
        break;
      case "week":
        const weekRange = getWeekRange(date);
        start = weekRange.firstday;
        end = weekRange.lastday;
        break;
      case "month":
        const monthRange = getMonthRange(date);
        start = monthRange.firstday;
        end = monthRange.lastday;
        break;
    }
    setSelectedDate(date);
    filteredjobs.map(job => {
      if (checkedJobs.includes(job)) {
        const index = checkedJobs.indexOf(job);
        if (index > -1) {
          checkedJobs.splice(index, 1);
        }
      }
    })
    if (checkedJobs.length > 0) {
      dispatch(fetchEventsWithJobs({
        startDate: start,
        endDate: end,
        fetchedJobs: checkedJobs
      }))
    }
    else {
      loadEvents(start, end);
    }
  }

  const onOpenSettings = () => {
    setViewState("calendarSettings");
  }

  const onEditEvent = () => {
    setViewState("editEvent");
  }

  const onBack = () => {
    setViewState("calendarView");
    setView();
  }

  const onEventChange = (e) => {
    setViewState("calendarView");
    setView();
    setSelectedEvent(null);
  }

  const setView = () => {
    switch (calendarView) {
      case "day":
        setSelectedView("timeGridDay");
        setDayHeaders(false);
        break;
      case "week":
        setSelectedView("timeGridWeek");
        setDayHeaders(true);
        break;
      case "month":
        setSelectedView("dayGridMonth");
        setDayHeaders(true);
        break;
    }
  }

  const getEventCount = () => {
    let endPrefix = "today";
    if (calendarView == "week") {
      endPrefix = "week";
      calendar.events.map(event => {
        const weekRange = getWeekRange(selectedDate ? selectedDate : new Date());
        let start = moment.tz(new Date(weekRange.firstday), event.ownerTimeZone).format('YYYY-MM-DD');
        let end = moment.tz(new Date(weekRange.lastday), event.ownerTimeZone).format('YYYY-MM-DD');

        let eventDate = moment.tz(event.startMeeting, event.ownerTimeZone).format('YYYY-MM-DD');
        if (eventDate <= end && eventDate >= start) {
          todayEvent.push(event);
        }
      });
    }
    else if (calendarView == "month") {
      endPrefix = "month";
      calendar.events.map(event => {
        const monthRange = getMonthRange(selectedDate ? selectedDate : new Date());
        let start = moment.tz(new Date(monthRange.firstday), event.ownerTimeZone).format('YYYY-MM-DD');
        let end = moment.tz(new Date(monthRange.lastday), event.ownerTimeZone).format('YYYY-MM-DD');

        let eventDate = moment.tz(event.startMeeting, event.ownerTimeZone).format('YYYY-MM-DD');
        if (eventDate <= end && eventDate >= start) {
          todayEvent.push(event);
        }
      });
    }
    else {
      calendar.events.map(event => {
        let eventDate = moment.tz(event.startMeeting, event.ownerTimeZone).format('YYYY-MM-DD');
        let now = moment.tz(selectedDate ? selectedDate : new Date(), event.ownerTimeZone).format('YYYY-MM-DD');
        if (now == eventDate) {
          todayEvent.push(event);
        }
      });
    }

    let count = todayEvent && todayEvent.length > 0 ? todayEvent.length : "no";
    return "You have " + count + " meeting(s) scheduled for " + endPrefix;
  }

  const getSelectedDate = () => {
    return moment(selectedDate ? selectedDate : new Date()).local().format();
  }

  const loadEventsWithJobs = (jobs) => {
    let date = selectedDate ? selectedDate : new Date();
    let start = new Date(date);
    start = formatDate(new Date(start.setDate(start.getDate() - 2)));
    let end = new Date(date);
    switch (calendarView) {
      case "day":
        end = formatDate(new Date(end.setDate(end.getDate() + 2)));
        break;
      case "week":
        const weekRange = getWeekRange(date);
        start = weekRange.firstday;
        end = weekRange.lastday;
        break;
      case "month":
        const monthRange = getMonthRange(date);
        start = monthRange.firstday;
        end = monthRange.lastday;
        break;
    }
    if (jobs.length > 0) {
      dispatch(fetchEventsWithJobs({
        startDate: start,
        endDate: end,
        fetchedJobs: jobs
      }))
    }
    else {
      loadEvents(start, end);
    }
  }

  const onClickTriSelector = () => {
    filteredjobs = [];
    setShowTriSelector(false);
    setFilteredjobs(JSON.parse(JSON.stringify(filteredjobs)));
    filteredjobs.map(job => {
      if (checkedJobs.includes(job)) {
        const index = checkedJobs.indexOf(job);
        if (index > -1) {
          checkedJobs.splice(index, 1);
        }
      }
    })
    loadEventsWithJobs(checkedJobs)
  }

  const onSelectAll = (e) => {
    if (e.target.checked) {
      filteredjobs = [];
      setShowTriSelector(false);
      setFilteredjobs(JSON.parse(JSON.stringify(filteredjobs)));
    }
    else {
      let temp = JSON.parse(JSON.stringify(checkedJobs));
      filteredjobs = temp.filter((data, index) => {
        if (index > 0) {
          return data;
        }
      });
      setShowTriSelector(true);
      setFilteredjobs(JSON.parse(JSON.stringify(filteredjobs)));
    }
    filteredjobs.map(job => {
      if (checkedJobs.includes(job)) {
        const index = checkedJobs.indexOf(job);
        if (index > -1) {
          checkedJobs.splice(index, 1);
        }
      }
    })
    loadEventsWithJobs(checkedJobs)
  }

  const onCheckBoxSelect = (e) => {
    if (e.target.checked && filteredjobs.indexOf(Number(e.target.name)) > -1) {
      checkedJobs.push(Number(e.target.name));
      const index = filteredjobs.indexOf(Number(e.target.name));
      if (index > -1) {
        filteredjobs.splice(index, 1);
        setFilteredjobs(JSON.parse(JSON.stringify(filteredjobs)))
      }
      setShowTriSelector(false);
    }
    else {
      const index = checkedJobs.indexOf(Number(e.target.name));
      if (index > -1 && filteredjobs.length + 1 < checkedJobs.length) {
        checkedJobs.splice(index, 1);
        filteredjobs.push(Number(e.target.name));
        setFilteredjobs(JSON.parse(JSON.stringify(filteredjobs)))
      }
      else {
        setShowTriSelector(true);
      }
    }
    filteredjobs.map(job => {
      if (checkedJobs.includes(job)) {
        const index = checkedJobs.indexOf(job);
        if (index > -1) {
          checkedJobs.splice(index, 1);
        }
      }
    })
    loadEventsWithJobs(checkedJobs)
  }

  const Jobs = (props) => {
    return (
      <>
        <div style={{ marginTop: '10px', display: 'flex' }}>
          <div>
            <img style={{
              display: filteredjobs.length == 0 ? 'none' : 'flex',
              width: '25px', height: '25px',
              marginTop: '10px', marginRight: '10px',
              border: '1px solid #a7abb0',
              borderRadius: '2px',
              backgroundColor: '#a7abb0'
            }}
              src={triSelector} alt='triSelector' onClick={onClickTriSelector} />
            <Input className='checkBox'
              style={{ display: filteredjobs.length == 0 ? 'flex' : 'none', marginTop: '10px' }}
              type='checkbox'
              name="selectAll"
              checked={filteredjobs.length == 0}
              onChange={onSelectAll}
            />
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', marginLeft: '-5px', fontWeight: 'bold' }}>All Jobs ({props.fetchedJobs.length})</div>
        </div>
        <div style={{ marginTop: '10px' }}>
          {
            props.fetchedJobs.map((job, index) => {
              return <div key={job + index} style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '5px' }}>
                <div>
                  <Input className='checkBox'
                    type='checkbox'
                    name={job.id}
                    id={job.id}
                    onChange={onCheckBoxSelect}
                    checked={checkedJobs.includes(job.id) && !filteredjobs.includes(job.id)}
                  />
                </div>
                <div style={{ fontSize: '12px', margin: 'auto -5px' }}>{job.jobTitle}</div>
              </div>
            })
          }
        </div>
      </>
    )
  }
  const renderEventContent = (eventInfo) => {
    let start = moment.tz(eventInfo.event.start, eventInfo.event.ownerTimeZone).format('HH:mm');
    let end = moment.tz(eventInfo.event.end, eventInfo.event.ownerTimeZone).format('HH:mm');
    let endTime = moment.tz(eventInfo.event.end, eventInfo.event.ownerTimeZone).format('HH:mm A');

    let timeDifference = Math.abs(Number(end.split(":")[1]) - Number(start.split(":")[1]));
    let title = "Video Meeting for " + eventInfo.event.extendedProps.jobTitle;
    return (
      <>
        {(function () {
          switch (calendarView) {
            default:
            case 'day':
              return <div className="day"
                style={{
                  height: timeDifference == 30 ? '30px' : '23px',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  border: '1px solid rgb(41, 122, 247)',
                  color: selectedEvent && Number(eventInfo.event.id) == selectedEvent[0].id ? 'white' : 'black',
                  backgroundColor: selectedEvent && Number(eventInfo.event.id) == selectedEvent[0].id ? '#297AF7' : 'transparent'
                }}>
                <div style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
                  {title}
                  <span className="textDivider">|</span>
                  {start} - {endTime}
                  <span className="textDivider">|</span>
                  {eventInfo.event.extendedProps.name}
                </div>
              </div>;
            case 'week':
              return <div className="week" style={{
                width: '100%', cursor: 'pointer',
                borderRadius: '8px',
                border: '1px solid rgb(41, 122, 247)',
                color: selectedEvent && Number(eventInfo.event.id) == selectedEvent[0].id ? 'white' : 'black',
                backgroundColor: selectedEvent && Number(eventInfo.event.id) == selectedEvent[0].id ? '#297AF7' : 'transparent'
              }}>
                <div>{title}</div>
                <div>{start} - {endTime}</div>
              </div>;
            case 'month':
              return <div className="month" style={{
                width: '100%', cursor: 'pointer',
                borderRadius: '8px', color: 'black',
                border: '1px solid rgb(41, 122, 247)',
                color: selectedEvent && Number(eventInfo.event.id) == selectedEvent[0].id ? 'white' : 'black',
                backgroundColor: selectedEvent && Number(eventInfo.event.id) == selectedEvent[0].id ? '#297AF7' : 'transparent'
              }}>
                <div>{start} - {endTime}  {title}</div>
              </div>;
          }
        })()}
      </>
    )
  }

  return (
    <div style={{ height: '100vh' }}>
      <Header {...user.user} hideDD={(step === 3) && (!isPopupOpened)} tabNumber={2} push={push}  {...notifications}/>
      {(() => {
        switch (viewState) {
          case "calendarView":
          default:
            return <div className="container-fluid calendar">
              <div className="row">
                <div className="col-2 calendarView">
                  <FullCalendar
                    initialView="dayGridMonth"
                    headerToolbar={{
                      left: 'title',
                      center: '',
                      right: 'prev,next'
                    }}
                    height="auto"
                    contentHeight="200"
                    selectable={true}
                    dayHeaderFormat={{ weekday: 'narrow' }}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    dateClick={changeDate}
                    initialDate={selectedDate}
                  />
                  <div className="divider">
                  </div>
                  <Jobs fetchedJobs={fetchedJobs} />
                </div>
                <div className="col-6 eventView">
                  {
                    calendar.isDataAvailable && !calendar.isUpdating ?
                      <div>
                        <button style={{
                          position: 'absolute', left: '185px', zIndex: '2', border: 'none', width: '24px', height: '24px', backgroundColor: 'transparent'
                        }}>
                          <img src={prevIcon} alt='prevIcon' onClick={onPrevMonth} />
                        </button>
                        <button style={{
                          position: 'absolute', left: '210px', zIndex: '2', border: 'none', width: '24px', height: '24px', backgroundColor: 'transparent'
                        }}>
                          <img src={nextIcon} alt='nextIcon' onClick={onNextMonth} />
                        </button>

                        <button className="iconButton" style={{
                          position: 'absolute', right: '170px', zIndex: '2', border: '1px solid #A7ABB0', margin: '0'
                        }}>
                          <img src={settingsIcon} alt='settingsIcon' onClick={onOpenSettings} />
                        </button>
                        <button onClick={onToday} style={{
                          position: 'absolute', right: '97px', zIndex: '2', border: '1px solid #A7ABB0', margin: '0', width: '68px', height: '36px', color: 'black', fontSize: '12px', fontWeight: 'bold'
                        }}>
                          Today
                        </button>
                        <select className="viewButton"
                          value={calendarView}
                          onChange={onViewChange}>
                          <option value="day">
                            Day
                                    </option>
                          <option value="week">
                            Week
                                    </option>
                          <option value="month">
                            Month
                                    </option>
                        </select>
                        <FullCalendar
                          ref={calendarRef}
                          initialDate={getSelectedDate()}
                          dayHeaders={dayHeaders}
                          initialView={selectedView}
                          headerToolbar={{
                            left: 'title',
                            center: '',
                            right: 'custom2, today,custom1'
                          }}
                          customButtons={{
                            custom1: {
                              text: 'Day'
                            },
                            custom2: {
                              text: 'Set'
                            }
                          }}
                          views={{
                            dayGrid: {
                              dayHeaderFormat: {
                                weekday: 'short',
                              }
                            },
                            timeGrid: {
                              dayHeaderFormat: {
                                weekday: 'short',
                                day: 'numeric',
                                omitCommas: true
                              }
                            }
                          }}
                          slotLabelFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            omitZeroMinute: false,
                            meridiem: 'long'
                          }}
                          nowIndicator={true}
                          allDaySlot={false}
                          slotEventOverlap={true}
                          scrollTime={ qs.parse(search)?.startMeeting ? 
                            `${getDoubleDigits(String((new Date(qs.parse(search)?.startMeeting)).getHours()))}:${getDoubleDigits(String((new Date(qs.parse(search)?.startMeeting)).getMinutes()))}:${getDoubleDigits(String((new Date(qs.parse(search)?.startMeeting)).getSeconds()))}`: 
                            "08:00:00"}
                          slotLabelInterval="00:30:00"
                          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                          events={calendar.events}
                          editable={false}
                          selectable={false}
                          selectMirror={false}
                          weekends={true}
                          eventContent={renderEventContent}
                          eventClick={handleEventClick}
                          timeZone={false}
                        />
                      </div>
                      :
                      <div className="loadingCalender">
                        <Loader color='blue' height='100px' width='100px' />
                      </div>
                  }
                </div>
                <div className="col-4 eventDetails">
                  <div className="headingContainer">
                    <h2 className="eventHeading">Event Details</h2>
                  </div>
                  {
                    selectedEvent == null ?
                      <div className="contentContainer" style={{ display: 'flex' }}>
                        <div className="meetingCount">{getEventCount()}</div>
                        <div className="clickEvent">{todayEvent.length > 0 ? "Please click on an event to view details" : ""}</div>
                      </div> :
                      <EventDetails 
                      currentUser={user.user} 
                      selectedEvent={selectedEvent[0]} 
                      onEdit={onEditEvent} 
                      onClose={unselectEvent} 
                      />
                  }

                </div>
              </div>
            </div>;

          case "editEvent":
            return <EditEvent currentUser={user.user} event={selectedEvent[0]} onBack={onBack} onSave={onEventChange} />;
          case "calendarSettings":
            return <CalendarSettings currentUser={user.user} onBack={onBack} />;
        }
      })()}
    </div >
  )
}

export default connect(state => ({
  calendar: state.calendar,
  step: state.jobDescription.step,
  user: state.auth,
  notifications:state.tribe.notifications,
  isPopupOpened: _.get(state, 'user.data.isPopupOpened', false)
}))(CalendarComponent)
