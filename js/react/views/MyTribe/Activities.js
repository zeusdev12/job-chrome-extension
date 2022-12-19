import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { fetchTribeActivity } from '../../actions/tribe'
import Loader from '../../components/Loader'
import { Waypoint } from 'react-waypoint'

import './style.css'

const Activities = ({
    jobId,
    activityList,
    isLoading,
    isDataAvailable,
    totalDataLeft,
    dispatch,
    totalCount
}) => {

    const [pageNo, setPageNo] = useState(1)
    
    const handleWaypointOnEnter = () => {
        setPageNo((parseInt(pageNo, 10) + 1))
    }

    const shouldRenderWaypoint = isDataAvailable ? totalDataLeft > 0 : false

    useEffect(() => {
        dispatch(fetchTribeActivity(jobId, pageNo))
    }, [pageNo])

    return (
        <div className="activity-list">
            <div className="label">
                <p className="tribe-heading-text" style={{ marginLeft: '16px' }}>Activities ({totalCount}) </p>
            </div>
            <div className="list">
                {activityList.length > 0 && activityList.map((item, i) => (

                    <div className="item" key={i}>
                        <div>
                            <p className="activity-title">{item.activity}</p>
                            <p className="activity-details">
                                {item.name.split(' ', 1)} {moment(item.createdAt).format("HH:mm A") + ', '
                                    + moment(item.createdAt).format("DD MMM")}</p>
                        </div>
                    </div>
                ))}
                {shouldRenderWaypoint &&

                    <Waypoint color="primary"
                        fireOnRapidScroll={true}
                        onEnter={handleWaypointOnEnter}
                    />
                }
                {isLoading &&
                    <span style={{ marginTop: '50px', marginLeft: '48%' }}>
                        <Loader color='#297AF7' height='25px' width='25px' />
                    </span>
                }
            </div>
        </div>
    )
}

export default connect(state => ({
    ...state.tribe.activities
}))(Activities)