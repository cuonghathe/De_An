import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import { ListGroup, Container, Nav, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import '../../src/pages/Dashboard/Dashboard.scss';



const AdminSearchResults = () => {
  const location = useLocation();
  const { results } = location.state || { results: [] };
  const [setRecipes] = useState([]);
  const [setError] = useState("");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa công thức này?")) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:5000/recipe/api/delete/${recipeId}`, {
        headers: { Authorization: `${token}` },
      });
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== recipeId));
    } catch (err) {
      setError("Lỗi khi xóa công thức.");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      console.warn("Search term is empty");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/recipe/api/search/${encodeURIComponent(searchTerm)}`);
      navigate('admin/search', { state: { results: response.data } });
    } catch (error) {
      console.error('Failed to search recipes:', error);
    }
  };


  const handleNavigateRecipe = (id) => {
    navigate(`Recipe/${id}`);
  };


  return (
    <Container className="recipe-management">
      <h2 className="mb-4 text-center">Quản lý công thức</h2>

      <Nav className='text-mid'>
        <Form className='d-flex' style={{ maxWidth: "400px", width: "100%" }} onSubmit={handleSearch}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" style={{ position: "absolute", right: "6px", top: "8px", cursor: "pointer", border: "none", background: "none" }}>
            <i className="fa-solid fa-search"></i>
          </button>
        </Form>
      </Nav>

      <ListGroup>
        {results.map((recipe) => (
          <ListGroup.Item key={recipe._id} className="d-flex justify-content-between align-items-center">
            <span>
              <strong>{recipe.recipename}</strong> - {recipe.description}
            </span>
            <div>
              <button className="btn btn-success btn-sm me-2" onClick={() => handleNavigateRecipe(recipe._id)}>
                Xem
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRecipe(recipe._id)}>
                Xóa
              </button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default AdminSearchResults;