import React from 'react'
import { getInitials } from '../../utils/helper'

const Profileinfo = ({ userInfo, onLogout }) => {
  return (
    <div className="group relative flex items-center gap-3">
      {/* Avatar with hover effect */}
      <div className="w-10 h-10 flex justify-center items-center rounded-full bg-gradient-to-r from-blue-500 to-blue-400 text-white font-medium shadow-sm">
        {userInfo ? getInitials(userInfo.fullName) : 'GU'}
      </div>

      {/* Profile dropdown */}
      <div className="hidden group-hover:flex flex-col absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-10">
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-800">{userInfo?.fullName || 'Guest'}</p>
          <p className="text-xs text-gray-500 truncate">{userInfo?.email || 'guest@example.com'}</p>
        </div>
        {userInfo && (
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Sign out
          </button>
        )}
      </div>

      {/* Always visible name (mobile/fallback) */}
      <div className="md:hidden">
        <p className="text-sm font-semibold text-gray-800">{userInfo?.fullName || 'Guest'}</p>
        {userInfo && (
          <button 
            onClick={onLogout}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  )
}

export default Profileinfo