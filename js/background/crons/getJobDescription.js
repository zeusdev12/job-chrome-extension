import { callLinkedinApi, manualApiCall, simulateTimeout } from '../../../js/react/utils/index.js'
const LINKEDIN_DOMAIN_URL = 'https://www.linkedin.com'

const getJobDescriptionPhase2 = async (idList) => {

    try {
        const URL = `/voyager/api/jobs/jobPostings?decorationId=com.linkedin.voyager.deco.jobs.web.shared.WebJobPostingDescription-1&ids=List(${
            idList.join(',')})`
        const res = await callLinkedinApi(URL, 
        { 
            method: 'GET',
            headers: {
                "x-restli-protocol-version": "2.0.0"
            } 
        })
        // console.log(res)
        if(res?.results){
            const results = idList.map(id => {
                // console.log("----------------------------------------")
                // console.log(res?.results[`${id}`]?.description?.text)
                return res?.results[`${id}`]?.description?.text
            })

            return results
        }
        else
            console.log("Result object not found!")
            throw new Error('Result object not found')

    } catch(e){
        throw e
    }
}

const getJobDescriptionPagination = async (LOCATION_URL, title, start) => {

    try {

        const URL = `/voyager/api/search/hits?decorationId=com.linkedin.voyager.deco.jserp.WebJobSearchHitWithSalary-17${
            start>0 ? `&start=${start}` : ""}&count=25&filters=List(geoUrn-%3Eurn%3Ali%3Afs_geo%3A103644278,locationFallback-%3E${
            encodeURIComponent(LOCATION_URL)},resultType-%3EJOBS)&keywords=${
            encodeURIComponent(title)}&origin=JOB_SEARCH_RESULTS_PAGE&q=jserpFilters&queryContext=List(primaryHitType-%3EJOBS,spellCorrectionEnabled-%3Etrue)&topNRequestedFlavors=List(HIDDEN_GEM,IN_NETWORK,SCHOOL_RECRUIT,COMPANY_RECRUIT,SALARY,JOB_SEEKER_QUALIFIED,PREFERRED_COMMUTE,PRE_SCREENING_QUESTIONS,SKILL_ASSESSMENTS,ACTIVELY_HIRING_COMPANY,TOP_APPLICANT)`
        
        const jDIDs = []

        const res = await callLinkedinApi(URL, 
        { 
            method: 'GET',
            headers: {
                "x-restli-protocol-version": "2.0.0"
            } 
        })
        if(res?.elements){
            res.elements.map( element => {
                const [key, ...rest] = Object.keys(element?.hitInfo)
                if(key){
                    const id = element?.hitInfo[key]?.jobPosting?.split(":")?.length === 4 ? 
                        element?.hitInfo[key]?.jobPosting?.split(":")[3] : false
                    if(id)
                        jDIDs.push(id)
                }
            })
        }
        else{
            console.log("elements object not found!")
            
        }
        
        if(jDIDs.length>0){
            console.log("Getting Job Description....")
            const randomTimeout = Math.floor((Math.random() * 5) + 5) * 1000
            // console.log(randomTimeout)   
            console.log("LOADING...", randomTimeout)
            await simulateTimeout(randomTimeout)
            const descriptions = await getJobDescriptionPhase2(jDIDs)
            return {paging: res.paging, descriptions, end:false }
        }
        else {
            console.log("Empty job description ids")
            return {end: true}
        }
    } catch(e){
        throw e
    }
}

const getJobDescription = async () => {
    try {
    console.log("Start Of Getting Job Descriptions...")
    const jobTitles = ["Java Developer", "Full Stack Engineer", "NLP Engineer", "Quality Assurance Engineer"]
    const LOCATION_URL = "United States"
    const JobTitleDescription = {}
    for(const title of jobTitles){
        const jobDescriptions = []
        const count = 25
        let page = 1
        let start = (page - 1) * count
        let total = Number.MAX_VALUE
        while ( page * count <= total ){
            console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||')
            console.log("total",total)
            console.log("page",page)
            console.log("start",start)
            console.log("JD Length",jobDescriptions.length)
            const randomTimeout = Math.floor((Math.random() * 5) + 5) * 1000   
            console.log("LOADING...", randomTimeout)
            await simulateTimeout(randomTimeout)
            const resp =  await getJobDescriptionPagination(LOCATION_URL, title, start)
            if(resp.end)
                break
            console.log(resp)
            total = resp?.paging?.total ? resp?.paging?.total : 0
            start = page * count
            page++
            jobDescriptions.push(...resp.descriptions)
        }
        console.log("END OF TITLE")
        JobTitleDescription[title] = jobDescriptions
    }

    console.log(JobTitleDescription)

    // jobTitles.map((jt) => {
    //     console.log("Getting job description ids.")
    //     let JobDescription = []
    //     console.log(getJobDescriptionPagination(LOCATION_URL, jt, JobDescription))
    // })
} catch(e){}

}


export { getJobDescription }