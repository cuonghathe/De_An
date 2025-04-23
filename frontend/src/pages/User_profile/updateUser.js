import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Login/Login.scss';

const UpdateProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [file, setFile] = useState(null);
    const [userprofile, setUserprofile] = useState('');
    const [passShow, setPassShow] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/user/api/profile/${userId}`);
                const { username, email, userprofile } = res.data;
                setUsername(username);
                setEmail(email);
                setUserprofile(userprofile);
            } catch (err) {
                console.error("Lỗi khi lấy thông tin người dùng:", err);
                setError("Không thể tải thông tin người dùng");
            }
        };
        fetchUser();
    }, [userId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        if (password) {
            formData.append('password', password);
        }
        if (file) {
            formData.append('userprofile', file);
        }

        try {
            const res = await axios.put(`http://localhost:5000/user/api/updateprofile/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(res.data);
            navigate(`/userprofile/${userId}`);
        } catch (err) {
            console.error('Cập nhật thất bại:', err);
            setError(err.response?.data?.error || 'Cập nhật thất bại');
        }
    };

    return (
        <div className="login_body">
            <section>
                <div className="form_data">
                    <div className="form_heading">
                        <h1>Cập nhật thông tin</h1>
                    </div>

                    <form onSubmit={handleUpdate}>
                        <div className="form_input">
                            <input
                                type="text"
                                name="username"
                                placeholder='Tên tài khoản'
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
                            {userprofile && (
                                <img src={userprofile} alt="Avatar" style={{ width: "80px", borderRadius: "50%", marginBottom: "10px" }} />
                            )}
                            <label htmlFor="file">Cập nhật ảnh đại diện</label>
                            <input
                                type="file"
                                name="file"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </div>

                        <div className="form_input">
                            <label>Mật khẩu mới (tuỳ chọn)</label>
                            <div className="two">
                                <input
                                    type={!passShow ? "password" : "text"}
                                    name="password"
                                    placeholder='Nhập mật khẩu mới'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="showpass" onClick={() => setPassShow(!passShow)}>
                                    {!passShow ? "Hiện" : "Ẩn"}
                                </div>
                            </div>
                        </div>

                        {error && <div className="error_message">{error}</div>}

                        <button className='btn' type="submit">Cập nhật</button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default UpdateProfile;
