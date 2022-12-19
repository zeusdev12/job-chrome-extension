import React from 'react'
import { Button } from 'reactstrap'
import BackButtonIcon from '../../../../img/chevron-left-tribe.svg'

import {
    unselectAllProspects,  
} from '../../actions/score'
  

import Tabs from './Tabs'
import { JobLabel } from './JobLabel'
import './style.css'

const TopContainer = ({
    title,
    tabNumber,
    setTab,
    id,
    job,
    dispatch,
    push,
    permissions
}) => {

    return (
        <>
            <div className="job-top-container">
                <div style={{ height: '50%' }}>
                    <div className="job-title-add-prospects">
                        <div>
                            <Button
                                className="job-view-back-button"
                                onClick={() => {
                                    dispatch(unselectAllProspects())
                                    push("/html/jobs.html");
                                }}>
                                <img src={BackButtonIcon} alt="back" />
                            </Button>
                            <span className="job-view-title-text">
                                {title}    </span>
                        </div>

                        <div >
                            <Button
                                color="primary"
                                className="job-view-add-prospects"
                                onClick={() => {
                                    push("/html/continue-search.html?jId=" + id);
                                }}>
                                <span className="text">Add Prospects</span>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="job-label-top">
                    <JobLabel
                        job={job}
                        dispatch={dispatch}
                        permissions={permissions}
                    />
                </div>
                <Tabs tabNumber={tabNumber} setTab={setTab} permissions={permissions}/>
            </div>
            <hr className='add-job-bottomBorder' />
        </>
    )
}

export default TopContainer