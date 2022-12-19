import React from 'react'
import './Section.css'

const Section = ({
  title = 'Sample Title',
  children
}) => {
  return (
    <div className='section-root'>
      <p className='section-title'>{title}</p>
      {children}
    </div>
  )
}

export default Section