let USER_DATA = 0
window.onload = function () {

  chrome.runtime.sendMessage({
    type: 'GET_DASHBOARD_HOST'
  }, function (response) {

    const CSRF_Token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    const DASHBOARD_HOST = response

    const Url = document.URL
    if (Url.includes(DASHBOARD_HOST)) {
      chrome.storage.local.set({ 'CARDINAL_CSRF_Token': CSRF_Token });

      if (Url.includes(`${DASHBOARD_HOST}/recruiter/dashboard`)) {
        chrome.storage.local.get(r => {
          // console.log('EXTENSION STORAGE: ', r)
          if (!r.recruiterID) {
            if (window.localStorage.getItem('UserData')) {
              window.localStorage.clear()

              window.location.reload()
            }
          }
        })
      }

      if (Url.includes(`${DASHBOARD_HOST}/recruiter/demo`)) {
        setTimeout(() => {

          chrome.runtime.sendMessage({ type: 'CHECK_USER_STATUS' }, function (response) {
            if (response.isBlocked) {
              alert('Please contact admin@dnnae.com to activate your account.')
            } else {
              chrome.runtime.sendMessage({ type: 'OPEN_JOB_DES' })
            }
          })


        }, 2000)

      }

      /** redo this if above doesnt work
      
      if (urlParams)
      {
  
        // chrome.runtime.sendMessage('GET_USER', function(r){
        // 	console.log('GET_USER response: ', r)
        // })
          if(urlParams.extensionLogout)
          {
            //console.log("Logout");
            //alert("Logout");
            window.localStorage.clear();
        
            setTimeout(function(){
        
              //location.reload();
          
              chrome.storage.local.clear(function() 
              {
                var error = chrome.runtime.lastError;
                if (error) {
                  console.error(error);
                }
              });
        
            },500);
            
            return;
          
          }
    
      }	
      
       */

      // if (localStorage["UserData"])
      // {
      // 	var value = localStorage["UserData"];

      // 	var data = JSON.parse(value);

      // 	if (data.token)
      // 	{

      // 		chrome.storage.local.set({'recruiterID': data.token}, UpdateJobs);

      // 		getPaymentInfo(data.token);

      // 		getReferralInfo(data.token);

      // 	}

      // 	if (data.name)
      // 	{

      // 		chrome.storage.local.set({'name': data.name});

      // 	}

      // 	if (data.calendlyLink)
      // 	{
      // 		if (data.calendlyLink != "")
      // 		chrome.storage.local.set({'calendlyLink':data.calendlyLink});

      // 	}

      // 	if (data.integratedEmailAddress)
      // 	{
      // 		if (data.integratedEmailAddress != "")
      // 		chrome.storage.local.set({'integratedEmailAddress':data.integratedEmailAddress});

      // 	}

      // 	if (data.emailAddress)
      // 	{
      // 		if (data.emailAddress != "")
      // 		chrome.storage.local.set({'emailAddress':data.emailAddress});

      // 	}

      // 	USER_DATA = 1;

      // }

      setInterval(function () {

        if (USER_DATA == 0) {
          if (localStorage["UserData"]) {
            var value = localStorage["UserData"];

            var data = JSON.parse(value);

            console.log('data is: ', data)

            if (data.token) {

              chrome.storage.local.set({
                'recruiterID': data.token,
                'isBlocked': data.isBlocked || false
              });
              chrome.runtime.sendMessage({ type: 'UPDATE_JOBS' })

              // getPaymentInfo(data.token);

              // getReferralInfo(data.token);

            }

            if (data.name) {

              chrome.storage.local.set({ 'name': data.name });

            }

            if (data.calendlyLink) {
              if (data.calendlyLink != "")
                chrome.storage.local.set({ 'calendlyLink': data.calendlyLink });

            }

            if (data.integratedEmailAddress) {
              if (data.integratedEmailAddress != "")
                chrome.storage.local.set({ 'integratedEmailAddress': data.integratedEmailAddress });

            }

            if (data.emailAddress) {
              if (data.emailAddress != "")
                chrome.storage.local.set({ 'emailAddress': data.emailAddress });

            }

            if (data.email) {
              if (data.email != "")
                chrome.storage.local.set({ 'emailAddress': data.email });
            }

            USER_DATA = 1;


          }

        }

      }, 1000);

      return;
    }

  })



}