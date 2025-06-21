import React, { useState } from 'react'
import axiosInstance from '../../utils/axiosInstance';
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md'

const AppEditNotes = ({ noteData, type, getAllNotes, onClose, showToastMessage }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Add Note
  const addNewNote = async () => {
    setIsSaving(true);
    try {
      const response = await axiosInstance.post('/add-note', {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully")
        getAllNotes()
        onClose()
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Edit Note
  const editNote = async () => {
    setIsSaving(true);
    const noteId = noteData._id;
    
    try {
      const response = await axiosInstance.put(`/edit-note/${noteId}`, {
        title,
        content,
        tags,
      });
      
      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully")
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }  

    if (!content) {
      setError("Please enter the content");
      return;
    }

    setError("");
 
    if (type === 'edit') {
      editNote();
    } else {
      addNewNote();
    }
  };
  
  return (
    <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
      <button 
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
        onClick={onClose}
      >
        <MdClose className="text-xl text-gray-500" />
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {type === 'edit' ? 'Edit Note' : 'Create New Note'}
      </h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Go to Gym"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[200px]"
            placeholder="Write your note content here..."
            rows={8}
            value={content}
            onChange={({ target }) => setContent(target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <TagInput tags={tags} setTags={setTags} />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center ${isSaving ? 'opacity-80' : ''}`}
          onClick={handleAddNote}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {type === 'edit' ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            type === 'edit' ? 'Update Note' : 'Create Note'
          )}
        </button>
      </div>
    </div>
  );
};

export default AppEditNotes;