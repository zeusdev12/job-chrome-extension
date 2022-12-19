import React from 'react'
import loaderSvg from '../../../../../../img/loader.svg'
// import Spinner from '../../../../compone/nts/Spinner'

const ApplyingFilters = () => {
  return (
    <div className='applying-filters-root'>
      <img className='rotate' src={loaderSvg} alt={'loader'} />
      <span>Setting Up</span>
      <p>Applying Filters, Please Wait</p>
    </div>
  )
}

export default ApplyingFilters
