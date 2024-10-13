import React, { useState } from 'react';
import { Card, Button, Form, Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

function DiaryEntry({ date, entries, onEdit, onDelete, darkMode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntries, setEditedEntries] = useState(entries);

  const handleEdit = () => {
    onEdit(editedEntries);
    setIsEditing(false);
  };

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...editedEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setEditedEntries(newEntries);
  };

  return (
    <Card className={`mb-4 ${darkMode ? 'bg-dark text-light' : ''}`}>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{date}</h5>
        <div>
          <Button variant="outline-primary" size="sm" onClick={() => setIsEditing(!isEditing)} className="mr-2">
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button variant="outline-danger" size="sm" onClick={onDelete}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Collapse in={!isEditing}>
          <div>
            {entries.map((entry, index) => (
              <div key={entry.id} className="mb-3">
                <small className="text-muted">{entry.time}</small>
                <p>{entry.content}</p>
                {entry.image && <img src={entry.image} alt="Diary entry" className="img-fluid mb-2" />}
              </div>
            ))}
          </div>
        </Collapse>
        <Collapse in={isEditing}>
          <div>
            {editedEntries.map((entry, index) => (
              <Form key={entry.id} className="mb-3">
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={entry.content}
                    onChange={(e) => handleEntryChange(index, 'content', e.target.value)}
                  />
                </Form.Group>
                {entry.image && (
                  <div className="mb-2">
                    <img src={entry.image} alt="Diary entry" className="img-fluid mb-2" />
                    <Button variant="outline-danger" size="sm" onClick={() => handleEntryChange(index, 'image', null)}>
                      Remove Image
                    </Button>
                  </div>
                )}
              </Form>
            ))}
            <Button variant="primary" onClick={handleEdit} className="mr-2">
              <FontAwesomeIcon icon={faSave} /> Save
            </Button>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </Button>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
}

export default DiaryEntry;