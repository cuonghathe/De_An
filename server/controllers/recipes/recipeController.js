import recipeDB from "../../models/recipe/recipeModel.js";
import cloudinary from "../../Cloudinary/cloudinary.js";
import reviewDB from "../../models/review/reviewModel.js";

const ITEM_PER_PAGE = 10;

const adjustMeasurements = (ingredients, originalServings, newServings) => {
  return ingredients.map(ingredient => {
    const adjustedMeasurement = (parseFloat(ingredient.measurement) * newServings) / originalServings;
    return { ...ingredient, measurement: adjustedMeasurement.toString() };
  });
};

// Tao cong thuc
export const createRecipe = async (req, res) => {
  const file = req.file ? req.file.path : "";
  const { recipename, description, instructions, ingredients, cookingTime, servingSize } = req.body;

  if (!recipename || !description || !instructions || !ingredients || !cookingTime || !servingSize) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin" });
  }

  const upload = await cloudinary.uploader.upload(file);
  try {
    const recipeData = new recipeDB({
      userId: req.userId,
      recipename,
      description,
      instructions: JSON.parse(instructions),
      ingredients: JSON.parse(ingredients),
      cookingTime,
      recipeImg: upload.secure_url,
      servingSize
    });

    await recipeData.save();
    res.status(200).json({ message: "Tạo công thức thành công", recipeData });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }
};

// sua cong thuc
export const updateRecipe = async (req, res) => {
  const { recipeid } = req.params;
  const file = req.file ? req.file.path : "";
  const { recipename, description, instructions, ingredients, cookingTime, servingSize } = req.body;

  var upload;
  if (file) {
    upload = await cloudinary.uploader.upload(file);
  }

  try {
    const existingRecipe = await recipeDB.findById(recipeid);
    const adjustedIngredients = adjustMeasurements(ingredients, existingRecipe.servingSize, servingSize);

    const updateRecipe = await recipeDB.findByIdAndUpdate({ _id: recipeid }, {
      recipename, description, instructions, ingredients: adjustedIngredients, cookingTime, recipeImg: upload && upload.secure_url, servingSize
    }, { new: true });

    await updateRecipe.save();
    res.status(200).json({ message: "Sửa thành công", updateRecipe })
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error })
  }
}

//xoa cong thuc
export const deleteRecipe = async (req, res) => {
  const { recipeid } = req.params;
  try {
    const deleteRecipe = await recipeDB.findByIdAndDelete({ _id: recipeid });
    res.status(200).json({ message: "Xóa thành công", deleteRecipe })
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error })
  }

}

// Tìm kiếm công thức
export const searchRecipe = async (req, res) => {
  try {
      const allRecipeData = await recipeDB.find({
          "$or": [
              { recipename: { $regex: req.params.key, $options: "i" } }
          ]
      });
      

      res.json(allRecipeData);
  } catch (error) {
      console.error("Error searching recipes:", error);
      res.status(500).json({ message: "Server error" });
  }
};

export const getAllRecipes = async (req, res) => {
  try {
    const allRecipeData = await recipeDB.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: 'userData'
        }
      }
    ]);

    const recipesWithReviewCount = await Promise.all(
      allRecipeData.map(async (recipe) => {
        const reviews = await reviewDB.find({ recipeid: recipe._id });

        const calculateAverageRating = () => {
          if (reviews.length === 0) return 0;
          const total = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
          return (total / reviews.length).toFixed(1);
        };

        const averageRating = calculateAverageRating();
        const reviewCount = reviews.length;

        return { ...recipe, averageRating, reviewCount };
      })
    );

    const count = await recipeDB.countDocuments();
    const pageCount = Math.ceil(count / ITEM_PER_PAGE);

    res.status(200).json({
      allRecipeData: recipesWithReviewCount,
      Pagination: {
        totalRecipeCount: count,
        pageCount
      }
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }
};



export const getSingleRecipeData = async (req, res) => {
  const { recipeid } = req.params;

  try {
    const recipe = await recipeDB.findOne({ _id: recipeid }).populate('userId', 'username');
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }
};






const recipeAuthController = {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipe,
  getAllRecipes,
  getSingleRecipeData
};

export default recipeAuthController;