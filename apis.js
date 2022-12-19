// const api = 'https://www.linkedin.com/voyager/api/search/dash/clusters?decorationId=com.linkedin.voyager.dash.deco.search.SearchClusterCollection-83&origin=FACETED_SEARCH&q=all&query=(keywords:machine%20learning%20engineer,flagshipSearchIntent:SEARCH_SRP,queryParameters:(industry:List(4,3,109),geoUrn:List(90000084,104112529),resultType:List(PEOPLE)))&start=0'



// const url = 'https://www.linkedin.com/search/results/people/?geoUrn=%5B%2290000084%22%2C%22104112529%22%5D&industry=%5B%224%22%2C%223%22%2C%22109%22%5D&keywords=machine%20learning%20engineer&origin=FACETED_SEARCH'


// const api2 = 'https://www.linkedin.com/voyager/api/search/dash/clusters?decorationId=com.linkedin.voyager.dash.deco.search.SearchClusterCollection-83&origin=FACETED_SEARCH&q=all&query=(keywords:machine%20learning%20engineer,flagshipSearchIntent:SEARCH_SRP,queryParameters:(network:List(S,O),industry:List(4,3,109),currentCompany:List(162479,1441),pastCompany:List(1441,1035),profileLanguage:List(en,de),serviceCategory:List(602,55798),geoUrn:List(90000084,104112529),schoolFilter:List(17926,17939),resultType:List(PEOPLE)))&start=0'

// const url2 = 'https://www.linkedin.com/search/results/people/?currentCompany=%5B%22162479%22%2C%221441%22%5D&geoUrn=%5B%2290000084%22%2C%22104112529%22%5D&industry=%5B%224%22%2C%223%22%2C%22109%22%5D&keywords=machine%20learning%20engineer&network=%5B%22S%22%2C%22O%22%5D&origin=FACETED_SEARCH&pastCompany=%5B%221441%22%2C%221035%22%5D&profileLanguage=%5B%22en%22%2C%22de%22%5D&schoolFilter=%5B%2217926%22%2C%2217939%22%5D&serviceCategory=%5B%22602%22%2C%2255798%22%5D'
// // console.log('query params are: ', params)


// // const obj = getQueryParmsAndOrigin(url2)

// // const searchTerm = 'machine learning engineer'



// // console.log('qParams: ', qParams)
// // console.log('\n')
// //  const apiUrl = `https://www.linkedin.com/voyager/api/search/dash/clusters?decorationId=com.linkedin.voyager.dash.deco.search.SearchClusterCollection-83&origin=${obj.origin}&q=all&query=(keywords:${encodeURIComponent(searchTerm)},flagshipSearchIntent:SEARCH_SRP,queryParameters:${paramsString})&start=0`
// // console.log(obj)
// // console.log(paramsString)
// // console.log(apiUrl)
// // console.log(apiUrl.length)
// // console.log('===========================')
// // console.log(api2)
// // console.log(api2.length)


// const getApiUrl = (searchTerm, browserUrl) => {
//   const variables = getQueryParmsAndOrigin(browserUrl)
//   const queryParamString = constructQueryString(variables.params)

//   const url = `https://www.linkedin.com/voyager/api/search/dash/clusters?decorationId=com.linkedin.voyager.dash.deco.search.SearchClusterCollection-83&origin=${variables.origin}&q=all&query=(keywords:${encodeURIComponent(searchTerm)},flagshipSearchIntent:SEARCH_SRP,queryParameters:${queryParamString})&start=0`

//   return url
// }


// const apiToHit = getApiUrl('Full Stack Engineer', url2)

// console.log('api to hit: ', apiToHit)