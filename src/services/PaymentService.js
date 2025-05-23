/**
 * Payment service for managing payment data
 * Table name: payment1
 */

const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'invoice',
  'amount',
  'paymentDate',
  'paymentMethod'
];

export const PaymentService = {
  /**
   * Get all payments
   * @param {Object} filters - Optional filter parameters
   * @returns {Promise} Promise with payments data
   */
  getPayments: async (filters = {}) => {
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
          'invoice',
          'amount',
          'paymentDate',
          'paymentMethod'
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

      const response = await apperClient.fetchRecords('payment1', params);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  /**
   * Get payments by invoice ID
   * @param {string} invoiceId - The invoice ID
   * @returns {Promise} Promise with payments data
   */
  getPaymentsByInvoiceId: async (invoiceId) => {
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
          'invoice',
          'amount',
          'paymentDate',
          'paymentMethod'
        ],
        where: [
          {
            fieldName: 'invoice',
            operator: 'ExactMatch',
            values: [invoiceId]
          }
        ]
      };

      const response = await apperClient.fetchRecords('payment1', params);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching payments for invoice ID ${invoiceId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new payment
   * @param {Object} paymentData - The payment data to create
   * @returns {Promise} Promise with created payment data
   */
  createPayment: async (paymentData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Filter out non-updateable fields
      const filteredData = {};
      UPDATEABLE_FIELDS.forEach(field => {
        if (paymentData[field] !== undefined) {
          filteredData[field] = paymentData[field];
        }
      });

      // Format date fields properly
      if (filteredData.paymentDate) {
        // Ensure date is in YYYY-MM-DD format
        filteredData.paymentDate = new Date(filteredData.paymentDate).toISOString().split('T')[0];
      }

      // Format currency fields properly
      if (filteredData.amount) {
        filteredData.amount = parseFloat(filteredData.amount);
      }

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord('payment1', params);
      return response.results?.[0]?.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  /**
   * Delete a payment
   * @param {string} paymentId - The payment ID to delete
   * @returns {Promise} Promise with delete operation result
   */
  deletePayment: async (paymentId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [paymentId]
      };

      const response = await apperClient.deleteRecord('payment1', params);
      return response.success;
    } catch (error) {
      console.error(`Error deleting payment with ID ${paymentId}:`, error);
      throw error;
    }
  }
};

export default PaymentService;