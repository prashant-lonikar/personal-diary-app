import React, { useState } from 'react';

function NewEntryForm({ onAddEntry }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onloadend = () => {
      onAddEntry({ 
        content, 
        image: reader.result, 
        date: new Date().toLocaleDateString() 
      });
      setContent('');
      setImage(null);
    };
    if (image) {
      reader.readAsDataURL(image);
    } else {
      onAddEntry({ 
        content, 
        image: null, 
        date: new Date().toLocaleDateString() 
      });
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea 
        value={content} 
        onChange={(e) => setContent(e.target.value)}
        placeholder="What happened today?"
      />
      <input 
        type="file" 
        accept="image/*" 
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button type="submit">Add Entry</button>
    </form>
  );
}

export default NewEntryForm;