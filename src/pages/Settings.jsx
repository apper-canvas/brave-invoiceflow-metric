import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, addDays, addWeeks, addMonths, addYears } from 'date-fns'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const Settings = () => {
  const dispatch = useDispatch()
  const { recurringInvoices, clients } = useSelector(state => state.invoices)
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    amount: '',
    frequency: 'monthly',
    startDate: '',
    endDate: '',
    dueAfterDays: 30,
    description: '',
    notes: '',
    isActive: true
  })

  const frequencies = [
    { value: 'daily', label: 'Daily', icon: 'Calendar' },
    { value: 'weekly', label: 'Weekly', icon: 'CalendarDays' },
    { value: 'monthly', label: 'Monthly', icon: 'Calendar' },
    { value: 'quarterly', label: 'Quarterly (3 months)', icon: 'CalendarRange' },
    { value: 'yearly', label: 'Yearly', icon: 'CalendarDays' }
  ]

  const resetForm = () => {
    setFormData({
      clientId: '',
      clientName: '',
      amount: '',
      frequency: 'monthly',
      startDate: '',
      endDate: '',
      dueAfterDays: 30,
      description: '',
      notes: '',
      isActive: true
    })
  }

  const openCreateModal = () => {
    resetForm()
    setEditingInvoice(null)
    setShowCreateModal(true)
  }

  const openEditModal = (invoice) => {
    setFormData({
      clientId: invoice.clientId,
      clientName: invoice.clientName,
      amount: invoice.amount.toString(),
      frequency: invoice.frequency,
      startDate: invoice.startDate,
      endDate: invoice.endDate || '',
      dueAfterDays: invoice.dueAfterDays,
      description: invoice.description,
      notes: invoice.notes || '',
      isActive: invoice.isActive
    })
    setEditingInvoice(invoice)
    setShowCreateModal(true)
  }

  const closeModal = () => {
    setShowCreateModal(false)
    setEditingInvoice(null)
    resetForm()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.clientName.trim() || !formData.amount || !formData.startDate) {
      toast.error('Please fill in all required fields')
      return
    }

    const recurringInvoice = {
      id: editingInvoice?.id || `recurring-${Date.now()}`,
      clientId: formData.clientId || `client-${Date.now()}`,
      clientName: formData.clientName.trim(),
      amount: parseFloat(formData.amount),
      frequency: formData.frequency,
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      dueAfterDays: parseInt(formData.dueAfterDays),
      description: formData.description.trim(),
      notes: formData.notes.trim(),
      isActive: formData.isActive,
      createdAt: editingInvoice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nextInvoiceDate: calculateNextInvoiceDate(formData.startDate, formData.frequency),
      totalGenerated: editingInvoice?.totalGenerated || 0
    }

    if (editingInvoice) {
      dispatch({ type: 'invoices/updateRecurringInvoice', payload: recurringInvoice })
      toast.success('Recurring invoice updated successfully!')
    } else {
      dispatch({ type: 'invoices/addRecurringInvoice', payload: recurringInvoice })
      toast.success('Recurring invoice created successfully!')
    }

    closeModal()
  }

  const calculateNextInvoiceDate = (startDate, frequency) => {
    const start = new Date(startDate)
    const now = new Date()
    
    if (start > now) return startDate
    
    switch (frequency) {
      case 'daily':
        return addDays(now, 1).toISOString().split('T')[0]
      case 'weekly':
        return addWeeks(now, 1).toISOString().split('T')[0]
      case 'monthly':
        return addMonths(now, 1).toISOString().split('T')[0]
      case 'quarterly':
        return addMonths(now, 3).toISOString().split('T')[0]
      case 'yearly':
        return addYears(now, 1).toISOString().split('T')[0]
      default:
        return addMonths(now, 1).toISOString().split('T')[0]
    }
  }

  const handleDelete = (id) => {
    dispatch({ type: 'invoices/deleteRecurringInvoice', payload: id })
    toast.success('Recurring invoice deleted successfully!')
    setDeleteConfirm(null)
  }

  const toggleStatus = (invoice) => {
    const updated = { ...invoice, isActive: !invoice.isActive }
    dispatch({ type: 'invoices/updateRecurringInvoice', payload: updated })
    toast.success(`Recurring invoice ${updated.isActive ? 'activated' : 'deactivated'}!`)
  }

  const getFrequencyIcon = (frequency) => {
    const freq = frequencies.find(f => f.value === frequency)
    return freq ? freq.icon : 'Calendar'
  }

  const getFrequencyLabel = (frequency) => {
    const freq = frequencies.find(f => f.value === frequency)
    return freq ? freq.label : frequency
  }

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                to="/"
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
              >
                <ApperIcon name="ArrowLeft" className="w-5 h-5 text-surface-600 dark:text-surface-400" />
              </Link>
              <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
                Settings
              </h1>
            </div>
            <p className="text-surface-600 dark:text-surface-400">
              Set up automated invoice generation based on predefined schedules
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="btn-primary flex items-center"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Create Recurring Invoice
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-modern p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">Total Recurring</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{recurringInvoices.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <ApperIcon name="Repeat" className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="card-modern p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">Active</p>
                <p className="text-2xl font-bold text-green-600">{recurringInvoices.filter(inv => inv.isActive).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="card-modern p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">Monthly Revenue</p>
                <p className="text-2xl font-bold text-primary">
                  ${recurringInvoices
                    .filter(inv => inv.isActive && inv.frequency === 'monthly')
                    .reduce((sum, inv) => sum + inv.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <ApperIcon name="DollarSign" className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </div>
        </div>

        {/* Recurring Invoices List */}
        <div className="card-modern">
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <h3 className="text-xl font-bold text-surface-900 dark:text-white">
              All Recurring Invoices
            </h3>
          </div>
          
          {recurringInvoices.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center">
                <ApperIcon name="Calendar" className="w-8 h-8 text-surface-400" />
              </div>
              <h4 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                No recurring invoices yet
              </h4>
              <p className="text-surface-600 dark:text-surface-400 mb-6">
                Create your first recurring invoice to automate your billing process
              </p>
              <button
                onClick={openCreateModal}
                className="btn-primary"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Create Recurring Invoice
              </button>
            </div>
          ) : (
            <div className="divide-y divide-surface-200 dark:divide-surface-700">
              {recurringInvoices.map((invoice) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-surface-900 dark:text-white">
                          {invoice.clientName}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.isActive)}`}>
                          {invoice.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <ApperIcon name="DollarSign" className="w-4 h-4 text-surface-400" />
                          <span className="text-surface-600 dark:text-surface-400">Amount:</span>
                          <span className="font-medium text-surface-900 dark:text-white">${invoice.amount.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <ApperIcon name={getFrequencyIcon(invoice.frequency)} className="w-4 h-4 text-surface-400" />
                          <span className="text-surface-600 dark:text-surface-400">Frequency:</span>
                          <span className="font-medium text-surface-900 dark:text-white">{getFrequencyLabel(invoice.frequency)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <ApperIcon name="Calendar" className="w-4 h-4 text-surface-400" />
                          <span className="text-surface-600 dark:text-surface-400">Next:</span>
                          <span className="font-medium text-surface-900 dark:text-white">
                            {format(new Date(invoice.nextInvoiceDate), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                      
                      {invoice.description && (
                        <p className="text-surface-600 dark:text-surface-400 mt-2">
                          {invoice.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStatus(invoice)}
                        className={`p-2 rounded-lg transition-colors ${
                          invoice.isActive
                            ? 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                            : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}
                        title={invoice.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <ApperIcon name={invoice.isActive ? 'Pause' : 'Play'} className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => openEditModal(invoice)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => setDeleteConfirm(invoice.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-surface-200 dark:border-surface-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-surface-900 dark:text-white">
                    {editingInvoice ? 'Edit Recurring Invoice' : 'Create Recurring Invoice'}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="input-modern"
                      placeholder="Enter client name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Invoice Amount ($) *
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="input-modern"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Billing Frequency *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {frequencies.map((freq) => (
                      <button
                        key={freq.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, frequency: freq.value })}
                        className={`p-3 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                          formData.frequency === freq.value
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-surface-200 dark:border-surface-600 hover:border-primary/50'
                        }`}
                      >
                        <ApperIcon name={freq.icon} className="w-4 h-4" />
                        <span className="font-medium">{freq.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="input-modern"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="input-modern"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Due After Days
                  </label>
                  <input
                    type="number"
                    value={formData.dueAfterDays}
                    onChange={(e) => setFormData({ ...formData, dueAfterDays: parseInt(e.target.value) || 0 })}
                    className="input-modern"
                    min="0"
                    max="365"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-modern"
                    placeholder="Brief description of the service or product"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-modern min-h-[80px] resize-none"
                    placeholder="Additional notes or terms..."
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-surface-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-surface-700 dark:text-surface-300">
                    Activate immediately
                  </label>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    {editingInvoice ? 'Update' : 'Create'} Recurring Invoice
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-surface-900 dark:text-white">
                      Delete Recurring Invoice
                    </h3>
                    <p className="text-surface-600 dark:text-surface-400">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Settings