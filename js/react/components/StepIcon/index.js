import React from 'react'
import './StepIcon.css'

const svgs = {
  addTribe: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#297AF7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#297AF7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M23 20.9999V18.9999C22.9993 18.1136 22.7044 17.2527 22.1614 16.5522C21.6184 15.8517 20.8581 15.3515 20 15.1299" stroke="#297AF7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16 3.12988C16.8604 3.35018 17.623 3.85058 18.1676 4.55219C18.7122 5.2538 19.0078 6.11671 19.0078 7.00488C19.0078 7.89305 18.7122 8.75596 18.1676 9.45757C17.623 10.1592 16.8604 10.6596 16 10.8799" stroke="#297AF7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  ,
  pickJd: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#297AF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M14 2V8H20" stroke="#297AF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M16 13H8" stroke="#297AF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M16 17H8" stroke="#297AF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M10 9H9H8" stroke="#297AF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  reviseCriteria: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 11.0801V12.0001C21.9988 14.1565 21.3005 16.2548 20.0093 17.9819C18.7182 19.7091 16.9033 20.9726 14.8354 21.584C12.7674 22.1954 10.5573 22.122 8.53447 21.3747C6.51168 20.6274 4.78465 19.2462 3.61096 17.4372C2.43727 15.6281 1.87979 13.4882 2.02168 11.3364C2.16356 9.18467 2.99721 7.13643 4.39828 5.49718C5.79935 3.85793 7.69279 2.71549 9.79619 2.24025C11.8996 1.76502 14.1003 1.98245 16.07 2.86011" stroke="#A7ABB0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M22 4L12 14.01L9 11.01" stroke="#A7ABB0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  findAndRank: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#A7ABB0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="#A7ABB0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M17 11L19 13L23 9" stroke="#A7ABB0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  messageProspects: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="#A7ABB0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  done: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="12" fill="#297AF7"/>
  <path d="M17.3332 8L9.99984 15.3333L6.6665 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
  
}

const StepIcon = ({
  stepNumber,
  isActive,
  isDone
}) => {
  let element
  switch(stepNumber){
    case 1:
      element = svgs.addTribe
      break
    case 2:
      element = svgs.pickJd
      break
    case 3:
      element = svgs.pickJd
      break
    case 4:
      element = svgs.pickJd
      break
    case 5:
      element = svgs.reviseCriteria
      break
    case 6:
      element = svgs.messageProspects
      break

    default:
      element = svgs.pickJd
      break
  }

  if(isDone){
    
    element = svgs.done
  }

  return <div className={ (!isDone && isActive) ? 'svg-active' : !isDone ? 'svg-inactive' : ''}> {element} </div>
}

export default StepIcon