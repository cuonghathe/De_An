import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  recipeid: {
    type: Schema.Types.ObjectId,
    ref: "recipes",
    required: true
  },

  username: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  description: {
    type: String,
  }

},{timestamps:true});

const reviewDB = new mongoose.model("review", ReviewSchema)
export default reviewDB