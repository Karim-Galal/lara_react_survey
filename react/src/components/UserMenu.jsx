import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { FaUserCircle } from "react-icons/fa";
import axiosClient from '../axois';


const userLinks = [
  { name: "Dashboard", to: "/dashboard" },
  { name: "Settings", to: "/settings" },
  { name: "Create Survey", to: "/surveys/create" },
  // { name: "Sign out", to: "/logout" },
];

const guestLinks = [
  { name: "Login", to: "/login" },
  { name: "Sign Up", to: "/signup" },
];



const UserMenu = () => {
  const { currentUser , userToken , setCurrentUser, setUserToken} = useStateContext();
  const [open, setOpen] = useState(false);

  // const isLoggedIn = currentUser && Object.keys(currentUser).length > 0;
  const isLoggedIn = userToken !== null;

  const logout = async () => {
    try {
      await axiosClient.post('/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('userToken');
      localStorage.removeItem('currentUser');
      setUserToken(null);
      setCurrentUser(null);
      window.location.href = '/login';
    }
  };


  return (
    <div className="relative">
      {/* btn for opping  */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center text-sm bg-gray-800 rounded-full
                  w-9 h-9 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open user menu</span>
        {isLoggedIn && currentUser.image ? (
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={currentUser.image}
            alt={currentUser.name || "User"}
          />
        ) : (
          <FaUserCircle className="w-7 h-7 text-gray-300 dark:text-gray-400" />
        )}
      </button>

      {/* dropdown menu */}
      {open && (
        <div className="absolute right-0 top-10 z-50 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600">
          <div className="px-4 py-3">
            <span className="block text-sm text-gray-900 dark:text-white">
              {isLoggedIn ? currentUser.name : "Guest User"}
            </span>
            <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
              {isLoggedIn ? currentUser.email : "guest@example.com"}
            </span>
          </div>

          <ul className="py-2">
            {(isLoggedIn ? userLinks : guestLinks).map((link, index) => (
              <li key={index}>
                <Link

                  to={link.to}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100
                    dark:hover:bg-gray-600 dark:text-gray-200"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {isLoggedIn && (
              <li>
                <button
                  onClick={logout}
                  className="block w-full text-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100
                    dark:hover:bg-gray-600 dark:text-gray-200"
                >
                  Sign out
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;



