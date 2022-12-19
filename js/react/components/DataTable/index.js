import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { fetchIndustries, clearIndustrySuggestions } from '../../actions/jobDescription'

import seeMoreCaret from '../../../../img/vector.svg'

import TrashIcon from '../../../../img/archiveIcon.svg'

import AutoSuggest from '../AutoSuggest'
import './DataTable.css'

const TableActions = ({ score, index, onSelectImportance ,viewMode }) => {
  return (
    <div className='tbl-actions'>
      <div onClick={() => onSelectImportance({ score: 1, index })} className={score === 1 ? 'table-action-active' : ''}>Nice to Have</div>
      <div onClick={() => onSelectImportance({ score: 3, index })} className={score === 3 ? 'table-action-active' : ''}>Important</div>
      <div onClick={() => onSelectImportance({ score: 5, index })} className={score === 5 ? 'table-action-active' : ''}>Must Have</div>
    </div>
  )
}


/**
 * TODO:
 * move this to IndustrySection component, 
 * DataTable should remain dumb
 */
const AutoSuggestInput = connect(state => ({
  suggestions: state.jobDescription.revise.industrySuggestions
}))(
  ({
    value,
    index,
    onChangeInput,
    suggestions,
    dispatch
  }) => {

    console.log('Auto Suggest Input, ', { value, index, onChangeInput, suggestions })


    const handleChangeInput = (e, { newValue }) => {
      onChangeInput({ index, value: newValue })
    }

    const inputProps = {
      value,
      onChange: handleChangeInput,
      placeholder: 'e.g. Computer Software'
    }

    const onSuggestionsFetchRequested = useCallback(_.debounce(({ value }) => {
      // console.log('FETCH INDUSTRIES AGAINST KEYWORD: ', value)
      dispatch(fetchIndustries(value))
    }, 200), [])

    const onSuggestionsClearRequested = () => {
      dispatch(clearIndustrySuggestions())
    }


    const renderSuggestion = (suggestion) => {
      return <div>{suggestion.name}</div>
    }

    return (
      <AutoSuggest
        inputProps={inputProps}
        suggestions={suggestions}
        renderSuggestion={renderSuggestion}
        getSuggestionValue={(suggestion) => suggestion}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
      />
    )
  })



const DataTable = ({
  data = [],
  title = 'Sample Title',
  seeMoreFlag = false,
  actionClickHandler,
  onClickAdd,
  onDelete,
  onChangeInput,
  autoSuggest = false,
  viewMode
}) => {
  const [SeeMore, setSeeMore] = useState(false)
  const [OverTen, setOverTen] = useState(false)

  useEffect(() => {
    if (data.length > 10 && seeMoreFlag)
      setOverTen(true)
    setSeeMore(!seeMoreFlag)
  }, [])

  const onClickSeeAll = (e) => {
    setSeeMore(prev => !prev)
  }

  console.log(`${title}, data: `, data)

  return (
    <table className='tbl-root'>
      {/* <thead>
        <tr>
          <th>{title}</th>
          <th>Importance</th>
          <th>Action</th>
        </tr>
      </thead> */}
      <tbody>
        {
          data.map((item, i) => {
            return (i < 9 || SeeMore) &&
              <tr key={item.id || i}>
                <td>
                  {autoSuggest ?
                    <AutoSuggestInput
                      value={item.name}
                      index={i}
                      onChangeInput={onChangeInput}
                      disabled={viewMode}
                    /> :
                    <input
                      className='job-title-ip'
                      value={item.name}
                      key={item.id || i}
                      onChange={(e) => { onChangeInput({ index: i, value: e.target.value }) }}
                      disabled={viewMode}
                    />
                  }
                </td>
                <td>
                  <TableActions
                    score={item.score}
                    onSelectImportance={actionClickHandler}
                    index={i}
                    viewMode={viewMode}
                  />
                </td>
                {!viewMode &&
                  <td>
                    <div onClick={() => onDelete(i)} className='trash-icon-container'>
                      <img src={TrashIcon} alt='trash' />
                    </div>
                  </td>
                }
              </tr>
          })
        }
        <tr>
          <td colSpan={3}>
            {OverTen &&
              <React.Fragment>
                <button
                  style={{ marginRight: "16px" }}
                  className='SeeMoreCriteriaButton'
                  onClick={onClickSeeAll}
                >
                  See all {title}
                  <img
                    className="seeMoreCriteriaCaret"
                    src={seeMoreCaret}
                    style={{ transform: SeeMore ? "rotate(180deg)" : "rotate(0deg)" }} />
                </button>
              </React.Fragment>}
          </td>
        </tr>

        {!viewMode &&
          <tr>
            <td colSpan={3}>
              <button
                className='add-more-btn'
                onClick={onClickAdd}
              >Add {title}</button>
            </td>
          </tr>
        }
      </tbody>
    </table>
  )
}

export default DataTable