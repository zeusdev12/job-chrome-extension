import React, { useState } from 'react'
import './addLabel.css'
import { Button } from 'reactstrap'
import Loader from '../Loader'

const AddLabel = ({
  onClickSave,
  onClickDiscard,
  isLoading = false,
  existingValue
}) => {
  const [val, setVal] = useState(existingValue)
  return (
    <div className='add-label-root'>
      <h4>{existingValue ? 'Edit Label' : 'Add a label'} </h4>
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder='Sample label...'
      />
      <div>
        <Button
          onClick={onClickDiscard}
          color="primary"
          outline
        >
          Discard
          </Button>
        <Button
          onClick={() => onClickSave(val)}
          color="primary"
          outline
          disabled={!val}
        >
          {isLoading ? <Loader color='blue' /> : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export { AddLabel }