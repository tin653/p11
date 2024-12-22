import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';  
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { API_ENPOINT } from '../Api';
import '../stylesheets/Login.css';  

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                jwtDecode(token);
                navigate('/dashboard');  
            } catch {
                console.error("Error decoding token", error);
                localStorage.removeItem('token');
                navigate("/login"); 
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Please enter username and password');
            return;
        }
        try {

            const response = await axios.post(`${API_ENPOINT}/auth/login`, { username, password });

            // Handle response and store token
            if (response.data?.token) {
                localStorage.setItem('token', response.data.token);
                setError('');  // Clear error message
                navigate('/dashboard');  // Redirect on success
            } else {
                throw new Error("Token not found");
            }
        } catch (err) {
            setError('Invalid username or password');  
            console.error("Login error:", err);
        }
    };
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner-border text-light" role="status">
                    <span className="sr-only"></span>
                </div>
                <p></p>
            </div>
        );
    }

    return (
        <Container className="login-container">
            <Row className="justify-content-center">
                <div className="login-content">
                    {/* Facebook logo */}
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" 
                        alt="Facebook Logo" 
                        className="logo" 
                        width="200" 
                    />
                    
                    {/* Facebook tagline */}
                    <h5 className="login-heading">Sign in to Facebook</h5>

                    <Col md={4} className="login-form">
                        {/* Error message */}
                        {error && <div className="alert alert-danger">{error}</div>}

                        <Form onSubmit={handleSubmit} className="login-form_1">
                            {/* Username input */}
                            <Form.Group controlId="username" className='username' style={{ width: '250px', marginBottom: '2px', }}>
                                <Form.Control 
                                    type="text" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    className="custom-input"
                                    placeholder="Phone number, username, or email" 
                                />
                            </Form.Group>

                            {/* Password input */}
                            <Form.Group controlId="password" className="mt-3" style={{ width: '250px', marginTop: '0', }}>
                                <Form.Control 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="custom-input"
                                    placeholder="Password" 
                                />
                            </Form.Group>

                            {/* Login button */}
                            <Button variant="primary" type="submit" className="mt-3 custom-button" style={{ width: '250px', }}>
                                Log In
                            </Button>

                            {/* Forgot password */}
                            <p style={{ marginTop: '10px', color: '#3897f0', cursor: 'pointer', display: 'inline-block' }}>Forgot password?</p>
                            
                            <div style={{ marginTop: '15px', borderTop: '1px solid #ccc', paddingTop: '24px' }}>
                                {/* Create new account */}
                                <Button 
                                    className='sign-up'
                                    variant="link" 
                                    style={{ color: '#3897f0', textDecoration: 'none' }}
                                >
                                    Don't have an account? Sign up
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </div>
            </Row>
        </Container>
    );
}

export default Login;
