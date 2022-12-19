import React, { useEffect, useState } from 'react'
import { Button } from 'reactstrap'
import Toggle from 'react-toggle'
import './style.css'
import DisplayPlaceholder from '../../../../../img/displayPlaceholder.svg'
import Trash from './Trash'

const MemberCard = ({
    data,
    details,
    handleReachoutPermissionChange,
    handleViewActivityPermissionChange,
    handleRemoveMember
}) => {
    console.log("=============")
    console.log(data)
    console.log(details)
    return (
        <div className="tribe-member-card">
            <div className="tribe-member-card-details">
                <div className="details-and-trash">
                    <div className="inner">
                        <img
                            className="tribe-member-card-picture"
                            src={DisplayPlaceholder}
                        />
                        <div>
                            <div className="tribe-member-card-name"> {details.name} </div>
                            <div className="tribe-member-card-email"> {details.email} </div>
                        </div>

                    </div>
                    <Trash userId={data.userId} handleRemoveMember={handleRemoveMember} />
                </div>
            </div>

            <p>Prospect Search Permissions</p>
            <div className="toggle-text-container">
                <span>Reachout / Message Prospects</span>
                <Toggle
                    icons={false}
                    defaultChecked={data.permissions?(data.permissions.includes(2)?true:false):true}
                    onChange={() => handleReachoutPermissionChange(data.userId)}
                />
            </div>
            <div className="toggle-text-container">
                <span>View Tribe Activity </span>
                <Toggle
                    icons={false}
                    defaultChecked={data.permissions?(data.permissions.includes(3)?true:false):true}
                    onChange={() => handleViewActivityPermissionChange(data.userId)}
                />
            </div>
        </div>
    )
}

export default MemberCard;