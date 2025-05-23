import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { format } from 'date-fns'
import ApperIcon from '../components/ApperIcon'
import ClientService from '../services/ClientService'
import { setClients, addClient, updateClient, deleteClient, setLoading } from '../store/invoiceSlice'

function Clients() {
  const dispatch = useDispatch()
  const { clients } = useSelector(state => state.invoices)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: ''
  });
  
  // Fetch clients when component mounts
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        dispatch(setLoading({ entity: 'clients', status: true }));
        
        const clientsData = await ClientService.getClients();
        
        // Transform data to match the expected format in the UI
        const formattedClients = clientsData.map(client => ({
          ...client,
          name: client.Name,
          email: client.email || '',
          createdAt: client.CreatedOn,
          // These would come from invoice relationships in a real implementation
          // For now, we'll set them to default values
          totalInvoices: 0,
          totalAmount: 0
        }));
        
        dispatch(setClients(formattedClients));
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        toast.error('Failed to load clients');
      } finally {
        setIsLoading(false);
        dispatch(setLoading({ entity: 'clients', status: false }));
      }
    };
    
    fetchClients();
  }, [dispatch]);

  // Filter and sort clients
  const filteredClients = useMemo(() => {
    let filtered = clients.filter(client =>
      (client.name || client.Name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.phone || '').includes(searchTerm)
    )

    filtered.sort((a, b) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    })

    return filtered
  }, [clients, searchTerm, sortBy, sortOrder])

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleAddClient = () => {
    const addNewClient = async () => {
      if (!newClient.name.trim() || !newClient.email.trim()) {
        toast.error('Name and email are required');
        return;
      }
      
      try {
        setIsLoading(true);
        
        const clientData = {
          Name: newClient.name,
          email: newClient.email,
          phone: newClient.phone,
          company: newClient.company,
          address: newClient.address,
          notes: newClient.notes,
          status: 'active'
        };
        
        const createdClient = await ClientService.createClient(clientData);
        dispatch(addClient({...createdClient, name: createdClient.Name, totalInvoices: 0, totalAmount: 0}));
        
        setNewClient({ name: '', email: '', phone: '', company: '', address: '', notes: '' });
        setIsAddModalOpen(false);
        toast.success('Client added successfully!');
      } catch (error) {
        console.error('Failed to add client:', error);
        toast.error('Failed to add client');
      } finally {
        setIsLoading(false);
      }
    }
    
    addNewClient();
  }
  
  const handleEditClient = () => {
    const updateExistingClient = async () => {
      if (!selectedClient.name && !selectedClient.Name) {
        toast.error('Name is required');
        return;
      }
      
      try {
        setIsLoading(true);
        
        const clientData = {
          Id: selectedClient.Id,
          Name: selectedClient.name || selectedClient.Name,
          email: selectedClient.email,
          phone: selectedClient.phone,
          company: selectedClient.company,
          address: selectedClient.address,
          notes: selectedClient.notes,
          status: selectedClient.status || 'active'
        };
        
        const updatedClient = await ClientService.updateClient(clientData);
        dispatch(updateClient({...updatedClient, name: updatedClient.Name}));
        
        setIsEditModalOpen(false);
        setSelectedClient(null);
        toast.success('Client updated successfully!');
      } catch (error) {
        console.error('Failed to update client:', error);
        toast.error('Failed to update client');
      } finally {
        setIsLoading(false);
      }
    }
    
    updateExistingClient();
  }
  
  const handleDeleteClient = (clientId) => {
    const deleteExistingClient = async () => {
      try {
        setIsLoading(true);
        
        await ClientService.deleteClient(clientId);
        dispatch(deleteClient(clientId));
        
        setDeleteConfirmId(null);
        toast.success('Client deleted successfully!');
      } catch (error) {
        console.error('Failed to delete client:', error);
        toast.error('Failed to delete client');
      } finally {
        setIsLoading(false);
      }
    }
    
    deleteExistingClient();
  }

  const handleViewClient = (client) => {
    setSelectedClient(client);
    setIsViewModalOpen(true);
  }

  const handleEditClientModal = (client) => {
    setSelectedClient({ ...client });
    setIsEditModalOpen(true);
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return 'ArrowUpDown';
    return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown';
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
                <p className="text-2xl font-bold text-green-600">{clients.filter(c => c.status === 'active').length}</p>
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
                  ${clients.reduce((sum, client) => sum + (client.totalAmount || 0), 0).toLocaleString()}
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
                  ${Math.round(clients.reduce((sum, client) => sum + (client.totalAmount || 0), 0) / 
                    clients.reduce((sum, client) => sum + (client.totalInvoices || 0), 0) || 0)}
                </p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-xl">
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </div>
        </div>

        {/* Clients Table */}
        {isLoading ? (
          <div className="card-modern p-8">
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-surface-600 dark:text-surface-400">
                Loading clients...
              </p>
            </div>
          </div>
        ) : (
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
                          {client.name || client.Name}
                        </div>
                        {client.email && (
                          <div className="text-sm text-surface-600 dark:text-surface-400">{client.email}</div>
                        )}
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
                          Added {client.createdAt ? format(new Date(client.createdAt), 'MMM dd, yyyy') : 'N/A'}
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
                        ${(client.totalAmount || 0).toLocaleString()}
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
        )}
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