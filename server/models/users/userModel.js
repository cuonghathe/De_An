import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value.trim())) {
        throw new Error("Email không hợp lệ");
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  userprofile: {
    type: String,

  },

  isAdmin:
  {
    type: Boolean,
    default: false
  },

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  verifytoken: {
    type: String,
  },
}, { timestamps: true });

// Token generation
userSchema.methods.generateAuthToken = async function () {
  try {
    const SECRET_KEY = process.env.SECRET_KEY;
    if (!SECRET_KEY) {
      throw new Error('SECRET_KEY is not defined');
    }

    let newToken = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, SECRET_KEY, {
      expiresIn: "1d",
    });

    this.tokens = this.tokens.concat({ token: newToken });
    await this.save();
    return newToken;
  } catch (error) {
    throw new Error('Token generation failed');
  }
};

// Model
const userDB = mongoose.model('users', userSchema);

export default userDB;