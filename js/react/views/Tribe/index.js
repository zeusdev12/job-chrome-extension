import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import { setStep, fetchJobs } from '../../actions/jobDescription'
import usePrevious from '../../customHooks/usePrevious'
import qs from 'query-string'
import {
  fetchTeamMembersList,
  addUserToTribe,
  toggleActivityPermission,
  toggleReachoutPermission,
  removeTribeMember,
  skipAssignTribe,
  addTribeToJob,
  fetchTribeMembersList,
  editTribe
} from '../../actions/tribe'

import './style.css'

import Search from './Search'
import Members from './Members'
import Loader from '../../components/Loader'

const Tribe = ({
  teamMembers,
  tribeMembers,
  tribeMembersDetails,
  handleCancel = null,
  handleDiscardChanges = null,
  handleAfterAdding = null,
  dispatch,
  jobId = null,
  tribeId = null,
  isAdding,
  isFetchingJobs,
  isAddingTribe = false,
  isCreatingJob = false,
  isEditingTribe = false,
  isLoadingTeam,
  isEditing,
  originalTribe,
  isLoading,
  search
}) => {

  const [searchTextBox, setSearchTextBox] = useState('')
  const isAddingPrev = usePrevious(isAdding)
  const isFetchingJobsPrev = usePrevious(isFetchingJobs)
  const isLoadingTeamPrev = usePrevious(isLoadingTeam)
  const isEditingPrev = usePrevious(isEditing)

  const handleClickSkipStep = () => {
    dispatch(skipAssignTribe())
    dispatch(setStep(2))
  }
  const handleAssignTribe = () => {
    dispatch(setStep(2))
  }
  const handleAddTribe = () => {
    dispatch(addTribeToJob(tribeMembers, jobId))
  }
  const handleCancelAddingTribe = () => {
    handleCancel()
  }
  const handleCancelEditingTribe = () => {
    handleDiscardChanges()
  }
  const handleReachoutPermissionChange = id => {
    dispatch(toggleReachoutPermission(id))
  }

  const handleViewActivityPermissionChange = id => {
    dispatch(toggleActivityPermission(id))
  }

  useEffect(() => {
    dispatch(fetchTeamMembersList())

  }, [])

  useEffect(() => {

    if (isLoadingTeamPrev && !isLoadingTeam && tribeId!=null&&isEditingTribe) {
      dispatch(fetchTribeMembersList(tribeId))
    }
  }, [isLoadingTeam])

  useEffect(() => {

    if (isEditingPrev && !isEditing) {
      handleDiscardChanges()
    }
  }, [isEditing])

  const addMemberToTribe = id => {
    dispatch(addUserToTribe(id))
  }

  const handleRemoveMember = id => {
    dispatch(removeTribeMember(id))
  }

  const handleEditTribe = () => {
    const tribeData=tribeMembers.filter(item=>item.permissions!=null)
    dispatch(editTribe(tribeData, tribeId,jobId))
  }

  useEffect(() => {


    if (isAddingPrev && !isAdding) {
      dispatch(fetchJobs())
    }
  }, [isAdding])

  useEffect(() => {

    if (isFetchingJobsPrev && !isFetchingJobs) {
      handleAfterAdding()
    }
  }, [isFetchingJobs])

  return (
    <div className="tribe-container">
      {isCreatingJob &&
        <>
          <div className="tribe-title">
            <span className="tribe-heading-text">
              Add Tribe Members
          </span>
            <div className="add-tribe-title-buttons">
              <Link className="tribe-link" onClick={handleClickSkipStep} > Skip this step</Link>
              <Button
                color="primary"
                disabled={!tribeMembers.length > 0}
                className="assign-tribe-button"
                onClick={handleAssignTribe}
              >
                Assign {tribeMembers.length > 0 ? tribeMembers.length : ''}
              </Button>
            </div>
          </div>
        </>
      }
      {isAddingTribe &&
        <>
          <div className="tribe-title">
            <span className="tribe-heading-text">
              Add Tribe Members
          </span>
            <div className="add-later-tribe-title-buttons-add">
              <Button
                color="primary"
                outline
                className="assign-tribe-button"
                style={{marginRight:'20px'}}
                onClick={handleCancelAddingTribe}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                disabled={!tribeMembers.length > 0}
                className="assign-tribe-button"
                onClick={handleAddTribe}
              >
                {isAdding || isFetchingJobs ? <Loader /> : `Assign ${tribeMembers.length > 0 ? tribeMembers.length : ''}`}

              </Button>
            </div>
          </div>
        </>
      }

      {isEditingTribe &&
        <>
          <div className="tribe-title">
            <span className="tribe-heading-text">
              Edit Tribe
          </span>
            <div className="edit-tribe-title-buttons-add">
              <Button
                color="danger"
                outline
                className="assign-tribe-button"
                onClick={handleCancelEditingTribe}
                style={{marginRight:'20px'}}
              >
                Discard
              </Button>
              <Button
                color="primary"
                className="edit-tribe-button"
                onClick={handleEditTribe}
                disabled={isLoading||originalTribe===tribeMembers}
              >
                {isEditing || isFetchingJobs ? <Loader /> : `Save Changes`}

              </Button>
            </div>
          </div>
        </>
      }
      <hr className='add-job-bottomBorder' />

      <div className="tribe-member-search">
        <span className="tribe-normal-text"> Add tribe members to this job by searching for them</span>
        <Search
          teamMembers={teamMembers}
          addMemberToTribe={addMemberToTribe}
          searchTextBox={searchTextBox}
          setSearchTextBox={setSearchTextBox}
        />
      </div>
      { isLoadingTeam ||isLoading ?

        <span className="loader-wrapper" style={{marginTop:'50px'}}><Loader color='#297AF7' height='50px' width='50px' /></span>
        : <Members
          tribeMembers={tribeMembers}
          tribeMembersDetails={tribeMembersDetails}
          handleReachoutPermissionChange={handleReachoutPermissionChange}
          handleViewActivityPermissionChange={handleViewActivityPermissionChange}
          handleRemoveMember={handleRemoveMember}
        />
      }
    </div>
  )
}

export default connect(state => ({
  teamMembers: state.tribe.selected.teamMembers,
  originalTribe:state.tribe.selected.originalTribe,
  tribeMembers: state.tribe.selected.tribeMembers,
  tribeMembersDetails: state.tribe.selected.tribeMembersDetails,
  isAdding: state.tribe.selected.isAdding,
  isFetchingJobs: state.jobDescription.revise.isFetchingJobs,
  isLoadingTeam: state.tribe.selected.isLoadingTeam,
  isEditing: state.tribe.selected.isEditing,
  isLoading:state.tribe.selected.isLoading
}))(Tribe)