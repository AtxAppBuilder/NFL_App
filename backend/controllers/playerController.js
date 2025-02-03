const axios = require('axios');
require('dotenv').config();
const saveJsonToFile = require('../utils/saveJSON'); 

const BASE_URL = 'https://api.balldontlie.io/nfl/v1';

const getAllPlayers = async (req, res) => {
  try {
    const {
      cursor,
      per_page = 25,
      search,
      first_name,
      last_name,
      team_ids,
      player_ids
    } = req.query;

    let allPlayers = [];
    let currentCursor = cursor || null;
    let page = 1; //Keeping track of the amount of API calls

    console.log('Fetching players from API...');

    // Loop through all pages using cursor-based pagination
    do {
      console.log(`Fetching page ${page}... (cursor: ${currentCursor || 'N/A'})`);

      // Build query parameters
      const params = {
        per_page: Math.min(per_page, 100), // Limit per_page to 100
        cursor: currentCursor,
        ...(search && { search }), // Add search if provided
        ...(first_name && { first_name }), // Add first_name if provided
        ...(last_name && { last_name }), // Add last_name if provided
        ...(team_ids && { team_ids: Array.isArray(team_ids) ? team_ids : [team_ids] }), // Ensure team_ids is an array
        ...(player_ids && { player_ids: Array.isArray(player_ids) ? player_ids : [player_ids] }) // Ensure player_ids is an array
      };

      // Fetch data from the API
      const response = await axios.get(`${BASE_URL}/players`, {
        params,
        headers: {
          'Authorization': process.env.API_KEY
        }
      });

      // Ensure the response contains valid data
      if (!response.data || !response.data.data) {
        console.error('Invalid API response:', response.data);
        break;
      }

      // Add the fetched players to the allPlayers array
      allPlayers = allPlayers.concat(response.data.data);

      // Check if there is a next cursor
      currentCursor = response.data.meta?.next_cursor || null;

      console.log(`Page ${page} fetched. Players count: ${allPlayers.length}`);

      page++; // Increment page number for debugging

    } while (currentCursor);

    console.log(`Total players fetched: ${allPlayers.length}`);

    // Save data to JSON file (optional)
    const fileName = `players_${Date.now()}.json`; // Unique filename based on timestamp
    saveJsonToFile(fileName, allPlayers);

    // Send the JSON data directly in the response
    res.json({
      success: true,
      data: allPlayers,
      meta: {
        total_count: allPlayers.length
      }
    });
  } catch (error) {
    console.error('Error fetching players:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Failed to fetch players',
      error: error.response?.data || error.message
    });
  }
};

module.exports = {
  getAllPlayers
};