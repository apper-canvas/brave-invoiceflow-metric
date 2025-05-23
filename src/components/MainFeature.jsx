import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [invoiceData, setInvoiceData] = useState({
    client: {
      name: '',
      email: '',
      address: ''
    },
    items: [
      { description: '', quantity: 1, price: 0 }
    ],
    dueDate: '',
    notes: '',
    tax: 0
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedInvoice, setGeneratedInvoice] = useState(null)

  const steps = [
    { id: 1, title: 'Client Info', icon: 'User' },
    { id: 2, title: 'Invoice Items', icon: 'Package' },
    { id: 3, title: 'Details & Terms', icon: 'FileText' },
    { id: 4, title: 'Preview', icon: 'Eye' }
  ]

  const updateClientData = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      client: { ...prev.client, [field]: value }
    }))
  }

  const updateItem = (index, field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }]
    }))
  }

  const removeItem = (index) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }))
    }
  }

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const taxAmount = subtotal * (invoiceData.tax / 100)
    return subtotal + taxAmount
  }

  const generateInvoice = async () => {
    setIsGenerating(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const invoice = {
      id: 'INV-' + Date.now(),
      number: '#1001',
      date: format(new Date(), 'MMM dd, yyyy'),
      dueDate: invoiceData.dueDate ? format(new Date(invoiceData.dueDate), 'MMM dd, yyyy') : 'Not set',
      client: invoiceData.client,
      items: invoiceData.items,
      subtotal: calculateSubtotal(),
      taxAmount: calculateSubtotal() * (invoiceData.tax / 100),
      total: calculateTotal(),
      notes: invoiceData.notes,
      status: 'draft'
    }
    
    setGeneratedInvoice(invoice)
    setIsGenerating(false)
    toast.success('Invoice generated successfully!')
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      generateInvoice()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetForm = () => {
    setCurrentStep(1)
    setGeneratedInvoice(null)
    setInvoiceData({
      client: { name: '', email: '', address: '' },
      items: [{ description: '', quantity: 1, price: 0 }],
      dueDate: '',
      notes: '',
      tax: 0
    })
    toast.info('Form reset successfully')
  }

  return (
    <>
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
            Invoice Management
          </h2>
          <p className="text-surface-600 dark:text-surface-400">
            Create professional invoices with ease
          </p>
        </div>
        <Link
          to="/settings"
          className="btn-secondary flex items-center"
        >
          <ApperIcon name="Settings" className="w-4 h-4 mr-2" />
          Settings
        </Link>
      </div>
    </div>
    
    <div className="max-w-6xl mx-auto">
      {!generatedInvoice ? (
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Step Navigation */}
          <div className="lg:col-span-1">
            <div className="card-modern p-6 md:p-8 sticky top-24">
              <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-6">
                Invoice Builder
              </h3>
              <div className="space-y-4">
                {steps.map((step) => (
                  <motion.div
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                      currentStep === step.id
                        ? 'bg-primary text-white shadow-soft'
                        : currentStep > step.id
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-400'
                    }`}
                    onClick={() => setCurrentStep(step.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      currentStep === step.id
                        ? 'bg-white/20'
                        : currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : 'bg-surface-200 dark:bg-surface-600'
                    }`}>
                      <ApperIcon 
                        name={currentStep > step.id ? 'Check' : step.icon} 
                        className="w-4 h-4" 
                      />
                    </div>
                    <span className="font-medium">{step.title}</span>
                  </motion.div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-8">
                <div className="flex justify-between text-sm text-surface-600 dark:text-surface-400 mb-2">
                  <span>Progress</span>
                  <span>{Math.round((currentStep / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                  <motion.div
                    className="h-2 invoice-gradient rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="card-modern p-6 md:p-8"
              >
                {/* Step 1: Client Information */}
                {currentStep === 1 && (
                  <div>
                    <h3 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">
                      Client Information
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Client Name *
                        </label>
                        <input
                          type="text"
                          value={invoiceData.client.name}
                          onChange={(e) => updateClientData('name', e.target.value)}
                          className="input-modern"
                          placeholder="Enter client name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={invoiceData.client.email}
                          onChange={(e) => updateClientData('email', e.target.value)}
                          className="input-modern"
                          placeholder="client@company.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Billing Address
                        </label>
                        <textarea
                          value={invoiceData.client.address}
                          onChange={(e) => updateClientData('address', e.target.value)}
                          className="input-modern min-h-[100px] resize-none"
                          placeholder="Enter billing address"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Invoice Items */}
                {currentStep === 2 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-surface-900 dark:text-white">
                        Invoice Items
                      </h3>
                      <button
                        onClick={addItem}
                        className="btn-primary text-sm"
                      >
                        <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                        Add Item
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {invoiceData.items.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-surface-50 dark:bg-surface-700 rounded-xl"
                        >
                          <div className="md:col-span-5">
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                              Description
                            </label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateItem(index, 'description', e.target.value)}
                              className="input-modern"
                              placeholder="Service or product description"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                              Quantity
                            </label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                              className="input-modern"
                              min="1"
                            />
                          </div>
                          <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                              Unit Price ($)
                            </label>
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                              className="input-modern"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="md:col-span-2 flex items-end">
                            <div className="w-full">
                              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                Total
                              </label>
                              <div className="input-modern bg-surface-100 dark:bg-surface-600 font-semibold">
                                ${(item.quantity * item.price).toFixed(2)}
                              </div>
                            </div>
                            {invoiceData.items.length > 1 && (
                              <button
                                onClick={() => removeItem(index)}
                                className="ml-2 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              >
                                <ApperIcon name="Trash2" className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-primary/5 rounded-xl">
                      <div className="flex justify-between text-lg font-semibold text-surface-900 dark:text-white">
                        <span>Subtotal:</span>
                        <span>${calculateSubtotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Details & Terms */}
                {currentStep === 3 && (
                  <div>
                    <h3 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">
                      Invoice Details
                    </h3>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                            Due Date
                          </label>
                          <input
                            type="date"
                            value={invoiceData.dueDate}
                            onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                            className="input-modern"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                            Tax Rate (%)
                          </label>
                          <input
                            type="number"
                            value={invoiceData.tax}
                            onChange={(e) => setInvoiceData(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
                            className="input-modern"
                            min="0"
                            max="100"
                            step="0.1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Notes & Terms
                        </label>
                        <textarea
                          value={invoiceData.notes}
                          onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                          className="input-modern min-h-[120px] resize-none"
                          placeholder="Payment terms, notes, or additional information..."
                        />
                      </div>

                      {/* Total Calculation */}
                      <div className="p-6 bg-surface-50 dark:bg-surface-700 rounded-xl space-y-3">
                        <div className="flex justify-between">
                          <span className="text-surface-600 dark:text-surface-400">Subtotal:</span>
                          <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-600 dark:text-surface-400">Tax ({invoiceData.tax}%):</span>
                          <span className="font-medium">${(calculateSubtotal() * (invoiceData.tax / 100)).toFixed(2)}</span>
                        </div>
                        <div className="border-t border-surface-200 dark:border-surface-600 pt-3">
                          <div className="flex justify-between text-xl font-bold text-surface-900 dark:text-white">
                            <span>Total:</span>
                            <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Preview */}
                {currentStep === 4 && (
                  <div>
                    <h3 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">
                      Invoice Preview
                    </h3>
                    <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl p-6 md:p-8">
                      {/* Invoice Header */}
                      <div className="flex flex-col md:flex-row justify-between mb-8">
                        <div>
                          <h4 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">INVOICE</h4>
                          <p className="text-surface-600 dark:text-surface-400">#1001</p>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                          <p className="text-sm text-surface-600 dark:text-surface-400">Issue Date</p>
                          <p className="font-semibold">{format(new Date(), 'MMM dd, yyyy')}</p>
                          {invoiceData.dueDate && (
                            <>
                              <p className="text-sm text-surface-600 dark:text-surface-400 mt-2">Due Date</p>
                              <p className="font-semibold">{format(new Date(invoiceData.dueDate), 'MMM dd, yyyy')}</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Client Info */}
                      <div className="mb-8">
                        <h5 className="font-semibold text-surface-900 dark:text-white mb-2">Bill To:</h5>
                        <div className="text-surface-600 dark:text-surface-400">
                          <p className="font-medium">{invoiceData.client.name || 'Client Name'}</p>
                          {invoiceData.client.email && <p>{invoiceData.client.email}</p>}
                          {invoiceData.client.address && (
                            <p className="whitespace-pre-line">{invoiceData.client.address}</p>
                          )}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="mb-8">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-surface-200 dark:border-surface-600">
                                <th className="text-left py-3 text-surface-900 dark:text-white">Description</th>
                                <th className="text-right py-3 text-surface-900 dark:text-white">Qty</th>
                                <th className="text-right py-3 text-surface-900 dark:text-white">Price</th>
                                <th className="text-right py-3 text-surface-900 dark:text-white">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {invoiceData.items.map((item, index) => (
                                <tr key={index} className="border-b border-surface-100 dark:border-surface-700">
                                  <td className="py-3 text-surface-600 dark:text-surface-400">
                                    {item.description || 'Service/Product'}
                                  </td>
                                  <td className="text-right py-3 text-surface-600 dark:text-surface-400">
                                    {item.quantity}
                                  </td>
                                  <td className="text-right py-3 text-surface-600 dark:text-surface-400">
                                    ${item.price.toFixed(2)}
                                  </td>
                                  <td className="text-right py-3 font-medium text-surface-900 dark:text-white">
                                    ${(item.quantity * item.price).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Totals */}
                      <div className="flex justify-end mb-8">
                        <div className="w-64 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-surface-600 dark:text-surface-400">Subtotal:</span>
                            <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-surface-600 dark:text-surface-400">Tax ({invoiceData.tax}%):</span>
                            <span className="font-medium">${(calculateSubtotal() * (invoiceData.tax / 100)).toFixed(2)}</span>
                          </div>
                          <div className="border-t border-surface-200 dark:border-surface-600 pt-2">
                            <div className="flex justify-between text-lg font-bold text-surface-900 dark:text-white">
                              <span>Total:</span>
                              <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {invoiceData.notes && (
                        <div>
                          <h5 className="font-semibold text-surface-900 dark:text-white mb-2">Notes:</h5>
                          <p className="text-surface-600 dark:text-surface-400 whitespace-pre-line">
                            {invoiceData.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-surface-200 dark:border-surface-600">
                  <div className="flex gap-4">
                    {currentStep > 1 && (
                      <button
                        onClick={prevStep}
                        className="btn-secondary"
                      >
                        <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                        Previous
                      </button>
                    )}
                    <button
                      onClick={nextStep}
                      disabled={isGenerating}
                      className="btn-primary"
                    >
                      {isGenerating ? (
                        <>
                          <ApperIcon name="Loader" className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : currentStep === 4 ? (
                        <>
                          <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
                          Generate Invoice
                        </>
                      ) : (
                        <>
                          Next
                          <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                  <button
                    onClick={resetForm}
                    className="btn-secondary sm:ml-auto"
                  >
                    <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
                    Reset
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* Generated Invoice Display */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-modern p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
              Invoice Generated Successfully!
            </h3>
            <p className="text-surface-600 dark:text-surface-400">
              Your invoice is ready. You can download, send, or edit it.
            </p>
          </div>

          {/* Invoice Summary Card */}
          <div className="bg-surface-50 dark:bg-surface-700 rounded-xl p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center md:text-left">
                <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">Invoice Number</p>
                <p className="text-xl font-bold text-surface-900 dark:text-white">{generatedInvoice.number}</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">Client</p>
                <p className="text-xl font-bold text-surface-900 dark:text-white">{generatedInvoice.client.name}</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-primary">${generatedInvoice.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button className="btn-primary text-center">
              <ApperIcon name="Download" className="w-5 h-5 mx-auto mb-2" />
              Download PDF
            </button>
            <button className="btn-secondary text-center">
              <ApperIcon name="Send" className="w-5 h-5 mx-auto mb-2" />
              Send to Client
            </button>
            <button className="btn-secondary text-center">
              <ApperIcon name="Edit" className="w-5 h-5 mx-auto mb-2" />
              Edit Invoice
            </button>
            <button className="btn-secondary text-center">
              <ApperIcon name="Copy" className="w-5 h-5 mx-auto mb-2" />
              Duplicate
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={resetForm}
              className="btn-primary"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Create Another Invoice
            </button>
          </div>
        </motion.div>
      )}
    </div>
    </>
  )
}

export default MainFeature