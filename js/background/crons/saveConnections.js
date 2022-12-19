import { callLinkedinApi, manualApiCall } from '../../../js/react/utils/index.js'
const LINKEDIN_DOMAIN_URL_BG = 'https://www.linkedin.com'

function saveConnectionsCronJob() {
  console.log("saveConnectionsCronJob");
  chrome.storage.local.get('recruiterID', function (result) {
    var recruiterID = result.recruiterID;;
    if (recruiterID) {
      //isLinkedInPageAvailable(function(tab){
      //if(tab){
      //BROWSER.tabs.sendMessage(tab.id, {cmd: 'getAcceptNetworkInformation'}, function(networkArray){
      callLinkedinApi(`/voyager/api/relationships/connections?count=100&sortType=RECENTLY_ADDED`, { method: 'GET' })
        .then(networkArray => {
          if (networkArray.elements) {
            // console.log(networkArray.elements);
            var profileArr = [];
            $.each(networkArray.elements, function (i, profile) {
              profileArr.push({
                entityUrn: profile.entityUrn.replace("urn:li:fs_relConnection:", ""),
                profileUrl: LINKEDIN_DOMAIN_URL_BG + "in/" + profile.miniProfile.publicIdentifier,
                status: "ACCEPTED"
              });
              // if(elem.entityUrn.indexOf('INVITATION_ACCEPTANCE')>=0){
              //    var obj =  elem.notification['com.linkedin.voyager.relationships.notifications.InvitationAcceptanceNotification'];
              //    $.each(obj.previewMiniProfiles,function(j,profile){
              //         profileArr.push({
              //             entityUrn:profile.entityUrn.replace("urn:li:fs_miniProfile:",""),
              //             profileUrl:LINKEDIN_DOMAIN_URL+"in/"+profile.publicIdentifier,
              //             status:"ACCEPTED"
              //         });
              //    });
              // }
            });
            var request = {
              token: recruiterID,
              jobID: 'All',
              requestArray: profileArr
            };
            request = JSON.stringify(request);

            manualApiCall(`/api/auth/user/connection/accepted`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: request
            })
              .then(json => {
                console.log(json)
                // setTimeout(function(){
                // 	readEmailCronStart()
                // }, 10000)
              })
              .catch(err => {
                console.log('an error occured: ', err.message)
              })

          }
        })



    }
  });
}


export { saveConnectionsCronJob }