import React, { useEffect, useState } from 'react'
import { Progress, Button } from 'reactstrap'
import { connect } from 'react-redux'
import useInterval from 'use-interval'

import { fetchEditProgress } from '../../actions/editJob'

import './editProgress.css'

const EditProgress = ({
  isUpdatingProfile,
  total,
  toUpdate,
  updated,
  progress,
  dispatch,
  jobId
}) => {

  const [intervalActive, setIntervalActive] = useState(true)

  useInterval(() => {
    fetchProgress()
  }, intervalActive ? 2000 : null)

  const fetchProgress = () => {
    dispatch(fetchEditProgress(jobId))
  }

  useEffect(() => {
    if (!isUpdatingProfile) {
      setIntervalActive(false)
    }
  }, [
    isUpdatingProfile
  ])

  const handleClickViewResults = () => {
    window.open(
       `${window.location.origin}/html/job.html?tN=2&fS=title_score&fSO=desc&secS=skill_score&secSO=desc&jId=${jobId}`,
      '_self'
    )
  }


  return (
    <div className='edit-progress-root'>
      <Progress value={progress} />
      <div className='break' />
      <Button
        color="primary"
        disabled={isUpdatingProfile}
        onClick={handleClickViewResults}
      >
        View Results ({updated})
        </Button>
    </div>
  )
}

export default connect(state => ({
  ...state.editProgress
}))(EditProgress)