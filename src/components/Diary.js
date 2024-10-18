import React, { useState, useEffect } from 'react';
import { logout } from '../auth';
import { db, storage } from '../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../quill-dark.css';
import { useTheme } from '../contexts/ThemeContext';
import { FaMoon, FaSun, FaEdit, FaTrash } from 'react-icons/fa';
import NewEntryForm from './NewEntryForm';

function Diary({ user }) {
  const [entries, setEntries] = useState({});
  const [newEntry, setNewEntry] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { darkMode, toggleDarkMode } = useTheme();
  const [isUploading, setIsUploading] = useState(false);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const handleImageChange = (e, isEditing = false) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      if (isEditing) {
        setEditImage(file);
        setEditImagePreview(URL.createObjectURL(file));
      } else {
        setNewImage(file);
        setNewImagePreview(URL.createObjectURL(file));
      }
      setIsImageLoading(true);
    }
  };

  const uploadImage = async (image) => {
    if (!image) return null;
    const storageRef = ref(storage, `images/${user.uid}/${Date.now()}_${image.name}`);
    await uploadBytes(storageRef, image);
    return await getDownloadURL(storageRef);
  };

  const handleAddEntry = async ({ content, image, date }) => {
    try {
      let imageUrl = null;
      if (image) {
        const storageRef = ref(storage, `images/${user.uid}/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }
      const newEntryData = {
        content,
        userId: user.uid,
        timestamp: Timestamp.fromDate(new Date(date)),
        imageUrl
      };
      await addDoc(collection(db, 'entries'), newEntryData);
      setError(null);
    } catch (err) {
      console.error("Error adding document: ", err);
      setError(err.message);
    }
  };

  const handleUpdateEntry = async (id, content, currentImageUrl) => {
    try {
      setIsUploading(true);
      let imageUrl = currentImageUrl;
      
      if (removeExistingImage) {
        if (currentImageUrl) {
          const oldImageRef = ref(storage, currentImageUrl);
          await deleteObject(oldImageRef);
        }
        imageUrl = null;
      } else if (editImage) {
        if (currentImageUrl) {
          const oldImageRef = ref(storage, currentImageUrl);
          await deleteObject(oldImageRef);
        }
        imageUrl = await uploadImage(editImage);
      }
      
      const updateData = { 
        content,
        timestamp: Timestamp.now()
      };
      if (imageUrl !== undefined) {
        updateData.imageUrl = imageUrl;
      }
      await updateDoc(doc(db, 'entries', id), updateData);
      setEditingId(null);
      setEditImage(null);
      setEditImagePreview(null);
      setRemoveExistingImage(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };
    
  const handleDeleteEntry = async (id, imageUrl) => {
    try {
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }
      await deleteDoc(doc(db, 'entries', id));
    } catch (err) {
      console.error("Error deleting document: ", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, 'entries'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const newEntries = {};
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const entry = {
            id: doc.id,
            ...data,
            timestamp: data.timestamp && typeof data.timestamp.toDate === 'function' 
              ? data.timestamp.toDate() 
              : new Date(data.timestamp)
          };
          const dateKey = entry.timestamp.toDateString();
          if (!newEntries[dateKey]) {
            newEntries[dateKey] = [];
          }
          newEntries[dateKey].push(entry);
        });
        setEntries(newEntries);
        setError(null);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching entries:", err);
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user.uid]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
      setError(error.message);
    }
  };

  const formatDate = (timestamp) => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleString();
    } else if (timestamp instanceof Date) {
      return timestamp.toLocaleString();
    } else {
      return new Date(timestamp).toLocaleString();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold">Welcome, {user.name || 'User'}</h2>
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300">
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
          </button>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Logout
          </button>
        </div>
      </div>
  
      {error && <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-100 p-4 mb-4" role="alert">
        <p>{error}</p>
      </div>}
      
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <NewEntryForm onAddEntry={handleAddEntry} darkMode={darkMode} />
  
          <div className="space-y-6">
            {Object.entries(entries)
              .sort(([a], [b]) => {
                const dateA = new Date(a);
                const dateB = new Date(b);
                return dateB - dateA;
              })
              .map(([date, dayEntries]) => (
                <div key={date} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 transition duration-300 ease-in-out">
                  <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">{new Date(date).toLocaleDateString()}</h3>
                  {dayEntries.map(entry => (
                    <div key={entry.id} className="mb-4 pb-4 border-b dark:border-gray-700 last:border-b-0">
                      {editingId === entry.id ? (
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          handleUpdateEntry(entry.id, editContent, entry.imageUrl);
                        }}>
                          <ReactQuill 
                            value={editContent}
                            onChange={setEditContent}
                            className="bg-white dark:bg-gray-700 mb-4 rounded border dark:border-gray-600"
                          />
                          <input
                            type="file"
                            onChange={(e) => handleImageChange(e, true)}
                            accept="image/*"
                            className="mb-4 text-gray-700 dark:text-gray-300"
                          />
                          {(entry.imageUrl || editImage) && (
                            <img 
                              src={editImage ? URL.createObjectURL(editImage) : entry.imageUrl} 
                              alt="Entry" 
                              className="max-w-full h-auto mb-4 rounded"
                            />
                          )}
                          <div className="flex space-x-2">
                            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-3 rounded transition duration-300 ease-in-out">Save</button>
                            <button onClick={() => {
                              setEditingId(null);
                              setEditImage(null);
                            }} className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-1 px-3 rounded transition duration-300 ease-in-out">Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="prose dark:prose-invert max-w-none mb-2" dangerouslySetInnerHTML={{ __html: entry.content }} />
                          {entry.imageUrl && (
                            <img src={entry.imageUrl} alt="Entry" className="max-w-full h-auto mb-2 rounded" />
                          )}
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {formatDate(entry.timestamp)}
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setEditingId(entry.id);
                                setEditContent(entry.content);
                              }}
                              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition duration-300 ease-in-out"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => handleDeleteEntry(entry.id, entry.imageUrl)}
                              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition duration-300 ease-in-out"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Diary;
