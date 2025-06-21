import React from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="relative w-full max-w-md ">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaMagnifyingGlass className="h-5 w-5 text-gray-400" />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg bg-white text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        placeholder="Search notes..."
      />
      
      {value && (
        <button
          onClick={onClearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IoMdClose className="h-5 w-5" />
        </button>
      )}
      
      <button
        onClick={handleSearch}
        className="absolute inset-y-0 right-0 px-4 flex items-center bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
      >
        <span className="sr-only">Search</span>
        <FaMagnifyingGlass className="h-4 w-4" />
      </button>
    </div>
  )
}

export default SearchBar