import React, { useState } from 'react';
import './Login.scss';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container } from 'react-bootstrap';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passShow, setPassShow] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCheck = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/user/api/login', { email, password });
      console.log(response.data);
      
      if (response.data.message === "Đăng nhập thành công") {
        const token = response.data.tokenData.token;
        const userId = response.data.tokenData.userId;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId);

        
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      setError(error.response?.data?.error || 'Đăng nhập thất bại');
    }
  };

  return (
    <>
      <div className='login_body'>
        <Container className='container_form'>
          <section>
            <div className="form_data">
              <div className="form_heading">
                <h1>Đăng nhập</h1>
              </div>

              <form onSubmit={handleCheck}>
                <div className="form_input">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder='Nhập địa chỉ email đăng ký'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form_input">
                  <label htmlFor="password">Mật khẩu</label>
                  <div className="two">
                    <input
                      type={!passShow ? "password" : "text"}
                      name="password"
                      id="password"
                      placeholder='Nhập mật khẩu'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="showpass" onClick={() => setPassShow(!passShow)}>
                      {!passShow ? "Hiện" : "Ẩn"}
                    </div>
                  </div>
                </div>

                {error && <div className="error_message">{error}</div>}

                <button className='btn' type="submit">Đăng nhập</button>
                <p>Chưa có tài khoản? <NavLink to="/register">Đăng ký</NavLink> </p>
              </form>
            </div>
          </section>
        </Container>
      </div>
    </>
  );
};

export default Login;