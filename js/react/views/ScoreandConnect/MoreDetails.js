import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Row, Col } from 'reactstrap'
import './style.css'
import { manualApiCall } from '../../utils'


const MoreDetails = (props) => {
  const {
    data,
    moreDetailsPopUp,
    jobId,
    setMoreDetailsPopUp } = props
  const { scoring, skills } = data
  const [toggle, setToggle] = useState(moreDetailsPopUp)

  const edReq = scoring?.education_required ?
    scoring?.education_required.map(ed => {
      return {
        educationReq: ed.includes(': Must Have') ?
          ed.slice(0, -11) : ed.includes(': Nice to Have') ?
            ed.slice(0, -14) : ed.includes(': Important') ?
              ed.slice(0, -11) : '',
        tagReq: ed.includes(': Must Have') ?
          ed.slice(-9) : ed.includes(': Nice to Have') ?
            ed.slice(-12) : ed.includes(': Important') ?
              ed.slice(-9) : '',
      }
    }) : []

  const expReq = scoring?.experience_required ?
    scoring?.experience_required.map(exp => {
      return {
        experienceReq: exp.includes(': Must Have') ?
          exp.slice(0, -11) : exp.includes(': Nice to Have') ?
            exp.slice(0, -14) : exp.includes(': Important') ?
              exp.slice(0, -11) : '',
        tagReq: exp.includes(': Must Have') ?
          exp.slice(-9) : exp.includes(': Nice to Have') ?
            exp.slice(-12) : exp.includes(': Important') ?
              exp.slice(-9) : ''
      }
    }) : []

  const skillReq = scoring?.skills_required ?
  scoring?.skills_required.map(skills => {
      return {
        sklReq: skills.includes(': Must Have') ?
          skills.slice(0, -11) : skills.includes(': Nice to Have') ?
            skills.slice(0, -14) : skills.includes(': Important') ?
              skills.slice(0, -11) : '',
        tagReq: skills.includes(': Must Have') ?
          skills.slice(-9) : skills.includes(': Nice to Have') ?
            skills.slice(-12) : skills.includes(': Important') ?
              skills.slice(-9) : ''
      }
    }) : []


  return (
    <>
      <Button
        className="details"
        outline
        color="secondary"
        onClick={() => {
                
          manualApiCall('/api/auth/user/activity/store', 
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              "actionName":"MORE_DETAILS",
              "jobId" :jobId
            })
          })

          setToggle(!toggle)
          setMoreDetailsPopUp(!moreDetailsPopUp)
        }}>
        More Details
      </Button>
      <Modal
        placement='bottom'
        isOpen={toggle}
        toggle={() => {
          setToggle(!toggle)
          setMoreDetailsPopUp(!moreDetailsPopUp)
        }}
        className='moreDetailContainer'>
        <ModalHeader
          className='moreDetailHead'
          toggle={() => {
            setToggle(!toggle)
            setMoreDetailsPopUp(!moreDetailsPopUp)
          }}>
          <p className='moreDetailHeading'>More Details</p>
        </ModalHeader>
        <ModalBody className='moreDetailBody'>
          <Row className='detailSection'>
            <Col className='detailRequire'>
              <h2 className='moreDetailHeading'>Score Description</h2>
              <div><p className='requiredDetails'>
                Total Score
              </p></div>
              <div><p className='requiredDetails'>
                Education Score
              </p></div>
              <div><p className='requiredDetails'>
                Experience Score
              </p></div>
              <div><p className='requiredDetails'>
                Skills Score
              </p></div>
              <div><p className='requiredSumDetails'>
                Title Match Score Boost
              </p></div>
            </Col>
            <Col className='detailFound'>

              <div className='foundDetails'>
                {`${Math.round(scoring?.final_score ?? 0)} / 50`}
              </div>

              <div className='foundDetails'>
                {`${Math.round(scoring?.education_score ?? 0)} / ${scoring?.education_total ?? 0}`}
              </div>

              <div className='foundDetails'>
                {`${Math.round(scoring?.experience_score ?? 0)} / ${scoring?.experience_total ?? 0}`}
              </div>

              <div className='foundDetails'>
                {`${Math.round(scoring?.skill_score ?? 0)} / ${scoring?.skill_total ?? 0}`}
              </div>

              <div className='foundSumDetailsContainer' >
                {`${scoring?.adjustment_factor ?? 0}%`}
              </div>

            </Col>
          </Row><br />
          <Row className='detailSection'>
            <Col className='detailRequire'>
              <h2 className='moreDetailHeading'>Education</h2>
              <h3 className='moreDetailSubHeading'>Required</h3>
              {edReq.filter(r => r.tagReq === 'Must Have').length > 0 &&
                <div>
                  <p className='detailTagHeading'>Must Have</p>
                  {edReq.filter(r => r.tagReq === 'Must Have')
                    .map((req, i) => <div key={i}>
                      <p className='requiredDetails'>{req.educationReq}</p>
                    </div>)}
                </ div>}
              {edReq.filter(r => r.tagReq === 'Important').length > 0 &&
                <div>
                  <p className='detailTagHeading'>Important</p>
                  {edReq.filter(r => r.tagReq === 'Important')
                    .map((req, i) => <div key={i}>
                      <p className='requiredDetails'>{req.educationReq}</p>
                    </div>)}
                </ div>}
              {edReq.filter(r => r.tagReq === 'Nice to Have').length > 0 &&
                <div>
                  <p className='detailTagHeading'>Nice to Have</p>
                  {edReq.filter(r => r.tagReq === 'Nice to Have')
                    .map((req, i) => <div key={i}>
                      <p className='requiredDetails'>{req.educationReq}</p>
                    </div>)}
                </ div>}
            </Col>
            <Col className='detailFound'>
              <h3 className='moreDetailSubHeading'>Found</h3>
              {scoring?.education_profile &&
                scoring?.education_profile.map((ed, i) => <div key={i}>
                  <p className='foundDetails'>{ed}</p>
                </div>)
              }
            </Col>
          </Row><br />
          <Row className='detailSection'>
            <Col className='detailRequire'>
              <h2 className='moreDetailHeading'>Experience</h2>
              <h3 className='moreDetailSubHeading'>Required</h3>
              {expReq.filter(r => r.tagReq === 'Must Have').length > 0 &&
                <div>
                  <p className='detailTagHeading'>Must Have</p>
                  {expReq.filter(r => r.tagReq === 'Must Have')
                    .map((req, i) => <div key={i}>
                      <p className='requiredDetails'>{req.experienceReq}</p>
                    </div>)}
                </ div>}
              {expReq.filter(r => r.tagReq === 'Important').length > 0 &&
                <div>
                  <p className='detailTagHeading'>Important</p>
                  {expReq.filter(r => r.tagReq === 'Important')
                    .map((req, i) => <div key={i}>
                      <p className='requiredDetails'>{req.experienceReq}</p>
                    </div>)}
                </ div>}
              {expReq.filter(r => r.tagReq === 'Nice to Have').length > 0 &&
                <div>
                  <p className='detailTagHeading'>Nice to Have</p>
                  {expReq.filter(r => r.tagReq === 'Nice to Have')
                    .map((req, i) => <div key={i}>
                      <p className='requiredDetails'>{req.experienceReq}</p>
                    </div>)}
                </ div>}

            </Col>
            <Col className='detailFound'>
              <h3 className='moreDetailSubHeading'>Found</h3>
              {scoring?.experience_found &&
                scoring?.experience_found.map((exp, i) => <div key={i}>
                  <p className='foundDetails'>{exp}</p>
                </div>)
              }
            </Col>
          </Row><br />
          <Row className='detailSection'>
            <Col className='detailRequire'>
              <h2 className='moreDetailHeading'>Skills</h2>
              <h3 className='moreDetailSubHeading'>Required</h3>
              {skillReq.filter(r => r.tagReq === 'Must Have').length > 0 && <>
                <p className='detailTagHeading'>Must Have</p>
                <div className='detailSkillContainer'>
                  {skillReq.filter(r => r.tagReq === 'Must Have')
                    .map((req, i) => <p key={i} className='detailSkill'>{req.sklReq}</p>)}
                </ div></>}
              {skillReq.filter(r => r.tagReq === 'Important').length > 0 && <>
                <p className='detailTagHeading'>Important</p>
                <div className='detailSkillContainer'>
                  {skillReq.filter(r => r.tagReq === 'Important')
                    .map((req, i) => <p key={i} className='detailSkill'>{req.sklReq}</p>)}
                </ div></>}
              {skillReq.filter(r => r.tagReq === 'Nice to Have').length > 0 && <>
                <p className='detailTagHeading'>Nice to Have</p>
                <div className='detailSkillContainer'>
                  {skillReq.filter(r => r.tagReq === 'Nice to Have')
                    .map((req, i) => <p key={i} className='detailSkill'>{req.sklReq}</p>)}
                </ div></>}

            </Col>
            <Col className='detailFound'>
              <h3 className='moreDetailSubHeading'>Found</h3>
              {scoring?.skills_profile && scoring?.skills_profile.length > 0 &&
                <div className='detailSkillContainer' >
                  {scoring?.skills_profile.map((skl, i) =>
                    <p key={i} className='detailSkill'>{skl}</p>)}
                </div>}
            </Col>
          </Row><br />
          <Row className='detailSection'>
            <Col className='detailRequire'>
              <h3 className='moreDetailSubHeading'>Total Skills</h3>
              {skills &&
                <div className='detailSkillContainer' >
                  {skills.map((skl, i) => (
                    <p key={i} className='detailSkill'>
                      {skl}
                    </p>))}
                  {scoring?.skills_profile && scoring?.skills_profile.length > 0 &&
                    scoring?.skills_profile.map((skl, i) => (
                      <p key={`moreSkills${i}`} className='detailSkill'>
                        {skl}
                      </p>
                    ))}
                </div>
              }
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  )

}

export default MoreDetails