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

import {manualApiCall} from '../../utils'

import SortModule from './SortModule'


const SortSection = (props) => {

    
    const {
        Show,
        setShow,


        FirstSort,
        setFirstSort,
        SecondSort,
        setSecondSort,

        push,
        search,
        dispatch,
        
        activeTab,
       

    } = props


    const actionApiAdvFilter = (actionType) => {
      manualApiCall('/api/auth/user/activity/store', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
              "actionName": `APPLY_SORT_${actionType}`
          })
        })
    }

    const handleAdvancedFilterCancel = () => {
        
        manualApiCall('/api/auth/user/activity/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {"actionName": `SORT_CANCEL`}
            )
        })

        setShow(false)
    }

    const handleClickApply = () => {

        const newParams = {
          ...qs.parse(search),
          fS: FirstSort.sort,
          fSO: FirstSort.order,
          secS: SecondSort.sort,
          secSO: SecondSort.order}

        dispatch(unselectAllProspects())

        push(`/html/job.html?${qs.stringify(newParams)}`)

        window.scrollTo({top: 0, behavior: 'smooth'})
        setShow(false)
    }


    return (
        <React.Fragment>
            <Modal className="scoringFilterSection"
                isOpen={Show}>
                <ModalBody>
                <Card>
                <CardHeader className="filterNavHeader" style={{padding: "16px"}}>
                <nav className="filterNav">
                    <div className="leftFilterNav">
                        <h4 className="filterNavHeading">Sorting</h4>
                    </div>
                    <span className="rightFilterNav">
                        <Button 
                            outline 
                            color="primary" 
                            className="filterCancelButton"
                            onClick={handleAdvancedFilterCancel}>
                            Cancel
                        </Button>
                        <Button 
                            color="primary" 
                            className="filterApplyButton"
                            onClick={handleClickApply}>
                            Apply
                        </Button>
                    </span>
                </nav>
                </CardHeader>
                <CardBody> 
                    <div className="sortCardBodyContainer">
                    <span style={{borderRight:'1px solid #E6E9ED'}} >
                        <h3 className="sortBodyHeading">
                            Firt Sort by
                        </h3>
                        <SortModule 
                            inputName='First'
                            inputLabel="Title (Default)" 
                            sort='title_score'
                            order='desc'
                            SortState={FirstSort} 
                            setSortState={setFirstSort} />
                        <SortModule
                            inputName='First'
                            inputLabel="Skill" 
                            sort='skill_score'
                            order='desc'
                            SortState={FirstSort} 
                            setSortState={setFirstSort} />
                        <SortModule 
                            inputName='First'
                            inputLabel="Experience" 
                            sort='experience_score'
                            order='desc'
                            SortState={FirstSort} 
                            setSortState={setFirstSort} />
                        <SortModule
                            inputName='First'
                            inputLabel="Education" 
                            sort='education_score'
                            order='desc'
                            SortState={FirstSort} 
                            setSortState={setFirstSort} />
                        <SortModule 
                            inputName='First'
                            inputLabel="Industry" 
                            sort='industry_score'
                            order='desc'
                            SortState={FirstSort} 
                            setSortState={setFirstSort} />
                        {(()=>{
                           switch (activeTab) {
                                case 'ConnectMessaged':
                                    return   (
                                    <React.Fragment>
                                        <SortModule
                                            inputName='First'
                                            inputLabel="Messaged (Latest)" 
                                            sort='connectMessageAt'
                                            order='desc'
                                            SortState={FirstSort} 
                                            setSortState={setFirstSort} />
                                        <SortModule
                                            inputName='First'
                                            inputLabel="Messaged (Oldest)" 
                                            sort='connectMessageAt'
                                            order='asc'
                                            SortState={FirstSort} 
                                            setSortState={setFirstSort} />
                                    </React.Fragment>)
                                case 'FollowUp1st':
                                    return   (
                                    <React.Fragment>
                                        <SortModule
                                            inputName='First'
                                            inputLabel="First follow up (Latest)" 
                                            sort='followUpFirstMessageAt'
                                            order='desc'
                                            SortState={FirstSort} 
                                            setSortState={setFirstSort} />
                                        <SortModule
                                            inputName='First'
                                            inputLabel="First follow up (Oldest)" 
                                            sort='followUpFirstMessageAt'
                                            order='asc'
                                            SortState={FirstSort} 
                                            setSortState={setFirstSort} />
                                    </React.Fragment>)
                                case 'FollowUp2nd':
                                    return   (
                                    <React.Fragment>
                                        <SortModule
                                            inputName='First'
                                            inputLabel="Second follow up (Latest)" 
                                            sort='followUpSecondMessageAt'
                                            order='desc'
                                            SortState={FirstSort} 
                                            setSortState={setFirstSort} />
                                        <SortModule
                                            inputName='First'
                                            inputLabel="Second follow up (Oldest)" 
                                            sort='followUpSecondMessageAt'
                                            order='asc'
                                            SortState={FirstSort} 
                                            setSortState={setFirstSort} />
                                    </React.Fragment>)
                                case 'Replied':
                                    return   (
                                    <React.Fragment>
                                        <SortModule
                                            inputName='First'
                                            inputLabel="Replied (Latest)" 
                                            sort='repliedAt'
                                            order='desc'
                                            SortState={FirstSort} 
                                            setSortState={setFirstSort} />
                                        <SortModule
                                            inputName='First'
                                            inputLabel="Replied (Oldest)" 
                                            sort='repliedAt'
                                            order='asc'
                                            SortState={FirstSort} 
                                            setSortState={setFirstSort} />
                                    </React.Fragment>)
                                case 'Archived':
                                    return   (
                                    <React.Fragment>
                                        <SortModule
                                            inputName='First'
                                            inputLabel="Archived (Latest)" 
                                            sort='archivedAt'
                                            order='desc'
                                            SortState={FirstSort} 
                                            setSortState={setFirstSort} />
                                        <SortModule
                                            inputName='First'
                                            inputLabel="Archived (Oldest)" 
                                            sort='archivedAt'
                                            order='asc'
                                            SortState={FirstSort} 
                                            setSortState={setFirstSort} />
                                    </React.Fragment>)
                                case 'Downloaded':
                                    return   (
                                    <React.Fragment>
                                        <SortModule
                                            inputName='First'
                                            inputLabel="Downloaded (Latest)" 
                                            sort='downloadedAt'
                                            order='desc'
                                            SortState={FirstSort} 
                                            setSortState={setFirstSort} />
                                        <SortModule
                                            inputName='First'
                                            inputLabel="Downloaded (Oldest)" 
                                            sort='downloadedAt'
                                            order='asc'
                                            SortState={FirstSort} 
                                            setSortState={setFirstSort} />
                                    </React.Fragment>)
                           
                               default:
                                   return   (
                                    <React.Fragment>
                                        <SortModule
                                            inputName='First'
                                            inputLabel="Added (Latest)" 
                                            sort='addedAt'
                                            order='desc'
                                            SortState={FirstSort} 
                                            setSortState={setFirstSort} />
                                        <SortModule
                                            inputName='First'
                                            inputLabel="Added (Oldest)" 
                                            sort='addedAt'
                                            order='asc'
                                            SortState={FirstSort} 
                                            setSortState={setFirstSort} />
                                    </React.Fragment>)
                           }
                        })()}
                        <SortModule 
                            inputName='First'
                            inputLabel="Gender (Male)" 
                            sort='male'
                            order='desc'
                            SortState={FirstSort} 
                            setSortState={setFirstSort} />
                        <SortModule
                            inputName='First'
                            inputLabel="Gender (Female)" 
                            sort='female'
                            order='desc'
                            SortState={FirstSort} 
                            setSortState={setFirstSort} />
                        <SortModule 
                            inputName='First'
                            inputLabel="Age (Ascending)" 
                            sort='age'
                            order='asc'
                            SortState={FirstSort} 
                            setSortState={setFirstSort} />
                        <SortModule
                            inputName='First'
                            inputLabel="Age (Descending)" 
                            sort='age'
                            order='desc'
                            SortState={FirstSort} 
                            setSortState={setFirstSort} />
                    </span>
                    <span>
                        <h3 className="sortBodyHeading">
                            Second Sort by
                        </h3>
                        <SortModule 
                            inputName='Second'
                            inputLabel="Title" 
                            sort='title_score'
                            order='desc'
                            SortState={SecondSort} 
                            setSortState={setSecondSort} />
                        <SortModule
                            inputName='Second'
                            inputLabel="Skill (Default)" 
                            sort='skill_score'
                            order='desc'
                            SortState={SecondSort} 
                            setSortState={setSecondSort} />
                        <SortModule 
                            inputName='Second'
                            inputLabel="Experience" 
                            sort='experience_score'
                            order='desc'
                            SortState={SecondSort} 
                            setSortState={setSecondSort} />
                        <SortModule
                            inputName='Second'
                            inputLabel="Education" 
                            sort='education_score'
                            order='desc'
                            SortState={SecondSort} 
                            setSortState={setSecondSort} />
                        <SortModule 
                            inputName='Second'
                            inputLabel="Industry" 
                            sort='industry_score'
                            order='desc'
                            SortState={SecondSort} 
                            setSortState={setSecondSort} />
                        {(()=>{
                           switch (activeTab) {
                                case 'ConnectMessaged':
                                    return   (
                                    <React.Fragment>
                                        <SortModule
                                            inputName='Second'
                                            inputLabel="Messaged (Latest)" 
                                            sort='connectMessageAt'
                                            order='desc'
                                            SortState={SecondSort} 
                                            setSortState={setSecondSort} />
                                        <SortModule
                                            inputName='Second'
                                            inputLabel="Messaged (Oldest)" 
                                            sort='connectMessageAt'
                                            order='asc'
                                            SortState={SecondSort} 
                                            setSortState={setSecondSort} />
                                    </React.Fragment>)
                                case 'FollowUp1st':
                                    return   (
                                    <React.Fragment>
                                        <SortModule
                                            inputName='Second'
                                            inputLabel="First follow up (Latest)" 
                                            sort='followUpFirstMessageAt'
                                            order='desc'
                                            SortState={SecondSort} 
                                            setSortState={setSecondSort} />
                                        <SortModule
                                            inputName='Second'
                                            inputLabel="First follow up (Oldest)" 
                                            sort='followUpFirstMessageAt'
                                            order='asc'
                                            SortState={SecondSort} 
                                            setSortState={setSecondSort} />
                                    </React.Fragment>)
                                case 'FollowUp2nd':
                                    return   (
                                    <React.Fragment>
                                        <SortModule
                                            inputName='Second'
                                            inputLabel="Second follow up (Latest)" 
                                            sort='followUpSecondMessageAt'
                                            order='desc'
                                            SortState={SecondSort} 
                                            setSortState={setSecondSort} />
                                        <SortModule
                                            inputName='Second'
                                            inputLabel="Second follow up (Oldest)" 
                                            sort='followUpSecondMessageAt'
                                            order='asc'
                                            SortState={SecondSort} 
                                            setSortState={setSecondSort} />
                                    </React.Fragment>)
                                case 'Replied':
                                    return   (
                                    <React.Fragment>
                                        <SortModule
                                            inputName='Second'
                                            inputLabel="Replied (Latest)" 
                                            sort='repliedAt'
                                            order='desc'
                                            SortState={SecondSort} 
                                            setSortState={setSecondSort} />
                                        <SortModule
                                            inputName='Second'
                                            inputLabel="Replied (Oldest)" 
                                            sort='repliedAt'
                                            order='asc'
                                            SortState={SecondSort} 
                                            setSortState={setSecondSort} />
                                    </React.Fragment>)
                                case 'Archived':
                                    return   (
                                    <React.Fragment>
                                        <SortModule
                                            inputName='Second'
                                            inputLabel="Archived (Latest)" 
                                            sort='archivedAt'
                                            order='desc'
                                            SortState={SecondSort} 
                                            setSortState={setSecondSort} />
                                        <SortModule
                                            inputName='Second'
                                            inputLabel="Archived (Oldest)" 
                                            sort='archivedAt'
                                            order='asc'
                                            SortState={SecondSort} 
                                            setSortState={setSecondSort} />
                                    </React.Fragment>)
                                case 'Downloaded':
                                    return   (
                                    <React.Fragment>
                                        <SortModule
                                            inputName='Second'
                                            inputLabel="Downloaded (Latest)" 
                                            sort='downloadedAt'
                                            order='desc'
                                            SortState={SecondSort} 
                                            setSortState={setSecondSort} />
                                        <SortModule
                                            inputName='Second'
                                            inputLabel="Downloaded (Oldest)" 
                                            sort='downloadedAt'
                                            order='asc'
                                            SortState={SecondSort} 
                                            setSortState={setSecondSort} />
                                    </React.Fragment>)
                           
                               default:
                                   return   (
                                    <React.Fragment>
                                        <SortModule
                                            inputName='Second'
                                            inputLabel="Added (Latest)" 
                                            sort='addedAt'
                                            order='desc'
                                            SortState={SecondSort} 
                                            setSortState={setSecondSort} />
                                        <SortModule
                                            inputName='Second'
                                            inputLabel="Added (Oldest)" 
                                            sort='addedAt'
                                            order='asc'
                                            SortState={SecondSort} 
                                            setSortState={setSecondSort} />
                                    </React.Fragment>)
                           }
                        })()}
                        <SortModule 
                            inputName='Second'
                            inputLabel="Gender (Male)" 
                            sort='male'
                            order='desc'
                            SortState={SecondSort} 
                            setSortState={setSecondSort} />
                        <SortModule
                            inputName='Second'
                            inputLabel="Gender (Female)" 
                            sort='female'
                            order='desc'
                            SortState={SecondSort} 
                            setSortState={setSecondSort} />
                        <SortModule 
                            inputName='Second'
                            inputLabel="Age (Ascending)" 
                            sort='age'
                            order='asc'
                            SortState={SecondSort} 
                            setSortState={setSecondSort} />
                        <SortModule
                            inputName='Second'
                            inputLabel="Age (Descending)" 
                            sort='age'
                            order='desc'
                            SortState={SecondSort} 
                            setSortState={setSecondSort} />
                    </span>
                    </div>
                </CardBody>
                </Card>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default withRouter(connect(state => {
    return {
        
    }
})(SortSection))

