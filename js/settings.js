// const PENCILIT_API_2 = "https://api.pencilit.io/api/v1/get/status"
const LINKEDIN_DOMAIN_URL = 'https://www.linkedin.com/'
const PENCILIT_API_TOKEN = "87567daf248f7d27de37fc48befcba71621b033c"
const PENCILIT_API_2 = "https://api.pencilit.io/api/v1/get/status";

setTimeout(function () {

  callXHROnLinkedIn(LINKEDIN_DOMAIN_URL + '/voyager/api/me', [], function (data) {

    console.log(data.miniProfile.publicIdentifier, data.miniProfile.firstName, data.miniProfile.lastName);

    var linkedinString = data.miniProfile.firstName + " " + data.miniProfile.lastName
      + " (https://www.linkedin.com/in/" + data.miniProfile.publicIdentifier + ")";

    console.log(linkedinString);

    $('#linkedin-ac-text').text(linkedinString);


  });

  setTimeout(() => {
    // console.log('HELLO WORLD HOWE AKDSJHFAKSJDHFKASHJDF')
    chrome.storage.local.get(['DailyLimitSelected'], function (response) {
      const dailyLimit = response['DailyLimitSelected'] || "500"
      console.log('daily limit selected is: ', dailyLimit)
      $('#DailyLimitsSelectOption').val(dailyLimit)
    })
  }, 1)

  // TESTING
  /*
  callXHROnLinkedIn(LINKEDIN_DOMAIN_URL_BG + 'voyager/api/messaging/conversations?keyVersion=LEGACY_INBOX', [{key:'x-restli-protocol-version', val:'2.0.0'}], function (data) {

  console.log(data);
	
  var temp = "com.linkedin.voyager.messaging.MessagingMember";
	
  for (var i = 0; i < data.elements.length; i++)
  {
    console.log(data.elements[i].events[0].from[temp].miniProfile.firstName);
  	
    console.log(data.elements[i].events[0].from[temp].miniProfile.entityUrn.split("miniProfile:")[1]);
	
  }


});
*/

  $('#DailyLimitsSaveButton').click(function () {


    var DailyLimitsSelectOption = $('#DailyLimitsSelectOption').val();

    console.log('DAILY LIMITE SELECTED SETTING TO: ', DailyLimitsSelectOption)
    chrome.storage.local.set({ 'DailyLimitSelected': DailyLimitsSelectOption });

    $('#daily-limit-selected-text').text(DailyLimitsSelectOption + " profile collections of Daily Limit.");


    var isRecruiter = $('#RecruiterSelectOption').val();

    //alert(isRecruiter);

    if (parseInt(isRecruiter) == 1) {
      //alert("ON");
      chrome.storage.local.set({ 'isRecruiter': '1' });
      $('#recruiter-selected-text').text("ON");

    }
    else {
      chrome.storage.local.set({ 'isRecruiter': '0' });
      $('#recruiter-selected-text').text("OFF");

    }


    $('#snackbar').text("LinkedIn Settings Saved");
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () {
      $('#snackbar').text(".");
      x.className = x.className.replace("show", "");
    }, 4000);

  });

  chrome.storage.local.get(['emailAddress', 'isPencilitSetup'], function (result) {

    emailAddress = result.emailAddress;

    var url = PENCILIT_API_2 + "?email=" + emailAddress;

    console.log(url);

    callPencilitAPI2(url, function (json) {
      console.log(json);

      if (json.errors) {
        $('#pencilit-ac-text').text("Not Found");

        $('#zoom-ac-text').text("Not Found");

      }
      else {
        $('#pencilit-ac-text').text(json.data.pencilit_email);

        $('#zoom-ac-text').text(json.data.zoom_email);

      }

    });

  });

}, 200);

function callPencilitAPI2(url, callback) {

  var xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", function () {
    if (xhr.readyState == 4) {
      console.log(xhr.responseText);
      var json = JSON.parse(xhr.responseText);
      callback(json);
    }
  });

  xhr.open("GET", url);
  xhr.setRequestHeader("accept", "application/json");
  xhr.setRequestHeader("content-type", "application/json");
  xhr.setRequestHeader("x-api-key", PENCILIT_API_TOKEN);

  xhr.send(null);

}




function callXHROnLinkedIn(url, headers, callback, is_async) {
  var async = !is_async ? true : false;
  chrome.storage.local.get('csrf_token', function (response) {
    $.ajax({
      url: url,
      async: false,
      beforeSend: function (req) {
        // var csrf_token;
        // if (document.cookie.match(JSESSIONID_REGEX)) {
        //   csrf_token = document.cookie.match(JSESSIONID_REGEX)[1];

        // }
        // else {
        //   csrf_token = CSRF_TK;

        // }
        req.setRequestHeader('csrf-token', response['csrf_token']);
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
  })


}
