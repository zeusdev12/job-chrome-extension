const jsonParse = (str) => {
  let r
  try {
    r = JSON.parse(str)
  } catch (e) {
    r = str
  }

  return r
}

const getQueryParmsAndOrigin = (url) => {
  const queryParams = url.split('?')[1].split('&')

  const params = queryParams.reduce((obj, item) => {
    const [key, value] = item.split('=')
    return {
      ...obj,
      [key]: jsonParse(decodeURIComponent(value))
    }
  }, {})

  const origin = params.origin
  const page = params.page || 1
  delete params.origin
  delete params.keywords

  Object.keys(params).forEach(key => {
    if (!Array.isArray(params[key])) {
      delete params[key]
    }
  })

  return {
    origin,
    params,
    page
  }
}

// https://www.linkedin.com/search/results/people/?geoUrn=%5B%22103644278%22%5D&keywords=qa%20test%20lead&origin=FACETED_SEARCH&page=1"

const constructQueryString = (params) => {
  const qParams = [...Object.keys(params).map(key => {
    // if(Array.isArray(obj.params[key])){
    // network:List(S,O)
    return `${key}:List(${params[key].join(',')})`
    // } else {
    //   return `${key}:List()`
    // }
  }), 'resultType:List(PEOPLE)']

  const paramsString = `(${qParams.join(',')})`
  return paramsString
}


const getApiEndpoint = (searchTerm, browserUrl) => {

  const variables = getQueryParmsAndOrigin(browserUrl)
  const queryParamString = constructQueryString(variables.params)


  console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++')
  console.log({ variables, queryParamString, searchTerm })
  console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++')
 
  const url = `/voyager/api/search/dash/clusters?decorationId=com.linkedin.voyager.dash.deco.search.SearchClusterCollection-86&origin=${variables.origin}&q=all&query=(keywords:${encodeURIComponent(searchTerm).replace(/[(]/g, '%28').replace(/[)]/g, '%29')},flagshipSearchIntent:SEARCH_SRP,queryParameters:${queryParamString})&start=${(variables.page - 1) * 10}`

  return url
}

export {
  getApiEndpoint
}


/**
 * page = 2, start = 10
 *
 * start = (page - 1) * 10
 */