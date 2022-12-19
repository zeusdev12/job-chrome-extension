import React, {useState, useRef, useCallback, useEffect} from "react";
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
import InputRange from 'react-input-range';

import {callLinkedinApi} from '../../utils'

import './style.css'

import qs from 'query-string'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import {
    unselectAllProspects,
    clearScoringFilter

} from '../../actions/score'

import Autosuggest from 'react-autosuggest'

import {manualApiCall} from '../../utils'

import ScoringFiltersSliderModule from './ScoringFiltersSliderModule'


const ScoringFilterSection = (props) => {

    
    const {
       
        dispatch,
        
        FilterCount,
        setFilterCount,

        ScoringFilters,


        titleFlag,
        skillFlag,
        industryFlag,
        experienceFlag,
        educationFlag

    } = props


    return (
        <React.Fragment>
            <h3 className="ScoringFiltersSliderModuleHeading">
                Show prospects that have scoring greater than: 
            </h3>
            <ScoringFiltersSliderModule 
                scoreFlag={titleFlag}
                dispatch={dispatch}
                scoreValue={ScoringFilters.titleScore.value}
                scoreActive={ScoringFilters.titleScore.active} 
                heading={"Current Title"}
                FilterCount={FilterCount}
                setFilterCount={setFilterCount}
            />
            <ScoringFiltersSliderModule 
                scoreFlag={skillFlag}
                dispatch={dispatch}
                scoreValue={ScoringFilters.skillScore.value}
                scoreActive={ScoringFilters.skillScore.active} 
                heading={"Skills"}
                FilterCount={FilterCount}
                setFilterCount={setFilterCount}
            />
            <ScoringFiltersSliderModule 
                scoreFlag={experienceFlag}
                dispatch={dispatch}
                scoreValue={ScoringFilters.experienceScore.value}
                scoreActive={ScoringFilters.experienceScore.active} 
                heading={"Experience"}
                FilterCount={FilterCount}
                setFilterCount={setFilterCount}
            />
            <ScoringFiltersSliderModule 
                scoreFlag={educationFlag} 
                dispatch={dispatch}
                scoreValue={ScoringFilters.educationScore.value}
                scoreActive={ScoringFilters.educationScore.active} 
                heading={"Education"}
                FilterCount={FilterCount}
                setFilterCount={setFilterCount}
            />
            <ScoringFiltersSliderModule 
                scoreFlag={industryFlag}
                dispatch={dispatch}
                scoreValue={ScoringFilters.industryScore.value}
                scoreActive={ScoringFilters.industryScore.active} 
                heading={"Industry"}
                FilterCount={FilterCount}
                setFilterCount={setFilterCount}
            />
        </React.Fragment>
  )
}

export default withRouter(connect(state => {
    return {...state.jobDescription.jobLocation,
        ScoringFilters: state.score.scoringFilters    
    }
})(ScoringFilterSection))

