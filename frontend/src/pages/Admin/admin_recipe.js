import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Container from "react-bootstrap/Container";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import "../Recipe/Recipe.scss";

const AdminRecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [checkedIngredients, setCheckedIngredients] = useState([]);
    const [servings, setServings] = useState(1);
    const [adjustedIngredients, setAdjustedIngredients] = useState([]);
    const [reviews, setReviews] = useState([]);
    const token = localStorage.getItem("authToken");



    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/recipe/api/singleRecipe/${id}`);
                setRecipe(response.data);
                setServings(response.data.servingSize);
                setAdjustedIngredients(response.data.ingredients);
            } catch (error) {
                console.error('Failed to fetch recipe:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/review/api/getreview/${id}`);
                setReviews(response.data);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            }
        };

        fetchRecipe();
        fetchReviews();
    }, [id]);


    const handleCheck = (ingredient) => {
        setCheckedIngredients(prevState =>
            prevState.includes(ingredient)
                ? prevState.filter(item => item !== ingredient)
                : [...prevState, ingredient]
        );
    };

    const adjustIngredients = (newServings) => {
        const adjustmentFactor = newServings / recipe.servingSize;
        const newIngredients = recipe.ingredients.map(ingredient => ({
            ...ingredient,
            quantity: Math.round(ingredient.quantity * adjustmentFactor * 100) / 100
        }));
        setAdjustedIngredients(newIngredients);
    };

    const handleServingsChange = (newServings) => {
        if (newServings > 0) {
            adjustIngredients(newServings);
            setServings(newServings);
        }
    };


    const handleDeleteReview = async (reviewId) => {
        try {
            await axios.delete(`http://localhost:5000/review/api/deletereview/${reviewId}`, {
                headers: { Authorization: `${token}` },
            });
            setReviews(reviews.filter(review => review._id !== reviewId));
        } catch (error) {
            console.error('Failed to delete review:', error);
        }
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
        return (total / reviews.length).toFixed(1);
    };

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="recipe-container">
            <div className="recipe-header-details-container">
                <div className="recipe-header-container">
                    <div className="recipe-header">
                        <h1 className="recipe-title">{recipe.recipename}</h1>
                        <div className="recipe-image-container">
                            <Card className='recipe-image-card'>
                                <Card.Img variant="top" src={recipe.recipeImg || '/logo192.png'} />
                            </Card>
                        </div>
                    </div>
                </div>
                <div className="recipe-details">
                    <h4 className="recipe-author">Tác giả: <span className='review'>{recipe.userId.username}</span></h4>
                    <div className="rating_info">
                        Điểm: <span className='review'>{calculateAverageRating()}<i className="star">★ </i></span>
                        <span className='review'>({recipe.reviewCount}) Đánh giá</span>
                    </div>
                    <Card.Title>Thời gian nấu</Card.Title>
                    <p className="mb-4">{recipe.cookingTime}</p>
                    <Card.Title>Suất ăn</Card.Title>
                    <div className="mb-4">
                        <div className="d-flex align-items-center button-group-outline mt-2">
                            <ButtonGroup>
                                <Button variant="outline-secondary" onClick={() => handleServingsChange(servings - 1)}>-</Button>
                                <p className="mx-2 my-0 servings-display">{servings}</p>
                                <Button variant="outline-secondary" onClick={() => handleServingsChange(servings + 1)}>+</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                    <div className="description">
                        <Card.Title>Mô tả:</Card.Title>
                        {recipe.description}
                    </div>
                </div>
            </div>

            <div className="recipe-ingredients-instructions">
                <Card className="ingredients-card">
                    <Card.Body>
                        <h4 className='mt-2'>Nguyên liệu</h4>
                        <Form>
                            {adjustedIngredients.map((ingredient, index) => (
                                <Form.Check
                                    key={index}
                                    type="checkbox"
                                    label={`${ingredient.name}: ${ingredient.quantity} (${ingredient.measurement})`}
                                    checked={checkedIngredients.includes(ingredient.name)}
                                    onChange={() => handleCheck(ingredient.name)}
                                    className={checkedIngredients.includes(ingredient.name) ? 'checked' : ''}
                                />
                            ))}
                        </Form>
                    </Card.Body>
                </Card>

                <Card className="instructions-card mt-4">
                    <Card.Body>
                        <h4 className='mt-2'>Cách làm</h4>
                        <Form>
                            {recipe.instructions.map((instruction, index) => (
                                <Form.Check
                                    key={index}
                                    type="checkbox"
                                    label={instruction}
                                    className='instruction-item'
                                />
                            ))}
                        </Form>
                    </Card.Body>
                </Card>
            </div>

            <div className="reviewdetails mt-4">
                <h2>Reviews ({reviews.length})</h2>
                <div className="user_review mt-4">
                    {reviews.map((review) => (
                        <Card key={review._id} className="mb-3">
                            <Card.Body>
                                <div className="info_box">
                                    <h5>{review.username}
                                        <span className="stars">
                                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                        </span>
                                    </h5>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteReview(review._id)}>Xóa</Button>
                                </div>
                                <div>
                                    <small className="Date">{new Date(review.createdAt).toLocaleDateString()}</small>
                                </div>

                                <p className="mt-2">{review.description}</p>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>
        </Container>
    );
}

export default AdminRecipeDetails;