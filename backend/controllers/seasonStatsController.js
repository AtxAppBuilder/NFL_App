const axios = require('axios');
require('dotenv').config();
const pool = require('../config/db');
const BASE_URL = 'https://api.balldontlie.io/nfl/v1';
const saveJsonToFile = require('../utils/saveJSON'); 

const getAllSeasonStats = async (req, res) => {
  try {
    const {
      season,
      player_ids,
      team_id,
      postseason = false,
      sort_by,
      sort_order = 'desc',
      per_page = 25
    } = req.query;

    // Validate required season parameter
    if (!season) {
      return res.status(400).json({
        success: false,
        message: 'Season parameter is required'
      });
    }

    let allData = [];
    let cursor = null;

    // Loop through all pages using cursor-based pagination
    do {
      // Build query parameters
      const params = {
        season,
        per_page: Math.min(per_page, 100), // Limit per_page to 100
        cursor,
        postseason: postseason == 'true',
        ...(player_ids && { player_ids: Array.isArray(player_ids) ? player_ids : [player_ids] }),
        ...(team_id && { team_id }),
        ...(sort_by && { sort_by }),
        ...(sort_order && { sort_order })
      };

      // Fetch data from the API
      const response = await axios.get(`${BASE_URL}/season_stats`, {
        params,
        headers: {
          'Authorization': process.env.API_KEY
        }
      });

      // Add the fetched data to the allData array
      allData = allData.concat(response.data.data);

      // Update cursor for the next page
      cursor = response.data.meta.next_cursor;
    } while (cursor);

       // ** Save data to JSON file **
       const fileName = `season_stats_${season}.json`; 
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
    console.error('Error fetching season stats:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Failed to fetch season stats',
      error: error.response?.data || error.message
    });
  }
};

module.exports = {
  getAllSeasonStats
};
