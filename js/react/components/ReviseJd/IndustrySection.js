import React from 'react'
import Section from '../Section'
import DataTable from '../DataTable'
import {
  setIndustryScore,
  addIndustry,
  deleteIndustry,
  setIndustryValue
} from '../../actions'

const IndustrySection = ({
  industries,
  dispatch,
  viewMode
  // suggestions
}) => {

  const handleClickAction = ({ score, index }) => {
    !viewMode && dispatch(setIndustryScore({ score, index }))
  }

  const handleClickAdd = () => {
    dispatch(addIndustry())
  }


  const onDelete = (index) => {
    dispatch(deleteIndustry(index))
  }

  const handleChangeInput = ({ index, value }) => {
    // console.log('VALUE FOR SUGGESTION IS: ', value)
    // console.log('typeof suggestion: ', )

    const isValueString = typeof (value) === 'string'

    dispatch(setIndustryValue({
      index,
      value: isValueString ? value : value.name,
      id: isValueString ? null : parseInt(value.id, 10)
    }))
  }


  return (
    <Section title={'Industry Experience'}>
      <p>List out any specific industrial experience and the degree to which that experience is required:</p>
      <DataTable
        title='Industry'
        data={industries}
        autoSuggest={true}
        actionClickHandler={handleClickAction}
        onClickAdd={handleClickAdd}
        onDelete={onDelete}
        onChangeInput={handleChangeInput}
        viewMode={viewMode}
        // suggestions={suggestions}
      />
    </Section>
  )
}

export default IndustrySection