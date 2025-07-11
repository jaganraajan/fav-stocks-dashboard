'use client';

import React from 'react';
import Link from 'next/link';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { useUser } from "@stackframe/stack";

interface NavBarProps {
    userEmail: string | null;
}

const NavBar: React.FC<NavBarProps> = ({ userEmail }) => {
    const user = useUser(); // Call the hook directly in the component body
  
    const handleSignOut = () => {

    if (user) {
        user.signOut();
    }
};

  return (
    <nav className="container mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <ul className="flex space-x-6 items-center">
          <li>
            <a
              href="https://www.linkedin.com/in/jagan-raajan/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin size={24} />
            </a>
          </li>
          <li>
            <a
              href="https://github.com/jaganraajan/fav-stocks-dashboard"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub size={24} />
            </a>
          </li>
        </ul>
      </div>
      <div className="flex items-center space-x-4">
        {userEmail ? (
          <>
            <span className="text-gray-700 dark:text-gray-300">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/handler/sign-in">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Login
              </button>
            </Link>
            <Link href="/handler/sign-up">
              <button className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors">
                Register
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;