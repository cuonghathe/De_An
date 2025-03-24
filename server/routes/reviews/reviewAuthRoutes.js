import express from 'express';
const router = new express.Router();
import userAuthenticate from '../../middleware/userAuthenticate.js';
import reviewAuthController from '../../controllers/reviews/reviewController.js';

router.post("/create/:recipeid",userAuthenticate,reviewAuthController.createReview);
router.get("/getreview/:recipeid",reviewAuthController.getRecipeReview);
router.delete("/deletereview/:reviewid",userAuthenticate,reviewAuthController.deleteReview);


export default router