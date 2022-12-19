import React, { useEffect, useState } from 'react'
import qs from 'query-string'
import './style.css'

import AddTribe from './AddTribe'
import TribeMembersActivityList from './TribeMemberActivityList'

const Content = ({
    type,
    tribeMembers,
    searchTextBox,
    setSearchTextBox,
    setSearching,
    isLoading,
    handleAddTribe,
    handleEditTribe,
    handleShowMemberActivity,
    permissions
}) => {


    return (
        <div className="tribe-user-activity-container">

            {type === 1 && <AddTribe handleAddTribe={handleAddTribe} />}
            {type === 2 &&
                <TribeMembersActivityList
                    permissions={permissions}
                    tribeMembers={tribeMembers}
                    searchTextBox={searchTextBox}
                    setSearchTextBox={setSearchTextBox}
                    setSearching={setSearching}
                    isLoading={isLoading}
                    handleEditTribe={handleEditTribe}
                    handleShowMemberActivity={handleShowMemberActivity}
                />}

        </div>
    )
}

export default Content;