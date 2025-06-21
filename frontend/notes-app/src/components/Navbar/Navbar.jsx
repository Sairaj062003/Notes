import React, { useState } from 'react'
import Profileinfo from '../Card/Profileinfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const onLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearchNote(searchQuery.trim())
    }
  }

  const onClearSearch = () => {
    setSearchQuery("")
    handleClearSearch()
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Notes
            </h1>
          </div>

          {/* Search Bar - Centered with Clear Button */}
          <div className="flex-1 flex justify-center items-center space-x-2 max-w-2xl mx-4">
            <div className="w-full max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={({ target }) => setSearchQuery(target.value)}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
              />
            </div>
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Profile Section */}
          <div className="flex items-center">
            <Profileinfo userInfo={userInfo} onLogout={onLogout} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar