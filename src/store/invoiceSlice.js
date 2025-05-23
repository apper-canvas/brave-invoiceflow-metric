import { createSlice } from '@reduxjs/toolkit';

// Initial state for invoice data
const initialState = {
  invoices: [],
  clients: [],
  nextInvoiceNumber: 1001,
  recurringInvoices: [],
  payments: [],
  loading: {
    invoices: false,
    clients: false,
    recurringInvoices: false,
    payments: false
  }
};

export const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading[action.payload.entity] = action.payload.status;
    },
    setInvoices: (state, action) => {
      state.invoices = action.payload;
    },
    addInvoice: (state, action) => {
      state.invoices.push(action.payload);
      state.nextInvoiceNumber += 1;
    },
    updateInvoice: (state, action) => {
      const index = state.invoices.findIndex(inv => inv.Id === action.payload.Id);
      if (index !== -1) {
        state.invoices[index] = action.payload;
      }
    },
    deleteInvoice: (state, action) => {
      state.invoices = state.invoices.filter(inv => inv.Id !== action.payload);
    },
    updateInvoiceStatus: (state, action) => {
      const index = state.invoices.findIndex(inv => inv.Id === action.payload.id);
      if (index !== -1) {
        state.invoices[index].status = action.payload.status;
      }
    },
    setClients: (state, action) => {
      state.clients = action.payload;
    },
    addClient: (state, action) => {
      state.clients.push(action.payload);
    },
    updateClient: (state, action) => {
      const index = state.clients.findIndex(client => client.Id === action.payload.Id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    },
    deleteClient: (state, action) => {
      state.clients = state.clients.filter(client => client.Id !== action.payload);
    },
    setRecurringInvoices: (state, action) => {
      state.recurringInvoices = action.payload;
    },
    addRecurringInvoice: (state, action) => {
      state.recurringInvoices.push(action.payload);
    },
    updateRecurringInvoice: (state, action) => {
      const index = state.recurringInvoices.findIndex(inv => inv.Id === action.payload.Id);
      if (index !== -1) {
        state.recurringInvoices[index] = action.payload;
      }
    },
    deleteRecurringInvoice: (state, action) => {
      state.recurringInvoices = state.recurringInvoices.filter(inv => inv.Id !== action.payload);
    },
    setPayments: (state, action) => {
      state.payments = action.payload;
    },
  }
});

export const { setLoading, setInvoices, addInvoice, updateInvoice, deleteInvoice, updateInvoiceStatus, setClients, addClient, updateClient, deleteClient, setRecurringInvoices, addRecurringInvoice, updateRecurringInvoice, deleteRecurringInvoice, setPayments } = invoiceSlice.actions;
export default invoiceSlice.reducer;