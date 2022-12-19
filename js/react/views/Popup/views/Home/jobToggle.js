import React, { useState } from 'react'

import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap'
import JobDropDownIcon from '../../../../../../img/job-toggle-small.svg'
// import Dropdown from '../../components/Dropdown'
// import DropdownItem from '../../components/DropdownItem'
import Tribe from '../../../../../../img/tribe-small.svg'
import SingleUser from '../../../../../../img/user-small.svg'

const JToggle = ({
    jobToggle,
    setJobToggle
}) => {

    const [isDdOpen, setDdOpen] = useState(false)

    const ddOptions = [
        {
            id: 1,
            text: 'My Jobs',
            label: 'my-jobs'
        },
        {
            id: 2,
            text: 'Tribe Jobs',
            label: 'tribe-jobs'
        },
    ]
    return (
        <div className="job-toggle-dropdown-toggle" onClick={() => setDdOpen(!isDdOpen)}>
            {/* <img
                className="jobs-type"
                src={jobToggle===1?SingleUser:Tribe}
                alt={'jobs-toggle-icon'}
            />
            <img
                src={JobDropDownIcon}
                alt={'toggle'}
                
                style={{ transform: isDdOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
            <div className='jobs-toggle'>
                <Dropdown isOpen={isDdOpen}>
                    {
                        ddOptions.map((item, i) =>
                            <DropdownItem
                                key={i}
                                onClick={() => { 
                                    setDdOpen(!isDdOpen)
                                    setJobToggle(i+1)
                                }}
                            >
                                {item.text}
                            </DropdownItem>
                        )
                    }
                </Dropdown>
            </div> */}


            <Dropdown isOpen={isDdOpen} toggle={() => setDdOpen(!isDdOpen)}>
                <DropdownToggle className="AdropDownButtons"color='transparent' onClick={() => setDdOpen(!isDdOpen)}>
                    <img
                        className="jobs-type"
                        src={jobToggle === 1 ? SingleUser : Tribe}
                        alt={'jobs-toggle-icon'}
                    />
                    <img
                        src={JobDropDownIcon}
                        alt={'toggle'}

                        style={{ transform: isDdOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                </DropdownToggle>
                <DropdownMenu className='jobs-toggle' >
                    {
                            ddOptions.map((item, i) =>
                                <DropdownItem
                                    key={i}
                                    className='Additem'
                                    onClick={() => {
                                        setDdOpen(!isDdOpen)
                                        setJobToggle(i + 1)
                                    }}
                                >
                                    {item.text}
                                </DropdownItem>
                            )

                        }
                </DropdownMenu>
            </Dropdown>
        </div>
    )
}

export default JToggle;