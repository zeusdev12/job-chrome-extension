import React, { useState, useEffect } from 'react'
import { Collapse } from 'reactstrap'
import { connect } from 'react-redux'


import './NotesSection.css'


import { Note } from '../../components/Note'
import { AddNewNote } from '../../components/AddNewNote'
import plusSmallIcon from '../../../../img/plus-small.svg'
import chevDown from '../../../../img/vector.svg'
import { addNote, decrementNoteCount, setRecentNote } from '../../actions/score'
import { manualApiCall } from '../../utils'
import Loader from '../../components/Loader'
import usePrevious from '../../customHooks/usePrevious'

const NotesSection = connect(state => ({
  notesMeta: state.score.notesMeta,
  loggedInUserName: state.auth.user.name
}))(({
  notesCount,
  notesMeta,
  recentNote,
  jobProfileId,
  jId,
  dispatch,
  loggedInUserName,
  setShowActivities,
  userName
}) => {

  const [viewAll, setViewAll] = useState(false)
  const [addNew, setAddNew] = useState(false)
  const [allNotes, setAllNotes] = useState([])
  const [loadingNotes, setLoadingNotes] = useState(false)


  const [isDeleting, setIsDeleting] = useState([])

  const isAddingPrev = usePrevious(notesMeta.isAddingNote.includes(jobProfileId))
  const isAdding = notesMeta.isAddingNote.includes(jobProfileId)


  useEffect(() => {
    if (isAddingPrev && !isAdding) {
      setAddNew(false)
    }
  }, [notesMeta.isAddingNote])

  const handleClickSave = async (note) => {

    dispatch(addNote({ jId, note, jobProfileId }))

    manualApiCall('/api/auth/user/activity/store',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "actionName": "ADD_NOTE",
          "jobId": jId
        })
      })

    setViewAll(false)

    // console.log('SAVE NOTE: ', { jobProfileId, note, jId })
  }

  const handleClickDelete = async ({ noteId, isLatest }) => {
    try {
      setIsDeleting([...isDeleting, noteId])
      const data = await manualApiCall(`/api/auth/job/profile/notes`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobId: jId,
          noteId: noteId,
          isRecent: isLatest,
          jobProfileId
        })
      })
      manualApiCall('/api/auth/user/activity/store',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "actionName": "DELETE_NOTE",
            "jobId": jId
          })
        })
      setIsDeleting(isDeleting.filter(item => item !== noteId))
      dispatch(decrementNoteCount(jobProfileId))

      if (!data.isRecent) {
        setAllNotes(allNotes.filter(item => item.id !== noteId))
      }

      if (data.isRecent && viewAll) {
        dispatch(setRecentNote({ jobProfileId, note: [allNotes.length > 0 ? allNotes[0] : null] }))
        setAllNotes(allNotes.filter((item, i) => i > 0))

      }
      if (data.isRecent && !viewAll) {
        dispatch(setRecentNote({ jobProfileId, note: data.recentNote ? [data.recentNote] : null }))
      }

    } catch (e) {
      setIsDeleting(isDeleting.filter(item => item !== noteId))
    }

    // console.log('HANDLE CLICK DELTE: ', { noteId, isLatest, jId })
    // dispatch(deleteNote({
    //   noteId,
    //   isRecent: isLatest,
    //   jId: jId,
    //   jobProfileId
    // }))
  }

  const handleClickViewAll = async () => {
    try {

      if (viewAll) {
        setViewAll(false)
        setShowActivities(true)
        return
      }

      setViewAll(true)
      setShowActivities(false)
      setLoadingNotes(true)

      const res = await manualApiCall(`/api/auth/job/profile/notes?jId=${jId}&jobProfileId=${jobProfileId}`, { method: 'GET' })
      // console.log('NOTES DATA: ', res.data)

      setAllNotes(res.data)
      setLoadingNotes(false)
    } catch (e) {
      setLoadingNotes(false)
    }
  }


  return (
    <div>
      <div className='note-header'>
        <div className='note-header-content'>
          <h1>Notes/Feedback</h1>
          <div />
          <p>{notesCount}</p>
        </div>
        <div onClick={() => setAddNew(!addNew)} >
          <img alt='n/a' src={plusSmallIcon} />
        </div>
      </div>
      <div className='note-content'>
        {addNew ?
          <AddNewNote
            onClickDiscard={() => setAddNew(false)}
            onClickSave={(args) => handleClickSave(args)}
            isAdding={isAdding}
          /> :
          <>
            <Note
              note={recentNote?.length > 0 ? recentNote[0] : null}
              isLatest={true}
              onDelete={handleClickDelete}
              isDeleting={isDeleting.includes(recentNote?.length > 0 ? recentNote[0].id : -1)}
              showDelete={loggedInUserName === recentNote?.length > 0 ? recentNote[0].userName : ''}
            />
            <Collapse isOpen={viewAll}>
              {loadingNotes ? <Loader color='blue' /> :
                <>
                  {allNotes.map((item, i) =>
                    <Note
                      note={item}
                      key={item.id || i}
                      isLatest={false}
                      onDelete={handleClickDelete}
                      isDeleting={isDeleting.includes(item.id)}
                      showDelete={loggedInUserName === item.userName}
                      userName={userName}
                    />
                  )}
                </>
              }
            </Collapse>

            {(notesCount > 1) &&
              <div style={{ cursor: 'pointer' }} onClick={() => handleClickViewAll()}>
                <span> {viewAll ? 'View Less' : 'View All Notes'} </span>
                <img
                  src={chevDown}
                  className={viewAll ? 'rotate180' : ''}
                />
              </div>
            }
          </>}
      </div>
    </div>
  )
})

export { NotesSection }