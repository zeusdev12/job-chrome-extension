import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import moment from 'moment'
import Header from '../../components/Header'
import { fetchNotifications, setNotificationRead } from '../../actions/tribe'
import Loader from '../../components/Loader'
import { Waypoint } from 'react-waypoint'
import { manualApiCall } from '../../utils'
import handleViewport from 'react-in-viewport';
import './style.css'

const Notifications = ({
    auth,
    newNotifications,
    list,
    isDataAvailable,
    totalDataLeft,
    dispatch,
    isLoading,
    history: { push }
}) => {

    const [pageNo, setPageNo] = useState(1)

    const handleWaypointOnEnter = () => {
        setPageNo((parseInt(pageNo, 10) + 1))
    }

    const shouldRenderWaypoint = isDataAvailable ? totalDataLeft > 0 : false

    useEffect(() => {
        dispatch(fetchNotifications(pageNo))
    }, [pageNo])

    const types = [
        'FIND_AND_RANK',
        'DOWNLOADED_PROSPECTS',
        'ARCHIVED_PROSPECTS',
        'SENT_MESSAGE',
        'FIRST_FOLLOW_UP_MESSAGE_ENABLED',
        'SECOND_FOLLOW_UP_MESSAGE_ENABLED',
        'SENT_MEETING_REQUEST',
        'EDITED_A_JOB'
    ]

    const redirect = ({ type, jobId }) => {
        switch (type) {
            case 'FIND_AND_RANK':
                push(`job.html?fS=title_score&fSO=desc&isConnectPage=1&jId=${jobId}&secS=skill_score&secSO=desc&tN=2`,'_blank')
                break;
            case 'SAVED_PROSPECTS':
                break;
            case 'UNSAVED_PROSPECTS':
                break;
            case 'DOWNLOADED_PROSPECTS':
                push(`job.html?fS=title_score&fSO=desc&isConnectPage=1&jId=${jobId}&secS=skill_score&secSO=desc&tF=Downloaded&tN=2`,'_blank')
                break;
            case 'ARCHIVED_PROSPECTS':
                push(`job.html?fS=title_score&fSO=desc&isConnectPage=1&jId=${jobId}&secS=skill_score&secSO=desc&tF=Archived&tN=2`,'_blank')
                break;
            case 'ADDED_A_MEMBER':
                break;
            case 'SENT_MESSAGE':
                push(`job.html?fS=title_score&fSO=desc&isConnectPage=1&jId=${jobId}&secS=skill_score&secSO=desc&tF=ConnectMessaged&tN=2`,'_blank')
                break;
            case 'FIRST_FOLLOW_UP_MESSAGE_ENABLED':
                push(`job.html?fS=title_score&fSO=desc&isConnectPage=1&jId=${jobId}&secS=skill_score&secSO=desc&tF=ConnectMessaged&tN=2`,'_blank')
                break;
            case 'SECOND_FOLLOW_UP_MESSAGE_ENABLED':
                push(`job.html?fS=title_score&fSO=desc&isConnectPage=1&jId=${jobId}&secS=skill_score&secSO=desc&tF=ConnectMessaged&tN=2`,'_blank')
                break;
            case 'DELETED_A_JOB':
                break;
            case 'DELETE_NOTE':
                break;
            case 'ADD_NOTE':
                break;
            case 'REMOVED_A_MEMBER':
                break;
            case 'SENT_MEETING_REQUEST':
                push(`job.html?fS=title_score&fSO=desc&isConnectPage=1&jId=${jobId}&secS=skill_score&secSO=desc&tF=ConnectMessaged&tN=2`,'_blank')
                break;
            case 'ADDED_MEMBERS':
                break;
            case 'EDITED_A_JOB':
                push(`job.html?tN=1&jId=${jobId}`,'_blank')
                break;
            case 'EDITED_PRE_EVAL_FORM':
                push(`job.html?tN=3&jId=${jobId}`,'_blank')
                break;
            case 'ADDED_PRE_EVAL_FORM':
                push(`job.html?tN=3&jId=${jobId}`,'_blank')
                break;
        }
    }

    return (
        <div className="notifications-container">
            <Header {...auth.user} tabNumber={3} push={push}  {...newNotifications} />
            <div className="top-label-container">
                <span className="tribe-title-text">My Notifications </span>
            </div>
            <div className="notifications-tab-content">
                <div>
                    {list?.length > 0 && list.map((item, i) => (
                        <div className={`${types.includes(item.type) ? 'clickable' : ''} notification-item`} key={i} onClick={() => redirect(item)} >
                            <Item
                                key={i}
                                item={item} />
                        </div>
                    ))}
                    {shouldRenderWaypoint &&
                        <Waypoint color="primary"
                            fireOnRapidScroll={true}
                            onEnter={handleWaypointOnEnter}
                        />
                    }
                    {isLoading && <div style={{ marginTop: '10%', marginLeft: '48%', marginBottom: '10%' }}>
                        <span >
                            <Loader color='#297AF7' height='25px' width='25px' />
                        </span>

                    </div>
                    }
                </div>
            </div>
        </div>
    )
}
const ListItem = (props) => {
    const { inViewport, forwardedRef, item, enterCount } = props;
    const [count, setCount] = useState(0)
    if (inViewport && enterCount === 1 && count < 1 && !item.is_read) {
        manualApiCall('/api/auth/tribes/notifications/set/read',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: item.id
                })
            })
        setCount(count + 1)
    }
    return (
        <>
            <div>
                <span className={item.is_read ? "notification-label" : "notification-label title-bold"} ref={forwardedRef}>
                    {item.name.split(' ', 1)} {item.text}
                </span>
                <span className="notification-time">
                    {moment(item.createdAt).fromNow(true)}
                </span>
            </div>
            <div>
                <p className="notification-job">{item.jobTitle}</p>
            </div>
        </>

    );
};

const Item = handleViewport(ListItem);

export default connect(state => ({
    auth: state.auth,
    ...state.tribe.notifications
}))(Notifications)