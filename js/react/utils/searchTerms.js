

// export const generateSearchTerms = (job) => {
//   // console.log('GENERATE SEARCH TERMS AGAINS JOB: ', job)

//   const jobTitle = job.jobTitle
//   const additionalTitles = []//job.jobArray.filter(item => item.tag === "SUGGESTED_JOB_TITLES")[0].data || []
//   const skills = job.jobArray.filter(item => item.tag === "TECHNICAL_SKILLS")[0].data

//   const allTitles = [jobTitle, ...additionalTitles]

//   let title = ``
//   let titleWithoutQuotes = ``
//   if (allTitles.length > 1) {
//     title = `(${allTitles.map(i => `("${i}")`).join(' OR ')})`
//     titleWithoutQuotes = `(${allTitles.map(i => `(${i})`).join(' OR ')})`
//   } else {
//     title = `"${jobTitle}"`
//     titleWithoutQuotes = `${jobTitle}`
//   }

//   // const title = `("${jobTit}")`

//   console.log('skills are: ', skills)

//   let searchTerms = [{
//     term: title,
//     score: 2
//   }, {
//     term: titleWithoutQuotes,
//     score: 1
//   }]

//   let mustHaveSkills = skills.filter(item => item.score == 5).map(item => item.name)
//   let importantSkills = skills.filter(item => item.score == 3).map(item => item.name)
//   // let niceHaveSkills = skills.filter(item => item.score == 1).map(item => item.name)
//   let pickedSkills = []

//   if (mustHaveSkills.length >= 3) {
//     pickedSkills = mustHaveSkills
//   } else {
//     pickedSkills = [...mustHaveSkills, ...importantSkills]

//     // var diff = 3 - pickedSkills.length

//     // if(importantSkills.length >= diff){
//     //   pickedSkills = [...pickedSkills, ...importantSkills.slice(0, diff)]
//     // } else if(importantSkills.length !== 0 && importantSkills.length < diff) {
//     //   pickedSkills = [ ...pickedSkills, ...importantSkills ]

//     //   var newDiff = 3 - pickedSkills.length

//     //   if(newDiff > 0){
//     //     pickedSkills = [...pickedSkills, ...niceHaveSkills.slice(0, newDiff)]
//     //   }

//     // }	else {
//     //   pickedSkills = [...pickedSkills, ...niceHaveSkills.slice(0, diff)]
//     // }
//   }


//   // console.log('========================= PICKED SKILLS ARE: ', pickedSkills)




//   for (var i = 0; i < pickedSkills.length; i++) {
//     searchTerms.push({ term: `${title} AND "${pickedSkills[i]}"`, score: 4 })
//     searchTerms.push({ term: `${title} AND ${pickedSkills[i]}`, score: 3 })

//     searchTerms.push({ term: `${titleWithoutQuotes} AND "${pickedSkills[i]}"`, score: 3 })
//     searchTerms.push({ term: `${titleWithoutQuotes} AND ${pickedSkills[i]}`, score: 2 })

//     for (var j = i + 1; j < pickedSkills.length; j++) {
//       searchTerms.push({
//         term: `${title} AND ${pickedSkills[i]} AND ${pickedSkills[j]}`,
//         score: 4
//       })

//       searchTerms.push({
//         term: `${title} AND "${pickedSkills[i]}" AND "${pickedSkills[j]}"`,
//         score: 6
//       })

//       searchTerms.push({
//         term: `${titleWithoutQuotes} AND ${pickedSkills[i]} AND ${pickedSkills[j]}`,
//         score: 3
//       })
//       searchTerms.push({
//         term: `${titleWithoutQuotes} AND "${pickedSkills[i]}" AND "${pickedSkills[j]}"`,
//         score: 5
//       })
//     }
//   }

//   // if(mustHaveSkills.length > 3){
//   //   const remainingMustHaveSkills = mustHaveSkills.filter(item => !pickedSkills.includes(item))
//   //   remainingMustHaveSkills.forEach(skl => {
//   //     searchTerms.push(`${title} AND ${skl}`)
//   //   })
//   // } 

//   // const manuallyAdded = (prevSearchTerms && prevSearchTerms.length > 0) ?  
//   // prevSearchTerms.filter(item => !searchTerms.map(i => i.searchTerm).includes(item.searchTerm)) : []

//   // console.log('searchTermsNewAre: ', searchTerms)
//   // console.log("=========================================")
//   // console.log('SEARCH TERMS ARE: ', searchTerms)
//   return [...searchTerms]


// }

// export const generateSearchTerms = (job) => {
//   const mainTitle = job.jobTitle
//   const additionalTitles = job.jobArray.filter(item => item.tag === "SUGGESTED_JOB_TITLES")[0].data || []
//   const skills = ['s1', 's2', 's3', 's4', 's5', 's6']//job.jobArray.filter(item => item.tag === "TECHNICAL_SKILLS")[0].data

