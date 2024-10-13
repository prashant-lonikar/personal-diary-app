import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faImage } from '@fortawesome/free-solid-svg-icons';

function NewEntryForm({ onAddEntry, darkMode }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEntry({ content, image });
    setContent('');
    setImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className={`mb-4 ${darkMode ? 'bg-dark text-light' : ''}`}>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className={darkMode ? 'bg-secondary text-light' : ''}
            />
          </Form.Group>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Form.Group>
              <Form.Label htmlFor="image-upload" className="mb-0">
                <Button variant="outline-secondary" as="span">
                  <FontAwesomeIcon icon={faImage} /> Add Image
                </Button>
              </Form.Label>
              <Form.Control
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              <FontAwesomeIcon icon={faPlus} /> Add Entry
            </Button>
          </div>
          {image && (
            <div className="mt-3">
              <img src={image} alt="Preview" className="img-fluid mb-2" />
              <Button variant="outline-danger" size="sm" onClick={() => setImage(null)}>
                Remove Image
              </Button>
            </div>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
}

export default NewEntryForm;