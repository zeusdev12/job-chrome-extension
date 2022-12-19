import React from 'react'
import Section from '../Section'
import DataTable from '../DataTable'
import {
  setTechnicalSkillScore,
  addTechnicalSkill,
  deleteTechnicalSkill,
  setTechnicalSkillValue

} from '../../actions/jobDescription'

const ImportantSkillsSection = ({ technicalSkills, dispatch , viewMode }) => {


  const handleClickAction = ({ score, index }) => {

     !viewMode && dispatch(setTechnicalSkillScore({ score, index }))
  }

  const handleClickAdd = () => {
    dispatch(addTechnicalSkill())
  }


  const onDelete = (index) => {
    dispatch(deleteTechnicalSkill(index))
  }

  const handleChangeInput = ({ index, value }) => {
    dispatch(setTechnicalSkillValue({ index, value }))
  }

  return (
    <Section title='Important Skills'>
      <p>List down the skills along with their importance required from the prospect:</p>
      <DataTable
        title={'Skills'}
        data={technicalSkills}
        actionClickHandler={handleClickAction}
        onClickAdd={handleClickAdd}
        onDelete={onDelete}
        onChangeInput={handleChangeInput}
        viewMode={viewMode}
      />
    </Section>
  )
}

export default ImportantSkillsSection