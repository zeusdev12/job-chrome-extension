import React, { useState, useEffect } from 'react'
import { Input } from 'reactstrap'
import './EditAndSend.css'
import linkedinIcon from '../../../../../../img/LinkedinIcon.svg'
import DisplayPlaceholder from '../../../../../../img/displayPlaceholder.svg'

// isSendingEdited={isSendingEdited}
// editedSentCount={editedSentCount}
// isEditedSent={isEditedSent}
// setView={setView}

const EditAndSend = ({
  recepients,
  messages,
  setMessages,
  selected,
  setSelected,
  isSendingEdited,
  editedSentCount,
  isEditedSent,
  setView,
  user
}) => {


  console.log('EDIT AND SEND: ', { recepients, messages })

  // const [] = useState(recep)
  // const [messages, setMessages] = useState({})
  const [CharLimitCounters, setCharLimitCounters] = useState({})
  // const [errorType, seterrorType] = useState("")

  useEffect(() => {
    // const msgs = recepients.map(item => ({ profileUrl: item.recepient.profileUrl, message: item.message }))
    const msgs = recepients.reduce((obj, item) => {

      const variables = {
        firstName: item.recepient.firstName,
        lastName: item.recepient.lastName,
        full_name: item.recepient.full_name,
        jobTitle: item.recepient.jobTitle,
        headline: item.recepient.headline,
        name: user.name,
        schoolName: item.recepient.education && item.recepient.education[0] ? item.recepient.education[0].schoolName : null,
        company: item.recepient.currentCompanyName ? item.recepient.currentCompanyName : null
      }

      const msg = item.message.replace(/{{.First_Name}}/g, variables.firstName || '{{.First_Name}}')
        .replace(/{{.Last_Name}}/g, variables.lastName || '{{.Last_Name}}')
        .replace(/{{.Full_Name}}/g, variables.full_name || '{{.Full_Name}}')
        .replace(/{{.Current_Title}}/g, variables.headline || '{{.Current_Title}}')
        .replace(/{{.Job_Title}}/g, variables.jobTitle || '{{.Job_Title}}')
        .replace(/{{.My_Name}}/g, variables.name || '{{.My_Name}}')
        .replace(/{{.My_First_Name}}/g, variables.name.split(" ")[0] || '{{.My_First_Name}}')
        .replace(/{{.My_Full_Name}}/g, variables.name || "{{.My_Full_Name}}")
        .replace(/{{.User_Name}}/g, variables.name || '{{.User_Name}}')
        .replace(/{{.School_Name}}/g, variables.schoolName || '{{.School_Name}}')
        .replace(/{{.Current_Company}}/g, variables.company || '{{.Current_Company}}')

      setCharLimitCounters(prev => ({ ...prev, [item.recepient.id]: msg.length }))

      return { ...obj, [item.recepient.id]: { message: msg, degree: item.degree } }
    }, {})
    setMessages(msgs)
  }, [])

  const handleChangeMsg = (e, pId) => {
    setCharLimitCounters({ ...CharLimitCounters, [pId]: e.target.value.length })

    if (e.target.value.length > 300) {
      setSelected(selected.filter(it => it !== pId))
    }


    setMessages({
      ...messages,
      [pId]: {
        ...messages[pId],
        message: e.target.value
      }
    })
  }
  const errorTypeCheck = (message) => ({
    type: `${message.length > 300 ? "LEN" : ""}${message.match(/{{\..*}}/g) ? "TAG" : ""}`,
    count: message.match(/{{\..*}}/g)?.join("")?.split("}{")?.length || 0
  })
  return (
    <div className='edit-and-send-root'>
      {(isSendingEdited || isEditedSent) &&
        <div className='progress-toast'>
          {!isEditedSent && <p style={{ color: 'white' }}>Sending {editedSentCount}/{selected.length}</p>}
          {
            isEditedSent &&
            <>
              <p style={{ color: 'white' }}>Sent!</p>
              <span>
                <a
                  href='https://www.linkedin.com/mynetwork/invitation-manager/sent/'
                  target='_blank'
                >
                  <div style={{ marginLeft: '8px' }} className='external-link-icon' />
                </a>
              </span>
            </>

          }
          <p
            style={{ color: 'darkgray', cursor: 'pointer' }}
            onClick={() => setView('ScoreAndConnect')}
          >
            Dismiss
          </p>
        </div>
      }
      {recepients.map((item, i) => {
        const errorType = errorTypeCheck(messages[item.recepient.id]?.message || '')
        const [imgUrl, setimgUrl] = useState(item.recepient.imageUrl ? item.recepient.imageUrl : DisplayPlaceholder)
        return (
          <div className='edit-msg-item' key={item.recepient.id || i}>
            <div className='check-container'>
              <Input
                disabled={CharLimitCounters[item.recepient.id] > 300 ? true : false}
                type='checkbox'
                checked={selected.includes(item.recepient.id)}
                onChange={() => {
                  if (selected.includes(item.recepient.id)) {
                    setSelected(selected.filter(it => it !== item.recepient.id))
                  } else {
                    setSelected([...selected, item.recepient.id])
                  }
                }} />
            </div>
            <div className='edit-msg-content' >
              <div>
                <img
                  className='displayPicEditPage'
                  src={imgUrl}
                  onError={() => setimgUrl(DisplayPlaceholder)}
                />
                <h2 className='displayNameEditPage'>{item.recepient.fullName}</h2>
                <a href={item.recepient.profileUrl} target='_blank'>
                  <img className='linkedIconEditPage' src={linkedinIcon} />
                </a>
              </div>
              <Input
                className={CharLimitCounters[item.recepient.id] > 300 ?
                  "editInputTextArea editInputTextAreaFlash" :
                  "editInputTextArea"}
                type="textarea"
                name="text"
                value={messages[item.recepient.id]?.message || ''}
                onChange={(e) => handleChangeMsg(e, item.recepient.id)} />
              <p className={CharLimitCounters[item.recepient.id] > 300 ? "limitCounter limitCounterFlash" : "limitCounter"}>{`${CharLimitCounters[item.recepient.id]}/300`}</p>
            </div>
            <div className="messageErrorTypeTagContainer">
              {errorType.type.includes("LEN") &&
                <p className="messageErrorTypeTag">
                  Length Exceeded
                  </p>}
              {errorType.type.includes("TAG") &&
                <p className="messageErrorTypeTag">
                  {`${errorType.count} Tag${errorType.count > 1 ? "s" : ""} Missing`}
                </p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default EditAndSend