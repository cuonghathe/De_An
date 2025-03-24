import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form } from 'react-bootstrap';
import axios from 'axios';
import "./header.scss";

const Header = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('authToken');
    const [searchTerm, setSearchTerm] = useState('');
    const userId = localStorage.getItem('userId');

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const handlenav = () => {
        navigate(`/userprofile/${userId}`);
    }

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchTerm.trim()) {
            console.warn("Search term is empty");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/recipe/api/search/${encodeURIComponent(searchTerm)}`);
            navigate('/search', { state: { results: response.data } });
        } catch (error) {
            console.error('Failed to search recipes:', error);
        }
    };



    return (
        <>
            <header>
                <Navbar bg="dark" data-bs-theme="dark" style={{ width: "100%" }}>
                    <Container>
                        <Navbar.Brand as={NavLink} to="/" className="text-light mx-2" style={{ fontSize: "24px" }}>
                            TastyEcho
                        </Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                            <Nav.Link as={NavLink} to="/Recipe/Create">Tạo công thức</Nav.Link>
                        </Nav>

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

                        {isLoggedIn ? (
                            <Nav className="ml-auto">
                                <Nav.Link onClick={handlenav}>Tài khoản</Nav.Link>
                                <Nav.Link onClick={handleLogout}>Đăng xuất</Nav.Link>
                            </Nav>
                        ) : (
                            <Nav className="ml-auto">
                                <Nav.Link href="/login">Đăng nhập</Nav.Link>
                                <Nav.Link href="/register">Đăng ký</Nav.Link>
                            </Nav>
                        )}
                    </Container>
                </Navbar>
            </header>
        </>
    );
};

export default Header;