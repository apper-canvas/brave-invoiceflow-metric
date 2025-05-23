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
    nextInvoiceNumber: 1001,
    recurringInvoices: [],
    payments: []
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
    deleteInvoice: (state, action) => {
      state.invoices = state.invoices.filter(inv => inv.id !== action.payload)
    },
    updateInvoiceStatus: (state, action) => {
      const index = state.invoices.findIndex(inv => inv.id === action.payload.id)
      if (index !== -1) {
        state.invoices[index].status = action.payload.status
      }
    },
    addClient: (state, action) => {
      state.clients.push(action.payload)
    },
    updateClient: (state, action) => {
      const index = state.clients.findIndex(client => client.id === action.payload.id)
      if (index !== -1) {
        state.clients[index] = action.payload
      }
    },
    deleteClient: (state, action) => {
      state.clients = state.clients.filter(client => client.id !== action.payload)
    },
    addRecurringInvoice: (state, action) => {
      state.recurringInvoices.push(action.payload)
    },
    updateRecurringInvoice: (state, action) => {
      const index = state.recurringInvoices.findIndex(inv => inv.id === action.payload.id)
      if (index !== -1) {
        state.recurringInvoices[index] = action.payload
      }
    },
    deleteRecurringInvoice: (state, action) => {
      state.recurringInvoices = state.recurringInvoices.filter(inv => inv.id !== action.payload)
    },
    addPayment: (state, action) => {
      state.payments.push(action.payload)
    },
    updatePayment: (state, action) => {
      const index = state.payments.findIndex(payment => payment.id === action.payload.id)
      if (index !== -1) {
        state.payments[index] = action.payload
      }
    },
    deletePayment: (state, action) => {
      state.payments = state.payments.filter(payment => payment.id !== action.payload)
    },
    updateInvoicePaymentStatus: (state, action) => {
      const { invoiceId, amountPaid, totalAmount } = action.payload
      const invoice = state.invoices.find(inv => inv.id === invoiceId)
      if (invoice) {
        invoice.amountPaid = amountPaid
        invoice.status = amountPaid >= totalAmount ? 'paid' : amountPaid > 0 ? 'partial' : 'pending'
      }
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