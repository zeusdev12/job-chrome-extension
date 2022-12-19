/**
 * STEP defines what state the popup is in on the current tab
 * 1 = base state, where we show all jobs
 * 2 = Linkedin variant selector, where we select between regular and recruiter lite and others..
 * 3 = apply filters, show search terms after filters are applied
 * 4 = prospect collection, job running and collecting prospects
 */

// alert('HELLO WORLD')
// alert(`MESSAGE TYPES; ${JSON.stringify(MESSAGE_TYPES)}`)
// let STEP = 1

//job against which prospects are being added
// let CURRENT_JOB = null

// function addToastContinaer() {
//   console.log('ADDING TOAST CONTAINER')
//   if (location.href.includes('search/results/people')) {
//     const body = $('body')
//     console.log('BODY IS: ', body)
//     $('body').append(`<div id='mytoastcontainer' style="position:fixed; height:100px; width:100vw; background-color:yellow"></div>`)
//   }
// }

// addToastContinaer()

// $(document.body).append(`
// <div id='pause-container' style="position:absolute; left:0, top:200px; width: 100vw; height: 100px; display:flex; justify-content:center; align-items:center">
//   <div id='pause-info' style="height:80px; padding:8px; border-radius:8px; background-color:dodgerblue; color:white">

//   </div>
// </div>`
// )

// setTimeout(() => {
//   console.log('ADDING TOAST')
//   console.log($.toast)
//   $.toast('Here you can put the text of the toast')
// }, 3000)

// setInterval(() => {
//   console.log('SHOULD SEE TOAST NOW')
//   $.toast('Here you can put the text of the toast')
// }, 2000)

let FILTERS_APPLIED = false
let COUNTER = 0
// let CURRENT_SEARCHTERM = null
let APPLYING_FILTERS = false


// setInterval(() => {
//   console.log('WINDOW OBJECT IS: ', window)
// }, 1000)


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case 'APPLY_FILTERS': {
      applyFilters(request.payload, sendResponse)
      return true
    }

    case 'CHECK_FILTERS': {
      sendResponse({ filtersApplied: FILTERS_APPLIED })
      return true
    }

    case 'START_COLLECTION': {
      startCollection(request, sender, sendResponse)
      return true
    }

    case 'SCRAPE_DATA': {
      startScraping(request.jobId)
      return true
    }

    case 'GET_COLLECTION_PROGRESS': {
      console.log('GET COLLECTION PROGRESS', request.payload)
      // console.log('')
      chrome.runtime.sendMessage({ type: 'FETCH_JOB_META' }, function (jobMeta) {
        console.log('JOB META: ', jobMeta)
        const searchTerms = jobMeta.searchTerms
        // console.log('SEARCH TERMS: ', searchTerms)
        const isSearchExhausted = searchTerms.every(item => (item.isExhausted || item.isDeleted))
        const progress = isSearchExhausted ? 100 : (COUNTER / 50) * 100
        const r = progress > 100 ? 100 : progress

        sendResponse({
          progress: r,
          isSearchExhausted: isSearchExhausted,
          isReady: document.readyState === 'complete'
        })
      })

      return true
    }

    case 'PAUSE_JOB': {
      pauseCollection(request, sender, sendResponse)
      return true
    }

    case 'RESUME_JOB': {
      resumeCollection(request, sender, sendResponse)
      return true
    }

    case 'STOP_JOB': {
      stopJob(request, sender, sendResponse)
      return true
    }

    default:
      return true
  }
})

function stopJob() {
  // console.log('STOP JOB STOP JOB STOP JOB STOP JOB STOP JOB STOP JOB STOP JOB')
  window['jobStopped'] = true
  if (window[`collectInterval`]) {
    clearInterval(window[`collectInterval`])
  }
  if (window['collectNextInterval']) {
    clearInterval(window['collectNextInterval'])
  }
  if (window['progressToast']) {
    window['progressToast'].reset()
  }
  if (window['toastInterval']) {
    clearInterval(window['toastInterval'])
  }
}

