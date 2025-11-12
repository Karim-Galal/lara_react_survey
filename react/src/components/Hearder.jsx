import { User } from "lucide-react";
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import UserMenu from "./UserMenu";
// import useStateContext from "../contexts/ContextProvider";

// const user = {
//   name: "Bonnie Green",
//   email: "example@gmail.com",
//   image: "https://flowbite.com/docs/images/people/profile-picture-3.jpg",
// };

const links = [
  { name: "Home", to: "/" },
  { name: "Surveys", to: "/surveys" },
];



const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);




  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-sm">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Surveys
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
          {/* User Avatar Button */}
          {/* <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src={user.image}
              alt="user"
            />
          </button> */}

          {/* Dropdown menu */}
          <UserMenu />
          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100
            focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`${menuOpen ? "block" : "hidden"} items-center justify-between w-full md:flex md:w-auto md:order-1`}
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg
            bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0
            md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {links.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block py-2 px-3  rounded hover:bg-gray-100 md:hover:bg-transparent
                    md:hover:text-blue-700 md:p-0  md:dark:hover:text-white
                    dark:hover:bg-gray-700 dark:hover:text-white
                    ${isActive ? " text-blue-700 dark:text-blue-500" : "text-gray-700 dark:text-gray-400"}`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
