const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const userProfile = require('../services/profileService');
const searchRecipe = require('../services/useApiService');
const historyFood = require('../services/historyFoodService');




//authentication
router.post('/register', authService.register);
router.post('/login', authService.login);

//profile
router.get('/user/:nickname', userProfile.readOne);
router.put('/user/:nickname', userProfile.update);
router.delete('/user/:nickname', userProfile.delete);


//Recipe
router.post('/recipe', searchRecipe.getRecipe);

router.post('/add-recipe', historyFood.add);
router.put('/del-recipe', historyFood.delete);

module.exports = router;