// Thay đổi số lượng nguyên liệu theo số suất ăn mới
export const adjustMeasurements = (ingredients, currentServings, newServings) => {
  if (currentServings <= 0 || newServings <= 0) {
    throw new Error("Số lượng suất ăn phải lớn hơn 0");
  }

  const adjustmentFactor = newServings / currentServings;
  return ingredients.map(ingredient => ({
    ...ingredient,
    quantity: Math.round(ingredient.quantity * adjustmentFactor * 100) / 100 // Làm tròn 2 số thập phân
  }));
};

// Lấy định lượng cho công thức từ CSDL
export const getMeasurementsForRecipe = async (recipeId) => {
  const recipe = await recipeDB.findById(recipeId);
  if (!recipe) {
    throw new Error("Công thức không tồn tại");
  }
  return recipe.ingredients;
};

// Tính toán số lượng nguyên liệu dựa trên số suất ăn mới
export const calculateServingSize = (originalServings, newServings, ingredients) => {
  if (originalServings <= 0 || newServings <= 0) {
    throw new Error("Số lượng suất ăn phải lớn hơn 0");
  }

  return ingredients.map(ingredient => ({
    ...ingredient,
    quantity: Math.round((ingredient.quantity / originalServings) * newServings * 100) / 100
  }));
};

// Lấy thông tin suất ăn từ công thức
export const getServingSizeInfo = (recipe) => {
  if (!recipe || !recipe.servingSize || !Array.isArray(recipe.ingredients)) {
    throw new Error("Dữ liệu công thức không hợp lệ");
  }

  return {
    servings: recipe.servingSize,
    ingredients: recipe.ingredients
  };
};
