import React, { useEffect } from 'react'
import { connect } from 'react-redux'
// import { fetchJobs } from '../../actions/jobDescription'
import './ContinueSearch.css'

import EditProgress from '../EditProgress'

import jigsawIcon from '../../../../img/puzzle.svg'
import pinIcon from '../../../../img/pin.svg'
import dnIcon from '../../../../img/logo.png'
import externalLinkIcon from '../../../../img/external-link-small.svg'
import arrowUpSvg from '../../../../img/ArrowUp.svg'


const PinExtensionWidget = ({ fte }) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className='pin-extension-widget'>
      {fte ?
        <p>Let's pin the extension, then continue with the prospect search.</p> :
        <p>Let's continue with the extension</p>
      }
      {fte ?
        <ol>
          <li>Click the jigsaw icon <img src={jigsawIcon} alt='puzzle' /> on the top right.</li>
          <li>Look for DNNae and click the pin icon <img className='pin-icon' src={pinIcon} alt='pin' /> in front of it.</li>
          <li>Go to LinkedIn <img style={{ cursor: 'pointer' }} src={externalLinkIcon} alt='link' /> .</li>
          <li>Click on the DNNae extension <img src={dnIcon} alt='dnIcon' /> to start looking for prospects!</li>
          <li>Click on <b>Find and Rank</b> under the relevant job to start the search</li>
        </ol> :
        <ol>
          <li>Click on the DNNae extension <img src={dnIcon} alt='dnIcon' />.</li>
          <li>Click on <b>Find and Rank</b> under this Prospect Search.</li>
        </ol>
      }
      <img src={arrowUpSvg} alt='N/A' className='arrow-up-icon' />
    </div>
  )
}

const ContinueSearch = ({
  isPopupOpened,
  editMode = false,
  jobId = null,
  ...rest
}) => {

  console.log('REST PROPS ARE: ', rest)

  const handleClick = (e) => {
    e.preventDefault()
    window.open(
      editMode ? `${window.location.origin}/html/job.html?tN=2&fS=title_score&fSO=desc&secS=skill_score&secSO=desc&isConnectPage=1&jId=${jobId}` : 'https://www.linkedin.com',
      '_self'
    )
  }

  const isMac = window.navigator.platform.toLowerCase().includes('mac')
  const message = editMode ?
    rest.updateMeta.shouldScoreAgain && rest.updateMeta.totalCount > 0 ?
      'Please wait while we rescore prospects against new criteria.' :
      'Job Updated Successfully' :
    `We'll redirect you to LinkedIn to look for the right prospects. Please click on the extension after getting to LinkedIn to continue.`

  return (
    <div className='continue-search-root'>
      { isMac ?
        <React.Fragment>
          {!isPopupOpened && <PinExtensionWidget fte={!isPopupOpened} />}
          {isPopupOpened && <div className='continue-search-content'>
            {(editMode && rest.updateMeta.shouldScoreAgain && rest.updateMeta.totalCount > 0) && <h4>Rescoring Prospects</h4>}
            <p style={{ marginBottom: '24px' }}>{message}</p>
            {(editMode && rest.updateMeta.shouldScoreAgain && rest.updateMeta.totalCount > 0) ? <EditProgress jobId={jobId} /> :
              <a onClick={handleClick}>
                <button>Continue to Linkedin</button>
              </a>
            }
          </div>}
        </React.Fragment> :
        <React.Fragment>
          {(editMode && rest.updateMeta.shouldScoreAgain && rest.updateMeta.totalCount > 0) ?
            <div className='continue-search-content'>
              <h4>Rescoring Prospects</h4>
              <p style={{ marginBottom: '24px' }}>{message}</p>
              <EditProgress jobId={jobId} />
            </div> :
            <PinExtensionWidget fte={!isPopupOpened} />
          }
        </React.Fragment>
      }
    </div>
  )
}

export default connect(state => ({
  isPopupOpened: _.get(state, 'auth.user.isPopupOpened', false)
}))(ContinueSearch)