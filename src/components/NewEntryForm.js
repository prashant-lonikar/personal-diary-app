import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaPaperclip, FaCalendarAlt, FaTimes } from 'react-icons/fa';

function NewEntryForm({ onAddEntry, darkMode }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [entryDate, setEntryDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEntry({ content, image, date: entryDate });
    setContent('');
    setImage(null);
    setImagePreview(null);
    setEntryDate(new Date());
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-4 flex items-center">
        <DatePicker
          selected={entryDate}
          onChange={date => setEntryDate(date)}
          className="p-2 border rounded mr-2 dark:bg-gray-700 dark:text-white"
        />
        <FaCalendarAlt className="text-gray-500 dark:text-gray-400" />
      </div>
      <ReactQuill 
        value={content}
        onChange={setContent}
        placeholder="Write a new entry..."
        className="bg-white dark:bg-gray-700 mb-4 rounded border dark:border-gray-600"
      />
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center space-x-2 cursor-pointer text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition duration-300">
          <FaPaperclip />
          <span>Attach Image</span>
          <input 
            type='file'
            className="hidden"
            onChange={handleImageChange}
            accept="image/*"
          />
        </label>
        {image && <span className="text-sm text-gray-500">Image selected: {image.name}</span>}
      </div>
      {imagePreview && (
        <div className="relative w-1/5 mb-4">
          <img src={imagePreview} alt="Preview" className="w-full h-auto rounded" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
          >
            <FaTimes />
          </button>
        </div>
      )}
      <button 
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-300 ease-in-out"
      >
        Add Entry
      </button>
    </form>
  );
}

export default NewEntryForm;