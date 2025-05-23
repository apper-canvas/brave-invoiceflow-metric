/**
 * Client service for managing client data
 * Table name: client4
 */

const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'email',
  'phone',
  'company',
  'address',
  'notes',
  'status'
];

export const ClientService = {
  /**
   * Get all clients
   * @param {Object} filters - Optional filter parameters
   * @returns {Promise} Promise with clients data
   */
  getClients: async (filters = {}) => {
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
          'email',
          'phone',
          'company',
          'address',
          'notes',
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

      const response = await apperClient.fetchRecords('client4', params);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  /**
   * Get client by ID
   * @param {string} clientId - The client ID
   * @returns {Promise} Promise with client data
   */
  getClientById: async (clientId) => {
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
          'email',
          'phone',
          'company',
          'address',
          'notes',
          'status'
        ]
      };

      const response = await apperClient.getRecordById('client4', clientId, params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching client with ID ${clientId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new client
   * @param {Object} clientData - The client data to create
   * @returns {Promise} Promise with created client data
   */
  createClient: async (clientData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Filter out non-updateable fields
      const filteredData = {};
      UPDATEABLE_FIELDS.forEach(field => {
        if (clientData[field] !== undefined) {
          filteredData[field] = clientData[field];
        }
      });

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.createRecord('client4', params);
      return response.results?.[0]?.data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  /**
   * Update an existing client
   * @param {Object} clientData - The client data to update
   * @returns {Promise} Promise with updated client data
   */
  updateClient: async (clientData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Filter out non-updateable fields but keep Id
      const filteredData = { Id: clientData.Id };
      UPDATEABLE_FIELDS.forEach(field => {
        if (clientData[field] !== undefined) {
          filteredData[field] = clientData[field];
        }
      });

      const params = {
        records: [filteredData]
      };

      const response = await apperClient.updateRecord('client4', params);
      return response.results?.[0]?.data;
    } catch (error) {
      console.error(`Error updating client with ID ${clientData.Id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a client
   * @param {string} clientId - The client ID to delete
   * @returns {Promise} Promise with delete operation result
   */
  deleteClient: async (clientId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [clientId]
      };

      const response = await apperClient.deleteRecord('client4', params);
      return response.success;
    } catch (error) {
      console.error(`Error deleting client with ID ${clientId}:`, error);
      throw error;
    }
  }
};

export default ClientService;