export * from './searchTerms.js'
import { API_HOST, API_HOST_PENCILIT, PENCILIT_API_KEY } from '../../config/index.js'

export const getToken = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('recruiterID', function (result) {
      if (result['recruiterID']) {
        resolve(result['recruiterID'])
      } else {
        reject('Not Found')
      }
    })
  })
}

export const sendMessageToActiveTab = (message) => new Promise((resolve, reject) => {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
        if (response) {
          resolve(response)
        } else {
          reject(response)
        }
      })
    }
  })
})

export const messageRuntime = ({ type, payload }) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      type,
      payload
    }, function (response) {
      resolve(response)
    })
  })
}

export const updateCurrentTab = (options) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]) {
      chrome.tabs.update(tabs[0].id, options)
    }
  })
}

export const getCurrentTabUrl = () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      if (tabs[0]) {
        resolve(tabs[0].url)
      } else {
        reject('NO TAB FOUND')
      }
    })
  })
}


export const simulateTimeout = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export const getCsrf = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('csrf_token', (r) => {
      resolve(r['csrf_token'])
    })
  })
}

export const getCsrfToken = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('csrf_token', ({ csrf_token }) => {
      resolve(csrf_token)
    })
  })
}

export const getCardinalCsrfToken = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('CARDINAL_CSRF_Token', ({ csrf_token }) => {
      resolve(csrf_token)
    })
  })
}

export const callLinkedinApi = (api, options) => {
  const HOST = 'https://www.linkedin.com'
  return new Promise((resolve, reject) => {
    getCsrfToken()
      .then(csrf => {
        return fetch(`${HOST}${api}`, {
          ...options,
          headers: {
            ...options.headers,
            'csrf-token': csrf
          }
        })
      })
      .then(res => {
        // console.log('RES BEFORE: ', res)
        // console.log('RES status:', res.status)

        if (res.status > 299) {
          throw new Error(`error_${res.status}`)
        }
        return res.json()
      })
      .then(res => {
        // console.log('res ================================================: ', res)
        // console.log('LI API RES: ', res)
        resolve(res)
      })
      .catch(err => {
        // console.log('LI API ERROR: ', err)
        if (err.message.startsWith('error_')) {
          const [, code] = err.message.split('_')
          resolve({
            error: true,
            code: code
          })
        } else {
          resolve(null)
        }
      })
  })

}

export const visitApiProfile = (publicIdentifier) => {
  return new Promise((resolve, reject) => {
    const payload = {
      experience: [],
      publications: [],
      education: [],
      skills: [],
      publicIdentifier: '',
      industryCode: '',
      picture: '',
      scrapeType: 'DEEP',
      trackingId: '',
      locationName: '',
      postalCode: '',
      versionTag: '',
      schoolName: '',
      fieldOfStudy: '',
      title: '',
      companyName: '',
      languages: [],
      firstName: '',
      lastName: '',
      full_name: '',
      entityUrn: '',
      headline: '',
      summary: '',
      industry: '',
      image_url: '',
      locality: '',
      country_code: '',
      primary_email: '',
      phone_number: '',
      current_company_website: '',
      company_linkedin_url: '',
      current_company_specialties: '',
      current_company_size: '',
      current_company_name: '',
      current_company_industry: ''
    }

    callLinkedinApi(`/voyager/api/identity/profiles/${publicIdentifier}/profileView`, { method: 'GET', headers: {} })
      .then(data => {
        // console.log('PROFILE IS: ', data)
        const companyCode = (data.positionView.elements.length > 0 && data.positionView.elements[0].companyUrn) ?
          data.positionView.elements[0].companyUrn.split(':').pop() : ''

        // console.log('company code is: ', companyCode)
        const profUrn = data.profile.entityUrn.replace('urn:li:fs', 'urn:li:fsd')
        const profUrl = encodeURIComponent(profUrn)
        // console.log('profile url: ', profUrl)

        return Promise.all([
          data,
          callLinkedinApi(`/voyager/api/identity/profiles/${publicIdentifier}/profileContactInfo`, { method: 'GET', headers: {} }),
          companyCode !== '' ? callLinkedinApi(`/voyager/api/organization/companies/${companyCode}`, { method: 'GET', headers: {} }) : Promise.resolve(null),
          callLinkedinApi(`/voyager/api/identity/profiles/${publicIdentifier}/skillCategory?includeHiddenEndorsers=true`, { method: 'GET', headers: {} }),
          callLinkedinApi(`/voyager/api/identity/dash/profilePositionGroups?q=viewee&profileUrn=${profUrl}&decorationId=com.linkedin.voyager.dash.deco.identity.profile.FullProfilePositionGroup-27&count=50&start=0`, { method: 'GET', headers: {} })
        ])
      })
      .then(([
        profileView,
        contactInfo,
        company,
        profileSkills,
        profileExperiences

      ]) => {

        // console.log('LAST THEN BLOCK: ', { profileView, contactInfo, company, profileSkills, profileExperiences })

        const data = profileView.profile

        payload.publicIdentifier = data.miniProfile.publicIdentifier
        payload.industryCode = data.industryUrn ? data.industryUrn.replace(/urn:li:fs_industry:/, "") : "";

        if (data.miniProfile.picture) {
          const config = data.miniProfile.picture["com.linkedin.common.VectorImage"];
          payload.picture = config.artifacts && 0 < config.artifacts.length ? config.rootUrl + "" + config.artifacts.splice(-1)[0].fileIdentifyingUrlPathSegment : "";
        } else {
          payload.picture = "";
        }

        payload.trackingId = data.miniProfile.trackingId;
        payload.locationName = data.locationName;
        payload.postalCode = data.location && data.location.basicLocation && data.location.basicLocation.postalCode || "";
        payload.versionTag = data.versionTag;

        if (profileView.educationView && profileView.educationView.elements && 0 < profileView.educationView.elements.length) {
          payload.schoolName = profileView.educationView.elements[0].schoolName || "";
          payload.fieldOfStudy = profileView.educationView.elements[0].fieldOfStudy || "";
        } else {
          payload.schoolName = "";
          payload.fieldOfStudy = "";
        }

        // left experiences here

        payload.languages = profileView.languageView && profileView.languageView.elements && 0 < profileView.languageView.elements.length ? profileView.languageView.elements.map(function (a) {
          return a.name;
        }).toString() : "";


        payload.firstName = data.firstName;
        payload.lastName = data.lastName;
        payload.full_name = payload.firstName + " " + payload.lastName;
        payload.entityUrn = data.entityUrn.replace(/urn:li:fs_data:/, '');
        payload.headline = data.headline;
        payload.title = data.headline
        payload.summary = data.summary;
        payload.industry = data.industryName;


        if (data.miniProfile.picture) {
          var vectorImg = data.miniProfile.picture['com.linkedin.common.VectorImage'];
          if (vectorImg.artifacts && vectorImg.artifacts.length > 0) {
            payload.image_url = vectorImg['rootUrl'] + '' + vectorImg.artifacts.splice(-1)[0].fileIdentifyingUrlPathSegment;
          }
        }

        payload.locality = data.locationName;

        if (data.location.basicLocation.countryCode)
          payload.country_code = data.location.basicLocation.countryCode;

        if (profileView.publicationView.elements.length) {
          profileView.publicationView.elements.forEach(function (v) {
            const info = { authors: [] };
            info.url = v.url;
            info.title = v.name;
            info.publisher = v.publisher;
            info.summary = "";
            if (v.authors.length) {
              for (var i = 0; i < v.authors.length; i++) {
                var authorInfo = {};
                if (typeof v.authors[i].member !== 'undefined') {
                  if (typeof v.authors[i].member.url !== 'undefined')
                    authorInfo.url = v.authors[i].member.url;
                  if (typeof v.authors[i].member.firstName !== 'undefined')
                    authorInfo.full_name = v.authors[i].member.firstName;
                  if (typeof v.authors[i].member.lastName !== 'undefined')
                    authorInfo.full_name += " " + v.authors[i].member.lastName;
                }
                info.authors.push(authorInfo);
              }
            }
            payload.publications.push(info);
          });
        }

        if (profileView.educationView.elements.length) {
          profileView.educationView.elements.forEach(function (v) {

            let fieldOfStudy = v.fieldOfStudy || "";
            let degreeName = v.degreeName || "";

            let start = "", end = "";

            if (typeof v.timePeriod != 'undefined') {
              if (typeof v.timePeriod.startDate !== 'undefined') {
                if (typeof v.timePeriod.startDate.month !== 'undefined') {
                  start = v.timePeriod.startDate.month;
                  if (typeof v.timePeriod.startDate.year !== 'undefined') {
                    start += "-" + v.timePeriod.startDate.year;
                  }
                }
                else if (typeof v.timePeriod.startDate.year !== 'undefined') {
                  start += v.timePeriod.startDate.year;
                }
              }

              if (typeof v.timePeriod.endDate !== 'undefined') {
                if (typeof v.timePeriod.endDate.month !== 'undefined') {
                  end = v.timePeriod.endDate.month;
                  if (typeof v.timePeriod.endDate.year !== 'undefined') {
                    end += "-" + v.timePeriod.endDate.year;
                  }
                }
                else if (typeof v.timePeriod.endDate.year !== 'undefined') {
                  end += v.timePeriod.endDate.year;
                }
              }

            }

            payload.education.push({
              "schoolName": v.schoolName,
              "fieldOfStudy": fieldOfStudy,
              "degreeName": degreeName,
              "start": start,
              "end": end
            });
          });
        }

        if (contactInfo && contactInfo.emailAddress) {
          payload.primary_email = contactInfo.emailAddress || "";
        }
        if (contactInfo && contactInfo.phoneNumbers) {
          payload.phone_number = contactInfo.phoneNumbers.map(x => x.number).toString() || "";
        }

        if (company) {
          payload.current_company_website = company.companyPageUrl;
          payload.company_linkedin_url = company.url;
          payload.current_company_specialties = (company.specialities).join(", ");
          payload.current_company_size = company.staffCount + " employees";
          payload.current_company_name = company.name;
          payload.current_company_industry = (company.industries && company.industries.length) ? (company.industries).join(', ') : "";
        }

        if (profileSkills.elements.length) {
          // console.log('ALL SKILLS ARE: ', allSkills)
          // const filteredSkills = profileSkills.elements.filter(item => ["TOP", "INDUSTRY_KNOWLEDGE", "TOOLS_TECHNOLOGIES", "NONE", "INTERPERSONAL"].includes(item.type)) //SPOKEN_LANGUAGES
          //   .map(item => item.endorsedSkills)

          const filteredSkills = profileSkills.elements.map(item => item.endorsedSkills)


          const skillNames = []
          filteredSkills.forEach(fs => {
            fs.forEach(sk => {
              skillNames.push(sk.skill.name)
            })
          })

          payload.skills = skillNames
        }

        if (profileExperiences.elements.length) {
          const profilePositions = _.flattenDeep(profileExperiences.elements.map(item => item.profilePositionInPositionGroup.elements))
            .map(item => {
              const company = item.company
              const dateRange = _.get(item, 'dateRange', null)


              const start = (dateRange && dateRange.start) ?
                `${dateRange.start.month ?
                  `${dateRange.start.month}-${dateRange.start.year}` :
                  `${dateRange.start.year ? `${dateRange.start.year}` :
                    ``}`}` :
                ``
              const end = (dateRange && dateRange.end) ?
                `${dateRange.end.month ?
                  `${dateRange.end.month}-${dateRange.end.year}` :
                  `${dateRange.end.year ? `${dateRange.end.year}` :
                    ``}`}` :
                ``

              const industryObj = _.get(company, 'industry', {})
              let industries = []

              for (let prop in industryObj) {
                industries.push(industryObj[prop].name)
              }


              return {
                company_name: _.get(company, 'name', ''),
                description: _.get(item, 'description', ''),
                end: end,
                industries: industries,
                location: _.get(item, 'locationName', ''),
                start: start,
                title: _.get(item, 'title', '')
              }
            })

          payload.experience = profilePositions
          payload.title = profilePositions[0] ? profilePositions[0].title : payload.title
        }

        return payload
      })
      .then(payload => {
        resolve(payload)
      })
      .catch(err => {
        reject(err)
      })

  })
}

