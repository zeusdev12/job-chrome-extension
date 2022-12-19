import React from 'react'
import chevronLeft from '../../../../img/chevron-left.svg'

import './BackNav.css'

const BackNav = ({
  title = 'Add Prospects',
  subTitle = null,
  onClickButtonBack
}) => {
  return (
    <div className='backnav-root'>
      <img src={chevronLeft} alt='back icon' onClick={onClickButtonBack} />
      <div>
        <p>{title}</p>
        {subTitle && <p>{subTitle}</p>}
      </div>
    </div>
  )
}

export default BackNav