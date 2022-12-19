import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import 'typeface-inter/index.css'
require('typeface-inter')
import { store } from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'regenerator-runtime'

import App from './App'
import './index.css'


// const GA_TID = 'UA-154255324-1'

// (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){

//   (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),

//   m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)

//   })(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here

//   ga('create', GA_TID, 'auto');

//   ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200

//   ga('require', 'displayfeatures');



ReactDOM.render(
  <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>
  , document.getElementById('dn-root'))