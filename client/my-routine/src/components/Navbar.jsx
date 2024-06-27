import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='md:flex md:justify-between md:items-center bg-gray-800 text-white px-8 py-4 z-10 sticky top-0'>
      <div className='flex justify-between items-center'>
        <h1 className='font-bold text-xl'>
          <Link to="/">Routine Creation System</Link>
        </h1>
        <div className='md:hidden' onClick={toggleMenu}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>
      </div>
      <ul className={`md:flex md:text-lg ${isOpen ? 'block' : 'hidden'} md:block`}>
        <li className='mt-2 md:mt-0 md:mr-8'>
          <Link to="/" className="hover:underline block">Home</Link>
        </li>
        <li className='mt-2 md:mt-0 md:mr-8'>
          <Link to="/instructions" className="hover:underline block">Instructions</Link>
        </li>
        <li className='mt-2 md:mt-0 md:mr-8'>
          <Link to="/resource_pref" className="hover:underline block">Update Preference</Link>
        </li>
        <li className='mt-2 md:mt-0 md:mr-8'>
          <Link to="/routines" className="hover:underline block">Routines</Link>
        </li>
        <li className='mt-2 md:mt-0 md:mr-8'>
          <Link to="/display" className="hover:underline block">Display</Link>
        </li>
        <li className='mt-2 md:mt-0'>
          <Link to="/credits" className="hover:underline block">Developers</Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
