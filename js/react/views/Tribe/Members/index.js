import React from 'react'
import MemberCard from './MemberCard'
import './style.css'
const Members = ({
    tribeMembers,
    tribeMembersDetails,
    handleReachoutPermissionChange,
    handleViewActivityPermissionChange,
    handleRemoveMember
}) => {
 
    return (
        <div className="tribe-members-container">
            {
                tribeMembers.map((member, index) => (
                    <MemberCard
                        key={index}
                        data={member}
                        details={tribeMembersDetails[index]}
                        handleReachoutPermissionChange={handleReachoutPermissionChange}
                        handleViewActivityPermissionChange={handleViewActivityPermissionChange}
                        handleRemoveMember={handleRemoveMember}
                    />
                ))
            }
        </div>
    )
}

export default Members;