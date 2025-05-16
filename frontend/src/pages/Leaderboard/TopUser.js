import React, { useEffect, useState } from 'react';
import { Table, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TopRecipe.scss';

const TopUser = () => {
  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState('averageRating'); 
  const navigate = useNavigate();
  const [nameFilter, setNameFilter] = useState("");


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user/api/alluserstats');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      }
    };

    fetchUsers();
  }, []);

  const handlenav = (id) => {
    if (!window.confirm("Đi đến người dùng?")) return;
    navigate(`/UserProfilePublic/${id}`);
}

const handleNameFilterChange = (e) => {
  setNameFilter(e.target.value);
};

const filteredUsers = users
.filter((user) => {
  const matchesName =
    nameFilter === "" ||
    (user.username && user.username.toLowerCase().includes(nameFilter.toLowerCase()));
  return matchesName;
})
.sort((a, b) => {
  if (sortBy === 'averageRating') {
    return parseFloat(b.averageRatingAcrossRecipes) - parseFloat(a.averageRatingAcrossRecipes);
  } else if (sortBy === 'totalRecipes') {
    return b.totalRecipes - a.totalRecipes;
  }
  return 0;
});

  return (
    <div className="TopRecipe_body">
      <Container className="leaderboard-container">
        <h1 className="leaderboard-title">Top Người Dùng</h1>
        <div className="filter-container-user">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select"
          >
            <option value="averageRating">Điểm trung bình</option>
            <option value="totalRecipes">Số lượng công thức đã đăng</option>
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
              <th>Ảnh đại diện</th>
              <th>Tên người dùng</th>
              <th>Điểm trung bình</th>
              <th>Tổng số lượng đánh giá đã nhận</th>
              <th>Số lượng công thức đã đăng</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.userId}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={user.userprofile || '/dragondancing_1200x1200.jpg'}
                    alt={user.username}
                    style={{ width: '75px', height: '75px', objectFit: 'cover'}}
                  />
                </td>
                <td onClick={() => handlenav(user._id)}>{user.username}</td>
                <td>{user.averageRatingAcrossRecipes}★</td>
                <td>{user.totalReviews}</td>
                <td>{user.totalRecipes}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default TopUser;