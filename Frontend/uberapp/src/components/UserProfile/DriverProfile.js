import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, Card, Container, Modal } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { BASE_API_URL } from '../../Setupconstants';
import { messageService } from '../Common/Message/MessageService';
import { useParams, useNavigate } from 'react-router-dom';
import './UserProfile.css';
const DriverProfile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    license_number: '',
    profile_image: null,
    introduction_video: null,
    vehicle: {
      id: null,
      make: '',
      model: '',
      year: '',
      license_plate: ''
    }
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const { id } = useParams();
  const token = Cookies.get('access_token');
  const navigate = useNavigate();

  const fetchDriver = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/drivers/${id}/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setProfile(response.data);
      if (response.data.state) fetchCities("USA", response.data.state);
    } catch (error) {
      console.error('Error fetching driver:', error);
      messageService.showMessage('error', 'Error fetching driver details');
    }
  };

  useEffect(() => {
    fetchDriver();
    fetchStates();
  }, [id, token]);

  const fetchStates = () => {
    axios
      .post('https://countriesnow.space/api/v0.1/countries/states', { country: "United States" })
      .then((response) => setStates(response.data.data.states))
      .catch((error) => console.error('Error fetching states:', error));
  };

  const fetchCities = (countryName, stateName) => {
    axios
      .post('https://countriesnow.space/api/v0.1/countries/state/cities', { country: "United States", state: stateName })
      .then((response) => setCities(response.data.data))
      .catch((error) => console.error('Error fetching cities:', error));
  };

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setProfile((prevProfile) => ({ ...prevProfile, state: stateName, city: '' }));
    if (stateName) fetchCities("USA", stateName);
    else setCities([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleVehicleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      vehicle: {
        ...prevProfile.vehicle,
        [name]: value
      }
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'image') {
        setImageFile(file);
        const imageUrl = URL.createObjectURL(file);
        setProfile((prevProfile) => ({ ...prevProfile, profile_image: imageUrl }));
      } else if (type === 'video') {
        setVideoFile(file);
        const videoUrl = URL.createObjectURL(file);
        setProfile((prevProfile) => ({ ...prevProfile, introduction_video: videoUrl }));
      }
    }
  };

  const handleSave = () => {
    const profileToSave = {
      ...profile,
      profile_image: null,
      introduction_video: null
    };
    setEditMode(false);
    axios
      .patch(`${BASE_API_URL}/api/drivers/${id}/`, profileToSave, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      .then(() => messageService.showMessage('success', 'Profile updated successfully!'))
      .catch((error) => {
        console.error('Error saving profile data:', error);
        messageService.showMessage('error', 'Error saving profile data');
      });
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${BASE_API_URL}/api/drivers/${id}/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      messageService.showMessage('success', 'Account deleted successfully!');
      Cookies.remove('access_token');
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      messageService.showMessage('error', 'Error deleting account');
    }
  };

  const handleVideoFileUpload = (type) => {
    const file = type === 'image' ? imageFile : videoFile;
    if (!file) return;

    const formData = new FormData();
    formData.append(type === 'image' ? 'profile_image' : 'introduction_video', file);

    axios
      .patch(`${BASE_API_URL}/api/drivers/${id}/upload-video/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      })
      .then((response) => {
        // setProfile(response.data);
        type === 'image' ? setImageModal(false) : setVideoModal(false);
      })
      .catch((error) => {
        console.error(`Error uploading ${type}:`, error);
        messageService.showMessage('error', `Error uploading ${type}`);
      });
  };

  const handleImageFileUpload = (type) => {
    const file = type === 'image' ? imageFile : videoFile;
    if (!file) return;

    const formData = new FormData();
    formData.append(type === 'image' ? 'profile_image' : 'introduction_video', file);

    axios
      .patch(`${BASE_API_URL}/api/drivers/${id}/upload-image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      })
      .then((response) => {
        setProfile(response.data);
        type === 'image' ? setImageModal(false) : setVideoModal(false);
      })
      .catch((error) => {
        console.error(`Error uploading ${type}:`, error);
        messageService.showMessage('error', `Error uploading ${type}`);
      });
  };

  return (
    <Container className="mt-5">

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4">
          <h2 className="text-center">Driver Profile</h2>
            <div className="text-center">
              <div className="position-relative d-inline-block">
                <img src={profile.profile_image || 'https://via.placeholder.com/150'} alt="Profile" className="rounded-circle" width="150" height="150" />
                <Button variant="light" className="p-1 shadow-sm" onClick={() => setImageModal(true)}>
                  <i className="bi bi-pencil"></i>
                </Button>
              </div>
            </div>
            <Form className="mt-4">
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" name="first_name" value={profile.first_name || ''} onChange={handleInputChange} readOnly={!editMode} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" name="last_name" value={profile.last_name || ''} onChange={handleInputChange} readOnly={!editMode} />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={profile.email || ''} onChange={handleInputChange} readOnly={!editMode} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formPhone">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" name="phone_number" value={profile.phone_number || ''} onChange={handleInputChange} readOnly={!editMode} />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" name="address" value={profile.address || ''} onChange={handleInputChange} readOnly={!editMode} />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="formState">
                    <Form.Label>State</Form.Label>
                    <Form.Select name="state" value={profile.state || ''} onChange={handleStateChange} disabled={!editMode}>
                      <option value="">Select a state</option>
                      {states.map((state) => (
                        <option key={state.name} value={state.name}>{state.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="formCity">
                    <Form.Label>City</Form.Label>
                    <Form.Select name="city" value={profile.city || ''} onChange={handleInputChange} disabled={!editMode}>
                      <option value="">Select a city</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="formZip">
                    <Form.Label>Zip Code</Form.Label>
                    <Form.Control type="text" name="zip_code" value={profile.zip_code || ''} onChange={handleInputChange} readOnly={!editMode} />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formLicenseNumber">
                    <Form.Label>License Number</Form.Label>
                    <Form.Control type="text" name="license_number" value={profile.license_number || ''} onChange={handleInputChange} readOnly={!editMode} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formIntroductionVideo">
                    <Form.Label>Introduction Video</Form.Label>
                    {profile.introduction_video ? (
                      <video src={profile.introduction_video} controls width="100%" />
                    ) : (
                      <p>No video uploaded</p>
                    )}
                    {editMode && (
                      <Button variant="outline-primary" size="sm" onClick={() => setVideoModal(true)}>
                        Upload Video
                      </Button>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <h4>Vehicle Information</h4>
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group controlId="formVehicleMake">
                    <Form.Label>Make</Form.Label>
                    <Form.Control type="text" name="make" value={profile.vehicle?.make || ''} onChange={handleVehicleInputChange} readOnly={!editMode} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="formVehicleModel">
                    <Form.Label>Model</Form.Label>
                    <Form.Control type="text" name="model" value={profile.vehicle?.model || ''} onChange={handleVehicleInputChange} readOnly={!editMode} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="formVehicleYear">
                    <Form.Label>Year</Form.Label>
                    <Form.Control type="number" name="year" value={profile.vehicle?.year || ''} onChange={handleVehicleInputChange} readOnly={!editMode} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="formVehicleLicensePlate">
                    <Form.Label>License Plate</Form.Label>
                    <Form.Control type="text" name="license_plate" value={profile.vehicle?.license_plate || ''} onChange={handleVehicleInputChange} readOnly={!editMode} />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" onClick={() => setEditMode(!editMode)}>
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button>
              {editMode && (
                <Button variant="success" className="ms-2" onClick={handleSave}>
                  Save Changes
                </Button>
              )}
              <Button variant="danger" className="mt-3" onClick={() => setShowDeleteModal(true)}>
                Delete Account
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
      <Modal show={imageModal} onHide={() => setImageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formFile">
            <Form.Label>Select an image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setImageModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => handleImageFileUpload('image')}>Upload</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={videoModal} onHide={() => setVideoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Introduction Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formVideo">
            <Form.Label>Select a video</Form.Label>
            <Form.Control type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setVideoModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => handleVideoFileUpload('video')}>Upload</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your account? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteAccount}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DriverProfile;