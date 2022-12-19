import { diff_hours, datediff, waterFall, delay } from '../utils/index.js'
import { manualApiCall, callLinkedinApi, simulateTimeout, getRandomInt } from '../../../js/react/utils/index.js'

function checkFollowUpCronJobStatus() {
  chrome.storage.local.get(['recruiterID'], function (result) {
    manualApiCall(`/api/auth/user/followup/check/last/cron`, {
      method: 'GET'
    })
      .then(res => {
        if (res.isSuccess === true) {
          if (res.messagedCheckedTill !== null) {
            console.log(new Date(res.messagedCheckedTill))
            console.log(diff_hours(new Date(res.messagedCheckedTill), new Date()) + '>=' + 12)
            if (diff_hours(new Date(res.messagedCheckedTill), new Date()) >= 12) fetchLinkedinMessage();
          } else {
            fetchLinkedinMessage();
          }
        }
      })
  });
}

function fetchLinkedinMessage() {
  // GETTING THE RECRUITER ID FROM STORAGE
  let lastLoggedDate;
  let startLoggingMessageFrom = new Date().getTime();
  let threads = []
  let lastMessagedChecked;
  let ownerPublicIdentifier;
  let conversationPublicIdentifier = []
  let lastConversationMessagedAt = new Date().getTime();
  let readMessageAllow = true;
  let messagechunkread = 1
  let sentMessagesList = []
  let recruiterIdFectch
  chrome.storage.local.get(['recruiterID'], async function (result) {

    if (result.recruiterID) {
      recruiterIdFectch = result.recruiterID
    }

    console.log('HELLOOO++++++++++++++++++++')

    // const activityLogEndpoint = HOST + 'api/auth/user/followup/check/message/logged/date'
    // const updateFollowUpAllow = HOST + 'api/auth/user/followup/update/followup/allow/status'

    // getting the threads
    const res = await manualApiCall('/api/auth/user/followup/check/message/logged/date', {
      method: 'GET'
    })

    if (res.isSuccess === true) {
      if (res.data[0].messagedCheckedTill === null) {
        lastLoggedDate = new Date(res.data[0].createdAt).getTime()
      } else {
        lastLoggedDate = new Date(res.data[0].messagedCheckedTill).getTime()
      }
      ownerPublicIdentifier = res.data[0].linkedinProfile
      sentMessagesList.push(...res.data.map((res) => res.sentMessageBody))
    }

    let i = 0;

    // await  readConversationThreads(lastConversationMessagedAt, function (res) {
    // });
    // alert(lastLoggedDate)
    // alert(datediff(new Date(lastLoggedDate), new Date(lastConversationMessagedAt)) >= 1)
    if (datediff(new Date(lastLoggedDate), new Date(lastConversationMessagedAt)) >= 1) {
      while (lastLoggedDate < lastConversationMessagedAt && readMessageAllow == true) {
        i++;
        console.log(lastLoggedDate < lastConversationMessagedAt)
        console.log(new Date(lastLoggedDate) + '<' + new Date(lastConversationMessagedAt))
        await simulateTimeout(getRandomInt(2, 3) * 1000)
        let res = await readConversationThreads(lastConversationMessagedAt);
        console.log('GOING FOR EXTRACTING MESSAGES')
        console.log(JSON.stringify(res))
        const resp = extractProfileFromConversation(res, ownerPublicIdentifier, sentMessagesList);
        console.log('GOT FOR EXTRACTING MESSAGES')
        console.log(JSON.stringify(resp))
        if (resp.profiles == null) {
          readMessageAllow = false
        } else {
          conversationPublicIdentifier.push(...resp.profiles)
          lastConversationMessagedAt = new Date(resp.lastMessagedAt).getTime()
        }


      }
    }
    console.log('READD ALL MESSAGES' + startLoggingMessageFrom)
    console.log(JSON.stringify(conversationPublicIdentifier))
    console.log('GOING FOR SEND FOLLOWUP')
    if (conversationPublicIdentifier.length >= 1) {
      // alert('FOUND');
      // alert(conversationPublicIdentifier)
      // fetch(updateFollowUpAllow, {
      //   method: 'POST',
      //   headers: {
      //     authorization: result.recruiterID,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ foundSameMessage: conversationPublicIdentifier, startLoggingMessageFrom: startLoggingMessageFrom })
      // })
      manualApiCall(`/api/auth/user/followup/update/followup/allow/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          foundSameMessage: conversationPublicIdentifier,
          startLoggingMessageFrom: startLoggingMessageFrom
        })
      })
        .then(res => {
          if (res.isSuccess === true) {
            if (res.messageArray && res.messageArray.length) {
              // alert(recruiterIdFectch)
              sendFollowUps(res.messageArray, recruiterIdFectch, function (res) {
              });
            }
          }
        })

    }




  });



}



function sendFollowUps(messageArray, token, _callback) {

  console.log("sendFollowUpMessages");
  const tempArray = [];

  waterFall.forEachSeries(messageArray, function (profile, cb) {

    setTimeout(async function () {

      if (profile.message) {
        // alert("PROFILES MESSAGE START")
        // alert(JSON.stringify(profile))
        // alert(profile.entityUrn);
        // alert(profile.message);
        // alert("PROFILES MESSAGE END")


        // var regPersonId = (profile.profileUrl).match(/\/in\/(.+)\//i);

        const linkedinId = profile.profileUrl.split('/').filter(i => i).pop()

        // if (regPersonId && regPersonId[1])
        //   linkedinId = cleanStr(regPersonId[1]);
          
        await simulateTimeout(5000)


        const resp = await callLinkedinApi(`/voyager/api/identity/profiles/${linkedinId}/profileView`, { method: 'GET' })
        if (resp && resp.profile) {

          console.log(JSON.stringify(resp.profile));

          var entityUrn = resp.profile.miniProfile.entityUrn.split("miniProfile:")[1];

          console.log('ENTITY URN IS: ', entityUrn)

          console.log(entityUrn);

          const status = await callSendMessageAPI(profile.conversationId, profile.message);

          console.log(status);
          console.log('MESSAGE SENT')
          console.log(JSON.stringify(resp.profile));

          if (status == true) {
            var request = {
              followUpNo: profile.followUpNo,
              profile: resp.profile.miniProfile.publicIdentifier,
              message: profile.message
            };

            request = JSON.stringify(request);
            console.log(request);
            console.log(JSON.parse(request));

            // var url = HOST+"api/auth/put/followup-message-status";
            // var url = HOST + "api/auth/user/followup/update"

            manualApiCall(`/api/auth/user/followup/update`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: request
            })
              .then(json => {
                console.log(json)
              })
              .catch(err => {
                console.log(err)
                console.log('An error occured: ', err.message)
              })
          }

        }



      }

      cb();

    }, 3000);

  });

  // alert('FINALIZE THE CALL START')
  // alert(JSON.stringify(tempArray))
  // alert('FINALIZE THE CALL END')



  _callback({ 'profiles': null, 'lastMessagedAt': null })
  return { 'profiles': null, 'lastMessagedAt': '' }
}

function cleanStr(str) {
  if (typeof str !== 'undefined') {
    if (str.length)
      str = str.trim();
    str = str
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  } else
    str = "";
  return str;
}

export async function readConversationThreads(startFrom) {
  // alert(startFrom)
  // alert('startFrom')
  delay(10000, function (res) {
    // alert(res)
  });
  return await callLinkedinApi(`/voyager/api/messaging/conversations?keyVersion=LEGACY_INBOX&createdBefore=${startFrom}`, { method: 'GET' })
}

function extractProfileFromConversation(res, ownerPublicIdentifier, sentMessagesList) {
  // if (ownerPublicIdentifier == null) {
  try {
    let conversationPublicIdentifier = res.elements.map(function (item) {
      if (item) {
        // alert(JSON.stringify(item))
        if (item.events[0].eventContent['com.linkedin.voyager.messaging.event.MessageEvent'].attributedBody) {
          // alert('sdfsfdf')
          if (sentMessagesList.includes(item.events[0].eventContent['com.linkedin.voyager.messaging.event.MessageEvent'].attributedBody.text)) {
            // alert(JSON.stringify({'conversationId':item.backendUrn.split('messagingThread:')[1],'linkedinIdentifier':item.participants[0]['com.linkedin.voyager.messaging.MessagingMember'].miniProfile.publicIdentifier}))
            return { 'conversationId': item.backendUrn.split('messagingThread:')[1], 'linkedinIdentifier': item.participants[0]['com.linkedin.voyager.messaging.MessagingMember'].miniProfile.publicIdentifier }
          }
        }
      }
    });
    //_callback({ 'profiles': conversationPublicIdentifier.filter(n => n), 'lastMessagedAt': res.elements[res.elements.length - 1].events[0].createdAt })
    return { 'profiles': conversationPublicIdentifier.filter(n => n), 'lastMessagedAt': res.elements[res.elements.length - 1].events[0].createdAt }
  } catch (e) {
    //_callback({ 'profiles': null, 'lastMessagedAt': null })
    return { 'profiles': null, 'lastMessagedAt': '' }
  }

}

async function callSendMessageAPI(conversationId, message) {
  try {
    await callLinkedinApi(`/voyager/api/messaging/conversations/${conversationId}/events?action=create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-restli-protocol-version': '2.0.0'
      },
      body: JSON.stringify({ "eventCreate": { "value": { "com.linkedin.voyager.messaging.create.MessageCreate": { "attributedBody": { "text": message, "attributes": [] }, "attachments": [] } } }, "dedupeByClientGeneratedToken": false })
    });
    return true
  } catch (e) {
    return false
  }
  // alert('RESPONSE AFTER SEND MESSAGE')

}
function callXHROnLinkedIn(url, headers, callback, is_async) {
  var async = !is_async ? true : false;
  if (csrf_token == "") {
    return;
  }
  $.ajax({
    url: url,
    async: false,
    beforeSend: function (req) {
      req.setRequestHeader('csrf-token', csrf_token);
      if (headers && headers.length > 0) {
        headers.forEach(function (h) {
          req.setRequestHeader(h.key, h.val);
        });
      }
    },
    xhrFields: {
      withCredentials: true
    },
    type: 'GET',
    success: function (data) {
      if (typeof callback == 'function')
        callback(data);
    },
    error: function (xhr) {
      // console.log("XHR Failed for "+url);
      if (typeof callback == 'function')
        callback();
    }
  });
}

export {
  checkFollowUpCronJobStatus
}
