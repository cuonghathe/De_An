import userDB from "../../models/users/userModel.js";
import recipeDB from "../../models/recipe/recipeModel.js";
import reviewDB from "../../models/review/reviewModel.js";
import bcryptjs from "bcryptjs";
import cloudinary from "../../Cloudinary/cloudinary.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import trasporter from "../../helper.js";


dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

// Đăng ký
export const register = async (req, res) => {
  const file = req.file ? req.file.path : "";
  const { username, email, password, comfirmpassword } = req.body;

  if (!username || !email || !password || !comfirmpassword) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin" });
  }

  try {
    const preuser = await userDB.findOne({ email: email });

    if (preuser) {
      return res.status(400).json({ error: "Tài khoản đã tồn tại" });
    } else if (password !== comfirmpassword) {
      return res.status(400).json({ error: "Mật khẩu không khớp" });
    } else {
      const hashpassword = await bcryptjs.hash(password, 12);

      let userprofileUrl = "";
      if (file) {
        const result = await cloudinary.uploader.upload(file);
        userprofileUrl = result.secure_url;
      }

      const userData = new userDB({
        username,
        email,
        password: hashpassword,
        userprofile: userprofileUrl,
        isAdmin: email === "admin@gmail.com",

      });

      await userData.save();

      return res.status(201).json({ message: "Đăng ký thành công" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
// Đăng nhập
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(":", req.body);

  if (!email || !password) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin" });
  }

  try {
    const userValid = await userDB.findOne({ email: email });

    if (userValid) {
      const isMatch = await bcryptjs.compare(password, userValid.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Mật khẩu không đúng" });
      } else {
        try {
          const token = await userValid.generateAuthToken();

          const tokenData = {
            token,
            userId: userValid._id,
          };

          return res.status(200).json({ tokenData, message: "Đăng nhập thành công" });
        } catch (error) {
          return res.status(500).json({ error: "Token generation failed" });
        }
      }
    } else {
      return res.status(400).json({ error: "Tài khoản không tồn tại" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

// Xác minh
export const userVerify = async (req, res) => {
  try {
    const verifyUser = await userDB.findOne({ _id: req.userId });
    if (!verifyUser) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }
    return res.status(200).json({ verifyUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};


//quên mật khẩu
export const forgotpassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin" });
  }

  try {
    const userFind = await userDB.findOne({ email: email });


    if (!userFind) {
      return res.status(400).json({ error: "Tài khoản không tồn tại" });
    } else {

      //tao token cho user
      const token = jwt.sign({ _id: userFind._id }, SECRET_KEY, {
        expiresIn: "120s",
      });

      const setToken = await userDB.findOneAndUpdate({ _id: userFind._id }, { verifytoken: token }, { new: true });


      if (setToken) {
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Đặt lại mật khẩu",
          html: `
          <h2>Đặt lại mật khẩu</h2>
          <p>Xin chào ${userFind.username}</p>
          <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn. Hãy nhấn vào link phía dưới để tiếp tục</p>
          <a href="http://localhost:5000/resetpassword/${userFind.id}/${setToken.verifytoken}" style="display: inline-block;
          <p>Nêu không phải bạn, vui lòng bỏ qua email này</p>
          `,
        };

        trasporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            return res.status(400).json({ error: "Lỗi gửi mail" });
          } else {
            console.log("Email sent: ", info.response);
            return res.status(200).json({ message: "Email đã được gửi" });
          }
        });
      } else {
        return res.status(400).json({ error: "Tài khoản không hợp lệ" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

// Lấy tất cả người dùng
export const getAllUsers = async (req, res) => {
  try {
    const users = await userDB.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xoa nguoi dung
export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const deletedUser = await userDB.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    await reviewDB.deleteMany({ user: userId });
    res.status(200).json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserRecipe = async (req, res) => {
  const{userId} = req.params;
  try {
    const getrecipe = await recipeDB.find({userId:userId})
    res.status(200).json(getrecipe)
    
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error })
  }
}

export const getUserReview = async (req, res) => {
  const { userId } = req.params;

  try {
    const getreview = await reviewDB
      .find({ userId: userId })
      .populate({
        path: "recipeid",
        select: "recipename", 
      })
      .lean();

    const formattedReviews = getreview.map(review => ({
      ...review, 
      recipeid: review.recipeid?._id || review.recipeid,
      recipename: review.recipeid?.recipename || "Không tìm thấy công thức" 
    }));

    res.status(200).json(formattedReviews);
  } catch (error) {
    console.error("Lỗi lấy review:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};


export const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user details
    const user = await userDB.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch all recipes uploaded by the user
    const userRecipes = await recipeDB.find({ userId });

    // Calculate total recipes
    const totalRecipes = userRecipes.length;

    // Calculate total reviews and average rating
    let totalReviews = 0;
    let sumOfAverageRatings = 0;

    for (const recipe of userRecipes) {
      const reviews = await reviewDB.find({ recipeid: recipe._id });

      // Add the number of reviews for this recipe to the total
      totalReviews += reviews.length;

      // Calculate the average rating for this recipe
      const averageRating =
        reviews.length > 0
          ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length
          : 0;

      // Add the average rating to the sum of average ratings
      sumOfAverageRatings += averageRating;
    }

    // Calculate the average rating across all uploaded recipes
    const averageRatingAcrossRecipes =
      totalRecipes > 0 ? (sumOfAverageRatings / totalRecipes).toFixed(1) : "0.0";

    // Return user details along with stats
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      userprofile: user.userprofile,
      isAdmin: user.isAdmin,
      tokens: user.tokens,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      totalRecipes,
      totalReviews,
      averageRatingAcrossRecipes,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, email, password } = req.body;
  const file = req.file ? req.file.path : "";

  try {
    const user = await userDB.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      const hashPassword = await bcryptjs.hash(password, 12);
      user.password = hashPassword;
    }

    if (file) {
      const result = await cloudinary.uploader.upload(file);
      user.userprofile = result.secure_url;
    }

    await user.save();
    return res.status(200).json({ message: "Cập nhật thành công", user });

  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    return res.status(500).json({ error: "Lỗi server" });
  }
};


export const getUserRecipeStats = async (req, res) => {
  try {
    const allUsers = await userDB.find();

    const userStats = await Promise.all(
      allUsers.map(async (user) => {
        const userRecipes = await recipeDB.find({ userId: user._id });

        const totalRecipes = userRecipes.length;

        let totalReviews = 0;
        let sumOfAverageRatings = 0;

        for (const recipe of userRecipes) {
          const reviews = await reviewDB.find({ recipeid: recipe._id });

          totalReviews += reviews.length;

          const averageRating =
            reviews.length > 0
              ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length
              : 0;

          sumOfAverageRatings += averageRating;
        }

        const averageRatingAcrossRecipes =
          totalRecipes > 0 ? (sumOfAverageRatings / totalRecipes).toFixed(1) : "0.0";

        return {
          ...user.toObject(), 
          totalRecipes,
          totalReviews,
          averageRatingAcrossRecipes,
        };
      })
    );

    res.status(200).json(userStats);
  } catch (error) {
    console.error("Error fetching all users' recipe stats:", error);
    res.status(500).json({ error: "Failed to fetch all users' recipe stats" });
  }
};



const userAuthController = {
  register,
  login,
  userVerify,
  forgotpassword,
  deleteUser,
  getUserRecipe,
  getUserReview,
  getUser,
  updateUser,
  getUserRecipeStats,
};

export default userAuthController;