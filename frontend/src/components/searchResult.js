import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Container, Button } from 'react-bootstrap';
import '../../src/pages/Dashboard/Dashboard.scss';
import { useNavigate } from 'react-router-dom';


const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { results } = location.state || { results: [] };


    const handleNavigateRecipe = (id) => {
        navigate(`/recipe/${id}`);
    };

    return (
        <Container className='dashboard_container'>
            <div className="recipe_container">
                <h1 className="text-center mt-5">Kết quả tìm kiếm ({results.length})</h1>
                <div className="recipecard">
                    {results.map((recipe) => (
                        <Card key={recipe._id} style={{ maxWidth: '21rem', width: "100%", marginBottom: "15px", boxShadow: "0px 2px 20px #cfd8dc", height: "27rem", cursor: "pointer" }}>
                            <Card.Img style={{ width: "100%", height: "13rem" }} variant="top" src={recipe.recipeImg || '/logo192.png'} />
                            <Card.Body>
                                <Card.Title>{recipe.recipename}</Card.Title>

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


export default SearchResults;