async function resumeCollection(request, sender, sendResponse) {
  console.log('RESUMING JOB YAYYYY')
  const jobId = request.payload
  window[`isPaused`] = false
  startCollection({ payload: { jobId: jobId } }, sender, sendResponse)
}

async function pauseCollection(request, sender, sendResponse) {
  console.log('PAUSING JOB YAYYYY')
  const jobId = request.payload
  window[`isPaused`] = true
  if (window[`collectInterval`]) {
    clearInterval(window[`collectInterval`])
  }
  if (window['collectNextInterval']) {
    clearInterval(window['collectNextInterval'])
  }
  if (window['progressToast']) {
    window['progressToast'].reset()
  }
  if (window['toastInterval']) {
    clearInterval(window['toastInterval'])
  }
}

async function startScraping() {
  await scrapeProfileData({ fromApi: false, url: null })
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function getNextSearchTerm(isExhausted = false) {
  if (!window['jobStopped'] || (!window['isPaused'])) {
    chrome.runtime.sendMessage({
      type: 'GET_NEXT_SEARCHTERM',
      payload: {
        isExhausted: isExhausted
      }
    }, function (response) {
      if (response.data.searchTerm) {
        clearInterval(window['collectNextInterval'])
        console.log('START VISITIN [2]')
        startVisiting(response.jobId, response.data)
      } else {
        if (!window['collectNextInterval'] && !response.exhausted) {
          window['collectNextInterval'] = setInterval(() => {
            console.log('GET NEXT SEARCH TERM [3]')
            getNextSearchTerm()
          }, 1000)
        }
      }
    })
  }
}

function showPauseProgress(pauseTime) {
  let secs = pauseTime
  window['progressToast'] = $.toast({
    text: `Pausing for ${pauseTime} seconds`,
    hideAfter: pauseTime * 1000
  })

  window['toastInterval'] = setInterval(() => {
    secs -= 1
    progressToast.update({
      text: `Pausing for ${secs} seconds`,
      hideAfter: secs * 1000
    })
  }, 1000)

  setTimeout(() => {
    clearInterval(window['toastInterval'])
  }, pauseTime * 1000)
}


async function scrapeProfileData({
  fromApi = false,
  url = null
}) {

  let continueUrl = location.href
  if (fromApi) {
    console.log('(FROM API)LOCATION HREF: ', location.href)
    // const comps = location.href.split('&page=')

    // console.log('COMPS ARE: ', comps)

    // const newComps = [comps[0], comps[1] ? parseInt(comps[1]) + 1 : 2]

    continueUrl = url
  }

  chrome.runtime.sendMessage({
    type: 'SET_CONTINUE_URL',
    payload: {
      continueUrl
    }
  })

  const waitTime = getRandomInt(7, 10)

  showPauseProgress(waitTime)

  await simulateTimeout(waitTime * 1000)

  console.log('GOING TO SCRAPE THROUGH: ', document.hidden ? 'API' : 'UI')

  document.hidden ? scrapeFromApi(url || location.href) : scrapeFromUi()

  return true

}

function scrapeFromApi(url) {
  const qs = decodeURI(url).split('?')[1]
  const params = qs.split('&').reduce((obj, item) => {
    const [key, val] = item.split('=')
    return { ...obj, [key]: val }
  }, {})



  const isPaused = window[`isPaused`]
  const jobStopped = window['jobStopped']

  // const isPaused = window[`isPaused`]

  // if (!isPaused && !window['jobStopped']) {


  chrome.runtime.sendMessage({
    type: 'SCRAPE_FROM_API',
    payload: {
      url: url,
      params
    }
  }, async function (response) {
    console.log('API SCRAPE RESPONSE: ', response)
    if (response.success && response.count > 0) {
      COUNTER += response.count
      if (!isPaused && !jobStopped) {

        if (COUNTER >= 50) {
          chrome.runtime.sendMessage({
            type: 'SET_CONTINUE_URL',
            payload: {
              continueUrl: url
            }
          })

          await simulateTimeout(100)
          console.log('COUNTER: ', COUNTER)
          console.log('GET NEXT SEARCH TERM [1]')
          getNextSearchTerm()
        } else {
          console.log('(API SCRAPE): calling scrape profile data')
          const comps = response.url.split('&page=')
          const url = [comps[0], parseInt(comps[1]) + 1].join('&page=')
          scrapeProfileData({ fromApi: true, url })
        }
      }
    } else {
      console.log('GET NEXT SEARCH TERM [0], isExhausted true')
      getNextSearchTerm(true)
    }
  })
}


async function scrapeFromUi() {
  console.log('SCRAPE FROM UI CALLED')
  window.scrollTo(0, document.body.scrollHeight);

  let isNewUi = false
  let cont_div = $("li.search-result");
  if (cont_div.length == 0 || !cont_div) {
    cont_div = $(".search-results__list > li");
    if (cont_div.length == 0 || !cont_div) {
      cont_div = $(".reusable-search__result-container")
      isNewUi = true
    }
  }

  if (!cont_div || cont_div.length === 0) {
    getNextSearchTerm(true)
  }

  let profiles = cont_div
  const transformed = []

  const qs = decodeURI(location.href).split('?')[1]
  const params = qs.split('&').reduce((obj, item) => {
    const [key, val] = item.split('=')
    return { ...obj, [key]: val }
  }, {})

  for (i = 0; i < profiles.length; i++) {
    var scrapeData = getUserInformationNew($(profiles[i]).html(), isNewUi);

    if (profiles[i].getElementsByClassName('search-result__result-link')[0]) {
      scrapeData.link = profiles[i].getElementsByClassName('search-result__result-link')[0].href;

    }

    if (scrapeData.linkedinId && scrapeData.linkedinId.length) {

      scrapeData.recruiterLink = "";
      scrapeData.search_keywords = params.keywords || '';
      scrapeData.result_position = i

      transformed.push(scrapeData)

    }
  }

  COUNTER += transformed.length

  chrome.runtime.sendMessage({
    type: 'POST_QUICK',
    payload: transformed
  })



  await simulateTimeout(1000)

  const isNextPageAvailable = checkIfNextPageExists()

  const isPaused = window[`isPaused`]

  if (!isPaused && !window['jobStopped']) {
    if (isNextPageAvailable && COUNTER <= 50) {
      document.getElementsByClassName("artdeco-pagination__button--next")[0].click()
      scrapeProfileData({ fromApi: false, url: null })
    } else {
      if ((!isNextPageAvailable && !(COUNTER >= 50)) || (!isNextPageAvailable && (COUNTER >= 50))) {
        getNextSearchTerm(true)
      }
      if (isNextPageAvailable && COUNTER >= 50) {
        chrome.runtime.sendMessage({
          type: 'SET_CONTINUE_URL',
          payload: {
            continueUrl: location.href
          }
        })
        await simulateTimeout(100)
        getNextSearchTerm()
      }
      if (!isNextPageAvailable && (COUNTER >= 50)) {
        getNextSearchTerm(true)
      }
    }
  }

}



function checkIfNextPageExists() {
  console.log('CHECK IF NEXT PAGE EXISTS: called')
  window.scrollTo(0, document.body.scrollHeight);
  // setTimeout(())
  var x = document.getElementsByClassName("artdeco-pagination__button--next");

  // if (SET_RECRUITER == 1) {
  //   x = document.querySelectorAll("#pagination > div > ul > li.next > a");

  // }

  let r
  if (x.length > 0) {
    r = true
    if (x[0].disabled == true) {
      r = false
    }
  } else {
    r = false
  }

  console.log('CHECK IF NEXT PAGE EXSITS RETURNING: ', r)
  return r
}

function startCollection(request, sender, sendResponse) {
  console.log('START COLLECTION FUNCTION CALLED....., ', request)
  // alert('start collection')
  const jobId = request.payload.jobId
  // console.log('SETTING CURRENT JOB ID = ', jobId)

  // console.log('START COLLECTION AGAINST: ', jobId)
  getSearchTermToCollectAgainst(jobId)
  window[`collectInterval`] = setInterval(() => getSearchTermToCollectAgainst(jobId), 1000)
}

function getSearchTermToCollectAgainst(jobId) {
  console.log('GET SEARCH TERM TO COLLECT AGAINST')
  // ask background for a search term, when a search term is found, start collecting
  chrome.runtime.sendMessage({
    type: 'GET_SEARCH_TERM_FOR_COLLECTION',
    payload: jobId
  }, function (response) {
    if (response) {

      console.log('SEARCH TERM RESPONSE IS: ', response)
      if (response.searchTerm) {
        clearInterval(window[`collectInterval`])
        console.log('START VISITING [1]')
        startVisiting(jobId, response)
      }

      if (response.exhausted) {
        clearInterval(window[`collectInterval`])
      }
    }
  })
}

function startVisiting(jobId, data) {
  console.log('START VISITING CALLED')
  console.log('START PROSPECT COLLECTION AGAINST SEARCH TERM AND JOB: ', { jobId, data })

  // CURRENT_SEARCHTERM = data.searchTerm.searchTermValue
  let url
  if (data.searchTerm.continueUrl) {
    url = data.searchTerm.continueUrl
  } else {
    const urlComps = data.mainSearchUrl.split('?')
    const qs = urlComps[1]
    const params = qs.split('&').reduce((obj, item) => {
      const [key, value] = item.split('=')
      return { ...obj, [key]: key === 'keywords' ? encodeURIComponent(data.searchTerm.searchTermValue) : value }
    }, {})

    const newQs = Object.keys(params).reduce((str, item, index, arr) => {
      const portion = (index === arr.length - 1) ? `${item}=${params[item]}` : `${item}=${params[item]}&`
      return str += portion
    }, ``)

    url = `${urlComps[0]}?${newQs}&page=2`
  }

  console.log('SETTING CURRENT SEARCH TERM TO: ', data.searchTerm)

  // if (document.hidden) {

  // } else {
  chrome.runtime.sendMessage({
    type: 'UPDATE_URL',
    payload: url,
    jobId: jobId
  })
  // }



}


function simulateTimeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

async function applySingleIndustryFilter(industryName, isNewUi) {
  if (isNewUi) {
    $('.mt4').each(function (i, e) {
      if (this.outerText.trim() === 'Add an industry') {
        $(e).find('button').click()
      }
    })

    await simulateTimeout(500)

    $('.mt4.pl0').each(function (i, e) {
      let inputElem = $(e).find('input[placeholder="Add an industry"]')
      if (inputElem.length !== 0) {
        $(inputElem[0]).click()
        $(inputElem[0]).focus()
        $(inputElem[0]).sendkeys(industryName.substring(0, industryName.length - 1))
      }
    })
  } else {
    // alert('applying industry filter')
    $('input[placeholder="Add an industry"]').click();
    $('input[placeholder="Add an industry"]').focus();
    $('input[placeholder="Add an industry"]').sendkeys(industryName.substring(0, industryName.length - 1));
  }

  await simulateTimeout(500)


  const options = $('.basic-typeahead__selectable')
  const industryElements = []
  if (options) {
    options.each(function () {
      if (this.innerText.trim().startsWith(industryName.trim())) {
        industryElements.push(this)
      }
    })

  }
  if (industryElements[0]) {
    industryElements[0].click()
  }

  await simulateTimeout(1000)

  return true
}

function applyIndustryFilters(industryNames, isNewUi) {
  return industryNames.reduce((p, industry) =>
    p.then(() => applySingleIndustryFilter(industry, isNewUi))
    , Promise.resolve())
}

async function applySingleLocationFilter(location, isNewUi) {
  if (isNewUi) {
    $('.mt4').each(function (i, e) {
      if (this.outerText.trim() === 'Add a location') {
        $(e).find('button').click()
      }
    })

    $('.mt4.pl0').each(function (i, e) {
      let inputElem = $(e).find('input[placeholder="Add a location"]')
      if (inputElem.length !== 0) {
        $(inputElem[0]).click()
        $(inputElem[0]).focus()
        $(inputElem[0]).sendkeys(location.substring(0, location.length - 1))
      }
    })
  } else {
    $('input[placeholder="Add a country/region"]').click();
    $('input[placeholder="Add a country/region"]').focus();
    //$('input[placeholder="Add a country/region"]').val(location);
    $('input[placeholder="Add a country/region"]').sendkeys(location.substring(0, location.length - 1));

  }

  await simulateTimeout(1000)

  const options = $('.basic-typeahead__selectable')
  const locElements = []

  if (options) {
    options.each(function () {
      // locNames.push(this.innerText)
      if (this.innerText.trim().toLowerCase().startsWith(location.trim().toLowerCase())) {
        locElements.push(this)
      }
    })

  }
  if (locElements[0]) {
    locElements[0].click()
  } else {
    if (options[0]) {
      options[0].click()
    }
  }

  await simulateTimeout(1000)

  return true


}

// setInterval(() => {
//   console.log('FILTERS APPLIED: ', FILTERS_APPLIED)
// }, 500)

async function applyLocationsFilter(locations, isNewUi) {
  locations.reduce((p, location, i) => {
    return p.then(() => applySingleLocationFilter(location, isNewUi))
  }, Promise.resolve())
}


async function applyFilters(job, sendResponse) {
  console.log('APPLYING FILTERS')
  APPLYING_FILTERS = true
  FILTERS_APPLIED = false

  await simulateTimeout(3500)

  const location = job.jobArray.filter(item => item.tag === "JOB_LOCATION")
  const industires = job.jobArray.filter(item => item.tag === "COMPANY_INDUSTRY_SPECIALTIES")

  const locationNames = location.length > 0 ? location[0].data.map(item => typeof(item) === 'string' ? item : item.name) : []

  let industryNames = []

  if (industires.length > 0) {
    industryNames = industires[0].data.filter(item => item.score == 5).map(item => item.name)
  }

  // console.log('INDUSTRY NAMES ARE: ', industryNames)

  let allFiltersTriggerElement = $('button[data-control-name*="all_filters"]')

  console.log('ALL FILTERS TRIGGER ELEMENT: ', allFiltersTriggerElement)

  if (allFiltersTriggerElement.length === 0) {
    allFiltersTriggerElement = $('button[data-control-name*="filter_all_text"]')
    // console.log('no element found to click')
  }


  console.log('ALL FILTERS TRIGGER ELEMENT: ', allFiltersTriggerElement)


  if (allFiltersTriggerElement.length === 0) {
    allFiltersTriggerElement = $('button[aria-label*="All filters"]')
  }


  console.log('ALL FILTERS TRIGGER ELEMENT: ', allFiltersTriggerElement)


  allFiltersTriggerElement[0].click();

  let locationInput = $('input[placeholder="Add a country/region"]')

  const isNewUi = locationInput.length === 0

  applyLocationsFilter(locationNames, isNewUi)
  await simulateTimeout(locationNames.length * 2200)
  applyIndustryFilters(industryNames, isNewUi)
  const timeout = isNewUi ? industryNames.length * 2000 : industryNames.length * 1700
  console.log('TIMEOUT IS: ', timeout)
  await simulateTimeout(timeout)

  if (isNewUi) {
    $('.search-reusables__secondary-filters-show-results-button').click()
  } else {
    $('button[class*="search-advanced-facets__button--apply"]')[0].click();
  }

  // APPLYING_FILTERS = false
  FILTERS_APPLIED = true

  // console.log('>>>>>>>>>>>>>>>>>>>>>SEND MESSAGE TO SET POPUP STEP')

  // chrome.runtime.sendMessage({
  //   type: 'SET_POPUP_STEP',
  //   payload: 4
  // })

  await simulateTimeout(100)
  sendResponse(true)


}













function getUserInformationNew(objStr, newUi = false) {
  console.log('GET USER INFORMATION', objStr);

  // console.log(objStr);

  var linkedInId, name, entityUrn, designation, profilePicture, locality, companyName, phoneNumber, website, skills, certification, education, experience, source;
  var STROBJ = $(objStr);
  var postedData = {
    linkedinId: "",
    entityUrn: "",
    url: ""
  };
  // previously:   if (SET_RECRUITER == 1)
  if (false) {
    try {

      postedData.full_name = STROBJ.find('.search-result-profile-link').text();
      postedData.firstName = postedData.full_name.split(" ")[0];
      postedData.lastName = postedData.full_name.split(" ")[1];
      postedData.connection_degree = escapeHtml(STROBJ.find(".degree-icon").text());
      postedData.degree = escapeHtml(STROBJ.find(".degree-icon").text());
      postedData.scrapeType = "QUICK";
      postedData.headline = escapeHtml(objStr.split('<p class="headline">')[1].split('</p>')[0]);

      if (postedData.headline.includes(" at ")) {
        postedData.title = postedData.headline.split(" at ")[0].replace(" at ", "");
        postedData.current_company_name = postedData.headline.split(" at ")[1];
      }
      else {

        postedData.title = postedData.headline;
        postedData.current_company_name = "";

      }
      postedData.locality = escapeHtml(objStr.split('<p class="location">')[1].split('</span>')[0]);
      postedData.image_url = "";

    }
    catch (e) {
      console.log(e);
    }

  }
  else {
    try {
      if (newUi) {
        postedData = { ...postedData, ...getUserInformationNewUiNew(objStr) }
      } else {
        var regPersonName = objStr.match(/<span.*class=".*name.*actor-name.*?">(.+?)<\/span>/mi);
        console.log('regPersonName: ', regPersonName)
        var regPersonId = objStr.match(/href="\/in\/(.+)\/"/i);
        console.log('regPersonId: ', regPersonId)

        if (regPersonId && typeof regPersonId[1] !== 'undefined')
          linkedInId = regPersonId[1];
        if (regPersonId && typeof regPersonId[0] !== 'undefined')
          postedData.profileUrl = regPersonId[0].match(/href="\/(.+?)"/i)[1];

        if (typeof regPersonName === null) {
          postedData.full_name = escapeHtml($('span.name.actor-name').text());
        } else {
          if (regPersonName && regPersonName[1])
            postedData.full_name = escapeHtml(regPersonName[1]);
        }

        postedData.headline = escapeHtml(STROBJ.find('a.search-result__result-link').next('p').html());
        if (postedData.headline.indexOf(' at ') > 0) {
          postedData.current_company_name = (postedData.headline.split(' at ')[1]).trim();
        } else {
          postedData.current_company_name = STROBJ.find('p.search-result__snippets').text().replace('Actual:', '');
          if (postedData.current_company_name.indexOf(' at ') >= 0) {
            postedData.current_company_name = postedData.current_company_name.split(' at ')[1];
          } else if (postedData.current_company_name.indexOf(' en ') >= 0) {
            postedData.current_company_name = postedData.current_company_name.split(' en ')[1];
          } else if (postedData.current_company_name.indexOf(' of ') >= 0) {
            postedData.current_company_name = postedData.current_company_name.split(' of ')[1];
          }
        }
        var regPersonPosition2 = objStr.match(/(.+?) at/i);
        var regPersonCompany3 = objStr.match(/ at (.*)/i) || objStr.match(/ en (.*)/i);
        if (regPersonCompany3 && regPersonCompany3[1]) {
          postedData.current_company_name = regPersonCompany3[1];
        }
        var regPersonLocality = objStr.match(/<p.*class="subline-level-2.*search-result__truncate">\s*([\s\S]+?)\s*<\/p>/mi);
        if (regPersonLocality && typeof regPersonLocality[1] !== 'undefined')
          postedData.locality = escapeHtml(regPersonLocality[1]);
        var regPersonDescription = objStr.match(/<p.*class="subline-level-1.*search-result__truncate">\s*([\s\S]+?)\s*<\/p>/mi);
        var imageObj = STROBJ.find('.search-result__image-wrapper .presence-entity__image');
        //profilePicture = imageObj.css('background-image');
        profilePicture = imageObj.attr('src');
        profilePicture = /^url\((['"]?)(.*)\1\)$/.exec(profilePicture);
        postedData.image_url = (profilePicture && profilePicture != null) ? profilePicture[2] : ""; // If matched, retrieve url, otherwise ""
        if (postedData.image_url == "") {
          regPersonImage = objStr.match(/class="lazy-image .*loaded".*?src="(.+?)"/mi);
          postedData.image_url = regPersonImage && regPersonImage[1] ? regPersonImage[1] : "";
        }
        //postedData.image_url = postedData.image_url.replace(';', '&');
        postedData.image_url = imageObj.prop('src');

        if (!postedData.image_url)
          postedData.image_url = "";

        companyName = "";

        postedData.connection_degree = escapeHtml(objStr.split('<span class="dist-value">')[1].split('</span>')[0]);

        postedData.degree = postedData.connection_degree;

        /*
        var degree = /<span class="dist-value">(.+?)<\/span>/mi.exec(objStr);
        if (degree) {
          postedData.connection_degree = degree[1];
        }
        */

        if (regPersonCompany3 !== null)
          if (typeof regPersonCompany3[1] !== 'undefined') {
            companyName = regPersonCompany3[1];
          }
        designation = regPersonPosition2 ? regPersonPosition2[1] : ((regPersonDescription) ? regPersonDescription[1] : "");

        var titleString = "";

        if (designation) {
          titleString = escapeHtml(designation);

          if (titleString.includes(":")) {
            titleString = titleString.split(":")[1];

          }

        }

        console.log("DDD " + titleString);

        postedData.title = titleString;

        source = "Basic";
        postedData.linkedinId = decodeURIComponent(linkedInId);

        postedData.scrapeType = "QUICK"; // Quick Collection

        postedData.recruiterLink = "";

        postedData.firstName = postedData.full_name.split(" ")[0];
        postedData.lastName = postedData.full_name.split(" ")[1];

        /*
        if(typeof postedData.connection_degree !== 'undefined')
        {
          postedData.degree = escapeHtml(postedData.degree);
          postedData.connection_degree = escapeHtml(postedData.degree);
        }
        */

        postedData.profileUrl = LINKEDIN_DOMAIN_URL + postedData.profileUrl;
      }

    } catch (e) {
      console.log(e);
    }

  }

  // console.log('FUNCTION GET USER INFORMATION RETURNING: ', postedData)
  return postedData;
}


function getUserInformationNewUiNew(element) {
  const obj = {}

  const imgUrl = $(element).find('img').attr('src') || ""

  // console.log('IMAGE URL: ', imgUrl)

  obj.image_url = imgUrl
  let content = $(element).find('.entity-result__content')

  // console.log('CONTENT: ', content)

  let nameAndLink = content.find(`[data-control-name='entity_result']`)//content.find('.search-result__result-link')

  if (nameAndLink.length == 0) {
    nameAndLink = content.find('.app-aware-link')
  }

  // console.log('NAME AND LINK: ', nameAndLink)

  const link = nameAndLink.attr('href');

  // console.log('LINK: ', link)

  const name = nameAndLink.find('span')[1].innerText

  // console.log('NAME: ', name)


  // console.log('name: ', { name, link })

  const linkedinId = link.split('/').pop()

  let degree = content.find('.entity-result__badge').find('.entity-result__badge-text')[0].innerText.trim()
  degree = degree.substring(degree.length - (degree.endsWith('+') ? 4 : 3), degree.length)

  const titleAndCompany = content.find('.entity-result__primary-subtitle')[0].innerText.trim()
  const [title, currentCompany] = titleAndCompany.split(' at ').map(i => i.trim())

  const locality = content.find('.entity-result__secondary-subtitle')[0].innerText.trim()

  obj.linkedinId = decodeURIComponent(linkedinId)
  obj.full_name = name
  obj.firstName = name.split(' ')[0]
  obj.lastName = name.split(' ')[1]
  obj.profileUrl = link
  obj.link = link
  obj.scrapeType = 'QUICK'
  obj.recruiterLink = ''
  obj.degree = degree
  obj.connection_degree = degree
  obj.title = title
  obj.headline = title
  obj.current_company_name = currentCompany || ""
  obj.locality = locality

  return obj
}