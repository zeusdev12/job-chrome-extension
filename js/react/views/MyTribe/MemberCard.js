import React from 'react'
import moment from 'moment'

import DisplayPlaceholder from '../../../../img/displayPlaceholder.svg'

import './style.css'

const MemberCard = ({
data,
handleShowMemberActivity
}) => {

   
    return (
        <div className="member-card-container">
            <div className="inner">
                <img
                    className="tribe-member-card-picture"
                    src={DisplayPlaceholder}
                />
                <div>
                    <div className="tribe-member-card-name"> {data.name}</div>
                    <div className="tribe-member-card-email"> {data.email}</div>
                </div>

            </div>
            <p 
            className="view-member-activity"
            onClick={ ()=>handleShowMemberActivity(data.id,data.name)}
            >
            View Activity
            </p>

        </div>
    )
}

export default MemberCard;