import express from 'express';
const router = new express.Router();
import recipeUpload from "../../Config/recipeConfig/recipeConfig.js";
import recipeAuthController from '../../controllers/recipes/recipeController.js';
import userAuthenticate from '../../middleware/userAuthenticate.js';

router.post("/create", userAuthenticate, recipeUpload.single("recipeImg"), recipeAuthController.createRecipe);
router.put("/update/:recipeid", userAuthenticate, recipeUpload.single("recipeImg"), recipeAuthController.updateRecipe);
router.delete("/delete/:recipeid", userAuthenticate, recipeAuthController.deleteRecipe);
router.get("/search/:key",recipeAuthController.searchRecipe)
router.get('/getRecipes', recipeAuthController.getAllRecipes);
router.get("/singleRecipe/:recipeid",recipeAuthController.getSingleRecipeData);



export default router;

