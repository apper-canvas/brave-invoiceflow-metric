/**
 * Invoice Item service for managing invoice item data
 * Table name: invoice_item1
 */

const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'description',
  'quantity',
  'rate',
  'invoice'
];

export const InvoiceItemService = {
  /**
   * Get all invoice items
   * @param {Object} filters - Optional filter parameters
   * @returns {Promise} Promise with invoice items data
   */
  getInvoiceItems: async (filters = {}) => {
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
          'description',
          'quantity',
          'rate',
          'invoice'
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

      const response = await apperClient.fetchRecords('invoice_item1', params);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching invoice items:', error);
      throw error;
    }
  },

  /**
   * Get invoice items by invoice ID
   * @param {string} invoiceId - The invoice ID
   * @returns {Promise} Promise with invoice items data
   */
  getInvoiceItemsByInvoiceId: async (invoiceId) => {
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
          'description',
          'quantity',
          'rate',
          'invoice'
        ],
        where: [
          {
            fieldName: 'invoice',
            operator: 'ExactMatch',
            values: [invoiceId]
          }
        ]
      };

      const response = await apperClient.fetchRecords('invoice_item1', params);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching invoice items for invoice ID ${invoiceId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new invoice item
   * @param {Object} invoiceItemData - The invoice item data to create
   * @returns {Promise} Promise with created invoice item data
   */
  createInvoiceItem: async (invoiceItemData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Filter out non-updateable fields
      const filteredData = {};
      UPDATEABLE_FIELDS.forEach(field => {
        if (invoiceItemData[field] !== undefined) {
          filteredData[field] = invoiceItemData[field];
        }
      });

      // Format numeric fields properly
      if (filteredData.quantity) {
        filteredData.quantity = parseInt(filteredData.quantity, 10);
      }
      
      if (filteredData.rate) {
        filteredData.rate = parseFloat(filteredData.rate);
      }

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord('invoice_item1', params);
      return response.results?.[0]?.data;
    } catch (error) {
      console.error('Error creating invoice item:', error);
      throw error;
    }
  },

  /**
   * Delete an invoice item
   * @param {string} invoiceItemId - The invoice item ID to delete
   * @returns {Promise} Promise with delete operation result
   */
  deleteInvoiceItem: async (invoiceItemId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [invoiceItemId]
      };

      const response = await apperClient.deleteRecord('invoice_item1', params);
      return response.success;
    } catch (error) {
      console.error(`Error deleting invoice item with ID ${invoiceItemId}:`, error);
      throw error;
    }
  },

  /**
   * Create multiple invoice items
   * @param {Array} invoiceItems - Array of invoice item data to create
   * @returns {Promise} Promise with created invoice items data
   */
  createInvoiceItems: async (invoiceItems) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const filteredItems = invoiceItems.map(item => {
        const filteredData = {};
        UPDATEABLE_FIELDS.forEach(field => {
          if (item[field] !== undefined) {
            filteredData[field] = item[field];
          }
        });

        // Format numeric fields properly
        if (filteredData.quantity) {
          filteredData.quantity = parseInt(filteredData.quantity, 10);
        }
        
        if (filteredData.rate) {
          filteredData.rate = parseFloat(filteredData.rate);
        }

        return filteredData;
      });

      const params = {
        records: filteredItems
      };

      const response = await apperClient.createRecord('invoice_item1', params);
      return response.results?.map(result => result.data) || [];
    } catch (error) {
      console.error('Error creating multiple invoice items:', error);
      throw error;
    }
  }
};

export default InvoiceItemService;