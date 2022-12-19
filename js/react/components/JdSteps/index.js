import React from 'react'
// import { connect } from 'react-redux'

// import { setStep } from '../../actions/jobDescription'
import StepIcon from '../StepIcon'
import './JdSteps.css'

const steps = [{
  id: 1,
  text: 'Assign Tribe',
  iconClass: 'icon-pickjd',
  icon: '../../../img/users.svg',
  svg: (isActive, isDone) =>
    <StepIcon
      stepNumber={1}
      isActive={isActive}
      isDone={isDone}
    />
}, 
// {
//   id: 2,
//   text: 'Set Company Preferences',
//   icon: '../../../img/file-text.svg',
//   iconClass: 'icon-pickjd',
//   svg: (isActive, isDone) =>
//     <StepIcon
//       stepNumber={2}
//       isActive={isActive}
//       isDone={isDone}
//     />
// }, 
{
  id: 2,
  text: 'Benchmark Prospects',
  icon: '../../../img/file-text.svg',
  iconClass: 'icon-pickjd',
  svg: (isActive, isDone) =>
    <StepIcon
      stepNumber={2}
      isActive={isActive}
      isDone={isDone}
    />

}, {
  id: 4,
  text: 'Pick a Job Description',
  icon: '../../../img/file-text.svg',
  iconClass: 'icon-pickjd',
  svg: (isActive, isDone) =>
    <StepIcon
      stepNumber={4}
      isActive={isActive}
      isDone={isDone}
    />

}, {
  id: 5,
  text: 'Revise Criteria',
  icon: '../../../img/user-check.svg',
  iconClass: 'icon-pickjd',
  svg: (isActive, isDone) =>
    <StepIcon
      stepNumber={5}
      isActive={isActive}
      isDone={isDone}
    />
}
// , {
//   id: 4,
//   text: 'Message Prospects',
//   icon: '../../../img/message-circle.svg',
//   iconClass: 'icon-pickjd',
//   svg: (isActive, isDone) =>
//     <StepIcon
//       stepNumber={4}
//       isActive={isActive}
//       isDone={isDone}
//     />
// }
]

const Step = ({ text, svg, isActive, isDone }) => {
  // console.log('IS DONE: ', isDone)
  return (
    <div className='step'>
      {svg(isActive, isDone)}
      <p className={(!isDone && isActive) ? 'step-active' : 'step-inactive'}>{text}</p>
    </div>
  )
}

const Breaker = () => <div className='step-breaker' />

const JdSteps = ({
  onStep = 6
}) => {

  return (
    <div className='jd-steps'>
      {steps.map((item, i) =>
        <React.Fragment key={item.id || i}>
          <Step
            
            {...item}
            isActive={i < onStep}
            isDone={((onStep - 1) - i) >= 1}
          />
          {(i !== steps.length - 1) && <Breaker />}
        </React.Fragment>)}
    </div>
  )
}

export default JdSteps