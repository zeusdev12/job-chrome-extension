let db = null

function openDatabase() {
  const request = window.indexedDB.open('dnnae', 2)
  request.onerror = function (event) {
    console.log('ERROR OPENING DATABASE: ', event)
  }

  request.onupgradeneeded = function (event) {
    db = event.target.result
    console.log('UPDGRADE NEEDED', event)
    let objectStore = db.createObjectStore('jobs', { keyPath: 'jobId' })
    objectStore.transaction.oncomplete = function (event) {
      console.log('JOBS OBJECT STORE CREATED SUCCESSFULLY', event)
    }
  }

  request.onsuccess = function (event) {
    console.log('DATABASE OPENED SUCCESSFULLY', event.target.result)
    db = event.target.result
  }
}

function addJobMeta(jobMeta) {
  console.log('ADD JOB META: ', jobMeta)
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('jobs', 'readwrite')
    const jobs = transaction.objectStore('jobs')

    const request = jobs.add({
      ...jobMeta,
      searchTerms: jobMeta.searchTerms.sort((a, b) => b.score - a.score)
    })

    request.onsuccess = function (event) {
      console.log('JOB ADDED SUCCESSFULLY', event)
      resolve(jobMeta)
    }

    // return transaction.complete

  })
}



function getJobMeta(jobId) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('jobs', 'readonly')
    const jobs = tx.objectStore('jobs')

    const request = jobs.get(jobId)

    request.onsuccess = function (e) {
      resolve(e.target.result)
    }


  })
}

function updateJobMeta(jobMeta) {
  console.log('UPDATE JOB META...: ', jobMeta)
  return new Promise((resolve, reject) => {
    const tx = db.transaction('jobs', 'readwrite')
    const jobs = tx.objectStore('jobs')

    const request = jobs.put({
      ...jobMeta,
      searchTerms: jobMeta.searchTerms.sort((a, b) => b.score - a.score)
    })

    request.onsuccess = function (e) {
      // console.log('JOB META UPDATED')
      resolve(jobMeta)
    }

    request.onerror = function (e) {

      // console.log('an error occured: ', request.error)
      // console.log('event: ', e)
      reject(request.error)
    }
  })
}

function deleteJobMeta(jobId) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('jobs', 'readwrite')
    const jobs = tx.objectStore('jobs')
    const request = jobs.delete(jobId)

    request.onsuccess = function (e) {
      resolve()
    }
    request.onerror = function (e) {
      reject()
    }
  })
}

export {
  openDatabase,
  addJobMeta,
  updateJobMeta,
  getJobMeta,
  deleteJobMeta
}