import React, { useState } from 'react'

import './style.css'
import optionsIcon from '../../../../img/more-vertical.svg'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'

const Trash = ({
  handleRemoveJob,
  jobId
}) => {

  const [isDdOpen, setDdOpen] = useState(false)

  const ddOptions = [
    {
      id: 1,
      text: 'Delete',
      label: 'delete'
    }]
  return (
    <div className="job-trash-container">
      {/* <img
        className="job-trash"
        src={optionsIcon}
        alt={'options'}
        onClick={() => setDdOpen(!isDdOpen)}
      />
      <div className='job-trash-dd'>
        <Dropdown isOpen={isDdOpen}>
          {
            ddOptions.map((item, i) =>
              <DropdownItem
                key={i}
                style={{ color: '#EF5555' }}
                onClick={() => {
                  setDdOpen(!isDdOpen)
                  handleRemoveJob(jobId)
                }
                }
              >
                {item.text}
              </DropdownItem>
            )
          }
        </Dropdown>
      </div> */}

      <Dropdown isOpen={isDdOpen} toggle={() => setDdOpen(!isDdOpen)}>
        <DropdownToggle className="job-trash" color='transparent' onClick={() => setDdOpen(!isDdOpen)}>
          <img
            src={optionsIcon}
            alt={'options'}
            onClick={() => setDdOpen(!isDdOpen)}
          />
        </DropdownToggle>
        <DropdownMenu className='job-trash-dd' >
          {
            ddOptions.map((item, i) =>
              <DropdownItem
                key={i}
                className='Additem'
                style={{ color: '#EF5555' }}
                onClick={() => {
                  setDdOpen(!isDdOpen)
                  handleRemoveJob(jobId)
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

export default Trash;