import React, { useEffect } from 'react'
import { LuCheck } from 'react-icons/lu'
import { MdDeleteOutline } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'

const Toast = ({ isShown, message, type, onClose }) => {
  useEffect(() => {
    if (isShown) {
      const timeoutId = setTimeout(() => {
        onClose();
      }, 3000);
      return () => {
        clearTimeout(timeoutId);
      }
    }
  }, [isShown, onClose]);

  return (
    <AnimatePresence>
      {isShown && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed top-6 right-6 z-50"
        >
          <div className={`relative flex items-start p-4 pr-8 rounded-lg shadow-lg overflow-hidden 
            ${type === 'delete' ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'}`}
          >
            {/* Animated progress bar */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: 0 }}
              transition={{ duration: 3, ease: 'linear' }}
              className={`absolute top-0 left-0 h-1 ${type === 'delete' ? 'bg-red-400' : 'bg-green-400'}`}
            />
            
            <div className={`flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full 
              ${type === 'delete' ? 'text-red-500 bg-red-100' : 'text-green-500 bg-green-100'}`}
            >
              {type === 'delete' ? (
                <MdDeleteOutline className="text-lg" />
              ) : (
                <LuCheck className="text-lg" />
              )}
            </div>
            
            <div className="ml-3">
              <p className={`text-sm font-medium ${type === 'delete' ? 'text-red-800' : 'text-green-800'}`}>
                {type === 'delete' ? 'Deleted' : 'Success'}
              </p>
              <p className="text-sm text-gray-600">{message}</p>
            </div>
            
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-500 transition-colors"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast