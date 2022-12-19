import React, { useState } from 'react'
import Section from '../Section'
import Chip from '../Chip'
import { setJobTitle, selectAdditionalTitle, addAdditionalTitle } from '../../actions/jobDescription'

import './ReviseJd.css'

const titles = [
  "resident engineer",
  "engineer, level 1",
  "splunk engineer",
  "engineer/associate engineer ii",
  "sr. ate engineer",
  "entry level engineer",
  "engineer journeyman- module c",
  "intern - engineer",
  "presales engineer",
  "engineer full-time 2021"
]

const JobTitleSection = ({
  viewMode,
  title,
  additionalTitles,
  dispatch
}) => {
  const [newAdditionalTitle, setNewAdditionalTitle] = useState('')
  const selectedAdditionalTitleCount = additionalTitles.filter(item => item.isSelected).length
  return (
    <Section title='Job Title'>
      <input className='job-title-ip' value={title} disabled={viewMode} onChange={(e) => { dispatch(setJobTitle(e.target.value)) }} />

      {additionalTitles.length>0 &&
        <>
          <p style={{ marginBottom: '12px', marginTop: '32px' }} className='paragraph-secondary'>
            Additional Titles
      </p>


          <div className='additional-titles'>
            <div className='chips-container'>
              {additionalTitles.map((item, i) =>
                <Chip
                  key={item.id || i}
                  text={item.name}
                  isSelected={item.isSelected}
                  disabled={!item.isSelected && selectedAdditionalTitleCount >= 2}
                  onClickIcon={(name) => { dispatch(selectAdditionalTitle(name)) }}
                />
              )}
            </div>
            {!viewMode && <div className='add-title'>
              <input
                style={{ marginBottom: 0 }}
                className='job-title-ip'
                placeholder='Add a new additional title'
                value={newAdditionalTitle}
                disabled={viewMode}
                onChange={e => setNewAdditionalTitle(e.target.value)}
              />
              <span onClick={() => {
                dispatch(addAdditionalTitle({
                  name: newAdditionalTitle,
                  isSelected: selectedAdditionalTitleCount < 2 ? true : false
                }))
                setNewAdditionalTitle('')
              }}>Add Title</span>

            </div>
            }
          </div>
        </>
      }
    </Section>
  )
}

export default JobTitleSection