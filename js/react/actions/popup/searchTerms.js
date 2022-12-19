import { MESSAGE_TYPES } from '../../../config/constants'
import { Combination } from 'js-combinatorics'

export const FETCH_SEARCH_TERMS = 'FETCH_SEARCH_TERMS'
export const FETCH_SEARCH_TERMS_SUCCESS = 'FETCH_SEARCH_TERMS_SUCCESS'
export const FETCH_SEARCH_TERMS_FAILURE = 'FETCH_SEARCH_TERMS_FAILURE'

export const SET_EDITED_SEARCH_TERMS = 'SET_EDITED_SEARCH_TERMS'
export const SET_SEARCH_TERM_VALUE = 'SET_SEARCH_TERM_VALUE'

export const DELETE_SEARCH_TERM = 'DELETE_SEARCH_TERM'
export const DELETE_SEARCH_TERM_SUCCESS = 'DELETE_SEARCH_TERM_SUCCESS'
export const DELETE_SEARCH_TERM_FAILURE = 'DELETE_SEARCH_TERM_FAILURE'

export const ADD_NEW_SEARCH_TERM = 'ADD_NEW_SEARCH_TERM'

export const fetchSearchTerms = (job) => (dispatch) => {
  dispatch({ type: FETCH_SEARCH_TERMS })
  const searchTermsNew = generateSearchTerms(job)
  chrome.runtime.sendMessage({ type: MESSAGE_TYPES.GET_JOB_META, payload: job.jobID }, function (jobMeta = {}) {
    // console.log('JOB META: ', jobMeta)
    if (jobMeta) {
      console.log('EXISTING JOB META: ', jobMeta)
      const previousSearchTerms = jobMeta.searchTerms
      const searchTerms = searchTermsNew.map((item, i) => {
        const prev_rec = previousSearchTerms ? previousSearchTerms.filter(it => it.searchTermGenerated === item.term) : []
        console.log("PREVIOUS RECORD FOR THIS SEARCH TERMS IS: ", prev_rec)
        console.log("search term is: ", item)

        let contUrl = ""
        let isInitialized = false
        let stVal = item.term
        let isDeleted = false
        let totalResults = null
        let isExhausted = false

        if (prev_rec.length > 0) {
          contUrl = prev_rec[0].continueUrl || ""
          isInitialized = prev_rec[0].isInitialized || false
          stVal = prev_rec[0].searchTermValue || item.term
          isDeleted = prev_rec[0].isDeleted || false
          totalResults = prev_rec[0].totalResults || null
          isExhausted = prev_rec[0].isExhausted || false
        }

        return {
          "searchTermGenerated": item.term,
          "searchTermValue": stVal, //implement logic here to see if this was edited before
          "isExhausted": isExhausted,
          "isSelected": false,
          "isCompleted": false,
          "isPaused": false,
          "isRunning": false,
          "isVisited": false,
          "isDeleted": isDeleted,
          "pickerCounter": 0,
          "continueUrl": contUrl,
          "isInitialized": isInitialized,
          "isInitializing": false,
          "score": item.score,
          "totalResults": totalResults
        }
      })

      const manuallyAdded = previousSearchTerms.filter(item => !item.searchTermGenerated)

      // chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.UPDATE_JOB_META,
        payload: {
          ...jobMeta,
          jobId: job.jobID,
          searchTerms: [
            ...searchTerms,
            ...manuallyAdded
          ],
          // mainSearchUrl: tabs[0].url
        }
      }, function (resp) {
        dispatch({ type: FETCH_SEARCH_TERMS_SUCCESS, payload: resp.searchTerms })
      })
      // })


    } else {
      const searchTerms = searchTermsNew.map((item, i) => {
        // const prev_rec = previousSearchTerms ? previousSearchTerms.filter(it => it.searchTerm === item) : []
        // console.log("PREVIOUS RECORD FOR THIS SEARCH TERMS IS: ", prev_rec)
        let contUrl = ""
        let isInitialized = false

        // if (prev_rec.length > 0) {
        //   contUrl = prev_rec[0].continueUrl || ""
        //   isInitDone = prev_rec[0].isInitDone || false
        // }

        return {
          "searchTermGenerated": item.term,
          "searchTermValue": item.term,
          "isExhausted": false,
          "isSelected": false,
          "isCompleted": false,
          "isPaused": false,
          "isRunning": false,
          "isDeleted": false,
          "isVisited": false,
          "pickerCounter": 0,
          "continueUrl": contUrl,
          "isInitialized": isInitialized,
          "isInitializing": false,
          "score": item.score,
          "totalResults": null
        }
      })

      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.runtime.sendMessage({
          type: MESSAGE_TYPES.ADD_JOB_META,
          payload: {
            jobId: job.jobID,
            searchTerms: searchTerms,
            mainSearchUrl: tabs[0].url
          }
        }, function (resp) {
          dispatch({ type: FETCH_SEARCH_TERMS_SUCCESS, payload: resp.searchTerms })
        })
      })


    }

  })
}

