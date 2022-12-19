import React, { useState, useEffect } from 'react'
import './JobLabel.css'

import cancelIcon from '../../../../img/close.svg'
import saveIcon from '../../../../img/check-small-inactive.svg'
import editIcon from '../../../../img/edit-small.svg'
import deleteIcon from '../../../../img/trash-small.svg'
import { manualApiCall } from '../../utils'
import Loader from '../../components/Loader'
import { setJobLabel } from '../../actions/tribe'


const NewLabel = ({
  setInputVisibility,
  val,
  setVal,
  isSaving,
  handleClickSave,
  setEditMode,
  setIconsVisibility,
  permissions
}) => {
  console.log('new label props: ', { val, isSaving })
  return (
    <div className='new-label'>
      <input
        placeholder='Sample Label...'
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
      <div>
        {!isSaving ?
          <>
            <img
              src={cancelIcon}
              onClick={() => {
                setInputVisibility(false)
                setEditMode(false)
                setIconsVisibility(false)
              }}
              alt='cancel'
            />
            <img
              src={saveIcon}
              alt='save'
              onClick={handleClickSave}

            />
          </> :
          <Loader color='#297AF7' />
        }
      </div>
    </div>
  )
}

const CreateLabel = (props) => {
  console.log('CREATE LABEL PROPS: ', props)
  return (
    <>
      {
        (props.permissions === '*')
          &&
          (props.editMode || props.inputVisible) ?
          <NewLabel {...props} /> :
          (props.permissions === '*')&&<p onClick={() => props.setInputVisibility(!props.inputVisible)} className='add-label'>Add Label</p>
      }

    </>
  )
}

const JobLabel = ({
  job = null,
  dispatch,
  permissions
}) => {
  const [editMode, setEditMode] = useState(false)
  const [inputVisible, setInputVisibility] = useState(job?.meta?.label ? true : false)
  const [val, setVal] = useState(job?.meta?.label || '')
  const [isSaving, setIsSaving] = useState(false)
  const [iconsVisible, setIconsVisibility] = useState(false)

  useEffect(() => {
    setVal(job?.meta?.label)
  }, [job?.meta?.label])

  const handleClickSave = async () => {
    try {
      if (!val) {
        alert('Label cannot be empty')
      } else {
        setIsSaving(true)
        await updateLabel(job.id, val)

        dispatch(setJobLabel(val))
        setEditMode(false)

        //dispatch an action here to update job label in job data

        setIsSaving(false)
        setIconsVisibility(false)
        setInputVisibility(false)
      }
    } catch (e) {
      alert('An unexpected error occured.')
      setIsSaving(false)
      setIconsVisibility(false)
    }
  }


  const handleClickDelete = async () => {
    try {
      setIsSaving(true)
      await updateLabel(job.id, null)
      setIsSaving(false)
      setIconsVisibility(false)
      dispatch(setJobLabel(null))
    } catch (e) {
      setIsSaving(false)
      setIconsVisibility(false)
      throw e
    }
  }


  const updateLabel = async (jobId, label) => {
    console.log(jobId)
    try {
      await manualApiCall(`/api/auth/job/addLabel`, {
        method: 'POST',
        body: JSON.stringify({
          jobId: jobId,
          label: label
        }),
        headers: { 'Content-Type': 'application/json' }
      })

      return label
    } catch (e) {
      throw e
    }
  }


  console.log('JOB LABEL COMPONENT: ', job)
  return (
    <>
      {job ?
        <>
          {(!editMode && job?.meta?.label) ?
            <div className='job-label'
              onMouseOverCapture={() => setIconsVisibility(true)}
              onMouseOutCapture={() => setIconsVisibility(false)}
            >
              <p>{job.meta.label}</p>

              {
                (permissions === '*')
                && <div style={{ visibility: (iconsVisible || isSaving) ? 'unset' : 'hidden' }}>
                  {isSaving ? <Loader color='blue' /> : <>
                    <img
                      src={editIcon}
                      alt='Edit'
                      onClick={() => setEditMode(true)}
                    />
                    <img
                      src={deleteIcon}
                      alt='Delete'
                      onClick={handleClickDelete}
                    />
                  </>}
                </div>
              }
            </div> :
            <CreateLabel
              job={job}
              dispatch={dispatch}
              initialValue={job?.meta?.label}
              inputVisible={inputVisible}
              setInputVisibility={setInputVisibility}
              val={val}
              setVal={setVal}
              isSaving={isSaving}
              handleClickSave={handleClickSave}
              editMode={editMode}
              setEditMode={setEditMode}
              setIconsVisibility={setIconsVisibility}
              permissions={permissions}
            />
          }
        </> :
        null
      }
    </>
  )
}

export { JobLabel }