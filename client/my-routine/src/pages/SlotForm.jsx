import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import { FormDataContext } from "../context/FormDataContext";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";

function SlotForm() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    formData,
    setFormData,
    courseFile,
    setCourseFile,
    slotsPerDay,
    setSlotsPerDay,
    breakAfter,
    setBreakAfter,
    weeklyHoliday,
    setWeeklyHoliday,
  } = useContext(FormDataContext);

  const navigate = useNavigate();

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleFileChange = (e) => {
    setCourseFile(e.target.files[0]);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "slotsPerDay") {
      setSlotsPerDay(parseInt(value));
    } else if (name === "breakAfter") {
      setBreakAfter(parseInt(value));
    }
  };

  const handleCheckboxChange = (index) => {
    const newHolidays = [...weeklyHoliday];
    newHolidays[index] = !newHolidays[index];
    setWeeklyHoliday(newHolidays);
  };

  const validateForm = () => {
    if (!courseFile) {
      setError("Upload Course File");
      return false;
    }
    if (!slotsPerDay || isNaN(slotsPerDay)) {
      setError("Enter Valid Slot Number");
      return false;
    }
    if (!breakAfter || isNaN(breakAfter)) {
      setError("Enter The Break Period");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const uploadData = new FormData();
    uploadData.append("courseFile", courseFile);
    uploadData.append("slotsPerDay", slotsPerDay);
    uploadData.append("breakAfter", breakAfter);
    uploadData.append("weeklyHoliday", JSON.stringify(weeklyHoliday));
    weeklyHoliday.forEach((isHoliday, index) => {
      uploadData.append(
        `weeklyHoliday[${index}]`,
        isHoliday ? "true" : "false"
      );
    });

    try {
      const res = await axios.post("http://localhost:8000/slots/", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(res.data);
      setFormData(res.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = () => {
    if (dragItem.current && dragOverItem.current) {
      const { listKey: dragItemListKey, index: dragItemIndex } =
        dragItem.current;
      const { index: dragOverItemIndex } = dragOverItem.current;

      const draggedItemContent = response[dragItemListKey][dragItemIndex];
      const updatedList = [...response[dragItemListKey]];
      updatedList.splice(dragItemIndex, 1);
      updatedList.splice(dragOverItemIndex, 0, draggedItemContent);

      const newResponse = {
        ...response,
        [dragItemListKey]: updatedList,
      };

      setResponse(newResponse);
      setFormData(newResponse);

      dragItem.current = null;
      dragOverItem.current = null;
    }
  };

  const handleDelete = (listKey, index) => {
    const updatedList = [...response[listKey]];
    updatedList.splice(index, 1);

    setResponse((prevState) => ({
      ...prevState,
      [listKey]: updatedList,
    }));
  };

  const handleModifiedSubmit = () => {
    localStorage.setItem("slot_pref", JSON.stringify(response));
    navigate("/form");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center items-center min-h-[90vh] bg-gray-700">
          <div className="py-6 px-7 my-auto w-full rounded-2xl bg-white md:w-2/5">
            <p className="flex text-2xl text-gray-900 font-bold pb-2 mb-4 border-b-2 border-gray-500">
              Slot Generation Form
            </p>

            {error && (
              <div className="bg-red-400 text-white p-4 mb-4 rounded-lg">
                {error}
              </div>
            )}

            <div className="text-lg relative flex flex-col mb-2.5 md:text-base xl:text-base">
              <label className="flex text-base mb-0.5 xl:text-lg">
                Course Details*
              </label>
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="
                    file:mr-2.5 file:py-1.5 file:px-4
                    file:rounded-md file:border file:border-gray-300
                    file:text-sm file:text-gray-500
                    file:bg-white hover:file:bg-gray-200"
              />
            </div>

            <div className="text-sm relative flex flex-col mb-2.5 md:text-base xl:text-base">
              <label className="flex text-base mb-0.5 xl:text-lg">
                Number of Class Slots in a Day*
              </label>
              <input
                type="number"
                id="slotsPerDay"
                name="slotsPerDay"
                placeholder="Eg.: 6 or 8"
                onChange={handleInputChange}
                className="outline-none border border-gray-300 rounded-md px-2.5 py-1.5"
              />
            </div>

            <div className="text-sm relative flex flex-col mb-2.5 md:text-base xl:text-base">
              <label className="flex text-base mb-0.5 xl:text-lg">
                Break After Which Period*
              </label>
              <input
                type="number"
                id="breakAfter"
                name="breakAfter"
                placeholder="Eg.: 3 or 4 or 5"
                onChange={handleInputChange}
                className="outline-none border border-gray-300 rounded-md px-2.5 py-1.5"
              />
            </div>

            <div className="text-sm relative flex flex-col md:text-base xl:text-base">
              <label className="flex text-base mb-0.5 xl:text-lg">
                Weekly Holidays:
              </label>
              <div className="grid grid-cols-4 gap-4">
                {daysOfWeek.map((day, index) => (
                  <div key={index} className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id={`holiday${index}`}
                      name={`holiday${index}`}
                      checked={weeklyHoliday[index]}
                      onChange={() => handleCheckboxChange(index)}
                    />
                    <label htmlFor={`holiday${index}`} className="ml-1">
                      {day}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {loading ? (
                <div className="flex justify-center items-center text-base cursor-pointer w-full font-medium text-center bg-gray-700 text-white mt-4 py-2.5 border-none outline-none rounded-md hover:bg-gray-600">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating Slots...
                </div>
              ) : (
                <input
                  type="submit"
                  value="Submit"
                  className="text-base cursor-pointer w-full font-medium text-center bg-gray-700 text-white mt-4 py-2.5 border-none outline-none rounded-md hover:bg-gray-600"
                />
              )}
            </div>
          </div>
        </div>
      </form>

      {response && (
        <div className="flex justify-center items-center min-h-screen bg-gray-700">
          <div className="py-6 px-7 mb-10 w-full rounded-2xl bg-white md:w-4/5">
            <p className="text-2xl text-gray-900 font-bold pb-2 mb-4 border-b-2 border-gray-500">
              Generated Slots
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(response).map((key) => (
                <div
                  key={key}
                  className="mb-6 p-4 bg-white rounded shadow-md w-full"
                >
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    Classes of Slot {key}
                  </h3>
                  <ul className="grid grid-cols-4 gap-2 pl-0">
                    {response[key].map((value, index) => (
                      <li
                        key={index}
                        className="mb-2 flex cursor-grab"
                        draggable
                        onDragStart={() =>
                          (dragItem.current = { listKey: key, index })
                        }
                        onDragEnter={() =>
                          (dragOverItem.current = { listKey: key, index })
                        }
                        onDragEnd={handleSort}
                      >
                        <span className="mr-2 px-2 py-1 bg-gray-500 text-white rounded flex justify-between items-center w-full hover:bg-gray-700">
                          <span className="ml-1">{value}</span>
                          <button
                            onClick={() => handleDelete(key, index)}
                            className="ml-2 p-2 text-white rounded-full hover:bg-gray-400"
                          >
                            <RiDeleteBin5Line />
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleModifiedSubmit}
                className="text-base cursor-pointer font-medium text-center bg-gray-700 text-white mt-4 px-4 py-2.5 border-none outline-none rounded-md hover:bg-gray-600"
              >
                Submit Modified Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SlotForm;
