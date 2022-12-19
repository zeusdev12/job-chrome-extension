import React from 'react'
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Label,
    Input,
    FormGroup,
    Modal,
    ModalBody
} from 'reactstrap'

import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import {
    setTitleScoringFilter,
    toggleTitleScoringFilter,
    setSkillScoringFilter,
    toggleSkillScoringFilter,
    setExperienceScoringFilter,
    toggleExperienceScoringFilter,
    setEducationScoringFilter,
    toggleEducationScoringFilter,
    setIndustryScoringFilter,
    toggleIndustryScoringFilter

} from '../../actions/score'

const ScoringFiltersSliderModule = ({
    dispatch,
    scoreValue,
    scoreActive,
    heading,
    scoreFlag = false,
    FilterCount,
    setFilterCount
    }) => {

    const handleChangeRange = (e) => {
        switch (heading) {
            case "Current Title":
                dispatch(setTitleScoringFilter(e.target.value))
                break;
            case "Skills":
                dispatch(setSkillScoringFilter(e.target.value))
                break;
            case "Experience":
                dispatch(setExperienceScoringFilter(e.target.value))
                break;
            case "Education":
                dispatch(setEducationScoringFilter(e.target.value))
                break;
            case "Industry":
                dispatch(setIndustryScoringFilter(e.target.value))
                break;
            default:
                console.log("INVALID SCORING FILTER TYPE")
                break;
        }
    } 
    const handleToggleScoreFilter = (e) => {

        setFilterCount(scoreActive ? 
            FilterCount - 1 :
            FilterCount + 1)

        switch (heading) {
            case "Current Title":
                dispatch(toggleTitleScoringFilter())
                break;
            case "Skills":
                dispatch(toggleSkillScoringFilter())
                break;
            case "Experience":
                dispatch(toggleExperienceScoringFilter())
                break;
            case "Education":
                dispatch(toggleEducationScoringFilter())
                break;
            case "Industry":
                dispatch(toggleIndustryScoringFilter())
                break;
            default:
                console.log("INVALID SCORING FILTER TYPE")
                break;
        }
    }
    return(
        <div className="ScoringFiltersSliderContainer" >
            <div className="advFilterCheckboxContainer">
                <Input
                    disabled={!scoreFlag}
                    className='checkBox'
                    type='checkbox'
                    onChange={handleToggleScoreFilter}
                    checked={scoreActive}
                />
                <h3 className="filterSubHeading">{heading}</h3>
                <h3 className="filterSliderValue">{scoreValue}%</h3>
            </div>
            <div className="sliderFilterContainer">
                <Input 
                    disabled={!scoreFlag}
                    className="sliderFilter"
                    type="range" 
                    name="range" 
                    value={scoreValue}
                    onChange={handleChangeRange}
                    />
            </div>
            <div className="sliderFilterLableContainer">
                <Label className="sliderFilterLable">
                    0%
                </Label>
                <Label className="sliderFilterLable">
                    100%
                </Label>
            </div>
        </div>
    )
}

export default withRouter(connect(state => {
    return {...state.jobDescription.jobLocation,
        ScoringFilters: state.score.scoringFilters    
    }
})(ScoringFiltersSliderModule))