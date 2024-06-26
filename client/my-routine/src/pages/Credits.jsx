import React from "react";
import image from "../components/img.jpeg";
import dipanjan from "../components/dipanjan.jpg";
import triasis from "../components/triasis.jpg";
import shirsha from "../components/shirsha.png";
import rishav from "../components/rishav.jpg";
import swapanSir from "../components/swapanSir.jpg";
import { IoIosMail } from "react-icons/io";
import { IoLogoLinkedin } from "react-icons/io";
import { IoLogoGithub } from "react-icons/io";

function Credits() {
  return (
    <div className="developers">
      <h1 className="text-center text-gray-900 bg-white font-bold text-3xl pt-4">
        Credits
      </h1>
      <div className="m-8">
        <h2 className="md:flex text-gray-900 bg-white font-bold text-3xl mx-4 mb-8">
          Developers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mx-4">
          <div className="flex flex-col sm:flex-row items-center text-white text-lg font-semibold mb-8 p-6 max-w-md bg-gray-700 rounded-xl hover:bg-gray-600">
            <img
              src={triasis}
              alt="img"
              className="h-24 w-24 rounded-full mb-4 sm:mb-0 sm:mr-5"
            />
            <div>
              <h3 className="flex">Triasis Ghosh</h3>
              <h3 className="flex items-center">
                <IoIosMail className="mr-2" />
                triasis.ghosh1234@gmail.com
              </h3>
              <div className="flex my-1.5">
                <a href="https://www.linkedin.com/in/triasis-ghosh-322b27201/" className="mr-4" target="_blank" rel="noopener noreferrer">
                  <IoLogoLinkedin />
                </a>
                <a href="https://github.com/triasisghosh" target="_blank" rel="noopener noreferrer">
                  <IoLogoGithub />
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center text-white text-lg font-semibold mb-8 p-6 max-w-md bg-gray-700 rounded-xl hover:bg-gray-600">
            <img
              src={shirsha}
              alt="img"
              className="h-24 w-24 rounded-full mb-4 sm:mb-0 sm:mr-5"
            />
            <div>
              <h3 className="flex">Shirsasish Sarkar</h3>
              <h3 className="flex items-center">
                <IoIosMail className="mr-2" />
                shirsasish@gmail.com
              </h3>
              <div className="flex my-1.5">
                <a href="https://www.linkedin.com/in/shirsasish-sarkar-150a03211/" className="mr-4" target="_blank" rel="noopener noreferrer">
                  <IoLogoLinkedin />
                </a>
                <a href="https://github.com/InsaneAqua234" target="_blank" rel="noopener noreferrer">
                  <IoLogoGithub />
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center text-white text-lg font-semibold mb-8 p-6 max-w-md bg-gray-700 rounded-xl hover:bg-gray-600">
            <img
              src={dipanjan}
              alt="img"
              className="h-24 w-24 rounded-full mb-4 sm:mb-0 sm:mr-5"
            />
            <div>
              <h3 className="flex">Dipanjan Das</h3>
              <h3 className="flex items-center">
                <IoIosMail className="mr-2" />
                dipanjan2910das@gmail.com
              </h3>
              <div className="flex my-1.5">
                <a href="https://www.linkedin.com/in/dipanjan-das-71041b226/" target="_blank" rel="noopener noreferrer" className="mr-4">
                  <IoLogoLinkedin />
                </a>
                <a href="https://github.com/dipanjan860" target="_blank" rel="noopener noreferrer">
                  <IoLogoGithub />
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center text-white text-lg font-semibold mb-8 p-6 max-w-md bg-gray-700 rounded-xl hover:bg-gray-600">
            <img
              src={rishav}
              alt="img"
              className="h-24 w-24 rounded-full mb-4 sm:mb-0 sm:mr-5"
            />
            <div>
              <h3 className="flex">Rishav Mandal</h3>
              <h3 className="flex items-center">
                <IoIosMail className="mr-2" />
                iamrishav@outlook.in
              </h3>
              <div className="flex my-1.5">
                <a href="https://in.linkedin.com/in/rishavxyz" target="_blank" rel="noopener noreferrer" className="mr-4">
                  <IoLogoLinkedin />
                </a>
                <a href="https://github.com/rishavxyz" target="_blank" rel="noopener noreferrer">
                  <IoLogoGithub />
                </a>
              </div>
            </div>
          </div>
        </div>
        <h2 className="md:flex text-gray-900 bg-white font-bold text-3xl mx-4 mb-8">
          Mentor
        </h2>
        <div className="flex flex-col sm:flex-row items-center text-white text-lg font-semibold mb-8 p-6 max-w-md bg-gray-700 rounded-xl hover:bg-gray-600 mx-4">
          <img src={swapanSir} alt="img" className="h-24 w-24 rounded-full mb-4 sm:mb-0 sm:mr-5" />
          <div>
            <h3 className="flex">Mr. Swapan Shakhari</h3>
            <h3 className="flex items-center">
              <IoIosMail className="mr-2" />
              swapanshakhari@gmail.com
            </h3>
            <div className="flex my-1.5">
              <a href="https://in.linkedin.com/in/swapan-shakhari" target="_blank" rel="noopener noreferrer" className="mr-4">
                <IoLogoLinkedin />
              </a>
              <a href="https://github.com/swapanshakhari" target="_blank" rel="noopener noreferrer">
                <IoLogoGithub />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Credits;
