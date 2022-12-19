import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import JobTitleSection from './JobTitleSection'
import RequiredEducationSection from './RequiredEducationSection'
import ImportantSkillsSection from './ImportantSkillsSection'
import AdditionalSkillsSection from './AdditionalSkillsSection'
import JobLocationSection from './JobLocationSection'
import RequiredExperienceSection from './RequiredExperienceSection'
import IndustrySection from './IndustrySection'
import { getToken } from '../../utils/index'
import Loader from '../Loader'
import usePrevious from '../../customHooks/usePrevious'

import { manualApiCall } from '../../utils'
import { addJob, fetchJobs, setStep, clearJobLocation } from '../../actions/jobDescription'
import { updateJob } from '../../actions/editJob'

import './ReviseJd.css'

const ReviseJd = ({
  benchmarkState,
  jobData,
  data,
  jd,
  jobLocation,
  tribeMembers,
  dispatch,
  isAddingJob,
  isFetchingJobs,
  editJob,
  editMode = false,
  viewMode = false,
  jobId = null,
  push,
  permissions

}) => {
  // console.log('REVISE JD, DATA')
  const isAddingJobPrev = usePrevious(isAddingJob)
  const isFetchingJobsPrev = usePrevious(isFetchingJobs)

  const isUpdatingJobPrev = usePrevious(editJob.isUpdating)
  // const isUpdatedPrev = usePrevious(editJob.isUpdated)

  useEffect(() => {
    // console.log({ isAddingJob, isAddingJobPrev })
    if (isAddingJobPrev && !isAddingJob) {
      dispatch(fetchJobs())
      push('/html/continue-search.html')
    }
  }, [isAddingJob])

  useEffect(() => {
    if (isUpdatingJobPrev && !editJob.isUpdating) {
      dispatch(fetchJobs())
      push('/html/continue-search.html?jId=' + jobId)
    }
  }, [editJob.isUpdating])

  useEffect(() => {
    console.log({ isFetchingJobs, isFetchingJobsPrev })
    if (isFetchingJobsPrev && !isFetchingJobs) {
      dispatch(setStep(3))
    }
  }, [isFetchingJobs])
  
  const replaceString = (str) => {
    if (typeof str === 'string' || str instanceof String)
      return str.replace(/'/g, "''")
    else
      return ''
  }

  const formatProspects = (prospect) => {
    return {
      companyName: replaceString(prospect?.companyName),
      company_linkedin_url: replaceString(prospect?.company_linkedin_url),
      country_code: prospect?.country_code,
      current_company_name: replaceString(prospect?.current_company_name),
      current_company_size: prospect?.current_company_size,
      current_company_specialties: replaceString(prospect?.current_company_specialties),
      education: Array.isArray(prospect?.education) ? 
      prospect?.education.map(itm => ({
          degreeName: replaceString(itm?.degreeName),
          end: itm?.end,
          fieldOfStudy: replaceString(itm?.fieldOfStudy),
          schoolName: replaceString(itm?.schoolName),
          start: itm?.start
        })) : [],
      current_company_website: replaceString(prospect?.current_company_website),
      entityUrn: prospect?.entityUrn,
      experience: Array.isArray(prospect?.experience) ? 
      prospect?.experience.map(itm => ({
          company_name: replaceString(itm?.company_name),
          description: replaceString(itm?.description),
          end: itm?.end,
          industries: Array.isArray(itm?.industries) ? 
            itm.industries.map(ind => replaceString(ind)): [],
          location: replaceString(itm?.location),
          start: itm?.start,
          title: replaceString(itm?.title),
        })) : [],
        fieldOfStudy: replaceString(prospect?.fieldOfStudy),
        firstName: replaceString(prospect?.firstName),
        lastName: replaceString(prospect?.lastName),
        full_name: replaceString(prospect?.full_name),
        headline: replaceString(prospect?.headline),
        locality: replaceString(prospect?.locality),
        locationName: replaceString(prospect?.locationName),
        schoolName: replaceString(prospect?.schoolName),
        summary: replaceString(prospect?.summary),
        title: replaceString(prospect?.title),
        image_url: prospect?.image_url,
        industry: prospect?.industry,
        industryCode: prospect?.industryCode,
        languages: prospect?.languages,
        phone_number: prospect?.phone_number,
        picture: prospect?.picture,
        postalCode: prospect?.postalCode,
        primary_email: prospect?.primary_email,
        publicIdentifier: prospect?.publicIdentifier,
        scrapeType: prospect?.scrapeType,
        trackingId: prospect?.trackingId,
        versionTag: prospect?.versionTag,
        skills: Array.isArray(prospect?.skills) ? 
        prospect?.skills.map(itm => replaceString(itm)) : [],
    }
  }

  const getBenchmarkProspects = (stateObj) => {
    const similar = stateObj.similar.empty ? 
      'null' :
      formatProspects(stateObj.similar)
    const ideal = stateObj.ideal.length > 0 ?
      stateObj.ideal.map(prospect => formatProspects(prospect)) :
      'null'
    return {
      similar,
      ideal
    }
  }

  const onEdit = () => {
    dispatch(setStep(4))
    push('/html/edit.html?jId=' + jobId)
  }
  
  const handleClickContinue = () => {
    if (!isAddingJob) {
      const scoreTextMap = {
        1: 'Nice to Have',
        3: 'Important',
        5: 'Must Have'
      }
      // console.log('ADD JOB:  ', { jobData, data, jd })

      const benchmarkProspects = getBenchmarkProspects(benchmarkState)

      if (!jobLocation || !jobData.jobTitle.trim()) {
        const itemsToAdd = []
        if (!jobLocation) {
          itemsToAdd.push('job location')
        }
        if (!jobData.jobTitle.trim()) {
          itemsToAdd.push('job title')
        }
        alert(`please add ${itemsToAdd.join(' and ')}`)
        return
      }


      getToken()
        .then(token => {
          const payload = {
            token: token,
            tribeData: tribeMembers,
            jobDescription: data,
            jobID: 'add',
            stepperData: {},
            sampleProspectsProfiles: {},
            jdText: jd,
            jdType: 'text',
            jobLocation,
            companyName: '',
            jobTitle: jobData.jobTitle
          }
          const jobArray = []
          jobArray.push({
            data: jobData.education.map(item => ({ ...item, scoreText: scoreTextMap[item.score] })),
            tag: 'DEGREE_FULL',
            title: 'Degree Name'
          })
          jobArray.push({
            data: jobData.industries.map(item => ({ ...item, scoreText: scoreTextMap[item.score] })),
            tag: 'COMPANY_INDUSTRY_SPECIALTIES',
            title: 'Company and industry specialties'
          })
          jobArray.push({
            data: [],
            tag: 'COMPANY_NAME',
            title: 'company name'
          })
          // jobArray.push({
          //   data: [],
          //   tag: 'OTHER_SKILLS',
          //   title: 'Other Skills'
          // })
          jobArray.push(...data.filter(item => item.tag === 'OTHER_SKILLS'))
          jobArray.push({
            data: jobData.additionalTitles.filter(item => item.isSelected).map(item => item.name),
            tag: 'SUGGESTED_JOB_TITLES',
            title: 'Suggested job titles'
          })
          jobArray.push({
            data: jobLocation,
            tag: 'JOB_LOCATION',
            title: 'Job Location'
          })

          let jobPosition = data.filter(item => item.tag === 'JOB_POSITION')[0]
          if (jobPosition.data.length === 0) {
            jobPosition.data.push(jobData.jobTitle)
          } else if (!jobPosition.data.includes(jobData.jobTitle)) {
            jobPosition.data = [jobData.jobTitle, ...jobPosition.data]
          }

          jobArray.push(
            jobPosition
          )
          jobArray.push({
            data: [],
            tag: 'DEGREE',
            title: 'Degree'
          })
          jobArray.push({
            data: [],
            tag: 'SALARY',
            title: 'Salary'
          })
          jobArray.push({
            data: [
              ...jobData.technicalSkills.map(item => ({
                ...item,
                scoreText: scoreTextMap[item.score],
                modifier: ''
              })),
              ...jobData.additionalSkills.filter(item => item.score > 1).map(item => ({
                ...item,
                scoreText: scoreTextMap[item.score],
                modifier: ''
              }))
            ],
            suggested: data.filter(item => item.tag === 'TECHNICAL_SKILLS')[0].suggested,
            tag: 'TECHNICAL_SKILLS',
            title: 'Technical Skills'
          })
          jobArray.push(...data.filter(item => item.tag === 'SOFT_SKILLS'))
          jobArray.push({
            data: [],
            tag: 'PUBLISHING_SITE',
            title: 'Publishing Site'

          })
          jobArray.push({
            data: [],
            tag: 'DEGREE_MAJOR',
            title: 'Degree Major'
          })
          jobArray.push({
            data: jobData.experience.map(item => ({
              ...item,
              scoreText: scoreTextMap[item.score]
            })),
            tag: 'TECHNOLOGY_WORK_EXPERIENCE',
            title: 'Technology work experience'
          })

          payload.jobArray = jobArray

          if (!editMode) {
            payload['benchmarkProspects'] = benchmarkProspects
            dispatch(addJob(payload))
            dispatch(clearJobLocation())
          } else {
            manualApiCall('/api/auth/user/activity/store',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  "actionName": "EDITED_A_JOB",
                  "jobId": jobId
                })
              })
            dispatch(updateJob({ ...payload, jobID: jobId }))
            dispatch(clearJobLocation())
          }
          // console.log('PAYLOAD FOR ADD JOB: ', payload)
        })
        .catch(err => {
          console.log(err)
          alert(err.message)
        })
    }
  }
  return (
    <React.Fragment>
      {viewMode &&
        <div className='revise-heading'>
          <div style={{ margin: '0px 11.5% 0px 11.5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span>Revise Job Criteria</span>
            {permissions === "*" &&
              <Button
                outline
                color="primary"
                style={{ borderRadius: '8px' }}
                onClick={() => onEdit()}
              >
                Edit
        </Button>}
          </div>
        </div>
      }
      <div className="revise-jd-root-container">

        <div className='revise-jd-root'>
          <JobTitleSection
            title={jobData.jobTitle}
            additionalTitles={jobData.additionalTitles}
            dispatch={dispatch}
            viewMode={viewMode}
          />

          <hr className='jd-bottomBorder' />

          <ImportantSkillsSection
            technicalSkills={jobData.technicalSkills}
            dispatch={dispatch}
            viewMode={viewMode}
          />

          <hr className='jd-bottomBorder' />

          {!viewMode &&
            <><AdditionalSkillsSection
              additionalSkills={jobData.additionalSkills}
              dispatch={dispatch}
              viewMode={viewMode}
            />
              <hr className='jd-bottomBorder' />
            </>
          }

          <RequiredExperienceSection
            experience={jobData.experience}
            dispatch={dispatch}
            viewMode={viewMode}
          />

          <hr className='jd-bottomBorder' />

          <IndustrySection
            industries={jobData.industries}
            dispatch={dispatch}
            viewMode={viewMode}
          />

          <hr className='jd-bottomBorder' />

          <RequiredEducationSection
            education={jobData.education}
            dispatch={dispatch}
            viewMode={viewMode}
          />

          <hr className='jd-bottomBorder' />

          <JobLocationSection viewMode={viewMode} />

        </div>
        <div className='revise-footer'>
          {/* <p>Cancel</p> */}

          {!viewMode &&
            <button
              onClick={handleClickContinue}>

              {(isAddingJob || isFetchingJobs || editJob.isUpdating) ? <Loader /> : 'Continue'}
            </button>
          }
        </div>
      </div>
    </React.Fragment>
  )
}

export default connect(state => ({
  ...state.jobDescription.revise,
  benchmarkState: state.jobDescription.benchmarkProspects,
  jd: state.jobDescription.choose.selectedJdText,
  jobLocation: state.jobDescription.jobLocation.locationState,
  editJob: state.editJob,
  tribeMembers: state.tribe.selected.tribeMembers
}))(ReviseJd)