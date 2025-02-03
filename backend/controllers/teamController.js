const axios = require('axios');
require('dotenv').config();
const pool = require('../config/db');
const BASE_URL = 'https://api.balldontlie.io/nfl/v1';
const saveJsonToFile = require('../utils/saveJSON');

const getAllTeams = async (req, res) => {
    try {
        // Extract query parameters
        const {
            division,
            conference
        } = req.query;

        let allData = [];
        let cursor = null;

        do {
        // Prepare the query parameters object
        const params = {
            ...(division && { division }), // Only add 'division' if provided
            ...(conference && { conference }), // Only add 'conference' if provided
            ...(cursor && { cursor }), // Ensure pagination works
        };

        // Make the GET request to the teams endpoint with the provided query parameters
        const response = await axios.get(`${BASE_URL}/teams`, {
            params,
            headers: {
                Authorization: process.env.API_KEY,
            }
        })

        allData = allData.concat(response.data.data);

        // Update cursor for pagination
        cursor = response.data.meta?.next_cursor || null;
        
    } while (cursor);

    // ** Save data to JSON file **
    const fileName = `teams_${division || 'all'}_${conference || 'all'}.json`;
    saveJsonToFile(fileName, allData);

    // Send the JSON data directly in the response
    res.json({
        success: true,
        data: allData,
        meta: {
          total_count: allData.length
        }
      });

    } catch (error) {
        console.error('Error fetching teams:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Failed to fetch teams',
      error: error.response?.data || error.message
    });
  };
}

module.exports = {
    getAllTeams
}