import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './TopRecipe.scss';

const TopRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [timeFilter, setTimeFilter] = useState("allTime");
  const navigate = useNavigate();
  const [nameFilter, setNameFilter] = useState("");


  useEffect(() => {
    const fetchRecipes = async () => {
      let dateThreshold = null;
      const now = new Date();

      if (timeFilter === "lastMonth") {
        dateThreshold = new Date(now);
        dateThreshold.setMonth(now.getMonth() - 1);
      } else if (timeFilter === "last3Months") {
        dateThreshold = new Date(now);
        dateThreshold.setMonth(now.getMonth() - 3);
      } else if (timeFilter === "lastYear") {
        dateThreshold = new Date(now);
        dateThreshold.setFullYear(now.getFullYear() - 1);
      }

      try {
        const response = await axios.get('http://localhost:5000/recipe/api/getRecipes');
        const sortedRecipes = response.data.allRecipeData
          .filter((recipe) => {
            const createdAt = new Date(recipe.createdAt);
            return !dateThreshold || createdAt >= dateThreshold;
          })
          .sort((a, b) => b.averageRating - a.averageRating);
        setRecipes(sortedRecipes);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      }
    };

    fetchRecipes();
  }, [timeFilter]);

  const handleNameFilterChange = (e) => {
    setNameFilter(e.target.value); // Update name filter state
  };

  const filteredRecipe = recipes
    .filter((recipe) => {
      const matchesName =
        nameFilter === "" ||
        (recipe.recipename && recipe.recipename.toLowerCase().includes(nameFilter.toLowerCase()));
      return matchesName;
    })

  const handleNavigateRecipe = (id) => {
    if (!window.confirm("Đi đến công thức?")) return;
    navigate(`/recipe/${id}`);
  };

  return (
    <div className='TopRecipe_body'>

      <Container className="leaderboard-container">
        <h1 className="leaderboard-title">Top công thức</h1>

        <div className="filter-container">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="form-select"
          >
            <option value="allTime">Toàn thời gian</option>
            <option value="lastMonth">Tháng trước</option>
            <option value="last3Months">3 tháng trước</option>
            <option value="lastYear">Năm trước</option>
          </select>
        </div>

        <div className="filters">
          <input className='search_input'
            type="text"
            placeholder="Tìm kiếm"
            value={nameFilter}
            onChange={handleNameFilterChange}
          />
        </div>

        <Table striped bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Ảnh công thức</th>
              <th>Tên công thức</th>
              <th>Tác giả</th>
              <th>Điểm trung bình</th>
              <th>Số lượng đánh giá</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecipe.map((recipe) => {
              const originalIndex = recipes.findIndex((r) => r._id === recipe._id);
              return (
                <tr key={recipe._id}>
                  <td>{originalIndex + 1}</td> { }
                  <td>
                    <img
                      src={recipe.recipeImg || '/default-image.png'}
                      alt={recipe.recipename}
                      style={{ width: '75px', height: '75px', objectFit: 'cover', borderRadius: '5px' }}
                    />
                  </td>
                  <td onClick={() => handleNavigateRecipe(recipe._id)}>{recipe.recipename}</td>
                  <td>{recipe.userData[0]?.username || 'Unknown'}</td>
                  <td>{recipe.averageRating}★</td>
                  <td>{recipe.reviewCount}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default TopRecipe;