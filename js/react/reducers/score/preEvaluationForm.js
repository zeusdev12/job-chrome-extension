import * as ActionTypes from '../../actions/preEvaluationForm'

const initialState = {
  formDescription: '',
  questions: [],
  preLoadFlag: false,
  isLoading: false,
  isDataAvailable: false,
  isSaving: false,
  isSaved: false,
  originalFormDescription:'',
  originalQuestions:[],
  newForm:false
}


const preEvaluationForm = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_FORM_DESCRIPTION:
      return { ...state, formDescription: action.payload }

    case ActionTypes.SET_QUESTION:
      return {
        ...state,
        questions: [...state.questions, action.payload]
      }

    case ActionTypes.ADD_MCQ_OPTION: {
      return {
        ...state,
        questions: state.questions.map((item, i) => i == action.payload.index ?
          { ...item, answer: [...item.answer, ''] } : item)
      }
    }

    case ActionTypes.SET_QUESTION_TEXT: {
      return {
        ...state,
        questions: state.questions.map((item, i) =>
          i == action.payload.index ?
            { ...item, question: action.payload.value } :
            item
        )
      }
    }


    case ActionTypes.SET_MCQ_OPTION_TEXT: {
      return {
        ...state,
        questions: state.questions.map((q, qi) =>
          qi == action.payload.qIndex ? {
            ...q,
            answer: q.answer.map((a, ai) =>
              ai == action.payload.aIndex ? action.payload.value :
                a)
          } :
            q
        )
      }
    }


    case ActionTypes.DELETE_QUESTION: {
      return {
        ...state,
        questions: state.questions.filter((item, i) =>
          i !== action.payload)
      }
    }

    case ActionTypes.COPY_QUESTION: {
      return {
        ...state,
        questions: [
          ...state.questions,
          { ...state.questions[action.payload] }
        ]
      }
    }


    case ActionTypes.SET_REQUIRED: {
      return {
        ...state,
        questions: state.questions.map((q, i) => i == action.payload ?
          { ...q, required: !q.required } :
          q)
      }
    }

    case ActionTypes.DELETE_MCQ_OPTION: {
      return {
        ...state,
        questions: state.questions.map((q, qi) =>
          qi == action.payload.qIndex ? {
            ...q,
            answer: q.answer.filter((a, ai) => ai !== action.payload.aIndex)
          } :
            q
        )
      }
    }

    case ActionTypes.SAVE_PRE_EVAL_FORM: {
      return {
        ...state, 
        isSaving:true,
        isSaved:false,
      }
    }
    case ActionTypes.SAVE_PRE_EVAL_FORM_FAILURE: {
      return {
        ...state, 
        isSaving:false,
        isSaved:false,
      }
    }
    case ActionTypes.SAVE_PRE_EVAL_FORM_SUCCESS: {
      return {
          ...state, 
          isSaving:false,
          isSaved:true,
        }
    }

    case ActionTypes.LOAD_PRE_EVAL_FORM: {
      return {
        ...state, 
        isLoading :true,
        isDataAvailable:false,
      }
    }
    case ActionTypes.LOAD_PRE_EVAL_FORM_FAILURE: {
      return {
        ...state, 
        isLoading :false,
        isDataAvailable:false,
      }
    }
    case ActionTypes.LOAD_PRE_EVAL_FORM_SUCCESS: {
      return {
          ...state, 
          newForm:action.payload.data==null?true:false,
          formDescription: action.payload?.data?.formDescription || initialState.formDescription,
          questions: action.payload?.data?.questions || initialState.questions,
          preLoadFlag: true,
          isLoading :false,
          isDataAvailable:true,
          originalFormDescription:action.payload?.data?.formDescription || initialState.formDescription,
          originalQuestions:action.payload?.data?.questions || initialState.questions
        }
    }




    default:
      return state
  }
}

export { preEvaluationForm }