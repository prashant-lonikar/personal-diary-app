import React, { useMemo, useState } from 'react';
import { Navbar, Nav, Button, Form, FormControl, Row, Col, Container, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faSearch, faKey } from '@fortawesome/free-solid-svg-icons';
import './NavbarComponent.css'; // We'll create this CSS file for custom styles

function NavbarComponent({ darkMode, toggleDarkMode, searchTerm, setSearchTerm, handleSearch, handleChangePassword }) {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const onChangePassword = () => {
    handleChangePassword(newPassword);
    setNewPassword('');
    setShowChangePassword(false);
  };

  return useMemo(() => (
    <>
      <Navbar bg={darkMode ? 'dark' : 'light'} variant={darkMode ? 'dark' : 'light'} expand="lg" fixed="top">
        <Container fluid>
          <Navbar.Brand>My Personal Diary</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="w-100">
              <Row className="w-100 align-items-center">
                <Col xs={12} lg={7} className="mb-2 mb-lg-0">
                  <Form onSubmit={handleSearch} className="d-flex">
                    <FormControl 
                      type="text" 
                      placeholder="Search" 
                      className={`mr-2 flex-grow-1 ${darkMode ? 'bg-dark text-light' : ''}`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant={darkMode ? "outline-light" : "outline-dark"} type="submit">
                      <FontAwesomeIcon icon={faSearch} />
                    </Button>
                  </Form>
                </Col>
                <Col xs={12} lg={5} className="mt-2 mt-lg-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <Button variant="link" onClick={() => setShowChangePassword(true)} className="p-0">
                      <FontAwesomeIcon icon={faKey} /> Change Password
                    </Button>
                    <div className="d-flex align-items-center">
                      <span className="mode-switch-text mr-2">Switch mode</span>
                      <Button variant={darkMode ? 'light' : 'dark'} onClick={toggleDarkMode} className="p-1">
                        <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showChangePassword} onHide={() => setShowChangePassword(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowChangePassword(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onChangePassword}>
            Change Password
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  ), [darkMode, searchTerm, toggleDarkMode, handleSearch, setSearchTerm, showChangePassword, newPassword]);
}

export default NavbarComponent;