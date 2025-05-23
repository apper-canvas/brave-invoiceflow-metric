/**
 * Recurring Invoice service for managing recurring invoice data
 * Table name: recurring_invoice
 */

const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'clientName',
  'amount',
  'description',
  'frequency',
  'nextDueDate',
  'status'
];

export const RecurringInvoiceService = {
  /**
   * Get all recurring invoices
   * @param {Object} filters - Optional filter parameters
   * @returns {Promise} Promise with recurring invoices data
   */
  getRecurringInvoices: async (filters = {}) => {
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
          'clientName',
          'amount',
          'description',
          'frequency',
          'nextDueDate',
          'status'
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

      const response = await apperClient.fetchRecords('recurring_invoice', params);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching recurring invoices:', error);
      throw error;
    }
  },

  /**
   * Get recurring invoice by ID
   * @param {string} recurringInvoiceId - The recurring invoice ID
   * @returns {Promise} Promise with recurring invoice data
   */
  getRecurringInvoiceById: async (recurringInvoiceId) => {
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
          'clientName',
          'amount',
          'description',
          'frequency',
          'nextDueDate',
          'status'
        ]
      };

      const response = await apperClient.getRecordById('recurring_invoice', recurringInvoiceId, params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recurring invoice with ID ${recurringInvoiceId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new recurring invoice
   * @param {Object} recurringInvoiceData - The recurring invoice data to create
   * @returns {Promise} Promise with created recurring invoice data
   */
  createRecurringInvoice: async (recurringInvoiceData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Filter out non-updateable fields
      const filteredData = {};
      UPDATEABLE_FIELDS.forEach(field => {
        if (recurringInvoiceData[field] !== undefined) {
          filteredData[field] = recurringInvoiceData[field];
        }
      });

      // Format date fields properly
      if (filteredData.nextDueDate) {
        // Ensure date is in YYYY-MM-DD format
        filteredData.nextDueDate = new Date(filteredData.nextDueDate).toISOString().split('T')[0];
      }

      // Format currency fields properly
      if (filteredData.amount) {
        filteredData.amount = parseFloat(filteredData.amount);
      }

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord('recurring_invoice', params);
      return response.results?.[0]?.data;
    } catch (error) {
      console.error('Error creating recurring invoice:', error);
      throw error;
    }
  },

  /**
   * Update an existing recurring invoice
   * @param {Object} recurringInvoiceData - The recurring invoice data to update
   * @returns {Promise} Promise with updated recurring invoice data
   */
  updateRecurringInvoice: async (recurringInvoiceData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Filter out non-updateable fields but keep Id
      const filteredData = { Id: recurringInvoiceData.Id };
      UPDATEABLE_FIELDS.forEach(field => {
        if (recurringInvoiceData[field] !== undefined) {
          filteredData[field] = recurringInvoiceData[field];
        }
      });

      // Format date fields properly
      if (filteredData.nextDueDate) {
        // Ensure date is in YYYY-MM-DD format
        filteredData.nextDueDate = new Date(filteredData.nextDueDate).toISOString().split('T')[0];
      }

      // Format currency fields properly
      if (filteredData.amount) {
        filteredData.amount = parseFloat(filteredData.amount);
      }

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord('recurring_invoice', params);
      return response.results?.[0]?.data;
    } catch (error) {
      console.error(`Error updating recurring invoice with ID ${recurringInvoiceData.Id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a recurring invoice
   * @param {string} recurringInvoiceId - The recurring invoice ID to delete
   * @returns {Promise} Promise with delete operation result
   */
  deleteRecurringInvoice: async (recurringInvoiceId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [recurringInvoiceId]
      };

      const response = await apperClient.deleteRecord('recurring_invoice', params);
      return response.success;
    } catch (error) {
      console.error(`Error deleting recurring invoice with ID ${recurringInvoiceId}:`, error);
      throw error;
    }
  }
};

export default RecurringInvoiceService;