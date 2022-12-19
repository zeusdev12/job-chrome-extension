import { callLinkedinApi, manualApiCall, simulateTimeout } from '../../../js/react/utils/index.js'
const LINKEDIN_DOMAIN_URL = 'https://www.linkedin.com'

const getFormatedConfirmedLocation = (data) => {
    return Array.isArray(data) ? 
        data.map(itm => {
            return ({
                ...itm,
                line1 : itm?.line1 ? itm?.line1.replace(/'/g,"''") : null,
                line2 : itm?.line2 ? itm?.line2.replace(/'/g,"''") : null,
                description : itm?.description ? itm?.description.replace(/'/g,"''") : null,
                city : itm?.city ? itm?.city.replace(/'/g,"''") : null,
            })
        }) : null
}

const getFormatedLocation = (data) => {
    return Array.isArray(data) ? 
        data.map(itm => {
            if(itm?.locations)
                return ({
                    ...itm,
                    localizedName: itm?.localizedName ? itm?.localizedName.replace(/'/g,"''") : null,
                    locations: Array.isArray(itm?.locations) ? 
                        itm.locations.map(loc => ({
                            ...loc,
                            city : itm?.city ? itm?.city.replace(/'/g,"''") : null,
                            description : itm?.description ? itm?.description.replace(/'/g,"''") : null,
                            line1 : loc?.line1 ? loc?.line1.replace(/'/g,"''") : null,
                            line2 : loc?.line2 ? loc?.line2.replace(/'/g,"''") : null
                        })): null
                })
            return ({
                ...itm
            })
        }) : null
}

const removeLastDateKey = (newDate, keys) => {
    for (const key in keys){
        if(key.match(/\d\d?-\d\d?-\d\d\d\d-companies/))
            return ({
                flag: true,
                lastKey: key
            })
    }
    return ({
        flag: false,
        lastKey: newDate
    })
}

const getLimit = (dateKey) => new Promise((resolve, reject) => {
    chrome.storage.local.get(r => {
        const {flag, lastKey} = removeLastDateKey(dateKey, r)
        if(flag && dateKey!==lastKey){
            console.log("REMOVING LAST KEY",lastKey,dateKey)
            chrome.storage.local.remove([lastKey])
            chrome.storage.local.set({ [dateKey]: 0 })
            resolve(0)
        }
        else if(dateKey in r){
            console.log("READING LAST KEY")
            resolve(parseInt(r[dateKey]))
        }
        else{
            console.log("INITIALIZING LAST KEY")
            chrome.storage.local.set({ [dateKey]: 0 })
            resolve(0)
        }
        reject("Error")
    })
})

const getCompanies = async () => {

try {

    const dateKey = `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}-companies`
    let companyCount = await getLimit(dateKey)

    console.log("LIMIT COUNT", companyCount)

    if(companyCount>399){
        console.log("DAILY LIMIT REACHED")
        return false}

    console.log("FIRST API CALL")
    const company = await manualApiCall('/api/auth/scrapy/companyScraper/commence/', { method: 'GET' })
    if(company?.universalName && company?.id){

        const URL = `/voyager/api/organization/companies?q=universalName&universalName=${encodeURIComponent(company.universalName)}`
        const companyData = { id: parseInt(company.id)}
        console.log("CALLING LI API")
        const data = await callLinkedinApi(URL, 
        { 
            method: 'GET',
            headers: {
                "x-restli-protocol-version": "2.0.0"
            } 
        })
        if(data?.elements && data?.elements.length>0){
            const apiData = data.elements[0]
            companyData['isDepreciated'] = false
            companyData["name"] = apiData?.name ? apiData?.name.replace(/'/g,"''") : null
            companyData["companyEmployeesSearchPageUrl"] = apiData?.companyEmployeesSearchPageUrl || null
            companyData["companyPageUrl"] = apiData?.companyPageUrl || null
            companyData["companyLogoUrl"] = apiData?.logo?.image['com.linkedin.common.VectorImage']?.rootUrl || null
            companyData["confirmedLocations"] = apiData?.confirmedLocations ?
            getFormatedConfirmedLocation(apiData?.confirmedLocations) : null
            companyData["companyType"] = apiData?.companyType || null
            companyData["defaultLocale"] = apiData?.defaultLocale || null
            companyData["description"] = apiData?.description ? apiData?.description.replace(/'/g,"''") : null
            companyData["entityUrn"] = apiData?.entityUrn || null
            companyData["followerCount"] = parseInt(apiData?.followingInfo?.followerCount) || null
            companyData["groupedLocations"] = apiData?.groupedLocations ? 
            getFormatedLocation(apiData?.groupedLocations) : null
            companyData["groupedLocationsByCountry"] = apiData?.groupedLocationsByCountry ?
            getFormatedLocation(apiData?.groupedLocationsByCountry) : null
            companyData["headquarter"] = apiData?.headquarter ? 
                {
                    ...apiData.headquarter,
                    line1:  apiData.headquarter?.line1 ? apiData.headquarter?.line1.replace(/'/g,"''") : null,
                    line2:  apiData.headquarter?.line2 ? apiData.headquarter?.line2.replace(/'/g,"''") : null
                } : null
            companyData["specialities"] = apiData?.specialities ? apiData?.specialities.map(s=>s.replace(/'/g, "''")) : null
            companyData["stockQuotes"] = apiData?.stockQuotes || null
            companyData["staffCount"] = parseInt(apiData?.staffCount) || null
            companyData["staffCountRange"] = apiData?.staffCountRange || null
            companyData["trackingInfo"] = apiData?.trackingInfo || null
            companyData["type"] = apiData?.type || null
            companyData["url"] = apiData?.url || null
            companyData["industries"] = apiData?.industries || null

            console.log("SECOND API CALL", companyData)
            const result = await manualApiCall('/api/auth/scrapy/companyScraper/conclude/', 
                {   method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ companyData })
                })

            if(result.isSuccess){
                console.log("SETTING LIMIT")
                chrome.storage.local.get(r => {
                    companyCount++
                    chrome.storage.local.set({ [dateKey]: companyCount })
                })
                return true
            }

            console.log("FAILIURE!")
            console.log(result)
            throw new Error('Api Failed')
        }
        if(data?.code && data?.code === "404"){
            companyData['isDepreciated'] = true

            console.log("SECOND API CALL", companyData)

            const result = await manualApiCall('/api/auth/scrapy/companyScraper/conclude/', 
                {   method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ companyData })
                })

            if(result.isSuccess){
                console.log("SETTING LIMIT")
                chrome.storage.local.get(r => {
                    companyCount++
                    chrome.storage.local.set({ [dateKey]: companyCount })
                })
                return true
            }

            console.log("FAILIURE!")
            console.log(result)
            throw new Error('Api Failed')
        }

        throw new Error('LI Api Failed')
    }
    throw new Error('No Compnaies!')



    // jobTitles.map((jt) => {
    //     console.log("Getting job description ids.")
    //     let JobDescription = []
    //     console.log(getJobDescriptionPagination(LOCATION_URL, jt, JobDescription))
    // })
    } 
    catch(e){
        console.log("ERROR ", e)
    }
}


export { getCompanies }