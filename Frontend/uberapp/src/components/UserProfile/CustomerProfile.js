import React, { useState, useEffect} from 'react';
import axios from 'axios'; // Using axios for API calls
import { Form, Button, Row, Col, Card, Container, Modal } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { BASE_API_URL } from '../../Setupconstants';
import { messageService } from '../Common/Message/MessageService';
import { useParams, useNavigate } from 'react-router-dom';

// Profile Page Component
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
  const [cities, setCities] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const token = Cookies.get('access_token');
  const navigate = useNavigate();

  console.log('Customer ID:', id);
  console.log('Token:', token);
  // Fetch customer details on mount
  const fetchCustomer = async () => {
    try {
        const response = await axios.get(`${BASE_API_URL}/api/customers/${id}/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        setProfile((prevProfile) => ({
          ...prevProfile,
          ...response.data,
          profile_image: response.data.profile_image,
        }));
        if (response.data.country) fetchStates("USA");
        if (response.data.state) fetchCities("USA", response.data.state);
    } catch (error) {
        console.error('Error fetching customer:', error);
        messageService.showMessage('error', 'Error fetching customer details');
    }
};

  useEffect(() => {
      fetchCustomer();
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
    setProfile((prevProfile) => ({
      ...prevProfile,
      state: stateName,
      city: '',
    }));
    if (stateName && profile.country) fetchCities(profile.country, stateName);
    else setCities([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setProfile((prevProfile) => ({ ...prevProfile, profile_image: imageUrl }));
    }
  };

  const handleSave = () => {
    const { profile_image, ...profileDataToSave } = profile;
    setEditMode(false);
    axios
      .patch(`${BASE_API_URL}/api/customers/${id}/`, profileDataToSave, {
        headers: { 
          'Authorization': `Bearer ${token}`,
         }
      })
      .then((response) => messageService.showMessage('success', 'Profile updated successfully!'))
      .catch((error) => {
        console.error('Error saving profile data:', error)
        messageService.showMessage('error', 'Error saving profile data')
      });
  };

  const handleImageUpload = () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append('nickname', profile.nickname);
    formData.append('profile_image', imageFile);

    axios
      .put(`${BASE_API_URL}/api/customers/profile-picture/`, formData, {
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setProfile(response.data);
        setImageModal(false);
      })
      .catch((error) => 
        {
          console.error('Error uploading image:', error)
          messageService.showMessage('error', 'Error uploading image')
        });
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Account Info</h2>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4">
            <div className="text-center">
              <div className="position-relative d-inline-block">
                <img
                  src={profile.profile_image || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="rounded-circle"
                  width="150"
                  height="150"
                />
                <Button variant="light" className="p-1 shadow-sm" onClick={() => setImageModal(true)}>
                  <i className="bi bi-pencil"></i>
                </Button>
              </div>
            </div>

            <Form className="mt-4">
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formFirstName">
                    <Form.Label>Name</Form.Label>
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
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={profile.last_name || ''}
                      onChange={handleInputChange}
                      readOnly={!editMode}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formPhone">
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
                <Col md={6}>
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
                  <Form.Group controlId="formState">
                    <Form.Label>State</Form.Label>
                    <Form.Select
                      name="state"
                      value={profile.state || ''}
                      onChange={handleStateChange}
                      disabled={!editMode}
                    >
                      <option value="">Select a state</option>
                      {states.map((state) => (
                        <option key={state.name} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formCity">
                    <Form.Label>City</Form.Label>
                    <Form.Select
                      name="city"
                      value={profile.city || ''}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    >
                      <option value="">Select a city</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
              <Col md={6}>
                  <Form.Group controlId="formZip">
                    <Form.Label>Zip Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="Zip Code"
                      value={profile.zip_code || ''}
                      onChange={handleInputChange}
                      readOnly={!editMode}
                    />
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
            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setImageModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleImageUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CustomerProfile;
