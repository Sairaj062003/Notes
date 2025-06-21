import React from 'react'
import moment from 'moment'
import { MdOutlinePushPin } from 'react-icons/md'
import { MdCreate, MdDelete } from 'react-icons/md'

const NoteCard = ({ title, date, content, tags, isPinned, onEdit, onDelete, onPinNote }) => {
  return (
    <div className={`relative rounded-xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-1 ${
      isPinned ? 'ring-2 ring-blue-500' : ''
    }`}>
      {/* Pinned indicator */}
      {isPinned && (
        <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          Pinned
        </div>
      )}
      
      <div className="flex flex-col h-full">
        {/* Header with pin button */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{title}</h3>
            <span className="text-xs text-gray-400">
              {moment(date).format('MMM D, YYYY')}
            </span>
          </div>
          <button 
            onClick={onPinNote}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
              isPinned ? 'text-blue-500' : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <MdOutlinePushPin className="text-xl" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-grow">
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {content}
          </p>
        </div>
        
        {/* Tags */}
        {tags?.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex justify-between items-center border-t border-gray-100 pt-3">
          <div className="text-xs text-gray-400">
            {moment(date).fromNow()}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              aria-label="Edit note"
            >
              <MdCreate className="text-lg" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              aria-label="Delete note"
            >
              <MdDelete className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteCard