import React from 'react';
import NavBar from './NavBar';
import { stackServerApp } from '@/app/stack';

const NavBarWrapper = async () => {
  let userEmail: string | null = null;

  try {
    // Fetch the authenticated user's data from stackServerApp
    const userData = await stackServerApp.getUser(); // Assuming getUser() fetches user info
    if (userData && userData.primaryEmail) {
      userEmail = userData.primaryEmail;
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }

//   const handleSignOut = async () => {
//     try {
//     //   await stackServerApp.signOut(); // Sign out the user
//         console.log('test sign out');
//       window.location.href = '/handler/sign-in'; // Redirect to sign-in page
//     } catch (error) {
//       console.error('Failed to sign out:', error);
//     }
//   };

  return <NavBar userEmail={userEmail}/>;
};

export default NavBarWrapper;