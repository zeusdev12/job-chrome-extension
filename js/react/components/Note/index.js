import React from 'react'
import moment from 'moment'

import './note.css'
import Loader from '../Loader'

const Note = ({
  note,
  onDelete,
  isLatest,
  isDeleting,
  userName
}) => {
  return (
    note ?
      <div>
        <p style={{ marginBottom: '8px' }}>{note.note}</p>
        <div className='note-meta'>
          <div>
            <p style={{
              marginRight: '7px'
            }}>{userName===note.userName?'You':note.userName.split(' ',1)}</p> | {moment(note.createdAt).format('h:mm a, D MMM')}
          </div>
          <div>
            <p onClick={() => onDelete({ noteId: note.id, isLatest: isLatest })}>
              {isDeleting ? <Loader color='blue' /> : 'Delete'}
            </p>
          </div>
        </div>
      </div> : null
  )
}

export { Note }