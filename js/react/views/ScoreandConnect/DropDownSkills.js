import React, {useState} from "react"
import { Button, Card, CardBody, Collapse } from 'reactstrap'

import SeeMoreSkills from './SeeMoreSkills'

import './style.css'

import DropDownIcon from '../../../../img/dropdown.svg'




const DropDownSkills = (props) => {
  
  const [Drop1, setDrop1] = useState(true)
  const [Drop2, setDrop2] = useState(false)
  const [Drop3, setDrop3] = useState(false)

  const { importance, skills_required} = props

  const must_haves = importance ? 
    importance.hasOwnProperty('must_haves') ? 
    importance.must_haves : [] : []
    
  const important = importance ? 
    importance.hasOwnProperty('important') ? 
    importance.important : [] : []

  const nice_to_haves = importance ? 
    importance.hasOwnProperty('nice_to_haves') ? 
    importance.nice_to_haves : [] : []
  
  const impMissing = skills_required ? 
    skills_required
      .filter(skl => skl
          .includes('Important') && 
          skl.indexOf(':')>2 &&
          !important.includes(skl.slice(0,skl.indexOf(':')).toLowerCase()))
              .map(skl => skl
                  .slice(0,skl.indexOf(':')).toLowerCase()) : []

  const mhMissing = skills_required ? 
    skills_required
      .filter(skl => skl
          .includes('Must Have') && 
          skl.indexOf(':')>2 &&
          !must_haves.includes(skl.slice(0,skl.indexOf(':')).toLowerCase()))
            .map(skl => skl
                .slice(0,skl.indexOf(':')).toLowerCase()) : []

  const nthMissing = skills_required ? 
    skills_required
      .filter(skl => skl
          .includes('Nice to Have') && 
          skl.indexOf(':')>2 && 
          !nice_to_haves.includes(skl.slice(0,skl.indexOf(':')).toLowerCase()))
            .map(skl => skl
                .slice(0,skl
                    .indexOf(':')).toLowerCase()) : []

  const mhSkillArray = [...mhMissing.map((skill, i) => <p key={'mhm'+i} className="missingTag">{skill}</ p>),
    ...must_haves.map((skill, i) => <p key={'mhf'+i} className="skillTag">{skill}</ p>)]

  
  const impSkillArray = [...impMissing.map((skill, i) => <p key={'impm'+i} className="missingTag">{skill}</ p>),
  ...important.map((skill, i) => <p key={'impf'+i} className="skillTag">{skill}</ p>)]

  const nthSkillArray = [...nthMissing.map((skill, i) => <p key={'nthm'+i} className="missingTag">{skill}</ p>),
  ...nice_to_haves.map((skill, i) => <p key={'nthf'+i} className="skillTag">{skill}</ p>)]

  const NA = <a className="notAvailable">Not Available</a>
  

  return(
    <React.Fragment>
      <Button 
        className="toggler" 
        outline 
        color="secondary" 
        id="togglerMH" 
        style={{border: "0px"}} 
        onClick={() => {
          setDrop1(!Drop1)
        }}>
        <div>
          <p className='boldInfo'>
            {`Must have  `}
          </p>
          <span className='verBar' />
          {`  ${must_haves.length} Found`}
          {mhMissing.length>0 ? ', ' : ''}
          <p className='missingInfo'>
            {mhMissing.length>0 ?
            `  ${mhMissing.length} missing  ` :
            ''}
          </p>
        </div>
      <img 
        src={DropDownIcon} 
        alt="drop down" 
        style={{transform: Drop1 ? "rotate(180deg)" : "rotate(0deg)"}}/>
      </Button>
      <Collapse isOpen={Drop1}>
        <Card className="dropcard">
          <CardBody className="dropcardbody">
            {skills_required ? 
            <>
              <SeeMoreSkills skillsArray={mhSkillArray} /> 
            </ >: 
            NA}
          </CardBody>
        </Card>
      </Collapse>
        <hr className="bar" />
      <Button 
        className="toggler" 
        outline 
        color="secondary" 
        id="togglerIMP" 
        style={{border: "0px"}} 
        onClick={() => {
          setDrop2(!Drop2)
        }}>
        <div>
          <p className='boldInfo'>
            {`Important  `}
          </p>
          <span className='verBar' />
          {`  ${important.length} Found`}
          {impMissing.length>0 ? ', ' : ''}
          <p className='missingInfo'>
            {impMissing.length>0 ?
            `  ${impMissing.length} missing  ` :
            ''}
          </p>
        </div>
      <img 
        src={DropDownIcon} 
        alt="drop down" 
        style={{transform: Drop2 ? "rotate(180deg)" : "rotate(0deg)"}}/>
      </Button>
      <Collapse isOpen={Drop2}>
        <Card className="dropcard">
          <CardBody className="dropcardbody">
            {skills_required ? 
            <>
              <SeeMoreSkills skillsArray={impSkillArray} /> 
            </>: 
            NA}
          </CardBody>
        </Card>
      </Collapse>
      <hr className="bar" />
      <Button 
        className="toggler" 
        outline 
        color="secondary" 
        id="togglerNTH" 
        style={{border: "0px"}} 
        onClick={() => {
          setDrop3(!Drop3)
        }}>
        <div>
          <p className='boldInfo'>
            {`Nice to Have  `}
          </p>
          <span className='verBar' />
          {`  ${nice_to_haves.length} Found`}
          {nthMissing.length>0 ? ', ' : ''}
          <p className='missingInfo'>
            {nthMissing.length>0 ?
            `  ${nthMissing.length} missing  ` :
            ''}
          </p>
        </div>
      <img 
        src={DropDownIcon} 
        alt="drop down" 
        style={{transform: Drop3 ? "rotate(180deg)" : "rotate(0deg)"}}/>
      </Button>
      <Collapse isOpen={Drop3}>
        <Card className="dropcard">
          <CardBody className="dropcardbody">
            {skills_required ? 
              <>
                <SeeMoreSkills skillsArray={nthSkillArray} /> 
              </ >: 
              NA}
          </CardBody>
        </Card>
      </Collapse>
    </ React.Fragment>
  )}

export default DropDownSkills