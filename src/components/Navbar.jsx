import React from 'react';
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaBell, FaUserAlt, FaFacebookMessenger } from 'react-icons/fa'; 
import '../stylesheets/Navbar.css';

function NavBar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear token from localStorage
        localStorage.removeItem('token');
        
        // Navigate to the login page
        navigate('/login');
    };

    return (
        <Navbar expand="lg" variant="dark" sticky="top" className="navbar" style={{ backgroundColor: '#fff', borderBottom: '1px solid #dbdbdb', paddingLeft: '20px', paddingRight: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <Navbar.Brand as={Link} to="/dashboard" className="navbar-brand-left">
                {/* Facebook Logo */}
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" 
                    alt="Facebook Logo" 
                    className="navbar-logo" 
                    style={{ height: '30px' }} 
                />
            </Navbar.Brand>
            
            <Nav className="navbar-center" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <div className="navbar-search-container" style={{ display: 'flex', alignItems: 'center' }}>
                    <FaSearch style={{ color: '#8e8e8e', marginRight: '5px' }} />
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="navbar-search" 
                        style={{ border: 'none', outline: 'none', paddingLeft: '5px', fontSize: '14px', color: '#8e8e8e', width: '200px' }} 
                    />
                </div>
            </Nav>

            <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', marginRight: '50px' }}>
                {/* Home Icon */}
                <Nav.Link as={Link} to="/dashboard" className="navbar-icon">
                    <FaHome style={{ fontSize: '20px' }} />
                </Nav.Link>

                {/* Explore Icon */}
                <Nav.Link className="navbar-icon">
                    <FaSearch style={{ fontSize: '20px' }} />
                </Nav.Link>

                {/* Notifications */}
                <Nav.Link className="navbar-icon">
                    <FaBell style={{ fontSize: '20px' }} />
                </Nav.Link>

                {/* Facebook Messenger Icon */}
                <Nav.Link className="navbar-icon">
                    <FaFacebookMessenger style={{ fontSize: '20px' }} />
                </Nav.Link>

                {/* Account Dropdown */}
                <NavDropdown title={<FaUserAlt style={{ fontSize: '20px' }} />} id="basic-nav-dropdown" className="navbar-icon" style={{ color: 'black' }}>
                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
            </div>
        </Navbar>
    );
}

export default NavBar;
