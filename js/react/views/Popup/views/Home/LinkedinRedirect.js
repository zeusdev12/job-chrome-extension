import React from 'react'
import { Button } from 'reactstrap'

const LinkedinRedirect = () => {
  return (
    <div className='linkedin-redirect-root'>
      <h1>Let's try this on linkedin</h1>
      <p>DNNae only works on LinkedIn. Please click the extension again when you’re there.</p>
      <Button
        color="primary"
        outline
        onClick={() => { window.open(`https://www.linkedin.com`, '_blank') }}
      >
        Continue to Linkedin
      </Button>
    </div>
  )
}

export default LinkedinRedirect