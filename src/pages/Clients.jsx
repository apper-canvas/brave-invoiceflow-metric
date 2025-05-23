import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { format } from 'date-fns'
import ApperIcon from '../components/ApperIcon'

const Clients = () => {
  const dispatch = useDispatch()
  const { clients } = useSelector(state => state.invoices)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: ''
  })

  // Generate sample clients if none exist
  const sampleClients = useMemo(() => {
    if (clients.length > 0) return clients
    
    return [
      {
        id: 1,
        name: 'John Anderson',
        email: 'john.anderson@techcorp.com',
        phone: '+1 (555) 123-4567',
        company: 'TechCorp Solutions',
        address: '123 Business Ave\nSuite 400\nNew York, NY 10001',
        notes: 'Prefers email communication. Monthly retainer client.',
        createdAt: '2024-01-15',
        totalInvoices: 12,
        totalAmount: 24500.00,
        status: 'active'
      },
      {
        id: 2,
        name: 'Sarah Mitchell',
        email: 'sarah@creativestudio.design',
        phone: '+1 (555) 987-6543',
        company: 'Creative Studio Design',
        address: '456 Design Street\nFloor 2\nLos Angeles, CA 90210',
        notes: 'Graphic design agency. Net 30 payment terms.',
        createdAt: '2024-02-03',
        totalInvoices: 8,
        totalAmount: 15750.00,
        status: 'active'
      },
      {
        id: 3,
        name: 'Michael Chen',
        email: 'mchen@globaltech.biz',
        phone: '+1 (555) 456-7890',
        company: 'Global Tech Industries',
        address: '789 Innovation Drive\nTech Park\nSan Francisco, CA 94105',
        notes: 'Fortune 500 client. Requires purchase orders.',
        createdAt: '2024-01-28',
        totalInvoices: 15,
        totalAmount: 45200.00,
        status: 'active'
      },
      {
        id: 4,
        name: 'Emma Rodriguez',
        email: 'emma@localcafe.com',
        phone: '+1 (555) 321-0987',
        company: 'Local Café & Bistro',
        address: '321 Main Street\nDowntown\nAustin, TX 78701',
        notes: 'Small business client. Weekly invoicing.',
        createdAt: '2024-02-10',
        totalInvoices: 6,
        totalAmount: 3250.00,
        status: 'inactive'
      }
    ]
  }, [clients])

  // Filter and sort clients
  const filteredClients = useMemo(() => {
    let filtered = sampleClients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
    )

    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [sampleClients, searchTerm, sortBy, sortOrder])

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleAddClient = () => {
    if (!newClient.name.trim() || !newClient.email.trim()) {
      toast.error('Name and email are required')
      return
    }

    const client = {
      id: Date.now(),
      ...newClient,
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      totalInvoices: 0,
      totalAmount: 0,
      status: 'active'
    }

    dispatch({ type: 'invoices/addClient', payload: client })
    setNewClient({ name: '', email: '', phone: '', company: '', address: '', notes: '' })
    setIsAddModalOpen(false)
    toast.success('Client added successfully!')
  }

  const handleEditClient = () => {
    if (!selectedClient.name.trim() || !selectedClient.email.trim()) {
      toast.error('Name and email are required')
      return
    }

    dispatch({ type: 'invoices/updateClient', payload: selectedClient })
    setIsEditModalOpen(false)
    setSelectedClient(null)
    toast.success('Client updated successfully!')
  }

  const handleDeleteClient = (clientId) => {
    dispatch({ type: 'invoices/deleteClient', payload: clientId })
    setDeleteConfirmId(null)
    toast.success('Client deleted successfully!')
  }

  const handleViewClient = (client) => {
    setSelectedClient(client)
    setIsViewModalOpen(true)
  }

  const handleEditClientModal = (client) => {
    setSelectedClient({ ...client })
    setIsEditModalOpen(true)
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return 'ArrowUpDown'
    return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border-b border-surface-200 dark:border-surface-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="p-2 rounded-xl bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              >
                <ApperIcon name="ArrowLeft" className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
                  Client Management
                </h1>
                <p className="text-surface-600 dark:text-surface-400">
                  Manage your client relationships and contact information
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Add New Client
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="card-modern p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <ApperIcon 
                  name="Search" 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" 
                />
                <input
                  type="text"
                  placeholder="Search clients by name, email, company, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-modern pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-modern min-w-0"
              >
                <option value="name">Sort by Name</option>
                <option value="company">Sort by Company</option>
                <option value="createdAt">Sort by Date Added</option>
                <option value="totalInvoices">Sort by Invoices</option>
                <option value="totalAmount">Sort by Total Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-modern p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Total Clients</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{sampleClients.length}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <ApperIcon name="Users" className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          <div className="card-modern p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Active Clients</p>
                <p className="text-2xl font-bold text-green-600">{sampleClients.filter(c => c.status === 'active').length}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <ApperIcon name="UserCheck" className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="card-modern p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Total Revenue</p>
                <p className="text-2xl font-bold text-primary">
                  ${sampleClients.reduce((sum, client) => sum + client.totalAmount, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <ApperIcon name="DollarSign" className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          <div className="card-modern p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-600 dark:text-surface-400">Avg. Invoice Value</p>
                <p className="text-2xl font-bold text-secondary">
                  ${Math.round(sampleClients.reduce((sum, client) => sum + client.totalAmount, 0) / 
                    sampleClients.reduce((sum, client) => sum + client.totalInvoices, 0) || 0)}
                </p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-xl">
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="card-modern overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 dark:bg-surface-700">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-surface-900 dark:text-white cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Name</span>
                      <ApperIcon name={getSortIcon('name')} className="w-4 h-4" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-surface-900 dark:text-white cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors"
                    onClick={() => handleSort('company')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Company</span>
                      <ApperIcon name={getSortIcon('company')} className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-surface-900 dark:text-white">
                    Contact
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-surface-900 dark:text-white cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors"
                    onClick={() => handleSort('totalInvoices')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Invoices</span>
                      <ApperIcon name={getSortIcon('totalInvoices')} className="w-4 h-4" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-surface-900 dark:text-white cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors"
                    onClick={() => handleSort('totalAmount')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Total Value</span>
                      <ApperIcon name={getSortIcon('totalAmount')} className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-surface-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-surface-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {filteredClients.map((client) => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-surface-900 dark:text-white">
                          {client.name}
                        </div>
                        <div className="text-sm text-surface-600 dark:text-surface-400">
                          {client.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-surface-900 dark:text-white font-medium">
                        {client.company}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-surface-900 dark:text-white">{client.phone}</div>
                        <div className="text-surface-600 dark:text-surface-400">
                          Added {format(new Date(client.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-surface-900 dark:text-white font-medium">
                        {client.totalInvoices}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-surface-900 dark:text-white font-medium">
                        ${client.totalAmount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        client.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-400'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewClient(client)}
                          className="p-2 text-surface-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="View Client"
                        >
                          <ApperIcon name="Eye" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditClientModal(client)}
                          className="p-2 text-surface-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit Client"
                        >
                          <ApperIcon name="Edit" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(client.id)}
                          className="p-2 text-surface-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete Client"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <ApperIcon name="Users" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">
                No clients found
              </h3>
              <p className="text-surface-600 dark:text-surface-400 mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first client.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn-primary"
                >
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Add Your First Client
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Client Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="card-modern p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-surface-900 dark:text-white">
                  Add New Client
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={newClient.name}
                      onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                      className="input-modern"
                      placeholder="Client name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                      className="input-modern"
                      placeholder="client@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newClient.phone}
                      onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                      className="input-modern"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={newClient.company}
                      onChange={(e) => setNewClient(prev => ({ ...prev, company: e.target.value }))}
                      className="input-modern"
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Address
                  </label>
                  <textarea
                    value={newClient.address}
                    onChange={(e) => setNewClient(prev => ({ ...prev, address: e.target.value }))}
                    className="input-modern min-h-[80px] resize-none"
                    placeholder="Business address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newClient.notes}
                    onChange={(e) => setNewClient(prev => ({ ...prev, notes: e.target.value }))}
                    className="input-modern min-h-[80px] resize-none"
                    placeholder="Additional notes about the client"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-surface-200 dark:border-surface-600">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddClient}
                  className="btn-primary flex-1"
                >
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Add Client
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Client Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsEditModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="card-modern p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-surface-900 dark:text-white">
                  Edit Client
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={selectedClient.name}
                      onChange={(e) => setSelectedClient(prev => ({ ...prev, name: e.target.value }))}
                      className="input-modern"
                      placeholder="Client name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={selectedClient.email}
                      onChange={(e) => setSelectedClient(prev => ({ ...prev, email: e.target.value }))}
                      className="input-modern"
                      placeholder="client@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={selectedClient.phone}
                      onChange={(e) => setSelectedClient(prev => ({ ...prev, phone: e.target.value }))}
                      className="input-modern"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={selectedClient.company}
                      onChange={(e) => setSelectedClient(prev => ({ ...prev, company: e.target.value }))}
                      className="input-modern"
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Address
                  </label>
                  <textarea
                    value={selectedClient.address}
                    onChange={(e) => setSelectedClient(prev => ({ ...prev, address: e.target.value }))}
                    className="input-modern min-h-[80px] resize-none"
                    placeholder="Business address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={selectedClient.notes}
                    onChange={(e) => setSelectedClient(prev => ({ ...prev, notes: e.target.value }))}
                    className="input-modern min-h-[80px] resize-none"
                    placeholder="Additional notes about the client"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-surface-200 dark:border-surface-600">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditClient}
                  className="btn-primary flex-1"
                >
                  <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Client Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsViewModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="card-modern p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-surface-900 dark:text-white">
                  Client Details
                </h3>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Contact Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-surface-600 dark:text-surface-400">Name:</span>
                        <p className="font-medium text-surface-900 dark:text-white">{selectedClient.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-surface-600 dark:text-surface-400">Email:</span>
                        <p className="font-medium text-surface-900 dark:text-white">{selectedClient.email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-surface-600 dark:text-surface-400">Phone:</span>
                        <p className="font-medium text-surface-900 dark:text-white">{selectedClient.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-surface-600 dark:text-surface-400">Company:</span>
                        <p className="font-medium text-surface-900 dark:text-white">{selectedClient.company || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Business Stats
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-surface-600 dark:text-surface-400">Total Invoices:</span>
                        <p className="font-medium text-surface-900 dark:text-white">{selectedClient.totalInvoices}</p>
                      </div>
                      <div>
                        <span className="text-sm text-surface-600 dark:text-surface-400">Total Amount:</span>
                        <p className="font-medium text-surface-900 dark:text-white">${selectedClient.totalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-surface-600 dark:text-surface-400">Status:</span>
                        <span className={`inline-flex ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                          selectedClient.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-400'
                        }`}>
                          {selectedClient.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-surface-600 dark:text-surface-400">Added:</span>
                        <p className="font-medium text-surface-900 dark:text-white">
                          {format(new Date(selectedClient.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedClient.address && (
                  <div>
                    <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Address
                    </h4>
                    <p className="text-surface-900 dark:text-white whitespace-pre-line">
                      {selectedClient.address}
                    </p>
                  </div>
                )}

                {selectedClient.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Notes
                    </h4>
                    <p className="text-surface-900 dark:text-white whitespace-pre-line">
                      {selectedClient.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-surface-200 dark:border-surface-600">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false)
                    handleEditClientModal(selectedClient)
                  }}
                  className="btn-primary flex-1"
                >
                  <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                  Edit Client
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirmId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="card-modern p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">
                  Delete Client
                </h3>
                <p className="text-surface-600 dark:text-surface-400 mb-6">
                  Are you sure you want to delete this client? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteClient(deleteConfirmId)}
                    className="btn-primary bg-red-600 hover:bg-red-700 flex-1"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
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

export default Clients