import React from 'react'
import './Dropdown.css'

const Dropdown = ({ children, isOpen = false }) => {
  return (
    <React.Fragment>
      {isOpen ?
        <div className='dd-root'>
          {children}
        </div> :
        null
      }
    </React.Fragment>
  )
}

export default Dropdown