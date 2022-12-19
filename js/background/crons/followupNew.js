import { callLinkedinApi, getRandomInt, manualApiCall } from "../../react/utils/index.js"


const followUpNewCron = async () => {
  try {
    const followups = await manualApiCall('/api/auth/user/followup', { method: 'GET' })

    window.followups = followups.length > 0 ? followups : []
    window.fuIndex = 0

    if (window['fup_interval']) {
      clearInterval(window['fup_interval'])
    }

    window['fup_interval'] = setInterval(followUpIntervalHandler, getRandomInt(4, 6) * 1000)

    // console.log('FOLLOWUPS TO SEND ARE: ', followups)


  } catch (e) {
    console.log('AN ERROR OCCURRED: ', e.message)
  }
}


const followUpIntervalHandler = async () => {
  try {
    const followup = window.followups[window.fuIndex]
    console.log('FOLLOWUP TO SEND: ', followup)

    // do ur wizardry here
    const resp = await callLinkedinApi(`/voyager/api/messaging/conversations?createdBefore=${Date.now()}&keywords=${encodeURIComponent(followup.recepientName)}&q=search`, {
      method: 'GET',
      headers: {
        'x-restli-protocol-version': '2.0.0'
      }
    })

    const convos = resp.elements.filter(item =>
      followup.recepientName.toLowerCase().trim().startsWith(item.participants[0]['com.linkedin.voyager.messaging.MessagingMember'].miniProfile.firstName.toLowerCase().trim())
    )

    console.log('CONVERSATIONS ARE: ', convos)
    if (convos.length === 0) {
      throw new Error('conversation not found')
    }
    // do ur wizardry here

    const conversation = convos[0]
    const convId = conversation.entityUrn.split(':').pop()
    const lastMessage = conversation.events[0].eventContent['com.linkedin.voyager.messaging.event.MessageEvent'].attributedBody.text


    if (lastMessage === followup.messageToCheck) {
      console.log('SEND FOLLOWUP PLEASE AND UPDATE STATUS')

      await callLinkedinApi(`/voyager/api/messaging/conversations/${convId}/events?action=create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-restli-protocol-version': '2.0.0'
        },
        body: JSON.stringify({ "eventCreate": { "value": { "com.linkedin.voyager.messaging.create.MessageCreate": { "attributedBody": { "text": followup.messageToSend, "attributes": [] }, "attachments": [] } } }, "dedupeByClientGeneratedToken": false })
      })


      await manualApiCall('/api/auth/user/followup/status/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobProfileId: followup.jobProfileId,
          shouldSendFollowup: true,
          followUpType: followup.followupType,
          message: followup.messageToSend
        })
      })

      


    } else {
      await manualApiCall('/api/auth/user/followup/status/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobProfileId: followup.jobProfileId,
          shouldSendFollowup: false,
          followUpType: followup.followupType,
          message: followup.messageToSend
        })
      })
      console.log('DONT SEND FOLLOWUP BUT UPDATE STATUS FOR THIS PROFILE')
    }


    if (window.fuIndex === window.followups.length - 1) {
      clearInterval(window['fup_interval'])
      window.followups = []
      window.fuIndex = 0
    } else {
      window.fuIndex = window.fuIndex + 1
      clearInterval(window['fup_interval'])
      window['fup_interval'] = setInterval(followUpIntervalHandler, getRandomInt(4, 6) * 1000)
    }
  } catch (e) {
    console.log('AN ERROR OCCURED: ', e.message)
    clearInterval(window['fup_interval'])
  }
}




export { followUpNewCron }