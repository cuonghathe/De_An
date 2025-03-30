import React, { useEffect, useState } from 'react';
import { Card, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.scss';

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const [ratingRange] = useState("");
  const [sortOrder, setSortOrder] = useState("highest");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/recipe/api/getRecipes');
        setRecipes(response.data.allRecipeData);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      }
    };

    fetchRecipes();
  }, []);



  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const filteredRecipe = recipes.filter((recipe) => {
    const matchesRating =
      ratingRange === "" ||
      (ratingRange === "Điểm") ||
      (ratingRange === "Review" && recipe.reviewCount) ||
      (ratingRange === "Ngày tạo" && recipe.createdAt);
    return matchesRating;
  })

  .sort((a, b) => {
    if (sortOrder === "rating↓") return b.averageRating - a.averageRating;
    else if (sortOrder === "rating↑") return a.reviewCount - b.reviewCount;
    else if (sortOrder === "numrating↓") return b.reviewCount - a.reviewCount;
    else if (sortOrder === "numrating↑") return a.reviewCount - b.reviewCount;
    else if (sortOrder === "date↓") return a.createdAt - b.createdAt;
    else if (sortOrder === "date↑") return b.createdAt - a.createdAt;

    return a.createdAt - b.createdAt;
  
  });


  const handleNavigateRecipe = (id) => {
    navigate(`/recipe/${id}`);
  };

  return (
    <Container className='dashboard_container'>
      <div className="recipe_container">
        <h1 className="text-center mt-5">Công thức ({recipes.length})</h1>
        <div className="filters">
          <select onChange={handleSortOrderChange} value={sortOrder}>
            <option value="date↑">Mới nhất</option>
            <option value="date↓">Cũ nhất</option>
            <option value="rating↓">Điểm ↓</option>
            <option value="rating↑">Điểm ↑</option>
            <option value="numrating↓">Số review ↓</option>
            <option value="numrating↑">Số review ↑</option>


          </select>
        </div>
        <div className="recipecard">
          {filteredRecipe.map((recipe) => (
            <Card key={recipe._id} style={{ maxWidth: '21rem', width: "100%", marginBottom: "15px", boxShadow: "0px 2px 20px #cfd8dc", height: "27rem", cursor: "pointer" }}>
              <Card.Img style={{ width: "100%", height: "13rem" }} variant="top" src={recipe.recipeImg || '/dragondancing_1200x1200.jpg'} />
              <Card.Body>
                <Card.Title>{recipe.recipename} <small style={{fontweight:"100px"}}>({new Date(recipe.createdAt).toLocaleDateString()})</small></Card.Title> 

                <Card.Text className="card_text">
                  {recipe.description.length > 100
                    ? recipe.description.slice(0, 100) + "..."
                    : recipe.description}
                </Card.Text>
                <Card.Text>
                  Điểm: <small className="star">{recipe.averageRating}★ </small><small>({recipe.reviewCount})</small>
                </Card.Text>
                <Button variant="outline-danger" onClick={() => handleNavigateRecipe(recipe._id)}>Xem công thức</Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;