export const manualApiCall = (endpoint, options) => {
  const apiSourceDefault = API_HOST
  const url = `${apiSourceDefault}${endpoint}`
  return new Promise((resolve, reject) => {
    getToken()
      .then(token => {
        return fetch(url, { ...options, headers: { ..._.get(options, 'headers', {}), 'Authorization': token } })
          .then(res => res.json())
          .then(json => {
            resolve(json)
          })
          .catch(err => {
            reject(err)
          })
      })
  })
}

export const manualApiCallPencilit = (endpoint, options) => {
  const apiSourceDefault = API_HOST_PENCILIT
  const url = `${apiSourceDefault}${endpoint}`
  return new Promise((resolve, reject) => {
    return fetch(url, { ...options, headers: { ..._.get(options, 'headers', {}), 'x-api-key': PENCILIT_API_KEY } })
      .then(res => res.json())
      .then(json => {
        resolve(json)
      })
      .catch(err => {
        reject(err)
      })
  })
}


export const extractPublicIdentifier = (profileUrl) => {
  const cleansedProfileUrl = profileUrl.split('?')
  return cleansedProfileUrl[0].split('/').filter(item => item).pop()
}

// var msg_url = LINKEDIN_DOMAIN_URL + 'voyager/api/messaging/conversations?action=create';
// var msg_post_data = JSON.stringify({
//   "conversationCreate": {
//     "eventCreate": {
//       "value": {
//         "com.linkedin.voyager.messaging.create.MessageCreate": {
//           "body": message,
//           "attachments": []
//         }
//       }
//     },
//     "recipients": [entityUrn],
//     "subtype": "MEMBER_TO_MEMBER"
//   }
//   , "keyVersion": "LEGACY_INBOX"
// });
export const isEmpty = value =>

  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);






