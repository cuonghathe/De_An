import React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import axios from 'axios';
import Container from "react-bootstrap/Container";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "../Recipe/Recipe.scss";

const UserProfilePublic = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [reviews, setReviews] = useState([]);



    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`http://localhost:5000/user/api/profile/${userId}`);
                setUser(userResponse.data);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        const fetchUserRecipes = async () => {
            try {
                const recipeResponse = await axios.get(`http://localhost:5000/user/api/getuserrecipe/${userId}`);
                setRecipes(recipeResponse.data);
            } catch (error) {
                console.error('Failed to fetch recipes:', error);
            }
        };

        const fetchUserReviews = async () => {
            try {
                const reviewResponse = await axios.get(`http://localhost:5000/user/api/getuserreview/${userId}`);
                setReviews(reviewResponse.data);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            }
        };


        fetchUserData();
        fetchUserRecipes();
        fetchUserReviews();
    }, [userId]);




    if (!user) {
        return <div>Đang tải...</div>;
    }
    
    return (
        <Container className="recipe-container">
            <div className="recipe-header-details-container">
                <div className="recipe-header-container">
                    <div className="recipe-header">
                        <h1 className="recipe-title">{ }</h1>
                        <div className="recipe-image-container">
                            <Card className='recipe-image-card'>
                                <Card.Img variant="top" src={user.userprofile || '/dragondancing_1200x1200.jpg'} />
                            </Card>
                        </div>
                    </div>
                </div>
                <div className="user-details">

                    <h4 className="recipe-author">
                        Username: <span className='review'>{user.username}</span>

                    </h4>
                    <Card.Title>Thời gian tạo tài khoản: <span className="mb-4">{new Date(user.createdAt).toLocaleDateString()}</span></Card.Title>
                    <Card.Title>Điểm trung bình:<span className="star"> {user.averageRatingAcrossRecipes}★</span> </Card.Title>
                    <Card.Title>Số bài đăng:<span className="mb-4"> {user.totalRecipes}</span> </Card.Title>
                    <Card.Title>Số đánh giá:<span className="mb-4"> {reviews.length}</span> </Card.Title>
                </div>
            </div>


            <div className="recipe-ingredients-instructions">
                <Card className="ingredients-card">
                    <Card.Body>
                        <h4 className='mt-2'>Công thức đã đăng ({recipes.length}) </h4>
                        <Form>
                            {recipes.map(recipe => (
                                <Card key={recipe._id} className="recipe-card">
                                    <Card.Body>
                                        <div className="info_box">
                                            <h5>{recipe.recipename}
                                                <p>Ngày tạo: <span className="mb-4">{new Date(recipe.createdAt).toLocaleDateString()}   </span></p>
                                            </h5>
                                            <div className="recipe-ingredients-instructions">
                                                <Button variant="success" size='sm' href={`/recipe/${recipe._id}`}>Xem</Button>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>

                            ))}
                        </Form>
                    </Card.Body>
                </Card>

            </div>

        </Container>
    );
};

export default UserProfilePublic;
