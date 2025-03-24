const RecipeList = ({ recipes, onDeleteRecipe }) => {
  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <div key={recipe._id} className="recipe-item">
          <h3>{recipe.name}</h3>
          <p>{recipe.description}</p>
          <button onClick={() => onDeleteRecipe(recipe._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;