import React from 'react'
import './style.css'

import Notifications from './Notifications'
import List from './List'

const Content = ({
    data,
    isLoading,
    jobToggle,
    setJobToggle,
    searchTextBox,
    getJob,
    handleViewJobCriteria,
    handleRemoveJob,
    handleViewJobProspects,
    handleAddProspects,
    searchTextBoxChange
}) => {

    return (
        <div className="jobs-content-container">
            <List
                data={data}
                jobToggle={jobToggle}
                setJobToggle={setJobToggle}
                isLoading={isLoading}
                searchTextBox={searchTextBox}
                getJob={getJob}
                handleViewJobCriteria={handleViewJobCriteria}
                handleRemoveJob={handleRemoveJob}
                handleViewJobProspects={handleViewJobProspects}
                handleAddProspects={handleAddProspects}
                searchTextBoxChange={searchTextBoxChange}
             
            />
           
        </div>
    )
}

export default Content;