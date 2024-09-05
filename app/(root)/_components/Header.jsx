"use client"
import { UserButton,SignInButton,useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

const Header = () => {
  const path = usePathname();
  const { isSignedIn } = useUser();

  useEffect(() => {
    console.log(path);
  }, [path]);
  
  useEffect(() => {
    const hasRefreshedAfterSignOut = localStorage.getItem('hasRefreshedAfterSignOut');

    if (!isSignedIn && !hasRefreshedAfterSignOut) {
      localStorage.setItem('hasRefreshedAfterSignOut', 'true');
      window.location.reload();
    } else if (isSignedIn) {
      localStorage.removeItem('hasRefreshedAfterSignOut');
    }
  }, [isSignedIn]);

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
      <Image src={'/logo.svg'} width={60} height={100} alt='logo' />
      <ul className=' hidden md:flex gap-6'>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === '/' && 'text-primary font-bold'
          }`}
        >
          Dashboard
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === '/questions' && 'text-primary font-bold'
          }`}
        >
          Questions
        </li>        
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === '/upgrade' && 'text-primary font-bold'
          }`}
        >
          Upgrade
        </li>        
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === '/how' && 'text-primary font-bold'
          }`}
        >
          How it works?
        </li>      
        </ul>
        {isSignedIn ? (
        <UserButton />
      ) : (
        <SignInButton mode="modal">
          <button className='px-4 py-2 text-white bg-primary rounded-md'>
            Sign In / Sign Up
          </button>
        </SignInButton>
      )}
    </div>
  );
};

export default Header;
