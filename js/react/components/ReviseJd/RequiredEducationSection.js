import React from 'react'
import Section from '../Section'
import DataTable from '../DataTable'
import {
  setEducationScore,
  addEducation,
  deleteEducationItem,
  setEducationItemValue
} from '../../actions/jobDescription'

const RequiredEducationSection = ({
  education,
  dispatch,
  viewMode
}) => {
  const handleClickAction = ({ score, index }) => {
    !viewMode && dispatch(setEducationScore({ score, index }))
  }

  const handleClickAdd = () => {
    dispatch(addEducation())
  }


  const onDelete = (index) => {
    dispatch(deleteEducationItem(index))
  }

  const handleChangeInput = ({ index, value }) => {
    dispatch(setEducationItemValue({ index, value }))
  }

  return (
    <Section title='Required Education'>
      <p>Mention the education required from the prospect</p>
      <DataTable
        data={education}
        title={'Education'}
        actionClickHandler={handleClickAction}
        onClickAdd={handleClickAdd}
        onDelete={onDelete}
        onChangeInput={handleChangeInput}
        viewMode={viewMode}
      />
    </Section>
  )
}

export default RequiredEducationSection