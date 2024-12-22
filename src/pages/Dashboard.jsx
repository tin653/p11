import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import NavBar from '../components/Navbar';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button, Row, Col, Form as BootstrapForm } from 'react-bootstrap'; 
import { API_ENPOINT } from '../Api';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [updateShow, setUpdateShow] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [updateFullname, setUpdateFullname] = useState('');
    const [updateUsername, setUpdateUsername] = useState('');
    const [updatePassword, setUpdatePassword] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const headers = { accept: 'application/json', Authorization: token };

    useEffect(() => {
        const fetchDecodedUserID = async () => {
            try {
                if (token) {
                    const decoded_token = jwtDecode(token);
                    setUser(decoded_token);
                } else {
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error decoding token", error);
                navigate("/login");
            }
        };
        fetchDecodedUserID();
    }, [navigate, token]);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(`${API_ENPOINT}/user`, { headers });
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (user_id) => {
        const isConfirm = await Swal.fire({
            title: 'Are you sure to delete this user?',
            text: "You won't be able to recover this user!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => result.isConfirmed);

        if (!isConfirm) return;

        try {
            await axios.delete(`${API_ENPOINT}/user/${user_id}`, { headers: headers });
            Swal.fire({ icon: 'success', title: 'Deleted!' });
            fetchUsers();
        } catch (error) {
            Swal.fire({ text: error.response?.data?.message || "An error occurred", icon: 'error' });
        }
    };

    const createUser = async (e) => {
        e.preventDefault();
        const userData = { fullname, username, password };
        try {
            const { data } = await axios.post(`${API_ENPOINT}/auth/register`, userData, { headers });
            Swal.fire({ icon: 'success', text: data.message });
            fetchUsers();
            setShow(false);  // Close the modal after successful user creation
        } catch (error) {
            Swal.fire({ icon: 'error', text: error.response?.data?.message || 'An error occurred during registration.' });
        }
    };
    //* Read user
    const [selectedUser1, setSelectedUser1] = useState(null);
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = (row_users) => {
        setSelectedUser(row_users);
        setShow1(true);
    }

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!updatePassword) {
            Swal.fire({ icon: 'error', text: 'Password must be changed to update the user.' });
            return;
        }

        const updatedUserData = { fullname: updateFullname, username: updateUsername, password: updatePassword };
        try {
            await axios.put(`${API_ENPOINT}/user/${selectedUser.user_id}`, updatedUserData, { headers });
            Swal.fire({ icon: 'success', text: 'User updated successfully!' });
            fetchUsers();
            setUpdateShow(false);
        } catch (error) {
            Swal.fire({ icon: 'error', text: error.response?.data?.message || 'An error occurred during update.' });
        }
    };

    const handleUserModalClose = () => setShow(false);
    const handleUserModalShow = () => setShow(true);
    const handleUserUpdateShow = (user) => {
        setSelectedUser(user);
        setUpdateFullname(user.fullname);
        setUpdateUsername(user.username);
        setUpdateShow(true);
    };

    return (
        <>
        <NavBar />
            <div className="container">
                
                <h1>Welcome, {user?.username}</h1>
                <div className="container text-end">
                    <Button onClick={handleUserModalShow} style={{ backgroundColor: "rgb(28, 150, 33)", color: "white", marginBottom: "10px" }}>Create User</Button>
                </div>

                <table className="table table-bordered" id="table">
                    <thead>
                        <tr>
                            <th><center>ID</center></th>
                            <th><center>Username</center></th>
                            <th><center>Full Name</center></th>
                            <th><center>Actions</center></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 && (
                            users.map((row_user) => (
                                <tr key={row_user.user_id}>  
                                    <td><center>{row_user.user_id}</center></td>
                                    <td><center>{row_user.username}</center></td>
                                    <td><center>{row_user.fullname}</center></td>
                                    <td style={{ textAlign: "center" }}>
                                        <Button variant="secondary" size="sm" style={{ marginRight: "5px", backgroundColor: "gray" }} onClick={() => handleShow1(row_user)}>Read</Button>
                                        <Button variant="danger" size="sm" style={{ marginRight: "5px", backgroundColor: "darkred", color: "white" }} onClick={() => { deleteUser(row_user.user_id) }}>Delete</Button>
                                        <Button variant="warning" size="sm" style={{ marginRight: "5px", backgroundColor: "orange" }} onClick={() => handleUserUpdateShow(row_user)}>Update</Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for creating a new user */}
            <Modal show={show} onHide={handleUserModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <BootstrapForm onSubmit={createUser}>
                        <Row>
                            <Col><BootstrapForm.Group controlId="Firstname"><BootstrapForm.Label>Fullname</BootstrapForm.Label><BootstrapForm.Control type='text' value={fullname} onChange={(e) => setFullname(e.target.value)} required /></BootstrapForm.Group></Col>
                        </Row>
                        <Row><Col><BootstrapForm.Group controlId="Username"><BootstrapForm.Label>Username</BootstrapForm.Label><BootstrapForm.Control type='text' value={username} onChange={(e) => setUsername(e.target.value)} required /></BootstrapForm.Group></Col></Row>
                        <Row><Col><BootstrapForm.Group controlId="Password"><BootstrapForm.Label>Password</BootstrapForm.Label><BootstrapForm.Control type='password' value={password} onChange={(e) => setPassword(e.target.value)} required /></BootstrapForm.Group></Col></Row>
                        <Button variant="primary" type="submit" style={{ marginTop: '20px', backgroundColor: 'rgb(20, 40, 150)', padding: '10px', width: '100%' }}>Save</Button>
                    </BootstrapForm>
                </Modal.Body>
            </Modal>

            {/* Modal for viewing user details */}
            <Modal 
            show={show1} 
            onHide={handleClose1} 
            aria-labelledby="read-user-modal"
            autoFocus
            enforceFocus
            >
                <Modal.Header closeButton>
                    <Modal.Title id="read-user-modal">Row Details</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {selectedUser ? (
                        <div>
                            <p><strong>ID:</strong> {selectedUser.user_id}</p>
                            <p><strong>Username:</strong> {selectedUser.username}</p>
                            <p><strong>Lastname:</strong> {selectedUser.fullname}</p>
                        </div>
                    ) : (
                        <p>No data available</p>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose1}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* Modal for updating a user */}
            <Modal show={updateShow} onHide={() => setUpdateShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <BootstrapForm onSubmit={handleUpdateUser}>
                        <Row><Col><BootstrapForm.Group controlId="updateFullname"><BootstrapForm.Label>Fullname</BootstrapForm.Label><BootstrapForm.Control type="text" value={updateFullname} onChange={(e) => setUpdateFullname(e.target.value)} required /></BootstrapForm.Group></Col></Row>
                        <Row><Col><BootstrapForm.Group controlId="updateUsername"><BootstrapForm.Label>Username</BootstrapForm.Label><BootstrapForm.Control type="text" value={updateUsername} onChange={(e) => setUpdateUsername(e.target.value)} required /></BootstrapForm.Group></Col></Row>
                        <Row><Col><BootstrapForm.Group controlId="updatePassword"><BootstrapForm.Label>Password</BootstrapForm.Label><BootstrapForm.Control type="password" value={updatePassword} onChange={(e) => setUpdatePassword(e.target.value)} /></BootstrapForm.Group></Col></Row>
                        <Button variant="primary" type="submit" style={{ marginTop: '20px', backgroundColor: 'rgb(20, 40, 150)', padding: '10px', width: '100%' }}>Update</Button>
                    </BootstrapForm>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Dashboard;
