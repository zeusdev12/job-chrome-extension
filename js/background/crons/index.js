// import { checkFollowUpCronJobStatus } from './followup.js'
import { saveConnectionsCronJob } from './saveConnections.js'
import { getMessagedPeopleCronJob } from './getMessaged.js'
// import { getJobDescription } from './getJobDescription.js'
import { getCompanies } from './getCompanies.js'
import { followUpNewCron } from './followupNew.js'

function initializeCrons() {
  setInterval(function () {
    getCompanies()
  }, 1000 * 60)

  setInterval(function () {
    saveConnectionsCronJob()
  }, 1000 * 60 * 25)

  setInterval(function () {
    getMessagedPeopleCronJob()
  }, 1000 * 60 * 30)

  setInterval(function () {
    followUpNewCron()
  }, 1000 * 60 * 35)
}

export {
  initializeCrons
}
