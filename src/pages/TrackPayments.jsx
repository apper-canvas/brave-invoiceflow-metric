import { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  DollarSign,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Home,
  Calendar,
  CreditCard,
  TrendingUp,
  X,
  Check,
  Clock,
  ArrowLeft,
  FileText
} from 'lucide-react'
import { format } from 'date-fns'

export default function TrackPayments() {
  const dispatch = useDispatch()
  const { payments, invoices } = useSelector(state => state.invoices)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [methodFilter, setMethodFilter] = useState('all')
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [paymentToDelete, setPaymentToDelete] = useState(null)

  // Record payment form state
  const [recordForm, setRecordForm] = useState({
    invoiceId: '',
    amount: '',
    method: 'cash',
    date: new Date().toISOString().split('T')[0],
    reference: '',
    notes: ''
  })

  // Edit payment form state
  const [editForm, setEditForm] = useState({
    invoiceId: '',
    amount: '',
    method: 'cash',
    date: '',
    reference: '',
    notes: ''
  })

  // Payment methods
  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'check', label: 'Check' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'online', label: 'Online Payment' }
  ]

  // Calculate payment statistics
  const paymentStats = useMemo(() => {
    const totalReceived = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const totalInvoices = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)
    const outstanding = totalInvoices - totalReceived
    const thisMonth = payments.filter(payment => {
      const paymentDate = new Date(payment.date)
      const now = new Date()
      return paymentDate.getMonth() === now.getMonth() && 
             paymentDate.getFullYear() === now.getFullYear()
    }).reduce((sum, payment) => sum + payment.amount, 0)

    return {
      totalReceived,
      outstanding,
      thisMonth,
      paymentCount: payments.length
    }
  }, [payments, invoices])

  // Filter payments based on search and method
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const invoice = invoices.find(inv => inv.id === payment.invoiceId)
      const matchesSearch = payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (invoice && invoice.invoiceNumber.toString().includes(searchTerm)) ||
                           (invoice && invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesMethod = methodFilter === 'all' || payment.method === methodFilter
      return matchesSearch && matchesMethod
    })
  }, [payments, invoices, searchTerm, methodFilter])

  const handleRecordPayment = (e) => {
    e.preventDefault()
    
    if (!recordForm.invoiceId || !recordForm.amount || !recordForm.date) {
      toast.error('Please fill in all required fields')
      return
    }

    const selectedInvoice = invoices.find(inv => inv.id === parseInt(recordForm.invoiceId))
    if (!selectedInvoice) {
      toast.error('Please select a valid invoice')
      return
    }

    const amount = parseFloat(recordForm.amount)
    if (amount <= 0) {
      toast.error('Payment amount must be greater than 0')
      return
    }

    const newPayment = {
      id: Date.now(),
      invoiceId: parseInt(recordForm.invoiceId),
      invoiceNumber: selectedInvoice.invoiceNumber,
      clientName: selectedInvoice.clientName,
      amount: amount,
      method: recordForm.method,
      date: recordForm.date,
      reference: recordForm.reference || `PAY-${Date.now()}`,
      notes: recordForm.notes,
      recordedAt: new Date().toISOString()
    }

    dispatch({
      type: 'invoices/addPayment',
      payload: newPayment
    })

    // Update invoice payment status
    const existingPayments = payments.filter(p => p.invoiceId === parseInt(recordForm.invoiceId))
    const totalPaid = existingPayments.reduce((sum, p) => sum + p.amount, 0) + amount
    
    dispatch({
      type: 'invoices/updateInvoicePaymentStatus',
      payload: {
        invoiceId: parseInt(recordForm.invoiceId),
        amountPaid: totalPaid,
        totalAmount: selectedInvoice.amount
      }
    })

    setRecordForm({
      invoiceId: '',
      amount: '',
      method: 'cash',
      date: new Date().toISOString().split('T')[0],
      reference: '',
      notes: ''
    })
    setShowRecordModal(false)
    toast.success('Payment recorded successfully!')
  }

  const handleEditPayment = (e) => {
    e.preventDefault()
    
    if (!editForm.invoiceId || !editForm.amount || !editForm.date) {
      toast.error('Please fill in all required fields')
      return
    }

    const amount = parseFloat(editForm.amount)
    if (amount <= 0) {
      toast.error('Payment amount must be greater than 0')
      return
    }

    const updatedPayment = {
      ...selectedPayment,
      invoiceId: parseInt(editForm.invoiceId),
      amount: amount,
      method: editForm.method,
      date: editForm.date,
      reference: editForm.reference,
      notes: editForm.notes
    }

    dispatch({
      type: 'invoices/updatePayment',
      payload: updatedPayment
    })

    setShowEditModal(false)
    setSelectedPayment(null)
    toast.success('Payment updated successfully!')
  }

  const handleDeletePayment = () => {
    dispatch({
      type: 'invoices/deletePayment',
      payload: paymentToDelete.id
    })

    // Recalculate invoice payment status
    const remainingPayments = payments.filter(p => 
      p.invoiceId === paymentToDelete.invoiceId && p.id !== paymentToDelete.id
    )
    const totalPaid = remainingPayments.reduce((sum, p) => sum + p.amount, 0)
    const invoice = invoices.find(inv => inv.id === paymentToDelete.invoiceId)
    
    if (invoice) {
      dispatch({
        type: 'invoices/updateInvoicePaymentStatus',
        payload: {
          invoiceId: paymentToDelete.invoiceId,
          amountPaid: totalPaid,
          totalAmount: invoice.amount
        }
      })
    }

    setShowDeleteConfirm(false)
    setPaymentToDelete(null)
    toast.success('Payment deleted successfully!')
  }

  const openViewModal = (payment) => {
    setSelectedPayment(payment)
    setShowViewModal(true)
  }

  const openEditModal = (payment) => {
    setSelectedPayment(payment)
    setEditForm({
      invoiceId: payment.invoiceId.toString(),
      amount: payment.amount.toString(),
      method: payment.method,
      date: payment.date,
      reference: payment.reference,
      notes: payment.notes
    })
    setShowEditModal(true)
  }

  const openDeleteConfirm = (payment) => {
    setPaymentToDelete(payment)
    setShowDeleteConfirm(true)
  }

  const getMethodIcon = (method) => {
    switch (method) {
      case 'cash': return '💵'
      case 'check': return '📝'
      case 'card': return '💳'
      case 'bank_transfer': return '🏦'
      case 'online': return '🌐'
      default: return '💰'
    }
  }

  const getMethodLabel = (method) => {
    const methodObj = paymentMethods.find(m => m.value === method)
    return methodObj ? methodObj.label : method
  }

  const availableInvoices = invoices.filter(invoice => {
    const totalPaid = payments
      .filter(p => p.invoiceId === invoice.id)
      .reduce((sum, p) => sum + p.amount, 0)
    return totalPaid < invoice.amount // Only show invoices that aren't fully paid
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50">
      {/* Header */}
      <div className="bg-white shadow-card border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-surface-600 hover:text-primary transition-colors">
                <Home className="w-6 h-6" />
              </Link>
              <Link to="/" className="text-surface-600 hover:text-primary transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-surface-900 flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-primary" />
                  Track Payments
                </h1>
                <p className="text-surface-600 mt-1">Monitor and manage payment receipts</p>
              </div>
            </div>
            <button
              onClick={() => setShowRecordModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Record Payment
            </button>
          </div>
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-modern p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm font-medium">Total Received</p>
                <p className="text-2xl font-bold text-green-600">
                  ${paymentStats.totalReceived.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-modern p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm font-medium">Outstanding</p>
                <p className="text-2xl font-bold text-red-600">
                  ${paymentStats.outstanding.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-modern p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm font-medium">This Month</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${paymentStats.thisMonth.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-modern p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm font-medium">Total Payments</p>
                <p className="text-2xl font-bold text-purple-600">
                  {paymentStats.paymentCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="card-modern p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by reference, invoice number, or client name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-surface-400 w-5 h-5" />
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="input-modern min-w-[140px]"
              >
                <option value="all">All Methods</option>
                {paymentMethods.map(method => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="card-modern overflow-hidden">
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-surface-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-surface-900 mb-2">No payments found</h3>
              <p className="text-surface-600 mb-6">
                {searchTerm || methodFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Record your first payment to get started'
                }
              </p>
              {!searchTerm && methodFilter === 'all' && (
                <button
                  onClick={() => setShowRecordModal(true)}
                  className="btn-primary flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Record First Payment
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-50 border-b border-surface-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-surface-700">Reference</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-surface-700">Invoice</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-surface-700">Client</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-surface-700">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-surface-700">Method</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-surface-700">Date</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-surface-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200">
                  {filteredPayments.map((payment) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-surface-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-surface-900">
                        {payment.reference}
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-700">
                        #{payment.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-700">
                        {payment.clientName}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-green-600">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-700">
                        <span className="flex items-center gap-2">
                          <span>{getMethodIcon(payment.method)}</span>
                          {getMethodLabel(payment.method)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-700">
                        {format(new Date(payment.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openViewModal(payment)}
                            className="p-2 text-surface-600 hover:text-primary transition-colors"
                            title="View Payment"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(payment)}
                            className="p-2 text-surface-600 hover:text-primary transition-colors"
                            title="Edit Payment"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(payment)}
                            className="p-2 text-surface-600 hover:text-red-600 transition-colors"
                            title="Delete Payment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Record Payment Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-invoice max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-surface-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-surface-900">Record Payment</h2>
                <button
                  onClick={() => setShowRecordModal(false)}
                  className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleRecordPayment} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Invoice *
                  </label>
                  <select
                    value={recordForm.invoiceId}
                    onChange={(e) => setRecordForm(prev => ({ ...prev, invoiceId: e.target.value }))}
                    className="input-modern"
                    required
                  >
                    <option value="">Select an invoice</option>
                    {availableInvoices.map(invoice => (
                      <option key={invoice.id} value={invoice.id}>
                        #{invoice.invoiceNumber} - {invoice.clientName} (${invoice.amount.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    value={recordForm.amount}
                    onChange={(e) => setRecordForm(prev => ({ ...prev, amount: e.target.value }))}
                    className="input-modern"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    value={recordForm.method}
                    onChange={(e) => setRecordForm(prev => ({ ...prev, method: e.target.value }))}
                    className="input-modern"
                    required
                  >
                    {paymentMethods.map(method => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    value={recordForm.date}
                    onChange={(e) => setRecordForm(prev => ({ ...prev, date: e.target.value }))}
                    className="input-modern"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={recordForm.reference}
                  onChange={(e) => setRecordForm(prev => ({ ...prev, reference: e.target.value }))}
                  className="input-modern"
                  placeholder="Check number, transaction ID, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={recordForm.notes}
                  onChange={(e) => setRecordForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="input-modern h-24 resize-none"
                  placeholder="Additional notes about this payment"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Record Payment
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* View Payment Modal */}
      {showViewModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-invoice max-w-lg w-full"
          >
            <div className="p-6 border-b border-surface-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-surface-900">Payment Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-surface-600">Reference</label>
                  <p className="text-surface-900 font-medium">{selectedPayment.reference}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-600">Amount</label>
                  <p className="text-2xl font-bold text-green-600">${selectedPayment.amount.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-surface-600">Invoice</label>
                  <p className="text-surface-900">#{selectedPayment.invoiceNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-600">Client</label>
                  <p className="text-surface-900">{selectedPayment.clientName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-surface-600">Payment Method</label>
                  <p className="text-surface-900 flex items-center gap-2">
                    <span>{getMethodIcon(selectedPayment.method)}</span>
                    {getMethodLabel(selectedPayment.method)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-600">Date</label>
                  <p className="text-surface-900">{format(new Date(selectedPayment.date), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              
              {selectedPayment.notes && (
                <div>
                  <label className="text-sm font-medium text-surface-600">Notes</label>
                  <p className="text-surface-900">{selectedPayment.notes}</p>
                </div>
              )}
              
              <div className="pt-4 border-t border-surface-200">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="btn-primary w-full"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-invoice max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-surface-900 mb-2">Delete Payment</h3>
              <p className="text-surface-600 mb-6">
                Are you sure you want to delete payment {paymentToDelete?.reference}? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePayment}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}