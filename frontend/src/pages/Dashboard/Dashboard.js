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
  const [nameFilter, setNameFilter] = useState("");
  


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


  const handleNameFilterChange = (e) => {
    setNameFilter(e.target.value);
  };



  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const filteredRecipe = recipes
  .filter((recipe) => {
    const matchesName =
      nameFilter === "" ||
      (recipe.recipename && recipe.recipename.toLowerCase().includes(nameFilter.toLowerCase()));

    const matchesRating =
      ratingRange === "" ||
      ratingRange === "Điểm" ||
      (ratingRange === "Review" && recipe.reviewCount) ||
      (ratingRange === "Ngày tạo" && recipe.createdAt);

    return matchesRating && matchesName;
  })

    .sort((a, b) => {
      if (sortOrder === "rating↓") return b.averageRating - a.averageRating;
      else if (sortOrder === "rating↑") return a.reviewCount - b.reviewCount;
      else if (sortOrder === "numrating↓") return b.reviewCount - a.reviewCount;
      else if (sortOrder === "numrating↑") return a.reviewCount - b.reviewCount;
      if (sortOrder === "date↓") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOrder === "date↑") return new Date(b.createdAt) - new Date(a.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);

    });


  const handleNavigateRecipe = (id) => {
    navigate(`/recipe/${id}`);
  };

  return (
    <Container className='dashboard_container'>
      <div className="recipe_container">
        <h1 className="text-center mt-5">Công thức ({recipes.length})</h1>
        <div className="filters">
          <input className='search_input'
            type="text"
            placeholder="Tìm kiếm"
            value={nameFilter}
            onChange={handleNameFilterChange}
          />
          <select className='form-select' onChange={handleSortOrderChange} value={sortOrder}>
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
              <Card.Img style={{ width: "100%", height: "190px", maxWidth:"334px" }} variant="top" src={recipe.recipeImg || '/dragondancing_1200x1200.jpg'} />
              <Card.Body>
                <Card.Title>{recipe.recipename} <small style={{ fontweight: "100px" }}>({new Date(recipe.createdAt).toLocaleDateString()})</small></Card.Title>

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