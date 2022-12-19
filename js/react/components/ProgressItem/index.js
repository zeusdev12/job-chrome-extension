import React from 'react'
import { Progress } from 'reactstrap'

import './progressItem.css'

const ProgressItem = ({
  label = 'Sample Label',
  progress = 30
}) => {
  return (
    <div className='progressitem-root'>
      <p>{label}</p>
      <div className='progressbar-container'>
        <Progress value={progress} />
      </div>
    </div>
  )
}

export default ProgressItem