import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Loader from '../Loader'

import { 
    setStep, 
    fetchIdeal, 
    fetchSimilar, 
    clearBenchmark, 
    clearSimilar, 
    clearIdeal} from '../../actions/jobDescription'

import './BenchmarkProspects.css'
import { manualApiCall } from '../../utils'
import { Button, Card, CardHeader, Input } from 'reactstrap'

import addIcon from '../../../../img/blue-plus-small.svg' 
import DisplayPlaceholder from '../../../../img/displayPlaceholder.svg'
import closeIcon from '../../../../img/close.svg'


const Footer = ({
    dispatch
}) => {
    const handleSkip = () => {
        dispatch(clearBenchmark())
        dispatch(setStep(4))
    }
    const handleContinue = () => {
        dispatch(setStep(4))
    }
    return <div className="benchmarkFooter">
        <div>
        <a 
            onClick={handleSkip}
        >
            Skip
        </a>
        <Button 
            color='primary'
            onClick={handleContinue}
        >
            Continue
        </Button>
        </div>
    </div>
}

const ProspectCard = ({
    type,
    dispatch,
    prospect
}) => {
    const {
        full_name,
        headline,
        picture,
        publicIdentifier
    } = prospect

    const [DisplayPictureURL, setDisplayPictureURL] = useState(picture || false)

    useEffect(() => setDisplayPictureURL(picture  || false), [picture])
    
    const handleClose = () => {
        switch (type) {
            case 'similar':
                dispatch(clearSimilar())
                break;
            case 'ideal':
                dispatch(clearIdeal(publicIdentifier))
                break;
            default:
                break;
        }
    }

    return <Card className="benchmarkProspectCard">
         <CardHeader className="benchmarkProspectCardHeader">
            <img 
                src={DisplayPictureURL ? DisplayPictureURL : DisplayPlaceholder}
                onError={() => setDisplayPictureURL(DisplayPlaceholder)} />
            <span>
                <div >
                    <span>
                        <h3>
                            {full_name}
                        </h3>
                    </span>
                    <Button 
                        onClick={handleClose}
                        color='secondary'
                        outline >
                        <img src={closeIcon} />
                    </Button>
                </div>
                <p>
                    {headline.replace(/\sat\s/, '@')}
                </p>
            </span>
         </CardHeader>
    </Card>

}

const InputField = ({
    prospects = [],
    type,
    isLoading,
    dispatch,
}) => {

    const [linkInput, setlinkInput] = useState("")

    const handleChange = (e) => {
        setlinkInput(e.target.value)
    }
    const handleClick = () => {
        if(linkInput.search(/linkedin.com\/in\/[\w\-]+/g)>=0){
            const publicIdentifier = linkInput.match(/in\/[\w\-]+/g)[0].split('/')[1]
            switch (type) {
                case 'similar':
                    dispatch(fetchSimilar(publicIdentifier))
                    break;
                case 'ideal':
                    if(prospects.every(prospect => prospect?.publicIdentifier!==publicIdentifier))
                        dispatch(fetchIdeal(publicIdentifier))
                    else
                        alert('Prospect already added!')
                    break;
                default:
                    break;
            }
        }
        else
            alert("Invalid linkedin url!")


    }
    return (
        <span className="benchmarkInputFieldContainer">
            <Input 
                onChange={handleChange}
                value={linkInput}
                type="text" 
                name="profileLink" 
                placeholder="Their LinkedIn URL" />
            <Button
                disabled={linkInput==='' || isLoading}
                outline
                color='primary' 
                onClick={handleClick}>
                {isLoading ? 
                    <Loader width='24px' height='24px' color='#297AF7' /> :
                    <img src={addIcon} />}
            </Button>
        </span>
    )

}



const Similar = ({
    dispatch,
    isLoading,
    isDataAvailable,
    prospect,
}) => {

    return <div className="benchmarkModule">
        <h3>
            Enter a similar profile
        </h3>
        <p>
            They should be anyone from the company you’re hiring for, with as similar a role as possible. This helps us get quality prospects for you.
        </p>
        {prospect.empty ?
            <InputField 
                type='similar'
                isLoading={isLoading}
                dispatch={dispatch}
            />:
            <ProspectCard 
                type = 'similar'
                dispatch = {dispatch}
                prospect = {prospect} />}
        <hr />
    </div>
}



const Ideal = ({
    isLoading,
    isDataAvailable,
    dispatch,
    prospects
}) => {
    
    return <div className="benchmarkModule">
       <h3>
            Enter ideal prospects
       </h3>
       <p>
            They can be anyone that fit your definition of an ideal prospect fit for this job. This also helps us get quality prospects for you.
       </p>
       {prospects.length > 0 && <div className="benchmarkIdealPropsectsContainer">
            {prospects.map(prospect => 
                <ProspectCard 
                    type = 'ideal'
                    dispatch = {dispatch}
                    prospect = {prospect}/>
            )}
        </div>}
       {prospects.length < 6 && 
            <InputField 
                prospects={prospects}
                type='ideal'
                isLoading={isLoading}
                dispatch={dispatch}
            />}

    </div>
}


const BenchmarkProspects = ({
  dispatch,
  benchmarkState
}) => {

// useEffect(() => {
    
//       dispatch(setStep(4))
      
// }, [])

  // console.log('revise: ', revise)

  return (
    <div className='benchmarkContainer'>
        <div className="benchmarkModuleContainer">
        <Similar 
            isLoading={benchmarkState.isSimilarLoading}
            isDataAvailable={benchmarkState.isSimilarDataAvailable}
            prospect={benchmarkState.similar}
            dispatch={dispatch}
        />
        <Ideal 
            isLoading={benchmarkState.isIdealLoading}
            isDataAvailable={benchmarkState.isIdealDataAvailable}
            prospects={benchmarkState.ideal}
            dispatch={dispatch}
        />
        </div>
        <Footer
            dispatch={dispatch}
        />
    </div>
  )
}

export default connect(state => ({
    benchmarkState: state.jobDescription.benchmarkProspects
}))(BenchmarkProspects)