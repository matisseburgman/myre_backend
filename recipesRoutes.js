const express = require('express');
const Recipe = require('./models/Recipe');
const router = express.Router();

router.get('/recipes/random', async (req, res) => {
    try {
        const { food_type } = req.query;
        
        // Bouw de aggregation pipeline
        let pipeline = [];
        
        // Voeg filter toe als food_type is opgegeven
        if (food_type) {
            pipeline.push({
                $match: { food_type: food_type }
            });
        }
        
        // Voeg altijd de random sample toe
        pipeline.push({ $sample: { size: 1 } });
        
        const recipe = await Recipe.aggregate(pipeline);
        
        if (recipe.length > 0) {
            res.json(recipe[0]);
        } else {
            res.status(404).json({ message: "No recipes found" });
        }
    } catch (error) {
        console.error('Error fetching random recipe:', error);
        res.status(500).json({ message: "Error fetching random recipe" });
    }
});

module.exports = router;
