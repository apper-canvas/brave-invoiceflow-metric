import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './store/userSlice'
import invoiceReducer from './store/invoiceSlice'
import App from './App.jsx'
import './index.css'

// Configure Redux store with proper reducers
const store = configureStore({
  reducer: {
    user: userReducer,
    invoices: invoiceReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types since they might contain non-serializable values
        ignoredActions: ['user/setUser'],
      },
    })
})

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)