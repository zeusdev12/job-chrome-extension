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
    

} from '../../actions/score'

const SortModule = ({
    dispatch,
    inputName,
    inputLabel,
    SortState,
    setSortState,
    sort,
    order,
   
    }) => {
    
    const handleRadioChange = (e) => {
        console.log("====================================")
        console.log(e.target.checked)
        setSortState({sort, order})
    }
        

    return(
        <div className="SortModuleContainer" >
        <FormGroup tag="fieldset">
            <FormGroup 
                className="SortMuduleFormGroup"  
                check>
            <Label 
                className="SortMuduleRadioLabel"  
                check>
                <Input
                    checked={sort===SortState.sort && order===SortState.order}
                    className="SortMuduleRadioInput" 
                    type="radio" 
                    onChange={handleRadioChange}
                    name={inputName}/>{' '}
                {inputLabel}
            </Label>
            </FormGroup>
        </FormGroup>    
        </div>
    )
}

export default withRouter(connect(state => {
    return {
        
    }
})(SortModule))