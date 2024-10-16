import React, { useState, useEffect } from 'react';
import { logout } from '../auth';
import { db, storage } from '../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Diary({ user }) {
  const [entries, setEntries] = useState({});
  const [newEntry, setNewEntry] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageChange = (e, isEditing = false) => {
    if (e.target.files[0]) {
      isEditing ? setEditImage(e.target.files[0]) : setNewImage(e.target.files[0]);
    }
  };
    
  const uploadImage = async (image) => {
    if (!image) return null;
    const storageRef = ref(storage, `images/${user.uid}/${Date.now()}_${image.name}`);
    await uploadBytes(storageRef, image);
    return await getDownloadURL(storageRef);
  };
    
  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (newEntry.trim() === '' && !newImage) return;

    try {
      const imageUrl = await uploadImage(newImage);
      await addDoc(collection(db, 'entries'), {
        content: newEntry,
        imageUrl: imageUrl,
        userId: user.uid,
        timestamp: Timestamp.now()
      });
      setNewEntry('');
      setNewImage(null);
      setError(null);
    } catch (err) {
      console.error("Error adding document: ", err);
      setError(err.message);
    }
  };
    
  const handleUpdateEntry = async (id, content, currentImageUrl) => {
    try {
      let imageUrl = currentImageUrl;
      if (editImage) {
        if (currentImageUrl) {
          // Delete the old image
          const oldImageRef = ref(storage, currentImageUrl);
          await deleteObject(oldImageRef);
        }
        imageUrl = await uploadImage(editImage);
      }
      await updateDoc(doc(db, 'entries', id), { 
        content,
        imageUrl,
        timestamp: Timestamp.now()
      });
      setEditingId(null);
      setEditImage(null);
    } catch (err) {
      console.error("Error updating document: ", err);
      setError(err.message);
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
          const entry = {
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate()
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Welcome to your diary, {user.email}!</h2>
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <form onSubmit={handleAddEntry} className="mb-8">
            <ReactQuill 
              value={newEntry}
              onChange={setNewEntry}
              placeholder="Write a new entry..."
              className="bg-white mb-4"
            />
            <div className="flex items-center space-x-4">
              <input
                type="file"
                onChange={(e) => handleImageChange(e)}
                accept="image/*"
                className="border p-2 rounded"
              />
              <button 
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Entry
              </button>
            </div>
          </form>

          <div className="space-y-6">
            {Object.entries(entries).map(([date, dayEntries]) => (
              <div key={date} className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">{date}</h3>
                {dayEntries.map(entry => (
                  <div key={entry.id} className="mb-4 pb-4 border-b last:border-b-0">
                    {editingId === entry.id ? (
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateEntry(entry.id, editContent, entry.imageUrl);
                      }}>
                        <ReactQuill 
                          value={editContent}
                          onChange={setEditContent}
                          className="bg-white mb-4"
                        />
                        <input
                          type="file"
                          onChange={(e) => handleImageChange(e, true)}
                          accept="image/*"
                          className="border p-2 rounded mb-4"
                        />
                        {(entry.imageUrl || editImage) && (
                          <img 
                            src={editImage ? URL.createObjectURL(editImage) : entry.imageUrl} 
                            alt="Entry" 
                            className="max-w-full h-auto mb-4"
                          />
                        )}
                        <div className="flex space-x-2">
                          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Save</button>
                          <button onClick={() => {
                            setEditingId(null);
                            setEditImage(null);
                          }} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="prose max-w-none mb-2" dangerouslySetInnerHTML={{ __html: entry.content }} />
                        {entry.imageUrl && (
                          <img src={entry.imageUrl} alt="Entry" className="max-w-full h-auto mb-2" />
                        )}
                        <div className="text-sm text-gray-500 mb-2">{entry.timestamp.toLocaleTimeString()}</div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              setEditingId(entry.id);
                              setEditContent(entry.content);
                            }}
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteEntry(entry.id, entry.imageUrl)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                          >
                            Delete
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
