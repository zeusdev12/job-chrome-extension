import React from 'react'
import './BlankSlate.css'

const BlankSlate = ({setSelectAllProspectsFlag}) => {
  setSelectAllProspectsFlag(false)
  return (
    <div className='blankslate-root'>
      <h1 className='ErrorMessage404'>No Prospects</h1>
    </div>
  )
}

export default BlankSlate