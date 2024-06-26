import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Routine = () => {
  const [routineData, setRoutineData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("routineData");
    if (storedData) {
      setRoutineData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    if (routineData) {
      localStorage.setItem("teacherData", JSON.stringify(routineData["Teacher Data"]));
    }
  }, [routineData]);

  const handleClick = (routineKey) => {
    localStorage.setItem("selectedRoutine", JSON.stringify(routineData[routineKey]));
    navigate("/display");
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-44 bg-gray-700">
      <div className="py-6 px-7 w-full rounded-2xl bg-white md:w-2/5">
        <p className="flex text-2xl text-gray-900 font-bold pb-2 mb-4 border-b-2 border-gray-500">
          Generated Routines
        </p>

        {routineData ? (
          <div>
            <div className="mt-4">
              <div className="mb-4 pt-4">
                <label className="text-base font-medium mr-4 xl:text-lg">
                  View Routine Set 1:
                </label>
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                  onClick={() => handleClick("Routine0")}
                >
                  Fitness:{" "}
                  {parseFloat(routineData.Routine0["Faculty Fitness"]).toFixed(
                    2
                  )}
                  %
                </button>
              </div>
              <div className="mb-4">
                <label className="text-base font-medium mr-4 xl:text-lg">
                  View Routine Set 2:
                </label>
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                  onClick={() => handleClick("Routine1")}
                >
                  Fitness:{" "}
                  {parseFloat(routineData.Routine1["Faculty Fitness"]).toFixed(
                    2
                  )}
                  %
                </button>
              </div>
              <div className="mb-4">
                <label className="text-base font-medium mr-4 xl:text-lg">
                  View Routine Set 3:
                </label>
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                  onClick={() => handleClick("Routine2")}
                >
                  Fitness:{" "}
                  {parseFloat(routineData.Routine2["Faculty Fitness"]).toFixed(
                    2
                  )}
                  %
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>No routine data available. Please generate a routine first.</div>
        )}
      </div>
    </div>
  );
};

export default Routine;
