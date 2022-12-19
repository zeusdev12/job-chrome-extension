import React from 'react'
import moment from 'moment'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'

import './style.css'
import AlertCircle from '../../../../img/alert-circle.svg'

import Trash from './Trash'
const JobCard = ({
  job,
  handleViewJobCriteria,
  handleRemoveJob,
  handleViewJobProspects,
  handleAddProspects,
  jobToggle
}) => {

  console.log('JOB IS: ', job)  //TODO-TEMP

  // const locations = job.jobArray.filter(item => item.tag === 'JOB_LOCATION')[0]
  // const locationName = locations.data.map(item => typeof (item) === 'string' ? item : item.name).join(', ')


  const createdAt = moment(job.created_at).format('MMM D');
  return (
    <div className="job-card-container">
      <div className="job-card-name-and-trash">
        <p className="job-title-text"
          onClick={() => handleViewJobCriteria(job.id)}
        > {job.name}
        </p>
        {jobToggle === 1 && <Trash jobId={job.id} handleRemoveJob={handleRemoveJob} />}
      </div>

      <p className="job-location-text" > {/*locationName ||*/ 'Location N/A'}</p>
      <p className="job-creation-time-text"> Created on {createdAt}</p>

      <div className="job-card-aspects-container">
        {!job.profileScored || job.profileScored === '0'
          ?
          < div className="job-details-group">
            <img
              className="job-alert-circle"
              src={AlertCircle}
            />
            <span>No Prospects</span>
          </div>
          :
          <>
            < div className="job-details-group">
              <span>{job.profileScored} Prospects</span>
            </div>

            <span className="job-details-group-line">|</span>
            < div className="job-details-group">
              {
                !job.totalSent || job.totalSent === '0'
                  ?
                  <>
                    <img
                      className="job-alert-circle"
                      src={AlertCircle}
                    />
                    <span>None Messaged</span>
                  </>
                  :
                  <span>{job.totalSent} Messaged</span>
              }
            </div>
          </>
        }
      </div>

      <p className="job-view-details-text"
        onClick={() => handleViewJobProspects(job.id)}>
        View Prospects
                {/* <Link
                    className="job-card-link"
                    to={{
                        pathname: '/html/job.html',
                        search: '?cTF=2&fS=title_score&fSO=desc&secS=skill_score&secSO=desc&isConnectPage=1&jId=' + job.jobID
                    }}>View Details</Link> */}
      </p>
      <div className="job-card-actions">
        {
          !job.profileScored || job.profileScored === '0' ?
            <Button
              color="primary"
              outline
              className="job-card-action-add-more-prospects"
              onClick={() => handleAddProspects(job.id)}
            >
              Add Prospects
                        </Button>
            :
            <div className="job-card-action-multiple-options">
              <Button
                color="primary"
                outline
                className="job-card-action-add-more-prospects"
                onClick={() => handleAddProspects(job.id)}
              >
                Add More Prospects
                            </Button>
              {/* <Button
                                color="primary"
                                outline
                            >
                                Create Campaign
                            </Button> */}
            </div>
        }
      </div>
    </div>
  )
}

export default JobCard;