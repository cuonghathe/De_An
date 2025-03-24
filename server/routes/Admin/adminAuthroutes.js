import express from 'express';
import adminAuthenticate from '../../middleware/admnAuthenticate.js';
import userAuthController from '../../controllers/users/usersControllers.js';
import recipeAuthController from '../../controllers/recipes/recipeController.js';

const router = new express.Router();


router.get('/users', adminAuthenticate, userAuthController.getAllUsers);
router.delete('/user/:userid', adminAuthenticate, userAuthController.deleteUser);
router.delete('/recipe/:recipeid', adminAuthenticate, recipeAuthController.deleteRecipe);

export default router;


