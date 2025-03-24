import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Container from "react-bootstrap/Container";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import "../Recipe/Recipe.scss";

const UserProfile = () => {
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
                <Card.Img variant="top" src={user.UserProfile || '/logo192.png'} />
              </Card>
            </div>
          </div>
        </div>
        <div className="recipe-details">
          <h4 className="recipe-author">Tác giả: <span className='review'>{user.username}</span></h4>
          <div className="rating_info">
            Điểm: <span className="star">{ }<i >★ </i></span>
            <Button variant="link" className='review_btn' onClick={scrollToReviews}>({reviews.length}) Đánh giá</Button>

          </div>
          <Card.Title>email</Card.Title>
          <p className="mb-4">{user.email}</p>
          <Card.Title>Suất ăn</Card.Title>
          <div className="mb-4">


          </div>
          <div className="description">
            <Card.Title>Thời gian tạo:</Card.Title>
            {user.createdAt}
          </div>
        </div>
      </div>

      <div className="recipe-ingredients-instructions">
        <Card className="ingredients-card" ref={ingredientsRef}>
          <Card.Body>
            <h4 className='mt-2'>Công thức đã đăng ({recipes.length}) </h4>
            <Form>
              {recipes.map(recipe => (
                <Card key={recipe._id} className="recipe-card">
                  <Card.Body>
                    <Card.Title>{recipe.recipename}</Card.Title>
                    <Card.Text>Ngày tạo: {recipe.createdAt}</Card.Text>
                    <Card.Text>Điểm:</Card.Text>
                    <Button variant="primary" href={`/recipe/${recipe._id}`}>Xem chi tiết</Button>
                  </Card.Body>
                </Card>

              ))}
            </Form>
          </Card.Body>
        </Card>



        <div className="user_review mt-4" ref={reviewRef}>
          <h3>Đánh giá đã viết ({reviews.length})</h3>
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
                  <small className="Date">({review.createdAt})</small>
                </div>

                <p className="mt-2">{review.description}</p>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default UserProfile;
