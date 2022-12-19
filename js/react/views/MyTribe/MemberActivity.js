import React, { useEffect, useState } from 'react'
import { Button } from 'reactstrap'
import BackButtonIcon from '../../../../img/chevron-left-tribe.svg'
import moment from 'moment'

import { connect } from 'react-redux'
import { fetchTribeMemberActivity } from '../../actions/tribe'
import Loader from '../../components/Loader'
import { Waypoint } from 'react-waypoint'
import './style.css'

const MemberActivity = ({
    jobId,
    userId,
    activityList,
    isLoading,
    isDataAvailable,
    totalDataLeft,
    dispatch,
    handleGoBack,
    userName
}) => {

    const [pageNo, setPageNo] = useState(1)

    const handleWaypointOnEnter = () => {
        setPageNo((parseInt(pageNo, 10) + 1))
    }

    const shouldRenderWaypoint = isDataAvailable ? totalDataLeft > 0 : false

    useEffect(() => {
        dispatch(fetchTribeMemberActivity(jobId, pageNo, userId))
    }, [pageNo])

    return (
        <>
            <div className="member-activity-top-container">
                <div className='inner'>
                    <div >
                        <Button
                            className="member-activity-view-back-button"
                            onClick={() => {
                                handleGoBack()
                            }}>
                            <img src={BackButtonIcon} alt="back"
                             />
                        </Button>
                        < p className="activity-member-tag"> {userName.split(' ', 1)}'s Activity</p>
                    </div>
                </div>

            </div>
            <hr className='add-job-bottomBorder' />
            <div className="member-activity-container">
                <div className="inner">
                    {activityList &&
                        activityList.length > 0 ?
                        <>
                            <ul className="experiences">
                                {activityList.map((item, i) => (

                                    <li className="green">
                                        <div className="member-activity-item" key={i}>
                                            <span className="activity-title">{item.activity}</span>
                                            <span className="activity-details">  {moment(item.createdAt).format("HH:mm A") + ', '
                                                + moment(item.createdAt).format("DD MMM")}</span>
                                        </div>

                                    </li>
                                ))
                                }
                            </ul>
                            {shouldRenderWaypoint &&

                                <Waypoint color="primary"
                                    fireOnRapidScroll={true}
                                    onEnter={handleWaypointOnEnter}
                                />
                            }

                        </>

                        : <p className="no-activity-label">

                            {!isLoading && 'No Logs Found'}
                            {isLoading && pageNo == 1 &&
                                <span >
                                    <Loader width="40px" height="40px" color='#297AF7' />
                                </span>
                            }
                        </p>
                    }
                    {isLoading && pageNo > 1 &&
                        <span className="no-activity-label" >
                            <Loader width="40px" height="40px" color='#297AF7' />
                        </span>
                    }
                </div>
            </div>
        </>
    )
}

export default connect(state => ({
    ...state.tribe.tribeMemberActivities
}))(MemberActivity)