export const transformCsvData = (dt) => {
  return dt
    .map((itm, idx) => {
      const {
        fullName,
        age,
        gender,
        ethnicity,
        currentCompanyName,
        headline,
        education,
        experience,
        industry,
        locality,
        profileUrl,
        visa_status,
        skills,
        summary,
        scoring: {
          experience_found,
          skill_importance,
          education_score,
          education_total,
          experience_score,
          experience_total,
          skill_score,
          skill_total,
          title_score,
          title_total,
        }
      } = itm

      const Total_Education = education ?
        education.map(edObject => {
          const ed = []
          for (const [key, value] of Object.entries(edObject)) {
            switch (key) {
              case ('degreeName'): {
                ed.push(`Degree Name: ${value}`)
                break;
              }
              case ('start'): {
                ed.push(`Start Date: ${value}`)
                break
              }
              case ('end'): {
                ed.push(`End Date: ${value}`)
                break
              }
              case ('fieldOfStudy'): {
                ed.push(`Field of Study: ${value}`)
                break
              }
              case ('schoolName'): {
                ed.push(`School Name: ${value}`)
                break
              }
              default:
                ed.push(`${value}`);
            }
          }
          return ed.join(' ')
        }).join('/ ') : ''

      const Total_Experience = experience ?
        experience.map(expObject => {
          const exp = []
          for (const [key, value] of Object.entries(expObject)) {
            switch (key) {
              case ('company_name'): {
                exp.push(`Company Name: ${value
                  .replace(/\n/g, ' ')
                  .replace(/,/g, '\,')
                  .replace(/'/g, '\'')}`)
                break;
              }
              case ('start'): {
                exp.push(`Start Date: ${value}`)
                break
              }
              case ('end'): {
                exp.push(`End Date: ${value}`)
                break
              }
              case ('location'): {
                exp.push(`Location: ${value}`)
                break
              }
              case ('title'): {
                exp.push(`Job Title: ${value
                  .replace(/\n/g, ' ')
                  .replace(/,/g, '\,')
                  .replace(/'/g, '\'')}`)
                break
              }
              case ('industries'): {
                exp.push(`Industry: ${value.join('/ ')
                  .replace(/\n/g, ' ')
                  .replace(/,/g, '\,')
                  .replace(/'/g, '\'')}`)
                break
              }
              case ('description'): {
                break
              }
              default:
                exp.push(`${value}`);
            }
          }
          return exp.join(' ')
        }).join('/ ') : ''

      const Sex = gender ?
        parseFloat(gender.male) > parseFloat(gender.female) ?
          'Male' : 'Female' : ''

      let EthnicityString = ''
      if (ethnicity) {
        let maxEthnicity = 0.0
        for (const [key, value] of Object.entries(ethnicity)) {
          if (parseFloat(value) > maxEthnicity) {

            maxEthnicity = parseFloat(value);
            EthnicityString = key;
          }
        }
      }


      return {
        Full_Name: fullName ? fullName : '',
        Age: age ? age : '',

        Sex,
        EthnicityString,

        Company: currentCompanyName ? currentCompanyName : ' ',
        Headline: headline ? headline
          .replace(/\n/g, ' ')
          .replace(/,/g, '\,')
          .replace(/'/g, '\'') : '',

        Education_Score: education_score && education_total ?
          `${Math.round(education_score)} out of ${education_total}` : '',

        Experience_Score: experience_score && experience_total ?
          `${Math.round(experience_score)} out of ${education_total}` : '',

        Skill_Score: skill_score && skill_total ?
          `${Math.round(skill_score)} out of ${skill_total}` : '',

        Title_Score: title_score && title_total ?
          `${Math.round(title_score)} out of ${title_total}` : '',

        Total_Education,
        Total_Experience,

        Relevant_Experience: experience_found ?
          experience_found.join('\n ') : '',

        Total_Skills: skills ?
          skills.join(' | ') : '',

        Important_Skills: skill_importance ? skill_importance.important ?
          skill_importance.important : '' : '',

        Must_Haves_Skills: skill_importance ? skill_importance.must_haves ?
          skill_importance.must_haves : '' : '',

        Nice_To_Haves_Skills: skill_importance ? skill_importance.nice_to_haves ?
          skill_importance.nice_to_haves : '' : '',

        Industry: industry ? industry : '',
        Location: locality ? locality : '',
        ProfileURL: profileUrl ? profileUrl : '',
        Visa: visa_status ? visa_status : '',
        Summary: summary ? summary
          .replace(/\n/g, ' ')
          .replace(/,/g, '\,')
          .replace(/'/g, '\'') : '',
      }
    })
}

