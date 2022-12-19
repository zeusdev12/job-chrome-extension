import React, { useEffect, useState, memo } from 'react'
import { onlyUpdateForKeys } from 'recompose'
import qs from 'query-string'
import { Button } from 'reactstrap'
import { connect } from 'react-redux'

import ScoreAndConnect from '../ScoreandConnect'
import ReviseJd from '../../components/ReviseJd'
import Tribe from '../Tribe'
import MyTribe from '../MyTribe'
import PreEvaluationForm from '../ScoreandConnect/views/RequestMeeting/PreEvaluationForm'

import { fetchJob } from '../../actions/editJob'
import { savePreEvalForm, loadPreEvalForm } from '../../actions/preEvaluationForm'
import { manualApiCall } from '../../utils'

const Content = memo(({
  search,
  push,
  tabNumber,
  dispatch,
  viewState,
  setView,
  permissions,
  newForm,
  formDescription,
  isLoading,
  isDataAvailable,
  questions
}) => {
  let [addPreEValForm, setAddPreEvalForm] = useState(null);
  let [preEvalQuestions, setPreEvalQuestions] = useState(null);
  const [editMode, setEditMode] = useState(false)
  const [addMode, setAddMode] = useState(false)


  const onSetPreEvalForm = (option) => {
    if (!option) {
      onSkipToComposeMessage();
    }
    else {
      setAddPreEvalForm(option)
    }
  }

  const onSetPreEvalFormData = (data) => {
    setPreEvalQuestions(data)
  }

  const onSkipToComposeMessage = () => {
    setAddPreEvalForm(false)
  }

  const onNext = () => {

    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "actionName": 'EDITED_PRE_EVAL_FORM',
          "jobId": qs.parse(search).jId
        })
      })

    dispatch(savePreEvalForm(qs.parse(search).jId))
    dispatch(loadPreEvalForm(jobId))
    setEditMode(false)
  }
  const onAdd = () => {

    (formDescription != '' || questions.length !== 0) &&
      manualApiCall('/api/auth/user/activity/store',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "actionName": 'ADDED_PRE_EVAL_FORM',
            "jobId": qs.parse(search).jId
          })
        })
    dispatch(savePreEvalForm(qs.parse(search).jId))
    dispatch(loadPreEvalForm(jobId))
    setEditMode(false)
  }
  const jobId = qs.parse(search).jId

  useEffect(() => {

    dispatch(fetchJob(jobId))
    if (tabNumber === '3')
      dispatch(loadPreEvalForm(jobId))
  }, [])

  return (
    <>
      {tabNumber === '1' && <ReviseJd jobId={jobId} viewMode={true} push={push} permissions={permissions} />}

      {tabNumber === '2' && <ScoreAndConnect search={search} push={push} setView={setView} viewState={viewState} />}

      {tabNumber === '3' &&
        <>
          <div className="tribe-title">
            <span className="tribe-heading-text">
              Pre Evaluation Form
                        </span>
            {editMode ?
              <div >
                <Button
                  color="primary"
                  outline
                  style={{ borderRadius: '8px', marginRight: '10px' }}
                  onClick={() => {
                    setEditMode(false)
                    dispatch(loadPreEvalForm(jobId))
                  }}
                >
                  Discard Changes
                                </Button>
                <Button
                  color="primary"
                  style={{ borderRadius: '8px' }}
                  onClick={() => (formDescription == '' && questions.length === 0) ? onAdd() : onNext()}
                >
                  Save Changes
                                </Button>
              </div> :
              !(formDescription == '' && questions.length === 0) &&
              <div >
                <Button
                  color="primary"
                  outline
                  style={{ borderRadius: '8px' }}
                  onClick={() => setEditMode(true)}
                >
                  Edit
                            </Button>
              </div>
            }

          </div>
          <hr className='add-job-bottomBorder' />
          {(formDescription == '' && questions.length === 0 && !editMode) ?
            <div style={{ display: 'flex', flexDirection: 'column', width: '50%', margin: '5% 25% 10% 25%', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ textAlign: 'center' }}>
                No form added yet. Create one to evaluate a prospect by having them answer any important questions before you talk over a meeting.
                        </p>
              <Button
                color="primary"
                outline
                className="my-tribe-add-container-add-members"
                onClick={() => {
                  setEditMode(true)
                }}
              >
                Add Form
                        </Button>
            </div>
            :
            <PreEvaluationForm
              addPreEValForm={addPreEValForm}
              onSetPreEvalForm={onSetPreEvalForm}
              onSetPreEvalFormData={onSetPreEvalFormData}
              onSkipToComposeMessage={onSkipToComposeMessage}
              dispatch={dispatch}
              viewMode={!editMode}
              editMode={editMode}
            />
          }
        </>
      }
      {tabNumber === '4' &&
        <MyTribe search={search} push={push} permissions={permissions} />}

    </>
  )
})

export default connect(state => ({
  ...state.score.preEvaluationForm
}))(onlyUpdateForKeys([
  'tabNumber',
  'viewState'
])(Content))