import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import '../../../layouts/header.scss';

const Header = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');


    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const handlenav = () => {
        navigate(`/admin/userprofile/${userId}`);
    }


    return (
        <>
            <header>
                <Navbar bg="dark" data-bs-theme="dark" style={{ width: "100%" }}>
                    <Container>
                        <NavLink to='/admin' className="text-decoration-none text-light mx-2" style={{ fontSize: "24px" }}>AdminPanel</NavLink>
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/admin/Recipe/Create">Tạo công thức</Nav.Link>
                            <Nav.Link as={NavLink} to="/admin">Quản lý công thức</Nav.Link>
                            <Nav.Link as={NavLink} to="/admin/User/Manage">Quản lý người dùng</Nav.Link>
                            <Nav.Link as={NavLink} to="/admin/Home">Trang chủ</Nav.Link>
                        </Nav>


                        {isLoggedIn ? (
                            <Nav className="ml-auto">
                                <Nav.Link onClick={handlenav}>Tài khoản</Nav.Link>
                                <Nav.Link onClick={handleLogout}>Đăng xuất</Nav.Link>
                            </Nav>
                        ) : (
                            <Nav className="ml-auto">
                                <Nav.Link href="/login">Đăng nhập</Nav.Link>
                            </Nav>
                        )}
                    </Container>
                </Navbar>
            </header>
        </>
    );
};

export default Header;