export async function sendMessageFirstConnection(fullName, message) {
  try {
    let r = false
    const resp = await callLinkedinApi(`/voyager/api/messaging/conversations?createdBefore=${Date.now()}&keywords=${encodeURIComponent(fullName)}&q=search`, {
      method: 'GET',
      headers: {
        'x-restli-protocol-version': '2.0.0'
      }
    })

    const convos = resp.elements.filter(item =>
      fullName.toLowerCase().trim().startsWith(item.participants[0]['com.linkedin.voyager.messaging.MessagingMember'].miniProfile.firstName.toLowerCase().trim())
    )

    if (convos.length > 0) {
      const conversationId = convos[0].entityUrn.split(':').pop()

      console.log('CONVERSATION ID TO SEND MESSAGE AGAINST: ', conversationId)

      await callLinkedinApi(`/voyager/api/messaging/conversations/${conversationId}/events?action=create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-restli-protocol-version': '2.0.0'
        },
        body: JSON.stringify({ "eventCreate": { "value": { "com.linkedin.voyager.messaging.create.MessageCreate": { "attributedBody": { "text": message, "attributes": [] }, "attachments": [] } } }, "dedupeByClientGeneratedToken": false })
      })
      r = true
    }
    return r
  } catch (e) {
    console.log('AN error occured: ', e.message)
    return false
  }
}



export const jsonParse = (str) => {
  let r
  try {
    r = JSON.parse(str)
  }
  catch (e) {
    r = str
  }
  return r
}

export const parseLiQs = (url) => {
  let params = {}
  const queryString = url.split('?')[1]

  if (queryString) {
    const qsParams = queryString.split('&')

    params = qsParams.reduce((obj, item) => {
      const [key, value] = item.split('=')
      return {
        ...obj,
        [key]: jsonParse(decodeURIComponent(value))
      }
    }, {})
  }

  return params
}


export const getTabsMeta = () => new Promise((resolve, reject) => {
  chrome.storage.local.get('tabsMeta', function (r) {
    if (r['tabsMeta']) {
      resolve(r['tabsMeta'])
    } else {
      reject('Couldngt get tabs meta')
    }
  })
})

export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}



export const transformQuickProfilesApiData = (results, term = '') => {
  return results.map((item, i) => {
    const imageData = _.get(item, 'image.attributes[0].detailData.profilePicture.profilePicture.displayImageReference.vectorImage')
    const imageArtifacts = _.get(imageData, 'artifacts', null)
    // [0].fileIdentifyingUrlPathSegment

    const full_name = _.get(item, 'title.text', null)
    const [firstName, lastName] = full_name.split(' ')
    const navigationUrl = _.get(item, 'navigationUrl', '')
    const distance = _.get(item, 'entityCustomTrackingInfo.memberDistance', '2nd')
    const title = _.get(item, 'primarySubtitle.text', '')
    const location = _.get(item, 'secondarySubtitle.text', '')
    const summary = _.get(item, 'summary.text', '')

    const summaryFrag = summary.split('at').map(item => item.trim())[1]
    const currentCompany = summaryFrag ? summaryFrag.split('-').map(item => item.trim())[0] : ''

    const distanceDegreeMap = {
      'DISTANCE_1': '1st',
      'DISTANCE_2': '2nd',
      'DISTANCE_3': '3rd+'
    }

    return {
      linkedinId: extractPublicIdentifier(navigationUrl),
      entityUrn: item.entityUrn,
      url: '',
      image_url: imageArtifacts ? (imageData.rootUrl + imageArtifacts[0].fileIdentifyingUrlPathSegment) : null,
      full_name,
      firstName,
      lastName,
      profileUrl: navigationUrl,
      link: navigationUrl,
      scrapeType: 'QUICK',
      recruiterLink: '',
      degree: distanceDegreeMap[distance],
      connection_degree: distanceDegreeMap[distance],
      title,
      headline: title,
      current_company_name: currentCompany,
      locality: location,
      result_position: i,
      search_keywords: term
    }
  })

}

