import React, { useState } from 'react'
import Loader from '../Loader'
import './addNewNote.css'

const AddNewNote = ({
  onClickDiscard,
  onClickSave,
  isAdding
}) => {

  const [val, setVal] = useState('')

  return (
    <div className='new-note-root'>
      <h1>New Note</h1>
      <textarea value={val} onChange={(e) => { setVal(e.target.value) }} />
      <div>
        <p onClick={onClickDiscard}>Discard</p>
        <p onClick={() => onClickSave(val)}> {isAdding ? <Loader color='blue' /> : 'Save'}</p>
      </div>
    </div>
  )
}

export { AddNewNote }