import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    measurement: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const RecipeSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    
    recipename: {
        type: String,
        required: true
    },
    recipeImg: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    instructions: {
        type: Array,
        required: true
    },
    ingredients: [ingredientSchema],
    cookingTime: {
        type: String,
        required: true
    },
    servingSize: {
        type: Number,
        required: true
    }
    
}, { timestamps: true });

const recipeModel = mongoose.model("recipes", RecipeSchema);
export default recipeModel;

