const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: String,
    description: String,
    ingredients: [String],
    servings: Number,
    food_type: String,
    image_name: String,
    image_url: String
}, {
    collection: 'recipes_v4'
});

module.exports = mongoose.model('Recipe', recipeSchema); 
