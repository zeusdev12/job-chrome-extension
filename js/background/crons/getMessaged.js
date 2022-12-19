import { callLinkedinApi, manualApiCall } from '../../../js/react/utils/index.js'

function getMessagedPeopleCronJob() {

  chrome.storage.local.get('recruiterID', async function (result) {

    var recruiterID = result.recruiterID;

    if (recruiterID) {


      const me = await callLinkedinApi(`/voyager/api/me`, { method: 'GET' })
      const self = me.miniProfile.entityUrn.split("miniProfile:")[1];

      const data = await callLinkedinApi(`/voyager/api/messaging/conversations?keyVersion=LEGACY_INBOX`, {
        method: 'GET',
        headers: {
          key: 'x-restli-protocol-version',
          val: '2.0.0'
        }
      })


      var messagedProfileUrl = [];

      var temp = "com.linkedin.voyager.messaging.MessagingMember";

      for (var i = 0; i < data.elements.length; i++) {
        if (self == data.elements[i].events[0].from[temp].miniProfile.entityUrn.split("miniProfile:")[1] || data.elements[i].events[0].from[temp].miniProfile.entityUrn.split("miniProfile:")[1] == "UNKNOWN")
          continue;

        //console.log(data.elements[i].events[0].from[temp].miniProfile.firstName);
        //console.log(data.elements[i].events[0].from[temp].miniProfile.entityUrn.split("miniProfile:")[1]);
        //console.log(data.elements[i].events[0].from[temp].miniProfile.publicIdentifier);

        var profileUrl = "https://www.linkedin.com/in/" + data.elements[i].events[0].from[temp].miniProfile.publicIdentifier;

        messagedProfileUrl.push(profileUrl);

      }

      if (messagedProfileUrl.length == 0) {
        messagedProfileUrl.push("");

      }

      console.log(messagedProfileUrl);

      var request = {
        token: recruiterID,
        jobID: 'All',
        requestArray: messagedProfileUrl
      };
      request = JSON.stringify(request);
      console.log(request);
      console.log(JSON.parse(request));
      // var url = HOST+"api/auth/put/applicants-message-status";
      // var url = HOST + "api/auth/user/connection/replied"

      // console.log('GOING TO CALL CALL AJAX POST: ', url)

      // fetch(url, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': recruiterID
      //   },
      //   body: request
      // }).then(r => r.json())


      await manualApiCall(`/api/auth/user/connection/replied`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: request
      })




      // callXHROnLinkedIn(LINKEDIN_DOMAIN_URL_BG + '/voyager/api/me', [], function (data) {

      //   console.log("getMessagedPeople - Self: " + data.miniProfile.entityUrn);

      //   var self = data.miniProfile.entityUrn.split("miniProfile:")[1];

      //   callXHROnLinkedIn(LINKEDIN_DOMAIN_URL_BG + 'voyager/api/messaging/conversations?keyVersion=LEGACY_INBOX', [{ key: 'x-restli-protocol-version', val: '2.0.0' }], function (data) {

      //     //console.log(data);

      //     var messagedProfileUrl = [];

      //     var temp = "com.linkedin.voyager.messaging.MessagingMember";

      //     for (var i = 0; i < data.elements.length; i++) {
      //       if (self == data.elements[i].events[0].from[temp].miniProfile.entityUrn.split("miniProfile:")[1] || data.elements[i].events[0].from[temp].miniProfile.entityUrn.split("miniProfile:")[1] == "UNKNOWN")
      //         continue;

      //       //console.log(data.elements[i].events[0].from[temp].miniProfile.firstName);
      //       //console.log(data.elements[i].events[0].from[temp].miniProfile.entityUrn.split("miniProfile:")[1]);
      //       //console.log(data.elements[i].events[0].from[temp].miniProfile.publicIdentifier);

      //       var profileUrl = "https://www.linkedin.com/in/" + data.elements[i].events[0].from[temp].miniProfile.publicIdentifier;

      //       messagedProfileUrl.push(profileUrl);

      //     }

      //     if (messagedProfileUrl.length == 0) {
      //       messagedProfileUrl.push("");

      //     }

      //     console.log(messagedProfileUrl);

      //     var request = {
      //       token: recruiterID,
      //       jobID: 'All',
      //       requestArray: messagedProfileUrl
      //     };
      //     request = JSON.stringify(request);
      //     console.log(request);
      //     console.log(JSON.parse(request));
      //     // var url = HOST+"api/auth/put/applicants-message-status";
      //     // var url = HOST + "api/auth/user/connection/replied"

      //     console.log('GOING TO CALL CALL AJAX POST: ', url)

      //     // fetch(url, {
      //     //   method: 'POST',
      //     //   headers: {
      //     //     'Content-Type': 'application/json',
      //     //     'Authorization': recruiterID
      //     //   },
      //     //   body: request
      //     // }).then(r => r.json())


      //     manualApiCall(`/api/auth/user/connection/replied`, {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json'
      //       },
      //       body: request
      //     })
      //       .then(json => {
      //         console.log(json)

      //       })
      //       .catch(err => {
      //         console.log('An error occured: ', err.message)
      //       })

      //     // callAjaxPOST(url,request,function(json){

      //     // 	console.log(json);

      //     // 	setTimeout(function()
      //     // 	{
      //     // 		sendFollowUpMessages();

      //     // 	},10000);

      //     // });

      //   });

      // });

    }

  });

}

export { getMessagedPeopleCronJob }