//   const allTitles = [mainTitle, ...additionalTitles]


//   let mustHaveSkills = skills.filter(item => item.score == 5).map(item => item.name)
//   let importantSkills = skills.filter(item => item.score == 3).map(item => item.name)
//   // let niceHaveSkills = skills.filter(item => item.score == 1).map(item => item.name)
//   let pickedSkills = []

//   if (mustHaveSkills.length >= 3) {
//     pickedSkills = mustHaveSkills
//   } else {
//     pickedSkills = [...mustHaveSkills, ...importantSkills]
//   }


//   const chunksOf5 = _.chunk(pickedSkills, 5)

//   const titleScores = allTitles.reduce((obj, item) => {
//     return {
//       ...obj,
//       [item]: item === mainTitle ? 10 : 1
//     }
//   }, {})

//   // console.log('TITLE SCORES ARE: ', titleScores)

//   // const allCombinations = getNewCombinations(pickedSkills)


//   const terms = []

//   // console.log('ALL COMBINATIONS: ', allCombinations)

//   if (pickedSkills.length > 0) {

//     chunksOf5.forEach(chunk => {
//       const allCombinations = getNewCombinations(chunk)
//       allTitles.forEach(title => {
//         const searchTerms = allCombinations.map(item => {
//           const ors = item.match(/OR/g)
//           const ands = item.match(/AND/g)

//           const andsScore = ands ? ands.length : 0
//           const orScore = ors ? 1 : 0

//           return {
//             term: `"${title}" AND ${item}`,
//             score: titleScores[title] * (andsScore + orScore)
//           }
//         })

//         terms.push(...searchTerms)
//       })
//     })
//   } else {
//     allTitles.forEach(title => {
//       terms.push({
//         term: `"${title}"`,
//         score: titleScores[title] || 0
//       })

//       terms.push({
//         term: title,
//         score: titleScores[title] || 0
//       })
//     })
//     // const searchTerms = allTitles.map(item => `"${item}"`)
//   }

//   // console.log('ALL SEARCH TERMS ARE: ', terms.sort((a, b) => b.score - a.score))

//   // console.log('ALL SEARCH TERMS ARE: ', terms)

//   return terms.sort((a, b) => b.score - a.score)

//   // console.log('all combinations are: ', allCombinations)

//   // const allSearchTerms = []

//   // chunksOf5.forEach(chunk => {
//   //   const allCombinations = getAllSkillCombinations(chunk)
//   //   const searchTerms = allTitles.reduce((arr, item) => {
//   //     const searchTerms = allCombinations.map(comb => {
//   //       return {
//   //         term: `"${item}" AND ${comb.text}`,
//   //         score: titleScores[item] * comb.score
//   //       }
//   //     })

//   //     return [...arr, searchTerms]
//   //   }, [])

//   //   allSearchTerms.push(searchTerms)
//   // })

//   // return _.flattenDeep(allSearchTerms).sort((a, b) => b.score - a.score)








// }

// function main() {
//   const mainTitle = 'devops engineer'
//   const additionalTitles = ['cloud engineer']

//   const allTitles = [mainTitle, ...additionalTitles]

//   const titleScores = allTitles.reduce((obj, item) => {
//     return {
//       ...obj,
//       [item]: item === mainTitle ? 10 : 1
//     }
//   }, {})


//   const skills = ['Terraform', 'CI/CD', 'Kubernetes', 'AWS']

//   const allCombinations = getAllSkillCombinations(skills)



//   const searchTerms = allTitles.reduce((arr, item) => {
//     const searchTerms = allCombinations.map(comb => {
//       return {
//         term: `"${item}" AND ${comb.text}`,
//         score: titleScores[item] * comb.score
//       }
//     })

//     return [...arr, searchTerms]
//   }, [])


//   console.log('SEARCH TERMS: ', searchTerms)


// }


//max 5
// function getAllSkillCombinations(skills) {
//   const combinations = []
//   for (let i = 0; i < skills.length; i++) {
//     let str = "("
//     for (let j = 0; j < skills.length; j++) {

//       str += j === 0 ? `"${skills[j]}"` : ` ${j <= i ? 'OR' : 'AND'} "${skills[j]}"`

//     }
//     str += ")"


//     const ands = str.match(/AND/g)
//     const ors = str.match(/OR/g)

//     const andsScore = ands ? ands.length : 0
//     const orScore = ors ? 1 : 0

//     const score = andsScore + orScore


//     combinations.push({ text: str, score: score + 1 })
//   }

//   return combinations
// }


