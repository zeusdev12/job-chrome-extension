import React, { useState, useEffect } from 'react'
import addNewIcon from '../../../../../../img/addNew.svg'

import copy from '../../../../../../img/copy.svg'
import trash from '../../../../../../img/archiveIcon.svg'
import off from '../../../../../../img/off.svg'
import on from '../../../../../../img/on.svg'
import x from '../../../../../../img/x.svg'
import mcqIcon from '../../../../../../img/check-circle.svg'
import paraIcon from '../../../../../../img/para.svg'

import { withRouter } from 'react-router-dom'
import { Button } from 'reactstrap'
import { connect } from 'react-redux'

import qs from 'query-string'

import {
  setFormDescription,
  setQuestion,
  setQuestionText,
  addOption,
  setMcqOptionText,
  deleteQuestion,
  copyQuestion,
  setRequired,
  deleteMcqOption,
  savePreEvalForm
} from '../../../../actions/preEvaluationForm'

const PreEvaluationForm = ({
  dispatch,
  data,
  addPreEValForm,
  editMode = false,
  viewMode = false,
  addMode = false,
  onSetPreEvalForm,
  onSetPreEvalFormData,
  onSkipToComposeMessage,
  preEvaluationForm: {
    formDescription,
    questions,
    preLoadFlag
  },
  location: {
    search
  }
}) => {

  let [addForm, setAddForm] = useState(false);
  let [addNew, setAddNew] = useState(false);

  useEffect(() => {
    setAddForm(preLoadFlag)
    onSetPreEvalForm(preLoadFlag)
  }, [preLoadFlag])

  if (addPreEValForm != null) {
    addForm = addPreEValForm
  }

  const onAddNew = () => {
    setAddNew(!addNew);
  }

  const onSkipStep = () => {
    onSkipToComposeMessage();
  }

  const onNext = () => {
    onSetPreEvalFormData(questions);
    dispatch(savePreEvalForm(qs.parse(search).jId))
    // ScoobyDoo
  }

  const onPeek = () => {
  }

  const onDelete = (index) => {
    dispatch(deleteQuestion(index))
  }

  const onCopy = (index) => {
    dispatch(copyQuestion(index))
  }

  const selectItem = (item) => {
    setAddNew(false);
    if (item == "multipleChoice") {
      setMCQuestions();
    }
    else if (item == "paragraph") {
      setParaQuestion();
    }
  }

  const setMCQuestions = () => {
    let question = { "question": "", "answer": [], "required": false }
    dispatch(setQuestion(question))
  }

  const setParaQuestion = () => {
    let question = { "question": "", "answer": null, "required": false }
    dispatch(setQuestion(question))
  }

  const onQuestionTextChange = (event, index) => {
    dispatch(setQuestionText(index, event.target.value))
  }

  const onOptionTextChange = (event, qIndex, aIndex) => {
    dispatch(setMcqOptionText(qIndex, aIndex, event.target.value))
  }

  const onDeleteOption = (qIndex, aIndex) => {
    dispatch(deleteMcqOption(qIndex, aIndex))
  }

  const onAddOption = (index) => {
    dispatch(addOption(index))
  }

  const onSelectAddForm = (option) => {
    setAddForm(option)
    onSetPreEvalForm(option)
  }

  const showQuestions = questions.length > 0

  return (
    <div className="preEvalTabPanelConatiner">
      {
        addForm == false &&!(viewMode||editMode) ? 
          <div style={{ minHeight: '374px', display: 'flex', flexDirection: 'column' }}>
            <p className="meetingTypeLable">Do you want to add a pre evaluation form for the prospects that will book a meeting with you?</p>
            <div className="meetingTypeButtonsContainer">
              <Button
                onClick={() => onSelectAddForm(true)}
                color='primary'
                className='settingButton'>
                Yes
              </Button>
              <Button
                onClick={() => onSelectAddForm(false)}
                color='primary'
                className='settingButton'>
                No, Skip this Step
              </Button>
            </div>
          </div>
          :
          <div className="preEvalFormConatiner">
            {addMode && <div className="preEvalFormHeader" >
              <h2 >Pre Evaluation Form</h2>
              <div className="meetingTypeButtonsContainer">
                {/* <button className="iconButton" style={{ border: 'none', }}
                                    onClick={onPeek}>
                                    <img style={{ left: '-7.5px', position: 'relative' }} src={eyeIcon} alt='eyeIcon'
                                        onClick={onPeek}/>
                                </button> */}
                <span>
                  <a
                    onClick={onSkipStep}>
                    Skip this Step
                  </a>
                </span>
                <Button
                  onClick={onNext}
                  color='primary'
                  outline>
                  Next
                </Button>
              </div>
            </div>
            }
            <div className="preEvalFormBody">
              {
              <div
                className="preEvalFormTextAreaContainer">
                <textarea
                  className="preEvalFormQuestionTextArea"
                  rows='3'
                  value={formDescription}
                  disabled={viewMode}
                  placeholder={viewMode?'':"Add form description..."}
                  onChange={(e) => {
                    dispatch(setFormDescription(e.target.value))
                  }}
                />
              </div>
              }
              <div
                className="preEvalForm"
                style={{ justifyContent: showQuestions ? 'unset' : 'center', alignContent: showQuestions ? 'unset' : 'center', alignItems: showQuestions ? 'unset' : 'center' }}>
                {showQuestions ?
                  <div className="preEvalFormQuestionContainer" >
                    {questions.map((q, i) => (
                      <div className="preEvalQuestionListContainer" key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '16px', marginTop: '16px' }}>
                          <div style={{ fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>Question {i + 1}</div>
                          {(addMode || editMode) && 
                          <div style={{ display: 'flex' }}>
                            <button className="iconButton" style={{ border: 'none', }}
                              onClick={() => onDelete(i)}>
                              <img
                                style={{ left: '-7.5px', position: 'relative', width: '24px', height: '24px' }}
                                src={trash}
                                alt='trash'
                              />
                            </button>
                            <button className="iconButton" style={{ border: 'none' }}
                              onClick={() => onCopy(i)}>
                              <img
                                style={{ left: '-7.5px', position: 'relative', width: '24px', height: '24px' }}
                                src={copy}
                                alt='copy'
                              />
                            </button>
                            < hr className='preEvalFormControlSeperator' />
                            {
                              q.required ?
                                <button className="preEvalFormRequired" style={{ border: 'none' }}
                                  onClick={() => dispatch(setRequired(i))}>
                                  Required
                                  <img
                                    style={{ marginLeft: '8px', position: 'relative', width: '24px', height: '24px' }}
                                    src={on}
                                    alt='on'
                                  />
                                </button>
                                :
                                <button className="preEvalFormRequired" style={{ border: 'none' }}
                                  onClick={() => dispatch(setRequired(i))}>
                                  Required
                                  <img
                                    style={{ marginLeft: '8px', position: 'relative', width: '24px', height: '24px' }}
                                    src={off}
                                    alt='off'
                                  />
                                </button>
                            }
                          </div>
                          }
                        </div>
                        <div>
                          <textarea
                            className="preEvalFormQuestionTextArea"
                            rows='2'
                            onChange={(event) => onQuestionTextChange(event, i)}
                            value={q.question} placeholder="Question..." />
                        </div>
                        {q.answer == null ?
                          <textarea
                            className="preEvalFormAnswerTextArea"
                            rows='1'
                            placeholder="Answer"
                            disabled={true}
                          />
                          :
                          <div>
                            {q.answer.map((ans, index) => (
                              <div key={index}>
                                <div style={{
                                  display: 'flex',
                                  padding: '0px 16px',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}>
                                  <div>
                                    <div style={{
                                      width: '20px',
                                      height: '20px',
                                      borderRadius: '50%',
                                      border: '1px solid #A7ABB0'
                                    }}></div>
                                  </div>
                                  <textarea
                                    className="preEvalFormQuestionTextArea"
                                    rows='1'
                                    onChange={(event) => onOptionTextChange(event, i, index)}
                                    value={ans}
                                    placeholder={'Option ' + (index + 1)} />
                                  <button className="iconButton" style={{ border: 'none', }}
                                    onClick={() => onDeleteOption(i, index)}>
                                    <img
                                      style={{ left: '-20px', top: '-5px', width: '24px', height: '24px', position: 'relative' }}
                                      src={x}
                                      alt='x'
                                    />
                                  </button>
                                </div>
                              </div>
                            ))}
                            {(addMode || editMode) && <div style={{
                              display: 'flex',
                              padding: '0 16px',
                              margin: '16px 0px'
                            }}>
                              <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                border: '1px solid #A7ABB0'
                              }}></div>
                              <p
                                style={{
                                  border: 'none',
                                  margin: '0px',
                                  marginLeft: '16px',
                                  marginTop: '-3px',
                                  cursor: 'pointer',
                                  color: '#297AF7'
                                }}
                                onClick={() => onAddOption(i)}
                                color='primary'
                                outline
                                className='addOption'>
                                Add Option
                              </p>
                            </div>
                            }
                          </div>
                        }
                      </div>
                    ))}
                  </div>
                  :
                  []
                }
                {(addMode || editMode) && 
                <div className="addPreEvalQuestionContainer" >
                  <button
                    onClick={onAddNew}>
                    Add a question
                    <img
                      src={addNewIcon}
                      alt='addNewIcon'
                    />
                  </button>
                  {addNew &&
                    <div className="prevEvalShortMenuContainer">
                      <div className="prevEvalShortMenu">
                        <button
                          type="button"
                          onClick={() => selectItem("multipleChoice")}>
                          <img
                            src={mcqIcon}
                            alt='mcq'
                          />
                            Multiple Choice
                        </button>
                        <button
                          type="button"
                          onClick={() => selectItem("paragraph")}>
                          <img
                            src={paraIcon}
                            alt='para'
                          />
                            Paragraph
                        </button>
                      </div>
                    </div>
                  }
                </div>
                }
              </div>
            </div>
          </div>
      }
    </div >
  )
}


export default withRouter(connect(state => ({
  preEvaluationForm: state.score.preEvaluationForm
}))(PreEvaluationForm))
