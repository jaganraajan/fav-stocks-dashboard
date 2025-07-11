import React, { Suspense } from 'react';
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

    return (
        <Suspense fallback={<p>Loading...</p>}>
        <NavBar userEmail={userEmail} />
        </Suspense>
    );
};

export default NavBarWrapper;