import React, { useState, useEffect } from 'react'
import { Collapse } from 'reactstrap'
import { connect } from 'react-redux'
import moment from 'moment'

import './ActivitiesSection.css'
import {fetchProspectActivities} from '../../actions/score'
import Loader from '../../components/Loader'
import chevDown from '../../../../img/vector.svg'
const ActivitiesSection = connect(state => ({

}))(({
    userName,
    activities = [],
    activityCount,
    jobProfileId,
    dispatch,
    loadingActivities,
    setShowNotes
}) => {

    const [viewAll, setViewAll] = useState(false)

    const handleClickViewAll = async () => {
        try {
    
          if (viewAll) {
            setViewAll(false)
            setShowNotes(true)
         
            return
          }
          setViewAll(true)
          setShowNotes(false)
          dispatch(fetchProspectActivities(jobProfileId,activities.length))
        } catch (e) {
        }
      }
    
    return (
        <div>
            <div className='activity-header'>
                <div className='activity-header-content'>
                    <h1>Activity</h1>
                </div>
            </div>
            <div className='activity-content'>
                {
                    <ul className="activities">
                        {activities?.slice(0, 2).map((item, i) => (
                            <li key={i}>
                                <p style={{ marginBottom: '2px' }}>{item.activityText}</p>
                                <div style={{ display: 'flex' }} className="activity-item-secondary-text">
                                    <p style={{ marginRight: '7px' }}>
                                        {item.name === userName ? 'You' : item.name.split(' ', 1)}</p>  {moment(item.activityAt).format('h:mm a, D MMM')}
                                </div>
                            </li>
                        ))
                        }
                    </ul>
                }

                <Collapse isOpen={viewAll}>
                    {loadingActivities ? <span style={{marginLeft:'48%'}}><Loader color='blue' /></span> :
                        <>
                        
                            <ul className="activities">
                                {activities?.map((item, i) => (
                                    i>1&&<li key={i}>
                                        <p style={{ marginBottom: '2px',color:'black' }}>{item.activityText}</p>
                                        <div style={{ display: 'flex' }} className="activity-item-secondary-text">
                                            <p style={{ marginRight: '7px' }}>
                                                {(item.name === userName||item.name==='') ? 'You' : item.name.split(' ', 1)}</p>  {moment(item.activityAt).format('h:mm a, D MMM')}
                                        </div>
                                    </li>))}
                            </ul>
                        </>
                    }
                </Collapse>

                {(activityCount > 2) &&
                    <div style={{ cursor: 'pointer',marginLeft:'30px',marginBottom:'20px' }} onClick={() => handleClickViewAll()}>
                        <span> {viewAll ? 'View Less' : 'View All Activities'} </span>
                        <img
                            src={chevDown}
                            className={viewAll ? 'rotate180' : ''}
                        />
                    </div>
                }
            </div>
        </div>
    )
})

export { ActivitiesSection }