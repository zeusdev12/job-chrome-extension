import React, { useEffect, useState } from 'react'

import { Button } from 'reactstrap'
import Search from './Search'
import MemberCard from './MemberCard'
import Loader from '../../components/Loader'
import './style.css'

const TribeMemberActivityList = ({
    search,
    push,
    tribeMembers,
    searchTextBox,
    setSearchTextBox,
    setSearching,
    isLoading,
    handleEditTribe,
    handleShowMemberActivity,
    permissions
}) => {


    return (
        <div className="tribe-member-activity-list">
            <div className="search-tribe-members-activity-and-edit">
                {tribeMembers && tribeMembers.length > 0 ?
                    <Search
                        teamMembers={tribeMembers}
                        searchTextBox={searchTextBox}
                        setSearchTextBox={setSearchTextBox}
                        setSearching={setSearching}
                    />
                    : <p />
                }
                {
                    permissions === '*' &&
                    <Button
                        color="primary"
                        outline
                        className="edit-button"
                        onClick={handleEditTribe}
                    >
                        Edit
                </Button>
                }
            </div>
            { isLoading ?
                <span className="loader-wrapper"><Loader color='#297AF7' height='50px' width='50px' /></span>
                :
                <>
                    { tribeMembers && tribeMembers.length > 0 ?
                        <div className="members-list">
                            {tribeMembers.map((member, index) => (
                                <MemberCard
                                    key={index}
                                    data={member}
                                    handleShowMemberActivity={handleShowMemberActivity}
                                />
                            ))}
                        </div>
                        :
                        <div >
                            <p className="my-tribe-add-container-no-members">
                                No Members
                            </p>
                            <p className="">
                                Maximize your efficiency by adding team members to your tribe
                        </p>
                        </div>
                    }
                </>
            }
        </div>
    )
}

export default TribeMemberActivityList;