import React from 'react'
// import ReactLoader from 'react-loader-spinner'
// import loaderSvg from '../../../../img/loader.svg'

const Loader = ({ color = 'white', height = '24px', width ='24px' }) => {

  return(<svg className='rotate' width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2V6" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 18V22" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M4.92993 4.93018L7.75993 7.76018" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16.24 16.2402L19.07 19.0702" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 12H6" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M18 12H22" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M4.92993 19.0702L7.75993 16.2402" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16.24 7.76018L19.07 4.93018" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>)

}

export default Loader