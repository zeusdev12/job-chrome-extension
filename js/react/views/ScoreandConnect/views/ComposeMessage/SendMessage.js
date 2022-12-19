import React from 'react'
import Loader from '../../../../components/Loader'

import './SendMessage.css'

const SendMessage = ({
  isSending,
  isSent,
  total,
  sentCount,
  isStopped,
  isExceeded,
  rateExceeded,
  // onClickDismiss,
  // onClickStop,
  failedCount,
  setCurrentView,
  sendingTo = null,
  setView,
  setSelectAllProspectsFlag
}) => {
  console.log('SENDING TO: ', sendingTo)
  return (
    <div className='sendmsg-root' >
      <div className='sendmsgg-content' >
        {/* <div className='info-icon-red icon-meta' /> */}

        <div className='sendmsg-row' >
          <div>
            {isSending && <p className='sendmsg-title'>Sending Connect Messages</p>}
            {isSent && !(isStopped || isExceeded || rateExceeded) && <p className='sendmsg-title'><span> Messages Sent </span>
              <div className='sent-icon icon-meta' style={{ marginLeft: '140px' }} /></p>}
            {(isStopped || isExceeded || rateExceeded) &&
              <>
                <p className='sendmsg-title'><span>Sending Stopped</span>
                  <div className='info-icon-red icon-meta' style={{ marginLeft: '160px' }} />
                </p>
                <p style={{ fontWeight: 'normal', fontSize: '16px', lineHeight: '23px', color: '#297AF7', cursor: 'pointer' }} onClick={() => {
                  window.scrollTo(0, 0)
                  setSelectAllProspectsFlag(false)
                  setView('ScoreAndConnect')
                }
                }>  Back to Prospects</p>
              </>
            }
          </div>
          <div>
            {isSending && <p>{sentCount}/{total}</p>}
            {(isSent || isStopped || isExceeded || rateExceeded) &&
              <div style={{ display: 'flex', alignItems: 'center' }}>

                <a
                  href='https://www.linkedin.com/mynetwork/invitation-manager/sent/'
                  target='_blank'
                  style={{ textDecoration: 'none' }}
                >
                  <p style={{ marginBottom: '0px', color: '#A7ABB0', textDecoration: 'none' }}>{isSent ? 'View' : 'View Sent'} ({sentCount}/{total})</p>
                </a>
              </div>
            }
          </div>
        </div>
        {isSending && sendingTo &&
          <div className='recepient'>
            <img src={sendingTo.imageUrl} />
            <div className='recepient-info'>
              <p>{sendingTo.fullName}</p>
              <p>{sendingTo.headline}</p>
            </div>
            <Loader color='blue' />
          </div>
        }

        <div className='sendmsg-row'>
          <div style={{ display: 'flex' }}>
            {(isExceeded || rateExceeded) ?
              <>
                {isExceeded &&
                  <p>You’ve reached the daily invitation limit on LinkedIn</p>
                }
                {
                  rateExceeded &&
                  <>
                    <p>Linkedin's connect limit exceeded, Try again after few hours.</p>
                    <p style={{ fontWeight: 'normal', fontSize: '16px', lineHeight: '23px', color: '#297AF7', cursor: 'pointer' }} onClick={() => {
                      window.scrollTo(0, 0)
                      setSelectAllProspectsFlag(false)
                      setView('ScoreAndConnect')
                    }
                    }>  Back to Prospects</p>
                  </>
                }
              </> :
              <>
                {(failedCount > 0) &&
                  <>
                    <p style={{ marginRight: '8px' }}>{failedCount} Failed</p>
                    <div className='info-icon' />
                    {
                      isSent &&
                      <>
                        <div className='verBar' style={{ marginRight: '10px' }} />
                        <span
                          onClick={() => setCurrentView('edit')}
                          style={{
                            color: '#297AF7',
                            fontSize: '16px',
                            cursor: 'pointer'
                          }}
                        >
                          Edit and Send Again
                          </span>
                      </>
                    }
                  </>
                }
              </>
            }

          </div>
        </div>
      </div>
    </div>
  )
}

export default SendMessage