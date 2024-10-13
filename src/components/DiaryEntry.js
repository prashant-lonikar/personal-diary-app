import React, { useState } from 'react';

function DiaryEntry({ date, entries, onEdit, onDelete }) {
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

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleEntryChange(index, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    handleEntryChange(index, 'image', null);
  };

  return (
    <div className="diary-entry">
      <div className="entry-header">
        <h2>{date}</h2>
        <div className="entry-actions">
          <button className="icon-button" onClick={() => setIsEditing(!isEditing)}>
            ✏️
          </button>
          <button className="icon-button" onClick={onDelete}>
            🗑️
          </button>
        </div>
      </div>
      {isEditing ? (
        <div className="edit-form">
          {editedEntries.map((entry, index) => (
            <div key={entry.id} className="edit-entry-item">
              <small>{entry.time}</small>
              <textarea
                value={entry.content}
                onChange={(e) => handleEntryChange(index, 'content', e.target.value)}
              />
              {entry.image && (
                <div>
                  <img src={entry.image} alt="Diary entry" />
                  <button onClick={() => removeImage(index)}>Remove Image</button>
                </div>
              )}
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(index, e)} />
            </div>
          ))}
          <div>
            <button onClick={handleEdit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          {entries.map((entry) => (
            <div key={entry.id} className="entry-item">
              <small>{entry.time}</small>
              <p>{entry.content}</p>
              {entry.image && <img src={entry.image} alt="Diary entry" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DiaryEntry;