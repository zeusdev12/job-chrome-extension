import React ,{useState} from 'react'

import './style.css'
import optionsIcon from '../../../../../img/more-vertical.svg'
import Dropdown from '../../../components/Dropdown'
import DropdownItem from '../../../components/DropdownItem'

const Trash = ({
    handleRemoveMember,
    userId
}) => {

    const [isDdOpen, setDdOpen] = useState(false)

    const ddOptions = [
        {
        id: 1,
        text: 'Delete',
        label: 'delete'
        // clickHandler: () => {
        //   chrome.runtime.sendMessage({
        //     type: MESSAGE_TYPES.LOG_ACTIVITY,
        //     payload: ACTIVITY_TYPES.DELETE_TRIBE_MEMBER
        //   })
        //   
        // }
      }]
    return (
        <div className="trash-container">
        <img
        className="tribe-trash"
        src={optionsIcon}
        alt={'options'}
        onClick={() => setDdOpen(!isDdOpen)}
      />
        <div className='tribe-trash-dd'>
        <Dropdown isOpen={isDdOpen}>
          {
            ddOptions.map((item, i) =>
              <DropdownItem
                key={i}
                style={{color: '#EF5555' }}
                onClick={() => {
                  setDdOpen(!isDdOpen)
                  handleRemoveMember(userId)
                }
                }
              >
                  {item.text}
              </DropdownItem>
            )
          }
        </Dropdown>
      </div>
      </div>
    )
}

export default Trash;