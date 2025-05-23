import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import App from './App.jsx'
import './index.css'

// Simple Redux store for invoice data
const invoiceSlice = {
  name: 'invoices',
  initialState: {
    invoices: [],
    clients: [],
    nextInvoiceNumber: 1001
  },
  reducers: {
    addInvoice: (state, action) => {
      state.invoices.push(action.payload)
      state.nextInvoiceNumber += 1
    },
    updateInvoice: (state, action) => {
      const index = state.invoices.findIndex(inv => inv.id === action.payload.id)
      if (index !== -1) {
        state.invoices[index] = action.payload
      }
    },
    addClient: (state, action) => {
      state.clients.push(action.payload)
    }
  }
}

const store = configureStore({
  reducer: {
    invoices: invoiceSlice.reducer || ((state = invoiceSlice.initialState) => state)
  }
})

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)