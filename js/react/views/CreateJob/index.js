import React, { useEffect } from 'react'
import { Button } from 'reactstrap'
import { connect } from 'react-redux'

import { setStep, clearJobDescription,clearReviseJd,clearJobLocation } from '../../actions/jobDescription'
import { skipAssignTribe } from '../../actions/tribe'
import Header from '../../components/Header'
import JdSteps from '../../components/JdSteps'
import SetCompanyPreferences from '../../components/SetCompanyPreferences/SetCompanyPreferences'
import BenchmarkProspects from '../../components/BenchmarkProspects/BenchmarkProspects'
import PickJd from '../../components/PickJd'
import ReviseJd from '../../components/ReviseJd'
import Tribe from '../Tribe'

import './style.css'


const CreateJob = ({ step, auth,  notifications, isPopupOpened, history: { push }, dispatch }) => {

    const heading = `New Job`

    const handleClickCancel = () => {

        if (step === 1) {
            dispatch(skipAssignTribe())
        }
        if (step === 2) {
            dispatch(skipAssignTribe())
            dispatch(clearJobDescription())
        }
        if(step >= 3) { 
            dispatch(setStep(1))
            dispatch(skipAssignTribe())
            dispatch(clearJobDescription())
            dispatch(clearReviseJd())
        }
        push('/html/jobs.html')
    }

    useEffect(() => {
        dispatch(skipAssignTribe())
        dispatch(clearJobDescription())
        dispatch(clearJobLocation())
        dispatch(clearReviseJd())
        dispatch(setStep(1))
    }, [])

    return (
        <div>
            <Header {...auth.user} tabNumber={1} push={push} hideDD={(!isPopupOpened)} {...notifications}/>
            <div className='add-job-headerContainer'>
                <div className="add-job-top-container">
                    <h1 className="add-job-heading">
                        {heading}
                    </h1>
                    <Button
                        color="primary"
                        outline
                        className="add-job-cancel-button"
                        onClick={handleClickCancel}
                    >
                        Cancel
                    </Button>
                </div>
                <JdSteps onStep={step} />
            </div>
            <hr className='add-job-bottomBorder' />
            <div className='add-job-container'>
                {step === 1 && <Tribe isCreatingJob={true}/>}
                {/* {step === 2 && <SetCompanyPreferences />} */}
                {step === 2 && <BenchmarkProspects />}
                {step === 4 && <PickJd />}
                {step === 5 && <ReviseJd push={push} />}
            </div>
        </div>
    )
}

export default connect(state => ({
    step: state.jobDescription.step,
    auth: state.auth,
    notifications:state.tribe.notifications,
    isPopupOpened: _.get(state, 'user.data.isPopupOpened', false)
}))(CreateJob)