import { CALL_API } from '../middlewares/apiMiddleware'


export const SET_FORM_DESCRIPTION = 'SET_FORM_DESCRIPTION'
export const SET_QUESTION = 'SET_QUESTION'
export const ADD_MCQ_OPTION = 'ADD_MCQ_OPTION'
export const SET_MCQ_OPTION_TEXT = 'SET_MCQ_OPTION_TEXT'
export const SET_QUESTION_TEXT = 'SET_QUESTION_TEXT'
export const DELETE_QUESTION = 'DELETE_QUESTION'
export const COPY_QUESTION = 'COPY_QUESTION'
export const SET_REQUIRED = 'SET_REQUIRED'
export const DELETE_MCQ_OPTION = 'DELETE_MCQ_OPTION'
export const SAVE_PRE_EVAL_FORM = "SAVE_PRE_EVAL_FORM"
export const SAVE_PRE_EVAL_FORM_SUCCESS = "SAVE_PRE_EVAL_FORM_SUCCESS"
export const SAVE_PRE_EVAL_FORM_FAILURE = "SAVE_PRE_EVAL_FORM_FAILURE"
export const LOAD_PRE_EVAL_FORM = "LOAD_PRE_EVAL_FORM"
export const LOAD_PRE_EVAL_FORM_SUCCESS = "LOAD_PRE_EVAL_FORM_SUCCESS"
export const LOAD_PRE_EVAL_FORM_FAILURE = "LOAD_PRE_EVAL_FORM_FAILURE"

export const setMcqOptionText = (qIndex, aIndex, value) => ({
  type: SET_MCQ_OPTION_TEXT,
  payload: {
    qIndex,
    aIndex,
    value
  }
})

export const deleteMcqOption = (qIndex, aIndex) => ({
  type: DELETE_MCQ_OPTION,
  payload: {
    qIndex,
    aIndex
  }
})

export const setFormDescription = (value) => ({
  type: SET_FORM_DESCRIPTION,
  payload: value
})

export const setQuestion = (payload) => ({
  type: SET_QUESTION,
  payload
})

export const setQuestionText = (index, val) => ({
  type: SET_QUESTION_TEXT,
  payload: {
    index,
    value: val
  }
})

export const addOption = (index) => ({
  type: ADD_MCQ_OPTION,
  payload: {
    index
  }
})

export const deleteQuestion = (index) => ({
  type: DELETE_QUESTION,
  payload: index
})

export const copyQuestion = (index) => ({
  type: COPY_QUESTION,
  payload: index
})

export const setRequired = (index) => ({
  type: SET_REQUIRED,
  payload: index
})

const prepareData = (data, flag) => {
  if(flag){
    return data.map(q => {
      if(q?.answer){
        return ({
          ...q,
          question: prepareData(q.question, false),
          answer: q.answer.map(a => prepareData(a, false))
        })
      }
      return({
        ...q,
        question: prepareData(q.question, false)
      })
    })

  }
  return data.replace(/'/g, "''")
}

export const savePreEvalForm = (jobId) => (dispatch, getState) =>  {

  const {formDescription, questions} = getState().score.preEvaluationForm

  console.log("---------------------------")
  console.log(formDescription)
  console.log(questions)  

  const preEvalForm = {
    formDescription: formDescription === '' ? '' : prepareData(formDescription, false),
    questions: questions.length > 0 ? prepareData(questions, true) : [],
    jobId
  }
  
  dispatch({
    [CALL_API]: {
      types: [SAVE_PRE_EVAL_FORM, SAVE_PRE_EVAL_FORM_SUCCESS, SAVE_PRE_EVAL_FORM_FAILURE],
      endpoint: `/api/auth/job/profile/save-pre-eval-form`,
      options: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
        body: JSON.stringify(preEvalForm)
      }
    }
  })
}

export const loadPreEvalForm = (jobId) => {
  return {
    [CALL_API]: {
      types: [LOAD_PRE_EVAL_FORM, LOAD_PRE_EVAL_FORM_SUCCESS, LOAD_PRE_EVAL_FORM_FAILURE],
      endpoint: `/api/auth/job/profile/load-pre-eval-form?jobId=${jobId}`,
      options: {
        method: 'GET'
      }
    }
  }
}