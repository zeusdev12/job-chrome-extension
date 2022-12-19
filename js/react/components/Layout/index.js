import React from 'react'

import Header from '../HeaderPopup'
import './Layout.css'

const Layout = ({ children }) => {
  return (
    <div className='layout-root'>
      <Header />
      {children}
    </div>
  )
}

export default Layout