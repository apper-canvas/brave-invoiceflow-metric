import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Share2,
  Send,
  Mail,
  Link as LinkIcon,
  Users,
  Search,
  Filter,
  Eye,
  Copy,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Home,
  FileText,
  Plus,
  X,
  Settings,
  Download,
  Globe,
  Lock,
  UserPlus,
  BarChart3
} from 'lucide-react'
import { format } from 'date-fns'

export default function SendShare() {
  const { invoices } = useSelector(state => state.invoices)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedInvoices, setSelectedInvoices] = useState([])
  const [activeTab, setActiveTab] = useState('email')
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showCollabModal, setShowCollabModal] = useState(false)
  const [showTrackingModal, setShowTrackingModal] = useState(false)

  // Email sharing state
  const [emailForm, setEmailForm] = useState({
    recipients: [''],
    subject: '',
    message: '',
    template: 'professional',
    attachPDF: true,
    sendCopy: true,
    schedule: false,
    scheduleDate: '',
    scheduleTime: ''
  })

  // Link sharing state
  const [linkForm, setLinkForm] = useState({
    accessType: 'public',
    requireAuth: false,
    expiresIn: '30',
    allowDownload: true,
    allowComments: false,
    password: '',
    customDomain: false
  })

  // Collaboration state
  const [collabForm, setCollabForm] = useState({
    teamMembers: [''],
    clientPortal: false,
    permissions: 'view',
    notifications: true,
    deadline: '',
    priority: 'normal'
  })

  // Tracking and analytics state
  const [shareHistory, setShareHistory] = useState([
    {
      id: 1,
      invoiceId: 1001,
      method: 'email',
      recipient: 'client@example.com',
      status: 'delivered',
      sentAt: '1/15/2024 10:30:00 AM',
      viewedAt: '2024-01-15T14:20:00Z',
      clicks: 3
    },
    {
      id: 2,
      invoiceId: 1002,
      method: 'link',
      recipient: 'Shared Link',
      status: 'viewed',
      sentAt: '2024-01-14T16:45:00Z',
      viewedAt: '2024-01-14T18:10:00Z',
      clicks: 7
    }
  ])

  // Email templates
  const emailTemplates = {
    professional: {
      subject: 'Invoice #{invoiceNumber} from {companyName}',
      message: `Dear {clientName},

Please find attached invoice #{invoiceNumber} for your review and payment.

Invoice Details:
- Amount: ${'{amount}'}
- Due Date: {dueDate}

If you have any questions, please don't hesitate to contact us.

Best regards,
{senderName}`
    },
    friendly: {
      subject: 'Your invoice #{invoiceNumber} is ready!',
      message: `Hi {clientName}!

Hope you're doing well! I've attached invoice #{invoiceNumber} for the work we completed.

Amount: ${'{amount}'}
Due: {dueDate}

Let me know if you need any clarification!

Thanks,
{senderName}`
    },
    reminder: {
      subject: 'Payment Reminder - Invoice #{invoiceNumber}',
      message: `Dear {clientName},

This is a friendly reminder that invoice #{invoiceNumber} is due for payment.

Invoice Details:
- Amount: ${'{amount}'}
- Original Due Date: {dueDate}

Please process payment at your earliest convenience.

Thank you,
{senderName}`
    }
  }

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toString().includes(searchTerm) ||
                         invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Handle invoice selection
  const toggleInvoiceSelection = (invoiceId) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    )
  }

  const selectAllInvoices = () => {
    setSelectedInvoices(filteredInvoices.map(inv => inv.id))
  }

  const clearSelection = () => {
    setSelectedInvoices([])
  }

  // Email sharing handlers
  const handleEmailShare = (e) => {
    e.preventDefault()
    
    if (selectedInvoices.length === 0) {
      toast.error('Please select at least one invoice to share')
      return
    }

    if (!emailForm.recipients.some(email => email.trim())) {
      toast.error('Please add at least one recipient')
      return
    }

    // Simulate email sending
    const validRecipients = emailForm.recipients.filter(email => email.trim())
    
    selectedInvoices.forEach(invoiceId => {
      const invoice = invoices.find(inv => inv.id === invoiceId)
      
      validRecipients.forEach(recipient => {
        const shareRecord = {
          id: Date.now() + Math.random(),
          invoiceId: invoice.invoiceNumber,
          method: 'email',
          recipient: recipient.trim(),
          status: emailForm.schedule ? 'scheduled' : 'sent',
          sentAt: emailForm.schedule ? emailForm.scheduleDate + 'T' + emailForm.scheduleTime : new Date().toISOString(),
          clicks: 0
        }
        
        setShareHistory(prev => [shareRecord, ...prev])
      })
    })

    setShowEmailModal(false)
    setEmailForm({
      recipients: [''],
      subject: '',
      message: '',
      template: 'professional',
      attachPDF: true,
      sendCopy: true,
      schedule: false,
      scheduleDate: '',
      scheduleTime: ''
    })
    
    toast.success(`Invoices ${emailForm.schedule ? 'scheduled' : 'sent'} successfully to ${validRecipients.length} recipient(s)!`)
  }

  // Link sharing handlers
  const handleLinkShare = (e) => {
    e.preventDefault()
    
    if (selectedInvoices.length === 0) {
      toast.error('Please select at least one invoice to share')
      return
    }

    const generatedLinks = selectedInvoices.map(invoiceId => {
      const invoice = invoices.find(inv => inv.id === invoiceId)
      const linkId = Math.random().toString(36).substring(2, 15)
      const baseUrl = linkForm.customDomain ? 'https://my-domain.com' : 'https://invoiceflow.app'
      const link = `${baseUrl}/shared/${linkId}`
      
      const shareRecord = {
        id: Date.now() + Math.random(),
        invoiceId: invoice.invoiceNumber,
        method: 'link',
        recipient: 'Shared Link',
        status: 'active',
        sentAt: new Date().toISOString(),
        link: link,
        clicks: 0,
        expiresAt: new Date(Date.now() + parseInt(linkForm.expiresIn) * 24 * 60 * 60 * 1000).toISOString()
      }
      
      setShareHistory(prev => [shareRecord, ...prev])
      return { invoice: invoice.invoiceNumber, link }
    })

    // Copy first link to clipboard
    if (generatedLinks.length > 0) {
      navigator.clipboard.writeText(generatedLinks[0].link)
      toast.success(`${generatedLinks.length} secure link(s) generated and copied to clipboard!`)
    }

    setShowLinkModal(false)
    setLinkForm({
      accessType: 'public',
      requireAuth: false,
      expiresIn: '30',
      allowDownload: true,
      allowComments: false,
      password: '',
      customDomain: false
    })
  }

  // Collaboration handlers
  const handleCollabShare = (e) => {
    e.preventDefault()
    
    if (selectedInvoices.length === 0) {
      toast.error('Please select at least one invoice to share')
      return
    }

    if (!collabForm.teamMembers.some(member => member.trim())) {
      toast.error('Please add at least one team member')
      return
    }

    const validMembers = collabForm.teamMembers.filter(member => member.trim())
    
    selectedInvoices.forEach(invoiceId => {
      const invoice = invoices.find(inv => inv.id === invoiceId)
      
      validMembers.forEach(member => {
        const shareRecord = {
          id: Date.now() + Math.random(),
          invoiceId: invoice.invoiceNumber,
          method: 'collaboration',
          recipient: member.trim(),
          status: 'invited',
          sentAt: new Date().toISOString(),
          permissions: collabForm.permissions,
          clicks: 0
        }
        
        setShareHistory(prev => [shareRecord, ...prev])
      })
    })

    setShowCollabModal(false)
    setCollabForm({
      teamMembers: [''],
      clientPortal: false,
      permissions: 'view',
      notifications: true,
      deadline: '',
      priority: 'normal'
    })
    
    toast.success(`Collaboration invites sent to ${validMembers.length} team member(s)!`)
  }

  // Add recipient/member functions
  const addEmailRecipient = () => {
    setEmailForm(prev => ({
      ...prev,
      recipients: [...prev.recipients, '']
    }))
  }

  const removeEmailRecipient = (index) => {
    setEmailForm(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index)
    }))
  }

  const addTeamMember = () => {
    setCollabForm(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, '']
    }))
  }

  const removeTeamMember = (index) => {
    setCollabForm(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }))
  }

  // Template selection handler
  const handleTemplateSelect = (templateKey) => {
    const template = emailTemplates[templateKey]
    setEmailForm(prev => ({
      ...prev,
      template: templateKey,
      subject: template.subject,
      message: template.message
    }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
      case 'sent':
      case 'active': return 'text-green-600 bg-green-100'
      case 'viewed': return 'text-blue-600 bg-blue-100'
      case 'scheduled':
      case 'invited': return 'text-yellow-600 bg-yellow-100'
      case 'failed':
      case 'expired': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const shareStats = {
    totalShares: shareHistory.length,
    emailShares: shareHistory.filter(s => s.method === 'email').length,
    linkShares: shareHistory.filter(s => s.method === 'link').length,
    totalViews: shareHistory.reduce((sum, share) => sum + (share.clicks || 0), 0),
    recentActivity: shareHistory.slice(0, 5)
  }

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
              <div>
                <h1 className="text-3xl font-bold text-surface-900 flex items-center gap-3">
                  <Share2 className="w-8 h-8 text-primary" />
                  Send & Share
                </h1>
                <p className="text-surface-600 mt-1">Share invoices via email, links, and collaboration</p>
              </div>
            </div>
            <button
              onClick={() => setShowTrackingModal(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              View Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { title: 'Total Shares', value: shareStats.totalShares, icon: Share2, color: 'primary' },
            { title: 'Email Shares', value: shareStats.emailShares, icon: Mail, color: 'secondary' },
            { title: 'Link Shares', value: shareStats.linkShares, icon: LinkIcon, color: 'accent' },
            { title: 'Total Views', value: shareStats.totalViews, icon: Eye, color: 'primary' }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-modern p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-surface-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sharing Actions */}
        <div className="card-modern p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-surface-900">Quick Share Actions</h2>
            <div className="text-sm text-surface-600">
              {selectedInvoices.length} invoice(s) selected
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setShowEmailModal(true)}
              disabled={selectedInvoices.length === 0}
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-surface-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-surface-900">Email Share</h3>
                <p className="text-sm text-surface-600">Send via email with custom templates</p>
              </div>
            </button>

            <button
              onClick={() => setShowLinkModal(true)}
              disabled={selectedInvoices.length === 0}
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-surface-200 hover:border-secondary hover:bg-secondary/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-surface-900">Secure Link</h3>
                <p className="text-sm text-surface-600">Generate shareable links with controls</p>
              </div>
            </button>

            <button
              onClick={() => setShowCollabModal(true)}
              disabled={selectedInvoices.length === 0}
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-surface-200 hover:border-accent hover:bg-accent/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-surface-900">Team Collaboration</h3>
                <p className="text-sm text-surface-600">Share with team members and clients</p>
              </div>
            </button>
          </div>
        </div>

        {/* Invoice Selection */}
        <div className="card-modern mb-6">
          <div className="p-6 border-b border-surface-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-surface-900">Select Invoices to Share</h2>
              <div className="flex gap-2">
                <button
                  onClick={selectAllInvoices}
                  className="btn-secondary text-sm"
                >
                  Select All
                </button>
                <button
                  onClick={clearSelection}
                  className="btn-secondary text-sm"
                >
                  Clear Selection
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by invoice number or client name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-modern pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-surface-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-modern min-w-[120px]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900 mb-2">No invoices found</h3>
                <p className="text-surface-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-surface-50 border-b border-surface-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                        onChange={selectedInvoices.length === filteredInvoices.length ? clearSelection : selectAllInvoices}
                        className="rounded border-surface-300 text-primary focus:ring-primary"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-surface-700">Invoice #</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-surface-700">Client</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-surface-700">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-surface-700">Due Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-surface-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200">
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className={`hover:bg-surface-50 transition-colors ${
                        selectedInvoices.includes(invoice.id) ? 'bg-primary/5' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(invoice.id)}
                          onChange={() => toggleInvoiceSelection(invoice.id)}
                          className="rounded border-surface-300 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-surface-900">
                        #{invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-700">
                        {invoice.clientName}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-surface-900">
                        ${invoice.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-700">
                        {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          invoice.status === 'paid' ? 'text-green-600 bg-green-100' :
                          invoice.status === 'overdue' ? 'text-red-600 bg-red-100' :
                          'text-yellow-600 bg-yellow-100'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Email Share Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-invoice max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-surface-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-surface-900 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-primary" />
                  Email Share
                </h2>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleEmailShare} className="p-6 space-y-6">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-3">Email Template</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.entries(emailTemplates).map(([key, template]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleTemplateSelect(key)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        emailForm.template === key
                          ? 'border-primary bg-primary/5'
                          : 'border-surface-200 hover:border-primary/50'
                      }`}
                    >
                      <h4 className="font-medium text-surface-900 capitalize">{key}</h4>
                      <p className="text-sm text-surface-600 mt-1">
                        {key === 'professional' && 'Formal business communication'}
                        {key === 'friendly' && 'Casual and approachable tone'}
                        {key === 'reminder' && 'For overdue payment reminders'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">Recipients *</label>
                <div className="space-y-2">
                  {emailForm.recipients.map((recipient, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="email"
                        value={recipient}
                        onChange={(e) => setEmailForm(prev => ({
                          ...prev,
                          recipients: prev.recipients.map((r, i) => i === index ? e.target.value : r)
                        }))}
                        className="input-modern flex-1"
                        placeholder="Enter email address"
                      />
                      {emailForm.recipients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEmailRecipient(index)}
                          className="p-3 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addEmailRecipient}
                    className="btn-secondary text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Recipient
                  </button>
                </div>
              </div>

              {/* Subject and Message */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="input-modern"
                    placeholder="Email subject"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">Options</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={emailForm.attachPDF}
                        onChange={(e) => setEmailForm(prev => ({ ...prev, attachPDF: e.target.checked }))}
                        className="rounded border-surface-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-surface-700">Attach PDF</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={emailForm.sendCopy}
                        onChange={(e) => setEmailForm(prev => ({ ...prev, sendCopy: e.target.checked }))}
                        className="rounded border-surface-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-surface-700">Send me a copy</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">Message</label>
                <textarea
                  value={emailForm.message}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, message: e.target.value }))}
                  className="input-modern h-32 resize-none"
                  placeholder="Email message"
                />
              </div>

              {/* Scheduling */}
              <div>
                <label className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={emailForm.schedule}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, schedule: e.target.checked }))}
                    className="rounded border-surface-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-surface-700">Schedule for later</span>
                </label>
                
                {emailForm.schedule && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="date"
                        value={emailForm.scheduleDate}
                        onChange={(e) => setEmailForm(prev => ({ ...prev, scheduleDate: e.target.value }))}
                        className="input-modern"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <input
                        type="time"
                        value={emailForm.scheduleTime}
                        onChange={(e) => setEmailForm(prev => ({ ...prev, scheduleTime: e.target.value }))}
                        className="input-modern"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {emailForm.schedule ? 'Schedule Email' : 'Send Email'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Link Share Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-invoice max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-surface-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-surface-900 flex items-center gap-3">
                  <LinkIcon className="w-6 h-6 text-secondary" />
                  Generate Secure Link
                </h2>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleLinkShare} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">Access Type</label>
                  <select
                    value={linkForm.accessType}
                    onChange={(e) => setLinkForm(prev => ({ ...prev, accessType: e.target.value }))}
                    className="input-modern"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="restricted">Restricted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">Expires In</label>
                  <select
                    value={linkForm.expiresIn}
                    onChange={(e) => setLinkForm(prev => ({ ...prev, expiresIn: e.target.value }))}
                    className="input-modern"
                  >
                    <option value="7">7 days</option>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="365">1 year</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={linkForm.requireAuth}
                    onChange={(e) => setLinkForm(prev => ({ ...prev, requireAuth: e.target.checked }))}
                    className="rounded border-surface-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-surface-700">Require authentication</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={linkForm.allowDownload}
                    onChange={(e) => setLinkForm(prev => ({ ...prev, allowDownload: e.target.checked }))}
                    className="rounded border-surface-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-surface-700">Allow PDF download</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={linkForm.allowComments}
                    onChange={(e) => setLinkForm(prev => ({ ...prev, allowComments: e.target.checked }))}
                    className="rounded border-surface-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-surface-700">Allow comments</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={linkForm.customDomain}
                    onChange={(e) => setLinkForm(prev => ({ ...prev, customDomain: e.target.checked }))}
                    className="rounded border-surface-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-surface-700">Use custom domain</span>
                </label>
              </div>

              {linkForm.requireAuth && (
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">Password (Optional)</label>
                  <input
                    type="password"
                    value={linkForm.password}
                    onChange={(e) => setLinkForm(prev => ({ ...prev, password: e.target.value }))}
                    className="input-modern"
                    placeholder="Set a password for the link"
                  />
                </div>
              )}

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Generate Link
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Collaboration Modal */}
      {showCollabModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-invoice max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-surface-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-surface-900 flex items-center gap-3">
                  <Users className="w-6 h-6 text-accent" />
                  Team Collaboration
                </h2>
                <button
                  onClick={() => setShowCollabModal(false)}
                  className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCollabShare} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">Team Members *</label>
                <div className="space-y-2">
                  {collabForm.teamMembers.map((member, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="email"
                        value={member}
                        onChange={(e) => setCollabForm(prev => ({
                          ...prev,
                          teamMembers: prev.teamMembers.map((m, i) => i === index ? e.target.value : m)
                        }))}
                        className="input-modern flex-1"
                        placeholder="Enter team member email"
                      />
                      {collabForm.teamMembers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="p-3 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="btn-secondary text-sm"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Team Member
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">Permissions</label>
                  <select
                    value={collabForm.permissions}
                    onChange={(e) => setCollabForm(prev => ({ ...prev, permissions: e.target.value }))}
                    className="input-modern"
                  >
                    <option value="view">View Only</option>
                    <option value="comment">View & Comment</option>
                    <option value="edit">View & Edit</option>
                    <option value="admin">Full Access</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">Priority</label>
                  <select
                    value={collabForm.priority}
                    onChange={(e) => setCollabForm(prev => ({ ...prev, priority: e.target.value }))}
                    className="input-modern"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">Deadline (Optional)</label>
                <input
                  type="date"
                  value={collabForm.deadline}
                  onChange={(e) => setCollabForm(prev => ({ ...prev, deadline: e.target.value }))}
                  className="input-modern"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={collabForm.clientPortal}
                    onChange={(e) => setCollabForm(prev => ({ ...prev, clientPortal: e.target.checked }))}
                    className="rounded border-surface-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-surface-700">Enable client portal access</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={collabForm.notifications}
                    onChange={(e) => setCollabForm(prev => ({ ...prev, notifications: e.target.checked }))}
                    className="rounded border-surface-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-surface-700">Send email notifications</span>
                </label>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowCollabModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Send Invitations
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Analytics/Tracking Modal */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-invoice max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-surface-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-surface-900 flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  Share Analytics
                </h2>
                <button
                  onClick={() => setShowTrackingModal(false)}
                  className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="card-modern p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-surface-600">Successful Shares</p>
                      <p className="text-xl font-bold text-surface-900">
                        {shareHistory.filter(s => ['delivered', 'sent', 'viewed'].includes(s.status)).length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="card-modern p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-surface-600">Total Views</p>
                      <p className="text-xl font-bold text-surface-900">{shareStats.totalViews}</p>
                    </div>
                  </div>
                </div>
                
                <div className="card-modern p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-surface-600">Pending</p>
                      <p className="text-xl font-bold text-surface-900">
                        {shareHistory.filter(s => ['scheduled', 'invited'].includes(s.status)).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-modern">
                <div className="p-4 border-b border-surface-200">
                  <h3 className="text-lg font-bold text-surface-900">Recent Share Activity</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-surface-700">Invoice</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-surface-700">Method</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-surface-700">Recipient</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-surface-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-surface-700">Sent</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-surface-700">Views</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-200">
                      {shareHistory.slice(0, 10).map((share) => (
                        <tr key={share.id} className="hover:bg-surface-50">
                          <td className="px-4 py-3 text-sm font-medium text-surface-900">
                            #{share.invoiceId}
                          </td>
                          <td className="px-4 py-3 text-sm text-surface-700 capitalize">
                            {share.method}
                          </td>
                          <td className="px-4 py-3 text-sm text-surface-700">
                            {share.recipient}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(share.status)}`}>
                              {share.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-surface-700">
                            {format(new Date(share.sentAt), 'MMM dd, yyyy HH:mm')}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-surface-900">
                            {share.clicks || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}