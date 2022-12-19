import React from 'react'
import Section from '../Section'
import DataTable from '../DataTable'
import {
  setExperienceScore,
  addExperience,
  deleteExperience,
  setExperienceValue
} from '../../actions/jobDescription'

const RequiredExperienceSection = ({
  experience,
  dispatch,
  viewMode
}) => {
  const handleClickAction = ({ score, index }) => {
    !viewMode && dispatch(setExperienceScore({ score, index }))
  }

  const handleClickAdd = () => {
    dispatch(addExperience())
  }


  const onDelete = (index) => {
    dispatch(deleteExperience(index))
  }

  const handleChangeInput = ({ index, value }) => {
    dispatch(setExperienceValue({ index, value }))
  }

  return (
    <Section title='Required Experience'>
      <p>List down role-wise experience required from the prospect (e.g. 4 years of Machine Learning):</p>
      <DataTable
        data={experience}
        title={'Experience'}
        actionClickHandler={handleClickAction}
        onClickAdd={handleClickAdd}
        onDelete={onDelete}
        onChangeInput={handleChangeInput}
        viewMode={viewMode}
      />
    </Section>
  )
}

export default RequiredExperienceSection