import React, { useEffect, useState } from 'react'

import {Button } from 'reactstrap'
import './style.css'


const AddTribe = ({
    jobData,
    search,
    handleAddTribe
}) => {

    return (
        <div className="my-tribe-add-container-secondary">
            <b className="my-tribe-add-container-no-members-secandory"> 
                No Members
            </b>
            <p className="">
            Maximize your efficiency by adding team members to your tribe
            </p>
            <Button
            color="primary"
            outline
            className="my-tribe-add-container-add-members"
            onClick={handleAddTribe}
            >
                Add Members
            </Button>
        </div>


    )
}

export default AddTribe;