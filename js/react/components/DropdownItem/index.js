import React from 'react'
import './DropdownItem.css'

const DropdownItem = ({
  children,
  style = {},
  ...rest
}) => {
  return (
    <p className='dd-item' style={style} {...rest}>
      {children}
    </p>
  )
}

export default DropdownItem