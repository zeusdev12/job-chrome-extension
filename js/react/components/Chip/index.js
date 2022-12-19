import React from 'react'
import checkSmall from '../../../../img/check-small.svg'
import plusSmall from '../../../../img/plus-small.svg'

import './Chip.css'

const Chip = ({
  isSelected = false,
  text = '',
  onClickIcon,
  disabled = false
}) => {
  return (
    <div
      className={
        isSelected ?
          'chip chip-selected' :
          disabled ? 'chip chip-disabled' :
            'chip chip-unselected'
      }
      onClick={() => {
        if (!disabled) {
          onClickIcon(text)
        }
      }}
    >
      {text}
      <img
        style={{ marginLeft: '14px', cursor: 'pointer' }}
        src={isSelected ? checkSmall : plusSmall}
      // onClick={() => onClickIcon(text)}
      />
    </div>
  )
}

export default Chip