export const setEditedSearchTerms = (job, searchTerms) => (dispatch) => {

  const sts = searchTerms.map((item) => {
    if (!item.searchTermGenerated) {
      let score = 0
      const st = item.searchTermValue.toLowerCase()
      if (st.includes('and')) {
        const stComps = st.split('and')
        stComps.forEach(comp => {
          score += comp.includes(`"`) ? 2 : 1
        })
      } else {
        score = st.includes(`"`) ? 2 : 1
      }
      return {
        ...item,
        score: score,
        // isInitialized: false,
        // isInitializing: false,
        // isExhausted: false,
        // continueUrl: '',
        // isRunning: false
      }

    } else {
      return item
    }
  })

  chrome.runtime.sendMessage({ type: MESSAGE_TYPES.GET_JOB_META, payload: job.jobID }, function (jobMeta = {}) {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.UPDATE_JOB_META,
      payload: {
        ...jobMeta,
        searchTerms: sts,
        jobId: job.jobID
      }
    }, function (resp) {
      dispatch({ type: SET_EDITED_SEARCH_TERMS, payload: resp.searchTerms })
    })
  })
}


export const deleteSearchTerm = ({
  job,
  searchTermName
}) => (dispatch) => {
  console.log('DELETE SEARCH TERM: ', { job, searchTermName })
  dispatch({ type: DELETE_SEARCH_TERM })
  chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.GET_JOB_META,
    payload: job.jobID
  }, function (jobMeta) {
    const searchTerms = jobMeta.searchTerms.map(
      item => item.searchTermValue.toLowerCase().trim() === searchTermName.toLowerCase().trim() ? { ...item, isDeleted: true } : item
    )

    console.log('SEARCH TERMS AFTER DELETING: ', searchTerms)

    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.UPDATE_JOB_META,
      payload: {
        ...jobMeta,
        searchTerms: searchTerms
      }
    }, function (resp) {
      dispatch({ type: DELETE_SEARCH_TERM_SUCCESS, payload: resp.searchTerms })
    })
  })
}



export const setSearchTermValue = ({
  index, value
}) => ({
  type: SET_SEARCH_TERM_VALUE,
  payload: {
    index,
    value
  }
})

export const addNewSearchTerm = () => (dispatch, getState) => {

  const searchTerms = getState().popup.home.searchTerms.data
  const job = getState().popup.home.currentJob.job

  chrome.runtime.sendMessage({ type: MESSAGE_TYPES.GET_JOB_META, payload: job.jobID }, function (jobMeta = {}) {

    const newSearchTerms = [
      ...searchTerms,
      {
        continueUrl: "",
        isCompleted: false, // not used
        isExhausted: false,
        isInitialized: false,
        isInitializing: false,
        isPaused: false, // not used
        isRunning: false,
        isSelected: false, // not used
        isDeleted: false,
        isVisited: false, 
        pickerCounter: 0, // not used
        searchTermGenerated: null,
        searchTermValue: "",
        score: 0,
        "totalResults": null,

      }
    ]

    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.UPDATE_JOB_META,
      payload: {
        ...jobMeta,
        jobId: job.jobID,
        searchTerms: newSearchTerms
      }
    }, function (resp) {
      dispatch({ type: ADD_NEW_SEARCH_TERM, payload: resp.searchTerms })
    })
  })
}



