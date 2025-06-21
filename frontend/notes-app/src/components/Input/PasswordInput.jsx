// PasswordInput.jsx
import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

const PasswordInput = ({ value, onChange }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [error, setError] = useState('');

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };
  
  const handleBlur = () => {
    if (!value.trim()) {
      setError('Password is required.');
    } else {
      setError('');
    }
  };

  return (
    <div className="relative mb-2">
      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-3">
        Password
      </label>
      <input
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        type={isShowPassword ? 'text' : 'password'}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        placeholder="•••••••••"
        required
      />
      <div className="absolute right-3 top-10 cursor-pointer text-blue-500" onClick={toggleShowPassword}>
        {isShowPassword ? <FaRegEye size={22} /> : <FaRegEyeSlash size={22} />}
      </div>
      {error && <p className="text-red-500 text-xs pt-1">{error}</p>}
    </div>
  );
};

export default PasswordInput;