import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import  './index.css'
import React from 'react'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import {Provider} from 'react-redux';
import { store } from './ReduxToolKit/store.js'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Toaster
        position="top-right" 
        reverseOrder={false} 
      />
    <Provider store={store}>
    <App />
    </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