const generateSearchTerms = (job) => {
  const mainTitle = job.jobTitle
  const additionalTitles = job.jobArray.filter(item => item.tag === "SUGGESTED_JOB_TITLES")[0].data || []
  const skills = job.jobArray.filter(item => item.tag === "TECHNICAL_SKILLS")[0].data

  const allTitles = [mainTitle, ...additionalTitles]


  let mustHaveSkills = skills.filter(item => item.score == 5).map(item => item.name)
  let importantSkills = skills.filter(item => item.score == 3).map(item => item.name)
  let pickedSkills = []

  if (mustHaveSkills.length >= 3) {
    pickedSkills = mustHaveSkills
  } else {
    pickedSkills = [...mustHaveSkills, ...importantSkills]
  }


  const chunksOf5 = _.chunk(pickedSkills, 5)

  const titleScores = allTitles.reduce((obj, item) => {
    return {
      ...obj,
      [item]: item === mainTitle ? 10 : 1
    }
  }, {})

  const terms = []

  if (pickedSkills.length > 0) {

    chunksOf5.forEach(chunk => {
      const allCombinations = getNewCombinations(chunk)
      allTitles.forEach(title => {
        const searchTerms = allCombinations.map(item => {
          let term = `"${title}" AND ${item}`
          const ors = term.match(/OR/g)
          const ands = term.match(/AND/g)

          const andsScore = ands ? ands.length : 0
          const orScore = ors ? 1 : 0

          return {
            term: term,
            score: titleScores[title] * (andsScore + orScore)
          }
        })

        terms.push(...searchTerms)
        const lastTermText = `${title} AND ${allCombinations[allCombinations.length - 1]}`

        const lastTermOrs = lastTermText.match(/OR/g)
        const lastTermAnds = lastTermText.match(/AND/g)

        const lastTermAndsScore = lastTermAnds ? lastTermAnds.length : 0
        const lastTermOrScore = lastTermOrs ? 1 : 0

        const lastTerm = {
          term: lastTermText,
          score: titleScores[title] * (lastTermAndsScore + lastTermOrScore)
        }

        terms.push(lastTerm)
      })



    })
  } else {
    allTitles.forEach(title => {
      terms.push({
        term: `"${title}"`,
        score: titleScores[title] || 0
      })

      terms.push({
        term: title,
        score: titleScores[title] || 0
      })
    })
  }

  return terms.sort((a, b) => b.score - a.score)
}



function getNewCombinations(skills = []) {

  const quotedSkills = skills.map(item => `"${item}"`)

  const skillsObj = quotedSkills.reduce((obj, item, index) => {
    return {
      ...obj,
      [index]: item
    }
  }, {})

  const skillKeyString = Object.keys(skillsObj).join('')

  console.log('SKILL KEYS: ', skillKeyString)

  const allCombinations = []

  for (let i = skillKeyString.length; i > 1; i--) {
    let it = new Combination(skillKeyString, i)
    for (let elem of it) {
      allCombinations.push(elem)
    }
  }

  const translated = allCombinations.reverse().map(item => {

    const text = `(${item.map(it => `${skillsObj[it]}`).join(' OR ')})`
    const skillsUsed = item.map(it => skillsObj[it])


    return {
      text: text,
      skillsUsed: skillsUsed
    }
  })

  const terms = translated.map(item => {
    const skillsToAnd = quotedSkills.filter(skl => !item.skillsUsed.includes(skl)).map(i => i)
    let term = `(${item.text}${skillsToAnd.length > 0 ? ` AND ${skillsToAnd.join(' AND ')}` : ''})`
    if (skillsToAnd.length === 0) {
      term = term.substring(1, term.length - 1)
    }
    return term
  })

  const r = [`(${quotedSkills.join(' AND ')})`, ...terms]

  return r
}