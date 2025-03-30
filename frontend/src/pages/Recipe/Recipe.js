import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Container from "react-bootstrap/Container";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Scrolling from '../../api/voiceControl/scrolling';
import "./Recipe.scss";

const RecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [checkedIngredients, setCheckedIngredients] = useState([]);
    const [servings, setServings] = useState(1);
    const [adjustedIngredients, setAdjustedIngredients] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState('');
    const [newReview, setNewReview] = useState({ username: '', rating: '', description: '' });
    const token = localStorage.getItem("authToken");
    const instructionsRef = useRef(null);
    const reviewRef = useRef(null);
    const ingredientsRef = useRef(null);
    const helpRef = useRef(null);


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

    const handleAddReview = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/review/api/create/${id}`, newReview, {
                headers: { Authorization: `${token}` },
            });
            setReviews([...reviews, response.data.addReview]);
            setNewReview({ username: '', rating: '', description: '' });
        } catch (error) {
            console.error('Lỗi tạo:', error);
            setError(error.response?.data?.error || 'Lỗi tạo:');
        }
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
        return (total / reviews.length).toFixed(1);
    };

    const scrollToInstructions = () => {
        instructionsRef.current?.scrollIntoView();
    };

    const scrollToReviews = () => {
        reviewRef.current?.scrollIntoView();
    };

    const scrollToIngredients = () => {
        ingredientsRef.current?.scrollIntoView();
    };

    const changeOpacity = () => {
        if (helpRef.current) {
            const currentOpacity = helpRef.current.style.opacity;
            helpRef.current.style.opacity = currentOpacity === '1' ? '0.05' : '1';
        }
    };


    if (!recipe) {
        return <div>Đang tải....</div>;
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
                        Điểm: <span className="star">{calculateAverageRating()}<i >★ </i></span>
                        <Button variant="link" className='review_btn' onClick={scrollToReviews}>({reviews.length}) Đánh giá</Button>
                        <Scrolling
                            scrollToInstructions={scrollToInstructions}
                            scrollToReviews={scrollToReviews}
                            scrollToIngredients={scrollToIngredients}
                            changeOpacity={changeOpacity}
                            handleAddServing={() => handleServingsChange(servings + 1)}
                            handleRemoveServing={() => handleServingsChange(servings - 1)}
                        />

                    </div>
                    <Card.Title>Thời gian nấu: <span className="mb-4">{recipe.cookingTime}</span>
                    </Card.Title>
                    <Card.Title>Suất ăn</Card.Title>
                    <div className="mb-4">
                        <div className="d-flex align-items-center button-group-outline mt-2">
                            <ButtonGroup>
                                <Button variant="outline-secondary" onClick={() => handleServingsChange(servings - 1)}>-</Button>
                                <p className="mx-2 my-0 servings-display">{servings}</p>
                                <Button variant="outline-secondary" onClick={() => handleServingsChange(servings + 1)}>+</Button>
                            </ButtonGroup>

                            <Button variant="primary" className='navBtn' onClick={scrollToInstructions}>
                                Xem Cách Làm
                            </Button>
                        </div>
                    </div>
                    <div className="description">
                        <Card.Title>Mô tả:</Card.Title>
                        {recipe.description}
                    </div>
                </div>
            </div>

            <div className="recipe-ingredients-instructions">
                <Card className="ingredients-card" ref={ingredientsRef}>
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

                <Card className="instructions-card mt-4" ref={instructionsRef}>
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
                <Form className="mt-3">
                    <Form.Group>
                        <Form.Label>Tên</Form.Label>
                        <Form.Control
                            type="text"
                            value={newReview.username}
                            onChange={(e) => setNewReview({ ...newReview, username: e.target.value })}
                            placeholder="Nhập tên của bạn"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Đánh giá (1-5)</Form.Label>
                        <Form.Control className='rating'
                            type="number"
                            min="1"
                            max="5"
                            value={newReview.rating}
                            onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                            placeholder="1"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Bình luận</Form.Label>
                        <Form.Control
                            as="textarea"
                            readOnly
                            rows={3}
                            value={newReview.description}
                            onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
                            placeholder="Viết nhận xét của bạn..."
                        />
                    </Form.Group>

                    {typeof error === 'object' ? <p className="error">{error.message}</p> : <p className="error">{error}</p>}

                    <Button variant="primary" className="mt-3" onClick={handleAddReview}>
                        Gửi đánh giá
                    </Button>
                </Form>

                <div className="user_review mt-4" ref={reviewRef}>
                    {reviews.map((review) => (
                        <Card key={review._id} className="mb-3">
                            <Card.Body>
                                <div className="info_box">
                                    <h5>{review.username}
                                        <span className="stars">
                                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                        </span>
                                    </h5>
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

            <div className="help" ref={helpRef}>
                <div className="info_box">
                    <h4>Điều khiển giọng nói</h4>
                    <span onClick={changeOpacity} className="mb-4" style={{ color: "red", fontSize: "24px", fontWeight: "900" }}>X</span>
                </div>
                <p className="instruction" style={{ marginTop: "10px" }}>Ẩn hiện hộp hướng dẫn: "tắt", "bật"</p>
                <p className="instruction">Lên đầu trang: "đầu"</p>
                <p className="instruction">Xuống cuối trang: "cuối"</p>
                <p className="instruction">Cuộn lên xuống: "lên", "xuống"</p>
                <p className="instruction">Cuộn xuống giữa trang: "nửa"</p>
                <p className="instruction">Đi đến phần nguyên liệu: "1"</p>
                <p className="instruction">Đi đến phần hướng dẫn: "2"</p>
                <p className="instruction">Đi đến phần đánh giá: "3"</p>
                <p className="instruction">Tăng giảm suất ăn: "tăng", "giảm"</p>

            </div>
        </Container>
    );
}


export default RecipeDetails;