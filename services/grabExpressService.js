const axios = require("axios");
const grabExpressCredentials = require("../config/grabExpressCredentials");

const grabExpressService = {
  token: null,
  tokenExpiration: null,

  getAuthToken: async () => {
    const now = new Date();

    if (this.token && this.tokenExpiration && now < this.tokenExpiration) {
      return this.token;
    }

    try {
      const response = await axios.post(
        `${grabExpressCredentials.baseURL}/grabid/v1/oauth2/token`,
        {
          client_id: grabExpressCredentials.clientId,
          client_secret: grabExpressCredentials.clientSecret,
          grant_type: grabExpressCredentials.grantType,
          scope: grabExpressCredentials.scope,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        }
      );

      this.token = response.data.access_token;
      this.tokenExpiration = new Date(
        now.getTime() + response.data.expires_in * 1000
      );

      return this.token;
    } catch (error) {
      console.error("Error fetching auth token:", error.response?.data);
      throw error;
    }
  },

  createOrder: async (orderDetails) => {
    try {
      const token = await this.getAuthToken();
      const response = await axios.post(
        `${grabExpressCredentials.baseURL}/orders`,
        orderDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating order with Grab Express:", error);
      throw error;
    }
  },

  getOrderStatus: async (orderId) => {
    try {
      const token = await this.getAuthToken();
      const response = await axios.get(
        `${grabExpressCredentials.baseURL}/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error fetching order status from Grab Express:", error);
      throw error;
    }
  },
};

module.exports = grabExpressService;
