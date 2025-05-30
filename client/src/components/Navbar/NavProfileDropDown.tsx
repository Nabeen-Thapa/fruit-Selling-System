import React, { useState, useEffect, MouseEvent, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { clearSession } from '../../services/shared.services';

interface NavProfileDropDownProps {
  name: string;
  jwtToken: string;
}

const NavProfileDropDown: React.FC<NavProfileDropDownProps> = ({ name, jwtToken }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 370);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Resize listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 370);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
   const handleClickOutside = (e: MouseEvent | Event) => {
  const target = e.target as Node;
  if (dropdownRef.current && !dropdownRef.current.contains(target)) {
    setIsOpen(false);
  }
};

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async() => {
    try {
    await clearSession();
    navigate("/");
    window.location.reload();
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Something went wrong during logout.");
  }
  };

  const handleDeleteAccount = async (e: MouseEvent<HTMLButtonElement>) => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    if (!jwtToken) {
      alert("User not authenticated");
      navigate("/iKeepMy/signup");
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
      >
        <FaUserCircle size={25} />
        {!isMobile && <span className="text-lg p-0 m-0 ">{name}</span>}
        <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.586l3.71-4.355a.75.75 0 011.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1">
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex justify-between"
              onClick={() => document.getElementById('userDetailModal')?.classList.toggle('hidden')}
            >
              Profile <i className="fas fa-user"></i>
            </button>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex justify-between"
              onClick={() => navigate("/iKeepMy/ChangePassword")}
            >
              Change Password <i className="fas fa-unlock"></i>
            </button>
            <hr className="my-1" />
            <button
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex justify-between"
              onClick={handleLogout}
            >
              Logout <i className="fas fa-right-from-bracket"></i>
            </button>
            <hr className="my-1" />
            <button
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex justify-between"
              onClick={handleDeleteAccount}
            >
              Delete Account <i className="fa-solid fa-user-xmark"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavProfileDropDown;
