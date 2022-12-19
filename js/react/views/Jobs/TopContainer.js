import React from 'react'
import {Button} from 'reactstrap'
import './style.css'

const TopContainer = ({
 jobToggle,
 push
}) => {

const handleNewJob=()=>{
  push('/html/add-job.html')
}

  return (
    <div className="top-label-container">
        <span className="tribe-title-text">{jobToggle===1 ?'My Jobs' : 'Tribe Jobs'}</span>
        <Button 
        className="new-job-button"
        color="primary"
        onClick={handleNewJob}
      >
            New Job
        </Button>
    </div>
  )
}

export default TopContainer;