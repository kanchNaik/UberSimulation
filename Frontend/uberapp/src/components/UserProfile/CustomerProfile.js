import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, Card, Container, Modal } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { BASE_API_URL } from '../../Setupconstants';
import { messageService } from '../Common/Message/MessageService';
import { useParams, useNavigate } from 'react-router-dom';
import './CustomerProfile.css';
const CustomerProfile = () => {
  const [profile, setProfile] = useState({
    username: '',
    first_name: '',
    last_name: '',
    profile_image: null,
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone_number: '',
    email: '',
    credit_card: '',
  });
  const [states, setStates] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const { id } = useParams();
  const token = Cookies.get('access_token');
  const navigate = useNavigate();

  const [imageModal, setImageModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setProfile((prevProfile) => ({ ...prevProfile, profile_image: imageUrl }));
    }
  };

  const handleImageFileUpload = () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append('profile_image', imageFile);

    axios.patch(`${BASE_API_URL}/api/customers/${id}/upload-image/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then((response) => {
      setImageModal(false);
      messageService.showMessage('success', 'Profile image updated successfully!');
    })
    .catch((error) => {
      console.error('Error uploading image:', error);
      messageService.showMessage('error', 'Error uploading profile image');
    });
  };
  useEffect(() => {
    fetchCustomer();
    fetchStates();
  }, [id, token]);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/customers/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile((prevProfile) => ({
        ...prevProfile,
        ...response.data,
        profile_image: response.data.profile_image,
      }));
    } catch (error) {
      console.error('Error fetching customer:', error);
      messageService.showMessage('error', 'Error fetching customer details');
    }
  };

  const fetchStates = async () => {
    try {
      const response = await axios.post(
        'https://countriesnow.space/api/v0.1/countries/states',
        { country: 'United States' }
      );
      setStates(response.data.data.states);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    const { profile_image, ...profileDataToSave } = profile;
    setEditMode(false);
    try {
      await axios.patch(`${BASE_API_URL}/api/customers/${id}/`, profileDataToSave, {
        headers: { Authorization: `Bearer ${token}` },
      });
      messageService.showMessage('success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile data:', error);
      messageService.showMessage('error', 'Error saving profile data');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${BASE_API_URL}/api/customers/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      messageService.showMessage('success', 'Account deleted successfully!');
      Cookies.remove('access_token');
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      messageService.showMessage('error', 'Error deleting account');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <Card className="p-4 shadow" style={{ maxWidth: '800px', width: '100%' }}>
        <h2 className="text-center mb-4">Account Info</h2>
        <div className="text-center mb-4">
          <img src={profile.profile_image || 'https://via.placeholder.com/150'} alt="Profile" className="rounded-circle" width="150" height="150" />
          <Button
      variant="light"
      className="p-1 shadow-sm position-relative bottom-0 end-0"
      onClick={() => setImageModal(true)}
    >
      <i className="bi bi-pencil"></i>
    </Button>
        </div>
        <Form>
          {/* Form fields */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={profile.first_name || ''}
                  onChange={handleInputChange}
                  readOnly={!editMode}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={profile.last_name || ''}
                  onChange={handleInputChange}
                  readOnly={!editMode}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={profile.email || ''}
                  onChange={handleInputChange}
                  readOnly={!editMode}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={profile.address || ''}
                  onChange={handleInputChange}
                  readOnly={!editMode}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formCity">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={profile.city || ''}
                  onChange={handleInputChange}
                  readOnly={!editMode}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formState">
                <Form.Label>State</Form.Label>
                <Form.Control
                  as="select"
                  name="state"
                  value={profile.state || ''}
                  onChange={handleInputChange}
                  readOnly={!editMode}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.name} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formZipCode">
                <Form.Label>Zip Code</Form.Label>
                <Form.Control
                  type="text"
                  name="zip_code"
                  value={profile.zip_code || ''}
                  onChange={handleInputChange}
                  readOnly={!editMode}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="phone_number"
                  value={profile.phone_number || ''}
                  onChange={handleInputChange}
                  readOnly={!editMode}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="formCreditCard">
                <Form.Label>Credit Card</Form.Label>
                <Form.Control
                  type="text"
                  name="credit_card"
                  value={profile.credit_card || ''}
                  onChange={handleInputChange}
                  readOnly={!editMode}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col className="d-flex justify-content-between">
              {!editMode ? (
                <Button variant="primary" onClick={() => setEditMode(true)}>
                  Edit Profile
                </Button>
              ) : (
                <Button variant="success" onClick={handleSave}>
                  Save Changes
                </Button>
              )}
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                Delete Account
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Delete Account Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your account? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={imageModal} onHide={() => setImageModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Upload Profile Picture</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form.Group controlId="formFile">
      <Form.Label>Select an image</Form.Label>
      <Form.Control
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </Form.Group>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setImageModal(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleImageFileUpload}>Upload</Button>
  </Modal.Footer>
</Modal>
    </Container>
  );
};

export default CustomerProfile;