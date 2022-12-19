import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { fetchNotifications } from '../../actions/tribe'
import Loader from '../../components/Loader'
import { Waypoint } from 'react-waypoint'
import { manualApiCall } from '../../utils'
const Notifications = ({
    list,
    isDataAvailable,
    totalDataLeft,
    dispatch,
    isLoading
}) => {

    //   const jobId = qs.parse(rest.location.search).jId

    useEffect(() => {
        // dispatch(fetchJob(jobId))
    }, [])
    const [pageNo, setPageNo] = useState(1)

    const handleWaypointOnEnter = () => {
        setPageNo((parseInt(pageNo, 10) + 1))
    }

    const shouldRenderWaypoint = isDataAvailable ? totalDataLeft > 0 : false

    useEffect(() => {
        dispatch(fetchNotifications(pageNo))
    }, [pageNo])

    const setRead=()=>{
        manualApiCall('/api/auth/user/activity/store',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id
          })
        })
    }
        const isVisible=(ele)=> {
        const { top, bottom } = ele.getBoundingClientRect();
        const vHeight = (window.innerHeight || document.documentElement.clientHeight);
      
        return (
          (top > 0 || bottom > 0) &&
          top < vHeight
        );
      }
    return (
        <div className="jobs-home-notifications">
            <div className="label">
                <p className="tribe-heading-text" style={{ marginLeft: '16px' }}>Notifications</p>
            </div>
            <div className="list">
                {list.length > 0 && list.map((item, i) => (
                    <div className="notification-read item" key={i}>
                        <div>
                            {isVisible && console.log(i)}
                            <p className={ `${item.isRead?'notification-title':'newNotification-title'}`}>{item.name.split(' ', 1)} {item.text}</p>
                            <p className={ `${item.isRead?'notification-text':'newNotification-text'}`}>{item.jobTitle}</p>
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
    ...state.tribe.notifications
}))(Notifications)