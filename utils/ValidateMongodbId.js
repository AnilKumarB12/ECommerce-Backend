const mongoose = require("mongoose");

/**
 * Validates if the provided ID is a valid MongoDB ObjectId.
 * @param {string} id - The ID to be validated.
 * @throws {Error} - Throws an error if the ID is not valid.
 */
const validateMongoDbId = (id) => {
    // Check if the provided ID is a valid MongoDB ObjectId
    //  isValid Checks if the provided id is a string and has a length of 24
    // isValid Checks if all characters are valid hexadecimal characters
    const isValid = mongoose.Types.ObjectId.isValid(id);

    // If the ID is not valid, throw an error
    if (!isValid) {
        throw new Error("This id is not valid or not found");
    }
}

// Export the validateMongoDbId function
module.exports = validateMongoDbId;
