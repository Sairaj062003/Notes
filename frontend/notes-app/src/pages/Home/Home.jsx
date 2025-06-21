
import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Card/NoteCard'
import { MdAdd } from 'react-icons/md'
import AppEditNotes from './AppEditNotes'
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { useEffect } from 'react'
import Toast from '../../components/ToastMessage/Toast'

// Set the app element for react-modal
Modal.setAppElement('#root'); // Or your root element ID

const Home = () => {
  const [openAddEditModal ,setOpenAddEditModal]=useState({
    isShown:false,
    type:'add',
    data:null,
  });
  const [allNotes, setAllNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo,setUserInfo]=useState(null);
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isSearch ,setIsSearch]=useState(false);
  const [isSearching, setIsSearching] = useState(false);
  

  const [showToastMsg,setShowToastMsg]=useState({
    isShown:false,
    message:"",
    type:'add',
   
  });
   
  const handleEdit =(noteDetails)=>{
   setOpenAddEditModal({isShown:true,data:noteDetails,type:'edit'});
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,  
      message,
      type
    });
  };

  const handleCloseToast =()=>{

    setShowToastMsg({
     isShown:false,
     message:"" ,
    });
  };

   //Get User Info  
   const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      } else {
        throw new Error('User data not found in response');
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      } else {
        // Handle other errors
        console.error("Failed to get user info:", error.message);
      }
    }
  };

  //Get all notes 
  const getAllNotes = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/get-all-notes');
      
      if (response.data && Array.isArray(response.data.notes)) {
        setAllNotes(response.data.notes); // Set the notes array directly
      } else {
        setAllNotes([]); // Set to empty array if no notes
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setAllNotes([]); // Set to empty array on error
    }
    finally {
      setIsLoading(false);
    }
  };

  //Delete Note
  const deleteNote = async (data) =>{
    setIsSaving(true);
    const noteId = data._id;
    try {
          // Fix: Added missing forward slash before noteId
          const response = await axiosInstance.delete(`/delete-note/${noteId}`);
          
          if(response.data && !response.data.error) {
            showToastMessage("Note Deleted Successfully" , 'delete')
            getAllNotes();
           
          }
        } catch(error) {
          if(error.response && error.response.data && error.response.data.message) {
            console.error("An unexpected error occure , Please try again !");
          }
        }

  };


  //Search 

  const onSearchNote = async (query) =>{
    setIsSearching(true);
    try {
      // Fix: Added missing forward slash before noteId
      const response = await axiosInstance.get('/search-notes',{
        params :{query}
      });
      
      if(response.data && response.data.notes) {
      setIsSearch(true);
      setAllNotes(response.data.notes);
       
      }
    } catch(error) {
         console.log(error);
    }
    finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = async () => {
    setIsSearch(false);
     getAllNotes(); // Reset to show all notes
  };
   
  //isPinned
  const updateIsPinned = async (noteData) => {
    try {
      const response = await axiosInstance.put(`/update-note-pinned/${noteData._id}`, {
        isPinned: !noteData.isPinned
      });
      
      if(response.data?.note) {
        showToastMessage(
          noteData.isPinned 
            ? "Note Unpinned Successfully" 
            : "Note Pinned Successfully",
          "success"
        );
        getAllNotes();
      }
    } catch(error) {
      console.error("Pin error:", error);
      showToastMessage(
        "Failed to update pin status",
        "error"
      );
    }
  };

useEffect(() =>{
  getAllNotes();
  getUserInfo();
  return ()=>{};
},[]);

return (
  <div className="min-h-screen bg-gray-50">
    <Navbar 
      userInfo={userInfo} 
      onSearchNote={onSearchNote} 
      handleClearSearch={handleClearSearch} 
    />

    <main className="container mx-auto px-4 py-8">
      {/* Header with stats */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
          <p className="text-gray-500">
            {allNotes.length} {allNotes.length === 1 ? 'note' : 'notes'}
          </p>
        </div>
        {isSearch && (
          <button 
            onClick={handleClearSearch}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Notes Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allNotes.length > 0 ? (
            allNotes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item)}
                onPinNote={() => updateIsPinned(item)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="max-w-md mx-auto">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No notes found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new note.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setOpenAddEditModal({ isShown: true, type: 'add', data: null })}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <MdAdd className="-ml-1 mr-2 h-5 w-5" />
                    New Note
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>

    {/* Floating Action Button */}
    <button
      className="fixed bottom-8 right-8 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all transform hover:scale-105"
      onClick={() => setOpenAddEditModal({ isShown: true, type: 'add', data: null })}
    >
      <MdAdd className="text-2xl text-white" />
    </button>

    {/* Edit Note Modal */}
    <Modal
      isOpen={openAddEditModal.isShown}
      onRequestClose={() => setOpenAddEditModal({ isShown: false, type: 'add', data: null })}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        },
        content: {
          border: 'none',
          borderRadius: '0.5rem',
          padding: 0,
          maxWidth: '90%',
          width: '40rem',
          maxHeight: '90vh',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }
      }}
    >
      <AppEditNotes
        type={openAddEditModal.type}
        noteData={openAddEditModal.data}
        onClose={() => setOpenAddEditModal({ isShown: false, type: 'add', data: null })}
        getAllNotes={getAllNotes}
        showToastMessage={showToastMessage}
      />
    </Modal>

    {/* Toast Notification */}
    <Toast
      isShown={showToastMsg.isShown}
      message={showToastMsg.message}
      type={showToastMsg.type}
      onClose={handleCloseToast}
    />
  </div>
)
}

export default Home
