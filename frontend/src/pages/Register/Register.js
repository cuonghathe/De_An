import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../Login/Login.scss';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [file, setFile] = useState(null);
    const [passShow, setPassShow] = useState(false);
    const [cpassShow, setCPassShow] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('comfirmpassword', confirmPassword);
        if (file) {
            formData.append('userprofile', file);
        }

        try {
            const response = await axios.post('http://localhost:5000/user/api/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            if (response.data.message === "Đăng ký thành công") {
                navigate('/login');
            }
        } catch (error) {
            console.error('Đăng ký thất bại:', error);
            setError(error.response?.data?.error || 'Đăng ký thất bại');
        }
    }

    return (
        <>
            <div className="login_body">
                <section>
                    <div className="form_data">
                        <div className="form_heading">
                            <h1>Đăng ký</h1>
                        </div>

                        <form onSubmit={handleRegister}>
                            <div className="form_input">
                                <input
                                    type="text"
                                    name="username"
                                    placeholder='Nhập tên tài khoản'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="form_input">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder='Địa chỉ Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form_input">
                                <label htmlFor="file">Ảnh đại diện (tùy chọn)</label>
                                <input
                                    type="file"
                                    name="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </div>
                            <div className="form_input">
                                <label htmlFor="password">Mật khẩu</label>
                                <div className="two">
                                    <input
                                        type={!passShow ? "password" : "text"}
                                        name="password"
                                        placeholder='Nhập mật khẩu'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div className="showpass" onClick={() => setPassShow(!passShow)}>
                                        {!passShow ? "Hiện" : "Ẩn"}
                                    </div>
                                </div>
                            </div>
                            <div className="form_input">
                                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                                <div className="two">
                                    <input
                                        type={!cpassShow ? "password" : "text"}
                                        name="confirmPassword"
                                        placeholder='Xác nhận mật khẩu'
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <div className="showpass" onClick={() => setCPassShow(!cpassShow)}>
                                        {!passShow ? "Hiện" : "Ẩn"}
                                    </div>
                                </div>
                            </div>

                            {error && <div className="error_message">{error}</div>}

                            <button className='btn' type="submit">Đăng ký</button>
                            <p>Đã có tài khoản? <NavLink to="/login">Đăng nhập</NavLink> </p>
                        </form>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Register;