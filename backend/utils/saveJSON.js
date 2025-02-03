const fs = require('fs');
const path = require('path');

/**
 * Saves JSON data to a file.
 * @param {string} fileName - The name of the file.
 * @param {Object} data - The JSON data to save.
 */
const saveJsonToFile = (fileName, data) => {
  try {
    const filePath = path.join(__dirname, '..', 'data', fileName); // Saves in 'data' folder
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Data saved to ${filePath}`);
  } catch (error) {
    console.error('❌ Error saving JSON file:', error);
  }
};

module.exports = saveJsonToFile;



