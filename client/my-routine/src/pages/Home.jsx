import React from "react";
import bg from "../components/bg.jpg";
import { Link } from 'react-router-dom';
import { FaCircleExclamation } from "react-icons/fa6";


function Home() {
  return (
    <div className="home">
      <header
        className="py-24 text-center text-gray-900 bg-cover bg-center h-1/2-screen"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <h1 className="font-extrabold text-4xl sm:text-5xl md:text-7xl">
          Welcome To Our
        </h1>
        <h2 className="text-gray-700 font-bold text-2xl sm:text-3xl md:text-5xl mt-3">
          Automated Academic Routine Creation System
        </h2>
      </header>
      <body className="bg-gray-700 text-white">
        <div className="flex flex-col md:flex-row justify-evenly items-center py-24 px-4 md:px-0">
          <div className="text-lg sm:text-xl md:text-2xl font-medium mx-4 text-center">
            <h2 className="mb-2">
              This is an ONLINE SERVICE to create dynamic academic routines.
            </h2>
            <p>
              We will take few basic details and the Routines will be generated.
            </p>
            <button className=" mt-7 px-8 py-2 rounded-lg bg-white text-gray-900 hover:bg-slate-200">
              <Link to="/slotform">Generate Routine</Link>
            </button>
          </div>
        </div>
        <div className="pb-24">
          <h1 className="text-center text-white font-bold text-3xl sm:text-4xl py-10">
            Instructions
          </h1>
          <div className="flex justify-center text-base sm:text-lg md:text-xl px-4 md:px-0">
            <ul className="text-left">
              <li className="flex items-center mb-4">
                <FaCircleExclamation className="mr-4" /> We will take FOUR Excel
                files as inputs.
              </li>
              <li className="flex items-center mb-4">
                <FaCircleExclamation className="mr-4" /> The Excel files will
                have details of Faculty, Subjects, etc.
              </li>
              <li className="flex items-center mb-4">
                <FaCircleExclamation className="mr-4" /> The Days and Slots are
                customizable.
              </li>
              <li className="flex items-center">
                <FaCircleExclamation className="mr-4" /> For more detailed
                instructions
                <Link
                  to="/instructions"
                  className="text-gray-300 font-semibold underline ml-2 hover:text-white"
                >
                  click here
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pb-24 text-center text-lg sm:text-xl md:text-2xl font-semibold px-4 md:px-0">
          <h1>If you have read the instructions!</h1>
          <p>Click the below button to generate routines</p>
          <button className="mt-7 px-8 py-2 rounded-lg bg-white text-base sm:text-lg md:text-2xl font-bold text-gray-900 hover:bg-slate-200">
            <Link to="/slotform">Generate Routine</Link>
          </button>
        </div>
      </body>
    </div>
  );
}


export default Home;





