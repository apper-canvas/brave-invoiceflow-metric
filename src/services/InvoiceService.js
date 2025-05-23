/**
 * Invoice service for managing invoice data
 * Table name: invoice2
 */

const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'invoiceNumber',
  'clientName',
  'amount',
  'dueDate',
  'description',
  'status',
  'amountPaid'
];

export const InvoiceService = {
  /**
   * Get all invoices
   * @param {Object} filters - Optional filter parameters
   * @returns {Promise} Promise with invoices data
   */
  getInvoices: async (filters = {}) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          'Id',
          'Name',
          'Tags',
          'Owner',
          'CreatedOn',
          'CreatedBy',
          'ModifiedOn',
          'ModifiedBy',
          'invoiceNumber',
          'clientName',
          'amount',
          'dueDate',
          'description',
          'status',
          'amountPaid'
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      // Add where clause if filters provided
      if (filters.where) {
        params.where = filters.where;
      }

      // Add orderBy if provided
      if (filters.orderBy) {
        params.orderBy = filters.orderBy;
      }

      const response = await apperClient.fetchRecords('invoice2', params);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  /**
   * Get invoice by ID
   * @param {string} invoiceId - The invoice ID
   * @returns {Promise} Promise with invoice data
   */
  getInvoiceById: async (invoiceId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          'Id',
          'Name',
          'Tags',
          'Owner',
          'CreatedOn',
          'CreatedBy',
          'ModifiedOn',
          'ModifiedBy',
          'invoiceNumber',
          'clientName',
          'amount',
          'dueDate',
          'description',
          'status',
          'amountPaid'
        ]
      };

      const response = await apperClient.getRecordById('invoice2', invoiceId, params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice with ID ${invoiceId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new invoice
   * @param {Object} invoiceData - The invoice data to create
   * @returns {Promise} Promise with created invoice data
   */
  createInvoice: async (invoiceData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Filter out non-updateable fields
      const filteredData = {};
      UPDATEABLE_FIELDS.forEach(field => {
        if (invoiceData[field] !== undefined) {
          filteredData[field] = invoiceData[field];
        }
      });

      // Format date fields properly
      if (filteredData.dueDate) {
        // Ensure date is in YYYY-MM-DD format
        filteredData.dueDate = new Date(filteredData.dueDate).toISOString().split('T')[0];
      }

      // Format currency fields properly
      if (filteredData.amount) {
        filteredData.amount = parseFloat(filteredData.amount);
      }
      
      if (filteredData.amountPaid) {
        filteredData.amountPaid = parseFloat(filteredData.amountPaid);
      }

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord('invoice2', params);
      return response.results?.[0]?.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  /**
   * Update an existing invoice
   * @param {Object} invoiceData - The invoice data to update
   * @returns {Promise} Promise with updated invoice data
   */
  updateInvoice: async (invoiceData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Filter out non-updateable fields but keep Id
      const filteredData = { Id: invoiceData.Id };
      UPDATEABLE_FIELDS.forEach(field => {
        if (invoiceData[field] !== undefined) {
          filteredData[field] = invoiceData[field];
        }
      });

      // Format date fields properly
      if (filteredData.dueDate) {
        // Ensure date is in YYYY-MM-DD format
        filteredData.dueDate = new Date(filteredData.dueDate).toISOString().split('T')[0];
      }

      // Format currency fields properly
      if (filteredData.amount) {
        filteredData.amount = parseFloat(filteredData.amount);
      }
      
      if (filteredData.amountPaid) {
        filteredData.amountPaid = parseFloat(filteredData.amountPaid);
      }

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord('invoice2', params);
      return response.results?.[0]?.data;
    } catch (error) {
      console.error(`Error updating invoice with ID ${invoiceData.Id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an invoice
   * @param {string} invoiceId - The invoice ID to delete
   * @returns {Promise} Promise with delete operation result
   */
  deleteInvoice: async (invoiceId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [invoiceId]
      };

      const response = await apperClient.deleteRecord('invoice2', params);
      return response.success;
    } catch (error) {
      console.error(`Error deleting invoice with ID ${invoiceId}:`, error);
      throw error;
    }
  }
};

export default InvoiceService;