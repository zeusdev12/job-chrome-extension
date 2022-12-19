import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import handleViewport from 'react-in-viewport';
import {
    DropdownMenu,
    DropdownItem
} from 'reactstrap'
import moment from 'moment'
import { manualApiCall } from '../../utils'
import { stopFetchingNotifications } from '../../actions/tribe'
import './style.css'

const DropDown = ({
    dispatch,
    list,
    isDdOpen,
    setDdOpen,
    push
}) => {

    useEffect(() => {
        dispatch(stopFetchingNotifications())
    }, [isDdOpen])
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
                push(`job.html?fS=title_score&fSO=desc&isConnectPage=1&jId=${jobId}&sF=Saved&secS=skill_score&secSO=desc&tN=2`,'_blank')
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
                push(`html/job.html?tN=3&jId=${jobId}`,'_blank')
                break;
            case 'ADDED_PRE_EVAL_FORM':
                push(`html/job.html?tN=3&jId=${jobId}`,'_blank')
                break;
        }
    }

    return (
        <div>
            <DropdownMenu className='notifications-dd' >
                <div className="not-top">
                    {list?.length > 0 ?
                        <><span className="not-title">Notifications</span>
                            <span className="not-viewAll " onClick={() => push(`notifications.html`)}>View All</span></>
                        :
                        <span className="not-title">No Notifications</span>
                    }
                </div>
                {
                    list?.length > 0 && list.slice(0, 3).map((item, i) => (
                        <DropdownItem
                            key={i}
                            className='Ndditem'
                            onClick={() => {
                                setDdOpen(!isDdOpen)
                                // setJobToggle(i + 1)
                            }}
                        >
                            <div className={`${types.includes(item.type) ? 'clickable' : ''} notifications-ddItem`} key={i} onClick={() => redirect(item)} >
                                <Item
                                    key={i}
                                    item={item} />
                            </div>
                        </DropdownItem>
                    ))

                }
            </DropdownMenu>

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
}))(DropDown)