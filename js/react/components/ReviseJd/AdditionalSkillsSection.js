import React from 'react'
import Section from '../Section'
import DataTable from '../DataTable'
import {
  setAdditionalSkillScore,
  setAdditionalSkillValue,
  addAdditionalSkill,
  deleteAdditionalSkill
} from '../../actions/jobDescription'

const AdditionalSkillsSection = ({ additionalSkills, dispatch, viewMode }) => {


  const handleClickAction = ({ score, index }) => {
    !viewMode && dispatch(setAdditionalSkillScore({ score, index }))
  }

  const handleClickAdd = () => {
    dispatch(addAdditionalSkill())
  }


  const onDelete = (index) => {
    dispatch(deleteAdditionalSkill(index))
  }

  const handleChangeInput = ({ index, value }) => {
    dispatch(setAdditionalSkillValue({ index, value }))
  }


  return (
    <Section title='Additional Skills'>
      <p>List out any additional skills required. These will not be considered unless marked:</p>
      <DataTable
        title={'Skills'}
        data={additionalSkills}
        seeMoreFlag={true}
        actionClickHandler={handleClickAction}
        onClickAdd={handleClickAdd}
        onDelete={onDelete}
        onChangeInput={handleChangeInput}
        viewMode={viewMode}
      />
    </Section>
  )
}

export default AdditionalSkillsSection